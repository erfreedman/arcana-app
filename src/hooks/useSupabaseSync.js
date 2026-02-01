import { useState, useEffect, useCallback, useRef } from 'react';
import { foldersService, readingsService, cardNotesService } from '../services/supabase';

const STORAGE_KEYS = {
  CARD_NOTES: 'arcana-card-notes',
  FOLDERS: 'arcana-folders',
  READINGS: 'arcana-readings',
  PENDING_OPS: 'arcana-pending-ops',
};

export function useSupabaseSync(userId) {
  const [cardNotes, setCardNotes] = useState({});
  const [folders, setFolders] = useState([]);
  const [readings, setReadings] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const pendingOpsRef = useRef([]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data when userId changes
  useEffect(() => {
    if (userId) {
      loadData();
    } else {
      // Clear data when logged out
      setCardNotes({});
      setFolders([]);
      setReadings([]);
      setIsLoaded(false);
    }
  }, [userId]);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && isLoaded && userId) {
      processPendingOperations();
    }
  }, [isOnline, isLoaded, userId]);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded && userId) {
      localStorage.setItem(STORAGE_KEYS.CARD_NOTES, JSON.stringify(cardNotes));
    }
  }, [cardNotes, isLoaded, userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
  }, [folders, isLoaded, userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
    }
  }, [readings, isLoaded, userId]);

  const loadData = async () => {
    if (!userId) return;

    // First, load from localStorage (instant)
    const localNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARD_NOTES) || '{}');
    const localFolders = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOLDERS) || '[]');
    const localReadings = JSON.parse(localStorage.getItem(STORAGE_KEYS.READINGS) || '[]');

    setCardNotes(localNotes);
    setFolders(localFolders);
    setReadings(localReadings);
    setIsLoaded(true);

    // Then, try to fetch from Supabase
    if (navigator.onLine) {
      try {
        setIsSyncing(true);

        const [remoteNotes, remoteFolders, remoteReadings] = await Promise.all([
          cardNotesService.getAll(userId),
          foldersService.getAll(userId),
          readingsService.getAll(userId),
        ]);

        // Use remote data (cloud is source of truth)
        setCardNotes(remoteNotes);
        setFolders(remoteFolders);
        setReadings(remoteReadings);

        setSyncError(null);
      } catch (error) {
        console.error('Failed to fetch from Supabase:', error);
        setSyncError(error.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const queueOperation = (operation) => {
    pendingOpsRef.current.push(operation);
    localStorage.setItem(STORAGE_KEYS.PENDING_OPS, JSON.stringify(pendingOpsRef.current));
  };

  const processPendingOperations = async () => {
    const ops = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_OPS) || '[]');
    if (ops.length === 0) return;

    setIsSyncing(true);

    for (const op of ops) {
      try {
        await executeOperation(op);
      } catch (error) {
        console.error('Failed to process pending operation:', error);
      }
    }

    pendingOpsRef.current = [];
    localStorage.setItem(STORAGE_KEYS.PENDING_OPS, '[]');
    setIsSyncing(false);
  };

  const executeOperation = async (op) => {
    if (!userId) return;

    switch (op.type) {
      case 'CREATE_FOLDER':
        return await foldersService.create(op.data, userId);
      case 'UPDATE_FOLDER':
        return await foldersService.update(op.id, op.data, userId);
      case 'DELETE_FOLDER':
        return await foldersService.delete(op.id, userId);
      case 'CREATE_READING':
        return await readingsService.create(op.data, userId);
      case 'UPDATE_READING':
        return await readingsService.update(op.id, op.data, userId);
      case 'DELETE_READING':
        return await readingsService.delete(op.id, userId);
      case 'UPSERT_NOTE':
        return await cardNotesService.upsert(op.cardId, op.notes, userId);
      default:
        console.warn('Unknown operation type:', op.type);
    }
  };

  const syncOperation = async (operation) => {
    if (!userId) return;

    if (isOnline) {
      try {
        return await executeOperation(operation);
      } catch (error) {
        console.error('Sync failed, queuing operation:', error);
        queueOperation(operation);
      }
    } else {
      queueOperation(operation);
    }
  };

  // Card Notes
  const saveCardNotes = useCallback(async (cardId, notes) => {
    setCardNotes((prev) => ({ ...prev, [cardId]: notes }));
    await syncOperation({ type: 'UPSERT_NOTE', cardId, notes });
  }, [userId, isOnline]);

  // Folders
  const createFolder = useCallback(async (name) => {
    const newFolder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
    const result = await syncOperation({ type: 'CREATE_FOLDER', data: newFolder });
    // Update with server ID if available
    if (result?.id) {
      setFolders((prev) =>
        prev.map((f) => (f.id === newFolder.id ? { ...f, id: result.id } : f))
      );
      return result;
    }
    return newFolder;
  }, [userId, isOnline]);

  const renameFolder = useCallback(async (id, name) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name } : f))
    );
    await syncOperation({ type: 'UPDATE_FOLDER', id, data: { name } });
  }, [userId, isOnline]);

  const deleteFolder = useCallback(async (id) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setReadings((prev) => prev.filter((r) => r.folderId !== id));
    await syncOperation({ type: 'DELETE_FOLDER', id });
  }, [userId, isOnline]);

  // Readings
  const createReading = useCallback(async (readingData) => {
    const newReading = {
      id: crypto.randomUUID(),
      ...readingData,
      createdAt: new Date().toISOString(),
    };
    setReadings((prev) => [newReading, ...prev]);
    const result = await syncOperation({ type: 'CREATE_READING', data: newReading });
    // Update with server ID if available
    if (result?.id) {
      setReadings((prev) =>
        prev.map((r) => (r.id === newReading.id ? { ...r, id: result.id } : r))
      );
      return result;
    }
    return newReading;
  }, [userId, isOnline]);

  const updateReading = useCallback(async (id, updates) => {
    setReadings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    await syncOperation({ type: 'UPDATE_READING', id, data: updates });
  }, [userId, isOnline]);

  const deleteReading = useCallback(async (id) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
    await syncOperation({ type: 'DELETE_READING', id });
  }, [userId, isOnline]);

  return {
    // State
    cardNotes,
    folders,
    readings,
    isOnline,
    isSyncing,
    syncError,
    isLoaded,

    // Card Notes
    saveCardNotes,

    // Folders
    createFolder,
    renameFolder,
    deleteFolder,

    // Readings
    createReading,
    updateReading,
    deleteReading,
  };
}
