import React, { useState, useMemo, useEffect } from 'react';
import { getMajorArcana, getCardsBySuit } from '../data/tarotCards';
import './ReadingForm.css';

const createEmptySpread = () => ({
  question: '',
  cards: [{ cardId: '', searchTerm: '', position: '' }],
  interpretation: '',
});

function ReadingForm({ folderId, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [spreads, setSpreads] = useState([createEmptySpread()]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Get all cards for autocomplete
  const allCards = useMemo(() => {
    return [
      ...getMajorArcana(),
      ...getCardsBySuit('Wands'),
      ...getCardsBySuit('Cups'),
      ...getCardsBySuit('Swords'),
      ...getCardsBySuit('Pentacles'),
    ];
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Spread operations
  const addSpread = () => {
    setSpreads([...spreads, createEmptySpread()]);
  };

  const removeSpread = (spreadIndex) => {
    if (spreads.length > 1) {
      setSpreads(spreads.filter((_, i) => i !== spreadIndex));
    }
  };

  const updateSpread = (spreadIndex, updates) => {
    setSpreads((prev) => {
      const updated = [...prev];
      updated[spreadIndex] = { ...updated[spreadIndex], ...updates };
      return updated;
    });
  };

  // Card operations within a spread
  const addCard = (spreadIndex) => {
    setSpreads((prev) => {
      const updated = [...prev];
      updated[spreadIndex] = {
        ...updated[spreadIndex],
        cards: [...updated[spreadIndex].cards, { cardId: '', searchTerm: '', position: '' }],
      };
      return updated;
    });
  };

  const removeCard = (spreadIndex, cardIndex) => {
    setSpreads((prev) => {
      const updated = [...prev];
      if (updated[spreadIndex].cards.length > 1) {
        updated[spreadIndex] = {
          ...updated[spreadIndex],
          cards: updated[spreadIndex].cards.filter((_, i) => i !== cardIndex),
        };
      }
      return updated;
    });
  };

  const updateCard = (spreadIndex, cardIndex, updates) => {
    setSpreads((prev) => {
      const updated = [...prev];
      const updatedCards = [...updated[spreadIndex].cards];
      updatedCards[cardIndex] = { ...updatedCards[cardIndex], ...updates };
      updated[spreadIndex] = { ...updated[spreadIndex], cards: updatedCards };
      return updated;
    });
  };

  // Filter cards based on search term
  const getFilteredCards = (searchTerm) => {
    if (!searchTerm) return allCards;
    const term = searchTerm.toLowerCase();
    return allCards.filter((c) => c.name.toLowerCase().includes(term));
  };

  // Select a card from dropdown
  const selectCard = (spreadIndex, cardIndex, card) => {
    updateCard(spreadIndex, cardIndex, { cardId: card.id, searchTerm: card.name });
    setActiveDropdown(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate: at least one spread with a question and at least one card
    const validSpreads = spreads
      .filter((s) => s.question.trim() && s.cards.some((c) => c.cardId))
      .map((s) => ({
        question: s.question.trim(),
        cards: s.cards
          .filter((c) => c.cardId)
          .map(({ cardId, position }) => ({ cardId, position })),
        interpretation: s.interpretation,
      }));

    if (validSpreads.length === 0) return;

    onSubmit({
      folderId,
      title: title.trim() || null,
      spreads: validSpreads,
      reflection: '',
      date,
    });
  };

  const isFormValid = spreads.some(
    (s) => s.question.trim() && s.cards.some((c) => c.cardId)
  );

  return (
    <form className="reading-form fade-in" onSubmit={handleSubmit}>
      {/* Title field */}
      <div className="form-group">
        <label htmlFor="reading-title">Title (optional)</label>
        <input
          id="reading-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this reading a name..."
        />
      </div>

      {/* Date field */}
      <div className="form-group">
        <label htmlFor="reading-date">Date</label>
        <input
          id="reading-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="divider" />

      {/* Spreads */}
      {spreads.map((spread, spreadIndex) => (
        <div key={spreadIndex} className="spread-section">
          <div className="spread-header">
            <span className="spread-number">Spread {spreadIndex + 1}</span>
            {spreads.length > 1 && (
              <button
                type="button"
                className="remove-spread-btn"
                onClick={() => removeSpread(spreadIndex)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Question */}
          <div className="form-group">
            <label htmlFor={`spread-question-${spreadIndex}`}>Spread</label>
            <input
              id={`spread-question-${spreadIndex}`}
              type="text"
              value={spread.question}
              onChange={(e) => updateSpread(spreadIndex, { question: e.target.value })}
              placeholder="What question are you exploring?"
              required={spreadIndex === 0}
            />
          </div>

          {/* Cards */}
          <div className="form-group">
            <label>Cards Pulled</label>
            <div className="cards-list">
              {spread.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="card-entry">
                  <div className="card-entry-header">
                    <span className="card-entry-number">Card {cardIndex + 1}</span>
                    {spread.cards.length > 1 && (
                      <button
                        type="button"
                        className="remove-card-btn"
                        onClick={() => removeCard(spreadIndex, cardIndex)}
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
                          updateCard(spreadIndex, cardIndex, { searchTerm: e.target.value, cardId: '' });
                          setActiveDropdown(`${spreadIndex}-${cardIndex}`);
                        }}
                        onFocus={() => setActiveDropdown(`${spreadIndex}-${cardIndex}`)}
                        required={spreadIndex === 0 && cardIndex === 0}
                        autoComplete="off"
                      />
                      {activeDropdown === `${spreadIndex}-${cardIndex}` && (
                        <div className="card-dropdown">
                          {getFilteredCards(card.searchTerm).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className="card-dropdown-item"
                              onClick={() => selectCard(spreadIndex, cardIndex, c)}
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
                      onChange={(e) => updateCard(spreadIndex, cardIndex, { position: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="add-card-btn" onClick={() => addCard(spreadIndex)}>
              + Add Another Card
            </button>
          </div>

          {/* Interpretation for this spread */}
          <div className="form-group">
            <label htmlFor={`interpretation-${spreadIndex}`}>Interpretation</label>
            <textarea
              id={`interpretation-${spreadIndex}`}
              value={spread.interpretation}
              onChange={(e) => updateSpread(spreadIndex, { interpretation: e.target.value })}
              placeholder="What insights did the cards reveal for this question?"
              rows={4}
            />
          </div>

          {spreadIndex < spreads.length - 1 && <div className="divider" />}
        </div>
      ))}

      <button type="button" className="add-spread-btn" onClick={addSpread}>
        + Add Another Spread
      </button>

      <div className="divider" />

      {/* Actions */}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!isFormValid}
        >
          Save Reading
        </button>
      </div>
    </form>
  );
}

export default ReadingForm;
