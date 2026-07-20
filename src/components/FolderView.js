import React, { useState, useMemo } from 'react';
import { getCardById } from '../data/tarotCards';
import './FolderView.css';

function FolderView({ folder, readings, onReadingSelect, onNewReading, onRenameFolder, onDeleteFolder }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTitleMenu, setShowTitleMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const startRenaming = () => {
    setShowTitleMenu(false);
    setRenameValue(folder?.name || '');
    setIsRenaming(true);
  };

  const saveRename = () => {
    if (renameValue.trim()) {
      onRenameFolder(folder.id, renameValue.trim());
      setIsRenaming(false);
    }
  };

  const confirmDelete = () => {
    setShowTitleMenu(false);
    setShowDeleteConfirm(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedReadings = useMemo(() => {
    let filtered = [...readings];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((reading) => {
        if (reading.title && reading.title.toLowerCase().includes(query)) return true;
        if (reading.reflection && reading.reflection.toLowerCase().includes(query)) return true;
        const spreads = reading.spreads || [];
        return spreads.some((spread) => {
          if (spread.question && spread.question.toLowerCase().includes(query)) return true;
          if (spread.interpretation && spread.interpretation.toLowerCase().includes(query)) return true;
          return (spread.cards || []).some((c) => {
            const info = getCardById(c.cardId);
            return info && info.name.toLowerCase().includes(query);
          });
        });
      });
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [readings, searchQuery]);

  // Get all cards from a reading (handles both old and new format)
  const getAllCards = (reading) => {
    if (reading.spreads) {
      return reading.spreads.flatMap((s) => s.cards);
    }
    return reading.cards || [];
  };

  // Get preview text for a reading
  const getPreviewText = (reading) => {
    if (reading.spreads && reading.spreads.length > 0) {
      // Show the first spread's question
      const firstQuestion = reading.spreads[0].question;
      if (firstQuestion) {
        if (reading.spreads.length > 1) {
          return `${firstQuestion} (+${reading.spreads.length - 1} more)`;
        }
        return firstQuestion;
      }
    }
    // Fall back to interpretation for old format
    return reading.interpretation;
  };

  return (
    <div className="folder-view fade-in">
      <div className="page-header-with-action">
        {isRenaming ? (
          <div className="folder-rename-inline">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setIsRenaming(false); }}
              autoFocus
            />
            <div className="section-actions">
              <button onClick={() => setIsRenaming(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveRename} disabled={!renameValue.trim()}>Save</button>
            </div>
          </div>
        ) : (
          <div className="title-menu-anchor">
            <h1 className="page-title page-title-tappable" onClick={() => setShowTitleMenu(!showTitleMenu)}>
              {folder?.name || 'Folder'}
              <svg className="title-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </h1>
            {showTitleMenu && (
              <>
                <div className="title-menu-backdrop" onClick={() => setShowTitleMenu(false)} />
                <div className="title-menu">
                  <button className="title-menu-item" onClick={startRenaming}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    Rename
                  </button>
                  <button className="title-menu-item" onClick={() => setShowTitleMenu(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Export Folder
                  </button>
                  <div className="title-menu-divider" />
                  <button className="title-menu-item danger" onClick={confirmDelete}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete Folder
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <button className="btn-small" onClick={onNewReading}>
          + New Reading
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Delete "{folder?.name}" and all its readings?</p>
          <div className="delete-confirm-actions">
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn-danger" onClick={() => onDeleteFolder(folder.id)}>Delete</button>
          </div>
        </div>
      )}


      {/* Search */}
      {readings.length > 0 && (
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search this folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {readings.length === 0 ? (
        <div className="empty-folder">
          <div className="empty-folder-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
          </div>
          <h3>No Readings Yet</h3>
          <p>Record your first reading in this folder to start tracking your tarot journey.</p>
          <button className="btn-primary" onClick={onNewReading}>
            Record a Reading
          </button>
        </div>
      ) : sortedReadings.length === 0 ? (
        <div className="search-empty">
          <p>No readings match "{searchQuery}"</p>
        </div>
      ) : (
        <div className="readings-list">
          {sortedReadings.map((reading) => {
            const allCards = getAllCards(reading);
            const previewText = getPreviewText(reading);

            return (
              <button
                key={reading.id}
                className="reading-item card"
                onClick={() => onReadingSelect(reading.id)}
              >
                <div className="reading-item-header">
                  {reading.title && (
                    <h3 className="reading-title">{reading.title}</h3>
                  )}
                  <time className="reading-date">{formatDate(reading.date)}</time>
                </div>

                <div className="reading-cards">
                  {allCards.slice(0, 3).map((card, i) => {
                    const cardInfo = getCardById(card.cardId);
                    return (
                      <span key={i} className="reading-card-chip">
                        {cardInfo?.name || 'Unknown'}
                        {card.reversed && ' ↓'}
                      </span>
                    );
                  })}
                  {allCards.length > 3 && (
                    <span className="reading-card-chip">
                      +{allCards.length - 3} more
                    </span>
                  )}
                </div>

                {previewText && (
                  <p className="reading-preview">
                    {previewText.length > 120
                      ? previewText.substring(0, 120) + '...'
                      : previewText}
                  </p>
                )}

                <div className="reading-item-footer">
                  <span className="view-link">View reading →</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FolderView;
