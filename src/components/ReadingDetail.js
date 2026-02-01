import React, { useState } from 'react';
import { getCardById } from '../data/tarotCards';
import './ReadingDetail.css';

function ReadingDetail({ reading, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInterpretation, setEditedInterpretation] = useState(reading?.interpretation || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!reading) {
    return <div className="reading-detail">Reading not found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSave = () => {
    onUpdate({ interpretation: editedInterpretation });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInterpretation(reading.interpretation || '');
    setIsEditing(false);
  };

  return (
    <div className="reading-detail fade-in">
      {/* Header */}
      <div className="reading-detail-header">
        <time className="reading-detail-date">
          {formatDate(reading.date || reading.createdAt)}
        </time>
      </div>

      <div className="divider" />

      {/* Cards */}
      <section className="reading-detail-section">
        <h2>Cards Drawn</h2>
        <div className="reading-detail-cards">
          {reading.cards.map((card, index) => {
            const cardInfo = getCardById(card.cardId);
            if (!cardInfo) return null;

            return (
              <div key={index} className="reading-card-item">
                <div className="reading-card-header">
                  {card.position && (
                    <span className="reading-card-position">{card.position}</span>
                  )}
                  {card.reversed && <span className="reversed-badge">Reversed</span>}
                </div>
                <h3 className="reading-card-name">{cardInfo.name}</h3>
                <p className="reading-card-keywords">
                  {card.reversed
                    ? cardInfo.reversedKeywords.join(' · ')
                    : cardInfo.keywords.join(' · ')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* Interpretation */}
      <section className="reading-detail-section">
        <div className="interpretation-header">
          <h2>Interpretation</h2>
          {!isEditing && (
            <button className="btn-small" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="interpretation-editor">
            <textarea
              value={editedInterpretation}
              onChange={(e) => setEditedInterpretation(e.target.value)}
              placeholder="Write your interpretation..."
              rows={8}
              autoFocus
            />
            <div className="interpretation-actions">
              <button onClick={handleCancel}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="interpretation-display">
            {reading.interpretation ? (
              <p>{reading.interpretation}</p>
            ) : (
              <p className="interpretation-empty">No interpretation recorded.</p>
            )}
          </div>
        )}
      </section>

      <div className="divider" />

      {/* Delete */}
      <div className="reading-detail-actions">
        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <p>Are you sure you want to delete this reading?</p>
            <div className="delete-confirm-actions">
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-danger" onClick={onDelete}>
                Delete Reading
              </button>
            </div>
          </div>
        ) : (
          <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>
            Delete Reading
          </button>
        )}
      </div>
    </div>
  );
}

export default ReadingDetail;
