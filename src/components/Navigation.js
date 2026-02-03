import React, { useState } from 'react';
import './Navigation.css';

function Navigation({ activeTab, onTabChange, folders, onNewReading }) {
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  const handleNewClick = () => {
    if (folders.length === 0) {
      alert('Create a folder first in the Readings tab');
      return;
    }
    if (folders.length === 1) {
      onNewReading(folders[0].id);
      return;
    }
    setShowFolderPicker(true);
  };

  const handleFolderSelect = (folderId) => {
    setShowFolderPicker(false);
    onNewReading(folderId);
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-content">
          <button
            className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => onTabChange('library')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="8" height="12" rx="1" />
              <rect x="8" y="6" width="8" height="12" rx="1" />
              <rect x="14" y="8" width="8" height="12" rx="1" />
            </svg>
            <span>Deck</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'readings' ? 'active' : ''}`}
            onClick={() => onTabChange('readings')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" />
            </svg>
            <span>Readings</span>
          </button>

          <button
            className="nav-tab nav-tab-create"
            onClick={handleNewClick}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create</span>
          </button>
        </div>
      </nav>

      {/* Folder Picker Modal */}
      {showFolderPicker && (
        <div className="folder-picker-overlay" onClick={() => setShowFolderPicker(false)}>
          <div className="folder-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose a folder</h3>
            <div className="folder-picker-list">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className="folder-picker-item"
                  onClick={() => handleFolderSelect(folder.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 7v13a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.93a2 2 0 01-1.66-.9l-.82-1.2a2 2 0 00-1.66-.9H5a2 2 0 00-2 2z" />
                  </svg>
                  {folder.name}
                </button>
              ))}
            </div>
            <button className="folder-picker-cancel" onClick={() => setShowFolderPicker(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
