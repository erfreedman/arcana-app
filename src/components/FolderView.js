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
                  <time className="reading-date">{formatDate(reading.createdAt)}</time>
                </div>

                <div className="reading-cards">
                  {allCards.map((card, i) => {
                    const cardInfo = getCardById(card.cardId);
                    return (
                      <span key={i} className="reading-card-chip">
                        {cardInfo?.name || 'Unknown'}
                        {card.reversed && ' ↓'}
                      </span>
                    );
                  })}
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
