import React from 'react';
import { getCardById } from '../data/tarotCards';
import './FolderView.css';

function FolderView({ folder, readings, onReadingSelect, onNewReading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedReadings = [...readings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="folder-view fade-in">
      <div className="folder-view-header">
        <div className="folder-view-info">
          <span className="folder-view-count">
            {readings.length} {readings.length === 1 ? 'reading' : 'readings'}
          </span>
        </div>
        <button className="btn-primary" onClick={onNewReading}>
          + New Reading
        </button>
      </div>

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
      ) : (
        <div className="readings-list">
          {sortedReadings.map((reading) => (
            <button
              key={reading.id}
              className="reading-item card"
              onClick={() => onReadingSelect(reading.id)}
            >
              <div className="reading-item-header">
                <time className="reading-date">{formatDate(reading.createdAt)}</time>
              </div>

              <div className="reading-cards">
                {reading.cards.map((card, i) => {
                  const cardInfo = getCardById(card.cardId);
                  return (
                    <span key={i} className="reading-card-chip">
                      {cardInfo?.name || 'Unknown'}
                      {card.reversed && ' ↓'}
                    </span>
                  );
                })}
              </div>

              {reading.interpretation && (
                <p className="reading-preview">
                  {reading.interpretation.length > 120
                    ? reading.interpretation.substring(0, 120) + '...'
                    : reading.interpretation}
                </p>
              )}

              <div className="reading-item-footer">
                <span className="view-link">View reading →</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FolderView;
