import React from 'react';
import './Header.css';

function Header({ title, showBack, onBack }) {
  return (
    <header className="header">
      <div className="header-content">
        {showBack ? (
          <button className="header-back" onClick={onBack} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="header-spacer" />
        )}

        <div className="header-title">
          {title ? (
            <h1 className="header-page-title">{title}</h1>
          ) : (
            <h1 className="header-logo">arcana</h1>
          )}
        </div>

        <div className="header-spacer" />
      </div>
    </header>
  );
}

export default Header;
