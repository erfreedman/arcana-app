import React, { useState } from 'react';
import { getMajorArcana, getCardsBySuit } from '../data/tarotCards';
import './ReadingForm.css';

function ReadingForm({ folderId, onSubmit, onCancel }) {
  const [cards, setCards] = useState([{ cardId: '', reversed: false, position: '' }]);
  const [interpretation, setInterpretation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addCard = () => {
    setCards([...cards, { cardId: '', reversed: false, position: '' }]);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (index, field, value) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validCards = cards.filter((c) => c.cardId);
    if (validCards.length === 0) return;

    onSubmit({
      folderId,
      cards: validCards,
      interpretation,
      date,
    });
  };

  const getPositionSuggestions = (index) => {
    const suggestions = [
      ['Past', 'Present', 'Future'],
      ['Situation', 'Action', 'Outcome'],
      ['Mind', 'Body', 'Spirit'],
      ['You', 'Them', 'The Relationship'],
    ];
    return suggestions[index % suggestions.length];
  };

  return (
    <form className="reading-form fade-in" onSubmit={handleSubmit}>
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
                <div className="card-select-wrapper">
                  <select
                    value={card.cardId}
                    onChange={(e) => updateCard(index, 'cardId', e.target.value)}
                    required={index === 0}
                  >
                    <option value="">Select a card...</option>
                    <optgroup label="Major Arcana">
                      {getMajorArcana().map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Wands">
                      {getCardsBySuit('Wands').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Cups">
                      {getCardsBySuit('Cups').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Swords">
                      {getCardsBySuit('Swords').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pentacles">
                      {getCardsBySuit('Pentacles').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <label className="reversed-toggle">
                  <input
                    type="checkbox"
                    checked={card.reversed}
                    onChange={(e) => updateCard(index, 'reversed', e.target.checked)}
                  />
                  <span>Reversed</span>
                </label>
              </div>

              <div className="position-field">
                <input
                  type="text"
                  placeholder="Position (optional, e.g., Past, Present, Future)"
                  value={card.position}
                  onChange={(e) => updateCard(index, 'position', e.target.value)}
                />
                <div className="position-suggestions">
                  {getPositionSuggestions(index).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="position-suggestion"
                      onClick={() => updateCard(index, 'position', suggestion)}
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
