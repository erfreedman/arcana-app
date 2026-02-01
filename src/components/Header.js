import React, { useState } from 'react';
import './Header.css';

function Header({ title, showBack, onBack, isOnline, isSyncing, user, onSignOut }) {
  const [showMenu, setShowMenu] = useState(false);

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

        <div className="header-actions">
          {isSyncing && (
            <span className="sync-indicator" title="Syncing...">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            </span>
          )}
          {!isOnline && !isSyncing && (
            <span className="offline-indicator" title="Offline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </span>
          )}
          {user && (
            <div className="header-menu-wrapper">
              <button
                className="header-menu-btn"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {showMenu && (
                <>
                  <div className="header-menu-backdrop" onClick={() => setShowMenu(false)} />
                  <div className="header-menu">
                    <div className="header-menu-email">{user.email}</div>
                    <button className="header-menu-item" onClick={() => { onSignOut(); setShowMenu(false); }}>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
