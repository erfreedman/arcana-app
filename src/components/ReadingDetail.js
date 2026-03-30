import React, { useState, useMemo, useEffect } from 'react';
import { getCardById, getMajorArcana, getCardsBySuit } from '../data/tarotCards';
import { getCardImageUrl } from '../data/cardImages';
import './ReadingDetail.css';

const createEmptySpread = () => ({
  question: '',
  cards: [{ cardId: '', searchTerm: '', position: '' }],
  interpretation: '',
});

function ReadingDetail({ reading, onUpdate, onDelete }) {
  const [editingSection, setEditingSection] = useState(null);
  // Header editing
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDate, setEditedDate] = useState('');
  // Spread editing (single spread at a time)
  const [editedSpread, setEditedSpread] = useState(null);
  // Interpretation editing
  const [editedInterpretation, setEditedInterpretation] = useState('');
  // Reflection editing
  const [editedReflection, setEditedReflection] = useState('');
  // Card autocomplete
  const [activeDropdown, setActiveDropdown] = useState(null);
  // Delete confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSpreadConfirm, setShowDeleteSpreadConfirm] = useState(false);

  const allCards = useMemo(() => [
    ...getMajorArcana(),
    ...getCardsBySuit('Wands'),
    ...getCardsBySuit('Cups'),
    ...getCardsBySuit('Swords'),
    ...getCardsBySuit('Pentacles'),
  ], []);

  useEffect(() => {
    if (!editingSection) return;
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingSection]);

  if (!reading) {
    return <div className="reading-detail">Reading not found</div>;
  }

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

  const cancelEditing = () => {
    setEditingSection(null);
    setActiveDropdown(null);
    setShowDeleteSpreadConfirm(false);
  };

  // --- Header section ---

  const startEditingHeader = () => {
    const dateValue = reading.date || reading.createdAt;
    setEditedTitle(reading.title || '');
    setEditedDate(dateValue ? dateValue.split('T')[0] : new Date().toISOString().split('T')[0]);
    setEditingSection('header');
  };

  const saveHeader = () => {
    onUpdate({
      title: editedTitle.trim() || null,
      date: editedDate,
    });
    setEditingSection(null);
  };

  // --- Spread section ---

  const startEditingSpread = (index) => {
    const spread = spreads[index];
    setEditedSpread({
      index,
      question: spread.question || '',
      cards: spread.cards.map((c) => {
        const cardInfo = getCardById(c.cardId);
        return {
          cardId: c.cardId,
          searchTerm: cardInfo ? cardInfo.name : '',
          position: c.position || '',
        };
      }),
    });
    setEditingSection(`spread-${index}`);
  };

  const saveSpread = () => {
    if (!editedSpread) return;
    const updatedSpreads = [...spreads];
    updatedSpreads[editedSpread.index] = {
      ...updatedSpreads[editedSpread.index],
      question: editedSpread.question.trim(),
      cards: editedSpread.cards
        .filter((c) => c.cardId)
        .map(({ cardId, position }) => ({ cardId, position })),
    };
    onUpdate({ spreads: updatedSpreads });
    setEditingSection(null);
    setEditedSpread(null);
  };

  const removeSpread = (index) => {
    if (spreads.length <= 1) return;
    const updatedSpreads = spreads.filter((_, i) => i !== index);
    onUpdate({ spreads: updatedSpreads });
    setEditingSection(null);
    setEditedSpread(null);
  };

  const addSpread = () => {
    // Save a new empty spread, then open it for editing
    const newSpread = { question: '', cards: [{ cardId: '', position: '' }], interpretation: '' };
    const updatedSpreads = [...spreads, newSpread];
    onUpdate({ spreads: updatedSpreads });
    const newIndex = updatedSpreads.length - 1;
    setEditedSpread({
      index: newIndex,
      question: '',
      cards: [{ cardId: '', searchTerm: '', position: '' }],
    });
    setEditingSection(`spread-${newIndex}`);
  };

  // Spread card operations
  const updateSpreadCard = (cardIndex, updates) => {
    setEditedSpread((prev) => {
      const updatedCards = [...prev.cards];
      updatedCards[cardIndex] = { ...updatedCards[cardIndex], ...updates };
      return { ...prev, cards: updatedCards };
    });
  };

  const addCardToSpread = () => {
    setEditedSpread((prev) => ({
      ...prev,
      cards: [...prev.cards, { cardId: '', searchTerm: '', position: '' }],
    }));
  };

  const removeCardFromSpread = (cardIndex) => {
    setEditedSpread((prev) => {
      if (prev.cards.length <= 1) return prev;
      return { ...prev, cards: prev.cards.filter((_, i) => i !== cardIndex) };
    });
  };

  const getFilteredCards = (searchTerm) => {
    if (!searchTerm) return allCards;
    const term = searchTerm.toLowerCase();
    return allCards.filter((c) => c.name.toLowerCase().includes(term));
  };

  const selectCard = (cardIndex, card) => {
    updateSpreadCard(cardIndex, { cardId: card.id, searchTerm: card.name });
    setActiveDropdown(null);
  };

  // --- Interpretation section ---

  const startEditingInterpretation = (index) => {
    setEditedInterpretation(spreads[index].interpretation || '');
    setEditingSection(`interpretation-${index}`);
  };

  const saveInterpretation = (index) => {
    const updatedSpreads = [...spreads];
    updatedSpreads[index] = {
      ...updatedSpreads[index],
      interpretation: editedInterpretation,
    };
    onUpdate({ spreads: updatedSpreads });
    setEditingSection(null);
  };

  // --- Reflection section ---

  const startEditingReflection = () => {
    setEditedReflection(reading.reflection || '');
    setEditingSection('reflection');
  };

  const saveReflection = () => {
    onUpdate({ reflection: editedReflection });
    setEditingSection(null);
  };

  // --- Render ---

  return (
    <div className="reading-detail fade-in">
      {/* Header */}
      <div className="reading-detail-header">
        {editingSection === 'header' ? (
          <>
            <div className="form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Give this reading a name..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-date">Date</label>
              <input
                id="edit-date"
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
              />
            </div>
            <div className="section-actions">
              <button onClick={cancelEditing}>Cancel</button>
              <button className="btn-primary" onClick={saveHeader}>Save</button>
            </div>
          </>
        ) : (
          <>
            {reading.title && (
              <h1 className="reading-detail-title">{reading.title}</h1>
            )}
            <time className="reading-detail-date">
              {formatDate(reading.date || reading.createdAt)}
            </time>
            <button className="btn-edit-icon reading-detail-edit-btn" onClick={startEditingHeader} aria-label="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="divider" />

      {/* Spreads */}
      {spreads.map((spread, spreadIndex) => (
        <div key={spreadIndex} className="spread-detail">

          {/* Spread structure (question + cards) */}
          {editingSection === `spread-${spreadIndex}` && editedSpread ? (
            <div className="spread-section">
              <div className="spread-header">
                <span className="spread-number">Spread {spreadIndex + 1}</span>
              </div>
              <div className="form-group">
                <label htmlFor={`edit-question-${spreadIndex}`}>Question</label>
                <input
                  id={`edit-question-${spreadIndex}`}
                  type="text"
                  value={editedSpread.question}
                  onChange={(e) => setEditedSpread((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="What question are you exploring?"
                />
              </div>

              <div className="form-group">
                <label>Cards</label>
                <div className="cards-list">
                  {editedSpread.cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="card-entry">
                      <div className="card-entry-header">
                        <span className="card-entry-number">Card {cardIndex + 1}</span>
                        {editedSpread.cards.length > 1 && (
                          <button
                            type="button"
                            className="remove-card-btn"
                            onClick={() => removeCardFromSpread(cardIndex)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="card-entry-row">
                        <div className="card-autocomplete" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="Type to search cards..."
                            value={card.searchTerm}
                            onChange={(e) => {
                              updateSpreadCard(cardIndex, { searchTerm: e.target.value, cardId: '' });
                              setActiveDropdown(`${cardIndex}`);
                            }}
                            onFocus={() => setActiveDropdown(`${cardIndex}`)}
                            autoComplete="off"
                          />
                          {activeDropdown === `${cardIndex}` && (
                            <div className="card-dropdown">
                              {getFilteredCards(card.searchTerm).map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  className="card-dropdown-item"
                                  onClick={() => selectCard(cardIndex, c)}
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="position-field">
                        <input
                          type="text"
                          placeholder="Position (optional, e.g., Mind, Body, Spirit)"
                          value={card.position}
                          onChange={(e) => updateSpreadCard(cardIndex, { position: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="add-card-btn" onClick={addCardToSpread}>
                  + Add Another Card
                </button>
              </div>

              {spreads.length > 1 && (
                showDeleteSpreadConfirm ? (
                  <div className="delete-confirm">
                    <p>Are you sure you want to delete this spread?</p>
                    <div className="delete-confirm-actions">
                      <button onClick={() => setShowDeleteSpreadConfirm(false)}>Cancel</button>
                      <button className="btn-danger" onClick={() => removeSpread(spreadIndex)}>
                        Delete Spread
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-delete-spread"
                    onClick={() => setShowDeleteSpreadConfirm(true)}
                  >
                    Delete Spread
                  </button>
                )
              )}

              <div className="section-actions">
                <button onClick={cancelEditing}>Cancel</button>
                <button
                  className="btn-primary"
                  onClick={saveSpread}
                  disabled={!editedSpread.cards.some((c) => c.cardId)}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="section-header-row">
                {spread.question ? (
                  <h2 className="spread-question">{spread.question}</h2>
                ) : spreads.length === 1 ? (
                  <h2 className="spread-question-label">Cards Drawn</h2>
                ) : (
                  <h2 className="spread-question-label">Spread {spreadIndex + 1}</h2>
                )}
                <button
                  className="btn-edit-icon"
                  onClick={() => startEditingSpread(spreadIndex)}
                  disabled={editingSection !== null}
                  aria-label="Edit spread"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              </div>

              <div className={`reading-spread-layout spread-layout-${
                spread.cards.length === 1 ? 'single' :
                spread.cards.length === 3 ? 'three' : 'custom'
              }`}>
                {spread.cards.map((card, cardIndex) => {
                  const cardInfo = getCardById(card.cardId);
                  if (!cardInfo) return null;
                  const imageUrl = getCardImageUrl(card.cardId);

                  return (
                    <div key={cardIndex} className="spread-card">
                      <div className={`spread-card-image-wrapper${card.reversed ? ' reversed' : ''}`}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={cardInfo.name}
                            className="spread-card-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="spread-card-placeholder">
                            <span>{cardInfo.name}</span>
                          </div>
                        )}
                        {card.reversed && <span className="reversed-badge">Reversed</span>}
                      </div>
                      <span className="spread-card-name">{cardInfo.name}</span>
                      <span className="spread-card-position">{card.position || '\u00A0'}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Interpretation */}
          <div className="spread-interpretation">
            <div className="section-header-row">
              <h3>Interpretation</h3>
              {editingSection !== `interpretation-${spreadIndex}` && (
                <button
                  className="btn-edit-icon"
                  onClick={() => startEditingInterpretation(spreadIndex)}
                  disabled={editingSection !== null}
                  aria-label="Edit interpretation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              )}
            </div>

            {editingSection === `interpretation-${spreadIndex}` ? (
              <>
                <textarea
                  value={editedInterpretation}
                  onChange={(e) => setEditedInterpretation(e.target.value)}
                  placeholder="Write your interpretation..."
                  rows={6}
                  autoFocus
                />
                <div className="section-actions">
                  <button onClick={cancelEditing}>Cancel</button>
                  <button className="btn-primary" onClick={() => saveInterpretation(spreadIndex)}>
                    Save
                  </button>
                </div>
              </>
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

      {/* Add spread */}
      <button
        type="button"
        className="add-spread-btn"
        onClick={addSpread}
        disabled={editingSection !== null}
      >
        + Add Another Spread
      </button>

      <div className="divider" />

      {/* Reflection */}
      <section className="reading-detail-section">
        <div className="section-header-row">
          <h2>Reflection</h2>
          {editingSection !== 'reflection' && (
            <button
              className="btn-edit-icon"
              onClick={startEditingReflection}
              disabled={editingSection !== null}
              aria-label="Edit reflection"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
          )}
        </div>

        {editingSection === 'reflection' ? (
          <>
            <textarea
              value={editedReflection}
              onChange={(e) => setEditedReflection(e.target.value)}
              placeholder="How did this reading show up in your life? What actually happened?"
              rows={6}
              autoFocus
            />
            <div className="section-actions">
              <button onClick={cancelEditing}>Cancel</button>
              <button className="btn-primary" onClick={saveReflection}>Save</button>
            </div>
          </>
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
