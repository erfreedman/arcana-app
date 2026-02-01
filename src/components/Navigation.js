import React from 'react';
import './Navigation.css';

function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <button
          className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => onTabChange('library')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Three cards stacked/fanned */}
            <rect x="2" y="4" width="8" height="12" rx="1" />
            <rect x="8" y="6" width="8" height="12" rx="1" />
            <rect x="14" y="8" width="8" height="12" rx="1" />
          </svg>
          <span>Deck</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'readings' ? 'active' : ''}`}
          onClick={() => onTabChange('readings')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" />
          </svg>
          <span>Readings</span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
