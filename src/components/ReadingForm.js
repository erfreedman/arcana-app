import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getMajorArcana, getCardsBySuit } from '../data/tarotCards';
import './ReadingForm.css';

function ReadingForm({ folderId, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState([{ cardId: '', searchTerm: '', position: '' }]);
  const [interpretation, setInterpretation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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

  const addCard = () => {
    setCards([...cards, { cardId: '', searchTerm: '', position: '' }]);
  };

  // Filter cards based on search term
  const getFilteredCards = (searchTerm) => {
    if (!searchTerm) return allCards;
    const term = searchTerm.toLowerCase();
    return allCards.filter((c) => c.name.toLowerCase().includes(term));
  };

  // Select a card from dropdown
  const selectCard = (index, card) => {
    updateCard(index, { cardId: card.id, searchTerm: card.name });
    setActiveDropdown(null);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (index, updates) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validCards = cards
      .filter((c) => c.cardId)
      .map(({ cardId, position }) => ({ cardId, position }));
    if (validCards.length === 0) return;

    onSubmit({
      folderId,
      title: title.trim() || null,
      cards: validCards,
      interpretation,
      date,
    });
  };

  const getPositionSuggestions = (index) => {
    const suggestions = [
      ['Mind', 'Body', 'Spirit'],
      ['Situation', 'Action', 'Outcome'],
      ['You', 'Them', 'The Relationship'],
      ['Past', 'Present', 'Future'],
    ];
    return suggestions[index % suggestions.length];
  };

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

      {/* Cards */}
      <div className="form-group">
        <label>Cards Pulled</label>
        <div className="cards-list">
          {cards.map((card, index) => (
            <div key={index} className="card-entry">
              <div className="card-entry-header">
                <span className="card-entry-number">Card {index + 1}</span>
                {cards.length > 1 && (
                  <button
                    type="button"
                    className="remove-card-btn"
                    onClick={() => removeCard(index)}
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
                      updateCard(index, { searchTerm: e.target.value, cardId: '' });
                      setActiveDropdown(index);
                    }}
                    onFocus={() => setActiveDropdown(index)}
                    required={index === 0}
                    autoComplete="off"
                  />
                  {activeDropdown === index && (
                    <div className="card-dropdown">
                      {getFilteredCards(card.searchTerm).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="card-dropdown-item"
                          onClick={() => selectCard(index, c)}
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
                  onChange={(e) => updateCard(index, { position: e.target.value })}
                />
                <div className="position-suggestions">
                  {getPositionSuggestions(index).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="position-suggestion"
                      onClick={() => updateCard(index, { position: suggestion })}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="add-card-btn" onClick={addCard}>
          + Add Another Card
        </button>
      </div>

      <div className="divider" />

      {/* Interpretation */}
      <div className="form-group">
        <label htmlFor="interpretation">Your Interpretation</label>
        <textarea
          id="interpretation"
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          placeholder="What insights did the cards reveal? How do they relate to your question or situation?"
          rows={6}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!cards.some((c) => c.cardId)}
        >
          Save Reading
        </button>
      </div>
    </form>
  );
}

export default ReadingForm;
