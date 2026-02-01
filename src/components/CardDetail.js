import React, { useState, useEffect } from 'react';
import { getCardById } from '../data/tarotCards';
import { getCardImageUrl } from '../data/cardImages';
import './CardDetail.css';

function CardDetail({ cardId, notes, onSaveNotes }) {
  const [editedNotes, setEditedNotes] = useState(notes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const card = getCardById(cardId);

  useEffect(() => {
    setEditedNotes(notes);
  }, [notes]);

  if (!card) {
    return <div className="card-detail">Card not found</div>;
  }

  const handleSave = () => {
    onSaveNotes(editedNotes);
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  const getCardType = () => {
    if (card.type === 'major') {
      return `${card.number} · Major Arcana`;
    }
    return card.suit;
  };

  return (
    <div className="card-detail fade-in">
      {/* Card Image */}
      <div className="card-detail-hero">
        <div className="card-detail-image">
          <img src={getCardImageUrl(cardId)} alt={card.name} />
        </div>
      </div>

      {/* Card Info */}
      <div className="card-detail-info">
        <span className="card-detail-type">{getCardType()}</span>
        <h1 className="card-detail-name">{card.name}</h1>
      </div>

      {/* Keywords */}
      <div className="card-detail-keywords">
        <div className="keywords-section">
          <h3>Upright</h3>
          <div className="keywords-list">
            {card.keywords.map((keyword, i) => (
              <span key={i} className="keyword">{keyword}</span>
            ))}
          </div>
        </div>

        <div className="keywords-section">
          <h3>Reversed</h3>
          <div className="keywords-list reversed">
            {card.reversedKeywords.map((keyword, i) => (
              <span key={i} className="keyword">{keyword}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Notes */}
      <div className="card-detail-notes">
        <div className="notes-header">
          <h2>My Notes</h2>
          {!isEditing && (
            <button className="btn-small" onClick={() => setIsEditing(true)}>
              {notes ? 'Edit' : 'Add'}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="notes-editor">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Write your personal interpretations, experiences, patterns you've noticed..."
              rows={6}
              autoFocus
            />
            <div className="notes-editor-actions">
              <button onClick={handleCancel}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        ) : (
          <div className="notes-display">
            {notes ? (
              <p>{notes}</p>
            ) : (
              <p className="notes-empty">Add your personal notes and interpretations for this card.</p>
            )}
          </div>
        )}

        {isSaved && (
          <div className="save-toast">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Saved
          </div>
        )}
      </div>
    </div>
  );
}

export default CardDetail;
