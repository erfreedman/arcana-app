import React, { useState } from 'react';
import { getCardById } from '../data/tarotCards';
import './ReadingDetail.css';

function ReadingDetail({ reading, onUpdate, onDelete }) {
  const [editingSpreadIndex, setEditingSpreadIndex] = useState(null);
  const [editedInterpretation, setEditedInterpretation] = useState('');
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [editedReflection, setEditedReflection] = useState(reading?.reflection || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!reading) {
    return <div className="reading-detail">Reading not found</div>;
  }

  // Handle backwards compatibility: convert old format to new format
  const spreads = reading.spreads || [{
    question: null,
    cards: reading.cards || [],
    interpretation: reading.interpretation || '',
  }];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const startEditingSpread = (index) => {
    setEditingSpreadIndex(index);
    setEditedInterpretation(spreads[index].interpretation || '');
  };

  const handleSaveInterpretation = () => {
    const updatedSpreads = [...spreads];
    updatedSpreads[editingSpreadIndex] = {
      ...updatedSpreads[editingSpreadIndex],
      interpretation: editedInterpretation,
    };
    onUpdate({ spreads: updatedSpreads });
    setEditingSpreadIndex(null);
  };

  const handleCancelInterpretation = () => {
    setEditingSpreadIndex(null);
    setEditedInterpretation('');
  };

  const handleSaveReflection = () => {
    onUpdate({ reflection: editedReflection });
    setIsEditingReflection(false);
  };

  const handleCancelReflection = () => {
    setEditedReflection(reading.reflection || '');
    setIsEditingReflection(false);
  };

  return (
    <div className="reading-detail fade-in">
      {/* Header */}
      <div className="reading-detail-header">
        {reading.title && (
          <h1 className="reading-detail-title">{reading.title}</h1>
        )}
        <time className="reading-detail-date">
          {formatDate(reading.date || reading.createdAt)}
        </time>
      </div>

      <div className="divider" />

      {/* Spreads */}
      {spreads.map((spread, spreadIndex) => (
        <div key={spreadIndex} className="spread-detail">
          {/* Spread question */}
          {spread.question && (
            <h2 className="spread-question">{spread.question}</h2>
          )}
          {!spread.question && spreads.length === 1 && (
            <h2 className="spread-question-label">Cards Drawn</h2>
          )}
          {!spread.question && spreads.length > 1 && (
            <h2 className="spread-question-label">Spread {spreadIndex + 1}</h2>
          )}

          {/* Cards */}
          <div className="reading-detail-cards">
            {spread.cards.map((card, cardIndex) => {
              const cardInfo = getCardById(card.cardId);
              if (!cardInfo) return null;

              return (
                <div key={cardIndex} className="reading-card-item">
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

          {/* Interpretation for this spread */}
          <div className="spread-interpretation">
            <div className="interpretation-header">
              <h3>Interpretation</h3>
              {editingSpreadIndex !== spreadIndex && (
                <button className="btn-small" onClick={() => startEditingSpread(spreadIndex)}>
                  Edit
                </button>
              )}
            </div>

            {editingSpreadIndex === spreadIndex ? (
              <div className="interpretation-editor">
                <textarea
                  value={editedInterpretation}
                  onChange={(e) => setEditedInterpretation(e.target.value)}
                  placeholder="Write your interpretation..."
                  rows={6}
                  autoFocus
                />
                <div className="interpretation-actions">
                  <button onClick={handleCancelInterpretation}>Cancel</button>
                  <button className="btn-primary" onClick={handleSaveInterpretation}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="interpretation-display">
                {spread.interpretation ? (
                  <p>{spread.interpretation}</p>
                ) : (
                  <p className="interpretation-empty">No interpretation recorded.</p>
                )}
              </div>
            )}
          </div>

          {spreadIndex < spreads.length - 1 && <div className="divider" />}
        </div>
      ))}

      <div className="divider" />

      {/* Reflection */}
      <section className="reading-detail-section">
        <div className="interpretation-header">
          <h2>Reflection</h2>
          {!isEditingReflection && (
            <button className="btn-small" onClick={() => setIsEditingReflection(true)}>
              Edit
            </button>
          )}
        </div>

        {isEditingReflection ? (
          <div className="interpretation-editor">
            <textarea
              value={editedReflection}
              onChange={(e) => setEditedReflection(e.target.value)}
              placeholder="How did this reading show up in your life? What actually happened?"
              rows={6}
              autoFocus
            />
            <div className="interpretation-actions">
              <button onClick={handleCancelReflection}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveReflection}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="interpretation-display">
            {reading.reflection ? (
              <p>{reading.reflection}</p>
            ) : (
              <p className="interpretation-empty">Come back later to reflect on how this reading showed up.</p>
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
