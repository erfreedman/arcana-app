import { getCardById, getMajorArcana, getCardsBySuit } from '../data/tarotCards';

// --- Helpers ---

const h = (level, headingOffset) => '#'.repeat(level + headingOffset + 1);

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDateLong = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const parseDate = (dateString) => new Date(dateString + 'T00:00:00');

const sortReadingsOldestFirst = (readings) =>
  [...readings].sort((a, b) => parseDate(a.date) - parseDate(b.date));

// --- Core render functions ---

export function renderReading(reading, headingOffset, folderName) {
  const lines = [];

  // Title
  const title = reading.title || 'Untitled Reading';
  lines.push(`${h(0, headingOffset)} ${title}`);

  // Subtitle: date + folder
  const parts = [];
  if (reading.date) parts.push(formatDateLong(reading.date));
  if (folderName) parts.push(folderName);
  if (parts.length) lines.push(`*${parts.join(' \u00b7 ')}*`);

  const spreads = reading.spreads || [];

  spreads.forEach((spread) => {
    const hasQuestion = spread.question && spread.question.trim();
    const hasCards = spread.cards && spread.cards.length > 0;
    const hasInterpretation = spread.interpretation && spread.interpretation.trim();

    if (!hasQuestion && !hasCards && !hasInterpretation) return;

    // Spread question as heading
    if (hasQuestion) {
      lines.push('');
      lines.push(`${h(1, headingOffset)} ${spread.question}`);
    }

    // Cards
    if (hasCards) {
      lines.push('');
      spread.cards.forEach((card) => {
        const info = getCardById(card.cardId);
        if (!info) return;
        const name = info.name;
        const position = card.position && card.position.trim();
        if (position) {
          lines.push(`**${name}** \u2014 ${position}`);
        } else {
          lines.push(`**${name}**`);
        }
      });
    }

    // Interpretation
    if (hasInterpretation) {
      lines.push('');
      lines.push('**Interpretation**');
      lines.push('');
      lines.push(spread.interpretation.trim());
    }
  });

  // Reflection
  if (reading.reflection && reading.reflection.trim()) {
    lines.push('');
    lines.push('**Reflection**');
    lines.push('');
    lines.push(reading.reflection.trim());
  }

  return lines.join('\n');
}

export function renderCardNote(card, notes, headingOffset) {
  const lines = [];
  const title = card.type === 'major'
    ? `${card.number} \u00b7 ${card.name}`
    : card.name;
  lines.push(`${h(0, headingOffset)} ${title}`);
  lines.push('');
  lines.push(notes.trim());
  return lines.join('\n');
}

// --- Export scope functions ---

export function exportSingleReading(reading, folderName) {
  const content = renderReading(reading, 0, folderName);
  const title = reading.title || 'reading';
  const filename = `arcana-${slugify(title)}-${localDate()}.md`;
  shareOrDownload(content, filename);
}

export function exportFolder(folder, readings) {
  const sorted = sortReadingsOldestFirst(readings);
  const lines = [];
  lines.push(`# Arcana \u2014 ${folder.name}`);
  lines.push(`*Exported ${formatDateLong(localDate())} \u00b7 ${sorted.length} ${sorted.length === 1 ? 'reading' : 'readings'}*`);

  sorted.forEach((reading, i) => {
    lines.push('');
    if (i > 0) lines.push('---');
    lines.push('');
    lines.push(renderReading(reading, 1));
  });

  const filename = `arcana-${slugify(folder.name)}-${localDate()}.md`;
  shareOrDownload(lines.join('\n'), filename);
}

export function exportAllReadings(folders, readings) {
  const lines = [];

  const totalReadings = readings.length;
  const foldersWithReadings = folders.filter((f) =>
    readings.some((r) => r.folderId === f.id)
  );

  lines.push('# Arcana \u2014 All Readings');
  lines.push(`*Exported ${formatDateLong(localDate())} \u00b7 ${foldersWithReadings.length} ${foldersWithReadings.length === 1 ? 'folder' : 'folders'} \u00b7 ${totalReadings} ${totalReadings === 1 ? 'reading' : 'readings'}*`);

  // Folders in app order (same as the folders array)
  folders.forEach((folder) => {
    const folderReadings = sortReadingsOldestFirst(
      readings.filter((r) => r.folderId === folder.id)
    );
    if (folderReadings.length === 0) return;

    lines.push('');
    lines.push(`## ${folder.name}`);

    folderReadings.forEach((reading, i) => {
      lines.push('');
      if (i > 0) lines.push('---');
      lines.push('');
      lines.push(renderReading(reading, 2));
    });
  });

  const filename = `arcana-all-readings-${localDate()}.md`;
  shareOrDownload(lines.join('\n'), filename);
}

export function exportCardNotes(cardNotes) {
  // Groups in library order: Major Arcana, Wands, Cups, Swords, Pentacles
  const groups = [
    { label: 'Major Arcana', cards: getMajorArcana() },
    { label: 'Wands', cards: getCardsBySuit('Wands') },
    { label: 'Cups', cards: getCardsBySuit('Cups') },
    { label: 'Swords', cards: getCardsBySuit('Swords') },
    { label: 'Pentacles', cards: getCardsBySuit('Pentacles') },
  ];

  const notedCards = [];
  groups.forEach((group) => {
    const cards = group.cards.filter((c) => cardNotes[c.id] && cardNotes[c.id].trim());
    if (cards.length > 0) {
      notedCards.push({ label: group.label, cards });
    }
  });

  const totalCards = notedCards.reduce((sum, g) => sum + g.cards.length, 0);

  const lines = [];
  lines.push('# Arcana \u2014 Card Notes');
  lines.push(`*Exported ${formatDateLong(localDate())} \u00b7 ${totalCards} ${totalCards === 1 ? 'card' : 'cards'} with notes*`);

  notedCards.forEach((group, i) => {
    lines.push('');
    if (i > 0) lines.push('---');
    if (i > 0) lines.push('');
    lines.push(`## ${group.label}`);

    group.cards.forEach((card) => {
      lines.push('');
      lines.push(renderCardNote(card, cardNotes[card.id], 2));
    });
  });

  const filename = `arcana-card-notes-${localDate()}.md`;
  shareOrDownload(lines.join('\n'), filename);
}

// --- Share / Download ---

async function shareOrDownload(content, filename) {
  const file = new File([content], filename, { type: 'text/markdown' });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // User cancelled or share failed — fall through to download
      if (err.name === 'AbortError') return;
    }
  }

  // Fallback: download
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
