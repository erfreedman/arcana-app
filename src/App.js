import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CardLibrary from './components/CardLibrary';
import CardDetail from './components/CardDetail';
import ReadingsSection from './components/ReadingsSection';
import FolderView from './components/FolderView';
import ReadingDetail from './components/ReadingDetail';
import ReadingForm from './components/ReadingForm';

const STORAGE_KEYS = {
  CARD_NOTES: 'arcana-card-notes',
  FOLDERS: 'arcana-folders',
  READINGS: 'arcana-readings',
};

function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'readings'
  const [currentView, setCurrentView] = useState('main'); // 'main', 'cardDetail', 'folderView', 'readingDetail', 'newReading'
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedReadingId, setSelectedReadingId] = useState(null);

  // Data state
  const [cardNotes, setCardNotes] = useState({});
  const [folders, setFolders] = useState([]);
  const [readings, setReadings] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEYS.CARD_NOTES);
    const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    const savedReadings = localStorage.getItem(STORAGE_KEYS.READINGS);

    if (savedNotes) setCardNotes(JSON.parse(savedNotes));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedReadings) setReadings(JSON.parse(savedReadings));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARD_NOTES, JSON.stringify(cardNotes));
  }, [cardNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
  }, [readings]);

  // Card notes handlers
  const saveCardNotes = (cardId, notes) => {
    setCardNotes((prev) => ({
      ...prev,
      [cardId]: notes,
    }));
  };

  // Folder handlers
  const createFolder = (name) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
    return newFolder;
  };

  const renameFolder = (folderId, newName) => {
    setFolders(folders.map((f) => (f.id === folderId ? { ...f, name: newName } : f)));
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter((f) => f.id !== folderId));
    setReadings(readings.filter((r) => r.folderId !== folderId));
    if (selectedFolderId === folderId) {
      setCurrentView('main');
      setSelectedFolderId(null);
    }
  };

  // Reading handlers
  const createReading = (readingData) => {
    const newReading = {
      ...readingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReadings([newReading, ...readings]);
    setCurrentView('folderView');
  };

  const updateReading = (readingId, updates) => {
    setReadings(readings.map((r) => (r.id === readingId ? { ...r, ...updates } : r)));
  };

  const deleteReading = (readingId) => {
    setReadings(readings.filter((r) => r.id !== readingId));
    setCurrentView('folderView');
    setSelectedReadingId(null);
  };

  // Navigation handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentView('main');
    setSelectedCardId(null);
    setSelectedFolderId(null);
    setSelectedReadingId(null);
  };

  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
    setCurrentView('cardDetail');
  };

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
    setCurrentView('folderView');
  };

  const handleReadingSelect = (readingId) => {
    setSelectedReadingId(readingId);
    setCurrentView('readingDetail');
  };

  const handleNewReading = () => {
    setCurrentView('newReading');
  };

  const handleBack = () => {
    if (currentView === 'cardDetail') {
      setCurrentView('main');
      setSelectedCardId(null);
    } else if (currentView === 'readingDetail' || currentView === 'newReading') {
      setCurrentView('folderView');
      setSelectedReadingId(null);
    } else if (currentView === 'folderView') {
      setCurrentView('main');
      setSelectedFolderId(null);
    }
  };

  const getViewTitle = () => {
    if (currentView === 'cardDetail' && selectedCardId) {
      return null; // Card name shown in detail
    }
    if (currentView === 'folderView' && selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      return folder?.name || 'Folder';
    }
    if (currentView === 'newReading') {
      return 'New Reading';
    }
    if (currentView === 'readingDetail') {
      return 'Reading';
    }
    return null;
  };

  const showBack = currentView !== 'main';

  return (
    <div className="app">
      <Header
        title={getViewTitle()}
        showBack={showBack}
        onBack={handleBack}
      />

      {currentView === 'main' && (
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      <main className="container">
        {activeTab === 'library' && currentView === 'main' && (
          <CardLibrary
            cardNotes={cardNotes}
            onCardSelect={handleCardSelect}
          />
        )}

        {activeTab === 'library' && currentView === 'cardDetail' && selectedCardId && (
          <CardDetail
            cardId={selectedCardId}
            notes={cardNotes[selectedCardId] || ''}
            onSaveNotes={(notes) => saveCardNotes(selectedCardId, notes)}
          />
        )}

        {activeTab === 'readings' && currentView === 'main' && (
          <ReadingsSection
            folders={folders}
            readings={readings}
            onFolderSelect={handleFolderSelect}
            onCreateFolder={createFolder}
            onRenameFolder={renameFolder}
            onDeleteFolder={deleteFolder}
          />
        )}

        {activeTab === 'readings' && currentView === 'folderView' && selectedFolderId && (
          <FolderView
            folder={folders.find((f) => f.id === selectedFolderId)}
            readings={readings.filter((r) => r.folderId === selectedFolderId)}
            onReadingSelect={handleReadingSelect}
            onNewReading={handleNewReading}
          />
        )}

        {activeTab === 'readings' && currentView === 'newReading' && selectedFolderId && (
          <ReadingForm
            folderId={selectedFolderId}
            onSubmit={createReading}
            onCancel={() => setCurrentView('folderView')}
          />
        )}

        {activeTab === 'readings' && currentView === 'readingDetail' && selectedReadingId && (
          <ReadingDetail
            reading={readings.find((r) => r.id === selectedReadingId)}
            onUpdate={(updates) => updateReading(selectedReadingId, updates)}
            onDelete={() => deleteReading(selectedReadingId)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
