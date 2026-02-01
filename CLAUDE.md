# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm start            # Run development server (localhost:3000)
npm run build        # Production build to /build
npm test             # Run tests in watch mode
```

## Architecture

Arcana is a Progressive Web App (PWA) tarot journal built with React. Features a "luxury tech" dark theme with glassmorphism effects and Smith-Waite card imagery.

### Data Storage
All data stored in localStorage:
- `arcana-card-notes` - Personal notes keyed by card ID
- `arcana-folders` - Reading folder metadata
- `arcana-readings` - Individual reading records

### Component Structure
```
src/
├── App.js                    # Main app with navigation and state
├── components/
│   ├── Header.js             # Minimal header with back navigation
│   ├── Navigation.js         # Bottom tab bar (Cards / Journal)
│   ├── CardLibrary.js        # Card grid with images, search, filters
│   ├── CardDetail.js         # Card view with image and notes
│   ├── ReadingsSection.js    # Folder management
│   ├── FolderView.js         # Readings list within a folder
│   ├── ReadingForm.js        # Create new reading
│   └── ReadingDetail.js      # View/edit single reading
├── data/
│   ├── tarotCards.js         # 78 cards with keywords
│   └── cardImages.js         # Card image URL mapping (sacred-texts.com)
└── serviceWorkerRegistration.js
```

### View Routing
State-based routing in App.js:
- `activeTab`: 'library' | 'readings'
- `currentView`: 'main' | 'cardDetail' | 'folderView' | 'readingDetail' | 'newReading'

### Design System
Theme defined in `src/index.css`:
- Dark background: `#0a0a0f`
- Bronze accent: `#b08968`
- Font: Outfit (Google Fonts)
- Glassmorphism: `backdrop-filter: blur()` with semi-transparent backgrounds
- Bottom navigation with pill-shaped container
- Card images from sacred-texts.com (Smith-Waite public domain)

### Data Structures
```js
// Folder
{ id, name, createdAt }

// Reading
{ id, folderId, date, cards[], interpretation, createdAt }

// Reading Card Entry
{ cardId, reversed, position }
```
