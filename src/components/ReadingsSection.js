import React, { useState } from 'react';
import './ReadingsSection.css';

function ReadingsSection({ folders, readings, onFolderSelect, onCreateFolder, onRenameFolder, onDeleteFolder }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deletingFolderId, setDeletingFolderId] = useState(null);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const handleRename = (folderId) => {
    if (editingName.trim()) {
      onRenameFolder(folderId, editingName.trim());
      setEditingFolderId(null);
      setEditingName('');
    }
  };

  const startEditing = (folder) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const getReadingCount = (folderId) => {
    return readings.filter((r) => r.folderId === folderId).length;
  };

  const suggestedFolders = [
    'Daily Pulls',
    'Full Moon Readings',
    'New Moon Readings',
    'Career & Work',
    'Love & Relationships',
    'Yearly Forecast',
    'Shadow Work',
  ];

  return (
    <div className="readings-section fade-in">
      <div className="section-header">
        <h2>My Reading Folders</h2>
        {!isCreating && (
          <button className="btn-small" onClick={() => setIsCreating(true)}>
            + New Folder
          </button>
        )}
      </div>

      {/* Create new folder form */}
      {isCreating && (
        <div className="create-folder-form card">
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div className="create-folder-suggestions">
            <span className="suggestions-label">Suggestions:</span>
            {suggestedFolders
              .filter((name) => !folders.some((f) => f.name === name))
              .slice(0, 4)
              .map((name) => (
                <button
                  key={name}
                  className="suggestion-chip"
                  onClick={() => setNewFolderName(name)}
                >
                  {name}
                </button>
              ))}
          </div>
          <div className="create-folder-actions">
            <button onClick={() => { setIsCreating(false); setNewFolderName(''); }}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleCreate} disabled={!newFolderName.trim()}>
              Create Folder
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {folders.length === 0 && !isCreating && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>Organize Your Readings</h3>
          <p>Create folders to organize your tarot readings by type, purpose, or any way that works for you.</p>
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            Create Your First Folder
          </button>
        </div>
      )}

      {/* Folder list */}
      <div className="folder-list">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-item card">
            {editingFolderId === folder.id ? (
              <div className="folder-editing">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(folder.id)}
                  autoFocus
                />
                <div className="folder-editing-actions">
                  <button onClick={() => { setEditingFolderId(null); setEditingName(''); }}>
                    Cancel
                  </button>
                  <button className="btn-primary btn-small" onClick={() => handleRename(folder.id)}>
                    Save
                  </button>
                </div>
              </div>
            ) : deletingFolderId === folder.id ? (
              <div className="folder-deleting">
                <p>Delete "{folder.name}" and all its readings?</p>
                <div className="folder-deleting-actions">
                  <button onClick={() => setDeletingFolderId(null)}>Cancel</button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => { onDeleteFolder(folder.id); setDeletingFolderId(null); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button className="folder-content" onClick={() => onFolderSelect(folder.id)}>
                  <div className="folder-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="folder-info">
                    <h3 className="folder-name">{folder.name}</h3>
                    <span className="folder-count">
                      {getReadingCount(folder.id)} {getReadingCount(folder.id) === 1 ? 'reading' : 'readings'}
                    </span>
                  </div>
                  <svg className="folder-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <div className="folder-actions">
                  <button
                    className="folder-action-btn"
                    onClick={(e) => { e.stopPropagation(); startEditing(folder); }}
                    title="Rename folder"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="folder-action-btn delete"
                    onClick={(e) => { e.stopPropagation(); setDeletingFolderId(folder.id); }}
                    title="Delete folder"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadingsSection;
