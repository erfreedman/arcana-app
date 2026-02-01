import React, { useState, useMemo } from 'react';
import { TAROT_CARDS, getMajorArcana, getCardsBySuit } from '../data/tarotCards';
import { getCardImageUrl } from '../data/cardImages';
import './CardLibrary.css';

function CardLibrary({ cardNotes, onCardSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  const filteredCards = useMemo(() => {
    let cards = TAROT_CARDS;

    if (activeSection === 'major') {
      cards = getMajorArcana();
    } else if (['wands', 'cups', 'swords', 'pentacles'].includes(activeSection)) {
      cards = getCardsBySuit(activeSection.charAt(0).toUpperCase() + activeSection.slice(1));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(
        (card) =>
          card.name.toLowerCase().includes(query) ||
          card.keywords.some((k) => k.toLowerCase().includes(query))
      );
    }

    return cards;
  }, [searchQuery, activeSection]);

  const sections = [
    { id: 'all', label: 'All' },
    { id: 'major', label: 'Major' },
    { id: 'wands', label: 'Wands' },
    { id: 'cups', label: 'Cups' },
    { id: 'swords', label: 'Swords' },
    { id: 'pentacles', label: 'Pentacles' },
  ];

  return (
    <div className="card-library fade-in">
      {/* Search Bar */}
      <div className="search-container">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search cards..."
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

      {/* Section Filters */}
      <div className="section-filters">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`section-filter ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="card-grid">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            className="card-tile"
            onClick={() => onCardSelect(card.id)}
          >
            <div className="card-tile-image">
              <img
                src={getCardImageUrl(card.id)}
                alt={card.name}
                loading="lazy"
              />
              {cardNotes[card.id] && (
                <div className="card-tile-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              )}
            </div>
            <div className="card-tile-name">{card.name}</div>
          </button>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="no-results">
          <p>No cards found</p>
          <button onClick={() => { setSearchQuery(''); setActiveSection('all'); }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default CardLibrary;
