// Smith-Waite Centennial Tarot card images
// Using the public domain images from sacred-texts.com

const BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img';

// Map card IDs to image filenames
const IMAGE_MAP = {
  // Major Arcana
  'major-00': 'ar00.jpg',  // The Fool
  'major-01': 'ar01.jpg',  // The Magician
  'major-02': 'ar02.jpg',  // The High Priestess
  'major-03': 'ar03.jpg',  // The Empress
  'major-04': 'ar04.jpg',  // The Emperor
  'major-05': 'ar05.jpg',  // The Hierophant
  'major-06': 'ar06.jpg',  // The Lovers
  'major-07': 'ar07.jpg',  // The Chariot
  'major-08': 'ar08.jpg',  // Strength
  'major-09': 'ar09.jpg',  // The Hermit
  'major-10': 'ar10.jpg',  // Wheel of Fortune
  'major-11': 'ar11.jpg',  // Justice
  'major-12': 'ar12.jpg',  // The Hanged Man
  'major-13': 'ar13.jpg',  // Death
  'major-14': 'ar14.jpg',  // Temperance
  'major-15': 'ar15.jpg',  // The Devil
  'major-16': 'ar16.jpg',  // The Tower
  'major-17': 'ar17.jpg',  // The Star
  'major-18': 'ar18.jpg',  // The Moon
  'major-19': 'ar19.jpg',  // The Sun
  'major-20': 'ar20.jpg',  // Judgement
  'major-21': 'ar21.jpg',  // The World

  // Wands
  'wands-01': 'waac.jpg',  // Ace of Wands
  'wands-02': 'wa02.jpg',  // Two of Wands
  'wands-03': 'wa03.jpg',  // Three of Wands
  'wands-04': 'wa04.jpg',  // Four of Wands
  'wands-05': 'wa05.jpg',  // Five of Wands
  'wands-06': 'wa06.jpg',  // Six of Wands
  'wands-07': 'wa07.jpg',  // Seven of Wands
  'wands-08': 'wa08.jpg',  // Eight of Wands
  'wands-09': 'wa09.jpg',  // Nine of Wands
  'wands-10': 'wa10.jpg',  // Ten of Wands
  'wands-11': 'wapa.jpg',  // Page of Wands
  'wands-12': 'wakn.jpg',  // Knight of Wands
  'wands-13': 'waqu.jpg',  // Queen of Wands
  'wands-14': 'waki.jpg',  // King of Wands

  // Cups
  'cups-01': 'cuac.jpg',   // Ace of Cups
  'cups-02': 'cu02.jpg',   // Two of Cups
  'cups-03': 'cu03.jpg',   // Three of Cups
  'cups-04': 'cu04.jpg',   // Four of Cups
  'cups-05': 'cu05.jpg',   // Five of Cups
  'cups-06': 'cu06.jpg',   // Six of Cups
  'cups-07': 'cu07.jpg',   // Seven of Cups
  'cups-08': 'cu08.jpg',   // Eight of Cups
  'cups-09': 'cu09.jpg',   // Nine of Cups
  'cups-10': 'cu10.jpg',   // Ten of Cups
  'cups-11': 'cupa.jpg',   // Page of Cups
  'cups-12': 'cukn.jpg',   // Knight of Cups
  'cups-13': 'cuqu.jpg',   // Queen of Cups
  'cups-14': 'cuki.jpg',   // King of Cups

  // Swords
  'swords-01': 'swac.jpg', // Ace of Swords
  'swords-02': 'sw02.jpg', // Two of Swords
  'swords-03': 'sw03.jpg', // Three of Swords
  'swords-04': 'sw04.jpg', // Four of Swords
  'swords-05': 'sw05.jpg', // Five of Swords
  'swords-06': 'sw06.jpg', // Six of Swords
  'swords-07': 'sw07.jpg', // Seven of Swords
  'swords-08': 'sw08.jpg', // Eight of Swords
  'swords-09': 'sw09.jpg', // Nine of Swords
  'swords-10': 'sw10.jpg', // Ten of Swords
  'swords-11': 'swpa.jpg', // Page of Swords
  'swords-12': 'swkn.jpg', // Knight of Swords
  'swords-13': 'swqu.jpg', // Queen of Swords
  'swords-14': 'swki.jpg', // King of Swords

  // Pentacles
  'pentacles-01': 'peac.jpg', // Ace of Pentacles
  'pentacles-02': 'pe02.jpg', // Two of Pentacles
  'pentacles-03': 'pe03.jpg', // Three of Pentacles
  'pentacles-04': 'pe04.jpg', // Four of Pentacles
  'pentacles-05': 'pe05.jpg', // Five of Pentacles
  'pentacles-06': 'pe06.jpg', // Six of Pentacles
  'pentacles-07': 'pe07.jpg', // Seven of Pentacles
  'pentacles-08': 'pe08.jpg', // Eight of Pentacles
  'pentacles-09': 'pe09.jpg', // Nine of Pentacles
  'pentacles-10': 'pe10.jpg', // Ten of Pentacles
  'pentacles-11': 'pepa.jpg', // Page of Pentacles
  'pentacles-12': 'pekn.jpg', // Knight of Pentacles
  'pentacles-13': 'pequ.jpg', // Queen of Pentacles
  'pentacles-14': 'peki.jpg', // King of Pentacles
};

export const getCardImageUrl = (cardId) => {
  const filename = IMAGE_MAP[cardId];
  if (!filename) return null;
  return `${BASE_URL}/${filename}`;
};

export default getCardImageUrl;
