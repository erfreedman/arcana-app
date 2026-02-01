import { foldersService, readingsService, cardNotesService } from './supabase';

const MIGRATION_KEY = 'arcana-migration-complete';

export async function migrateLocalStorageToSupabase() {
  // Check if already migrated
  if (localStorage.getItem(MIGRATION_KEY)) {
    return { migrated: false, reason: 'already_done' };
  }

  const localFolders = JSON.parse(localStorage.getItem('arcana-folders') || '[]');
  const localReadings = JSON.parse(localStorage.getItem('arcana-readings') || '[]');
  const localNotes = JSON.parse(localStorage.getItem('arcana-card-notes') || '{}');

  // Nothing to migrate
  if (localFolders.length === 0 && localReadings.length === 0 && Object.keys(localNotes).length === 0) {
    localStorage.setItem(MIGRATION_KEY, 'true');
    return { migrated: false, reason: 'no_data' };
  }

  try {
    // Build ID mapping for folders (local_id -> supabase_id)
    const folderIdMap = {};

    // Migrate folders first
    for (const folder of localFolders) {
      const created = await foldersService.create(folder);
      folderIdMap[folder.id] = created.id;
    }

    // Migrate readings with updated folder IDs
    for (const reading of localReadings) {
      const migratedReading = {
        ...reading,
        folderId: folderIdMap[reading.folderId],
      };
      await readingsService.create(migratedReading);
    }

    // Migrate card notes
    for (const [cardId, notes] of Object.entries(localNotes)) {
      if (notes) {
        await cardNotesService.upsert(cardId, notes);
      }
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
    return {
      migrated: true,
      counts: {
        folders: localFolders.length,
        readings: localReadings.length,
        notes: Object.keys(localNotes).filter(k => localNotes[k]).length,
      },
    };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export function isMigrationComplete() {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}
