import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CardLibrary from './components/CardLibrary';
import CardDetail from './components/CardDetail';
import ReadingsSection from './components/ReadingsSection';
import FolderView from './components/FolderView';
import ReadingDetail from './components/ReadingDetail';
import ReadingForm from './components/ReadingForm';
import { useSupabaseSync } from './hooks/useSupabaseSync';

function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'readings'
  const [currentView, setCurrentView] = useState('main'); // 'main', 'cardDetail', 'folderView', 'readingDetail', 'newReading'
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedReadingId, setSelectedReadingId] = useState(null);

  // Data from Supabase sync hook
  const {
    cardNotes,
    folders,
    readings,
    isOnline,
    isSyncing,
    saveCardNotes,
    createFolder,
    renameFolder,
    deleteFolder: deleteFolderFromDb,
    createReading: createReadingInDb,
    updateReading,
    deleteReading: deleteReadingFromDb,
  } = useSupabaseSync();

  // Wrapper for deleteFolder to handle view state
  const deleteFolder = async (folderId) => {
    await deleteFolderFromDb(folderId);
    if (selectedFolderId === folderId) {
      setCurrentView('main');
      setSelectedFolderId(null);
    }
  };

  // Wrapper for createReading to handle view state
  const createReading = async (readingData) => {
    await createReadingInDb(readingData);
    setCurrentView('folderView');
  };

  // Wrapper for deleteReading to handle view state
  const deleteReading = async (readingId) => {
    await deleteReadingFromDb(readingId);
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
        isOnline={isOnline}
        isSyncing={isSyncing}
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
