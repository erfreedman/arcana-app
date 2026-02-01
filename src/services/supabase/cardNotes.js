import { supabase } from './client';

export const cardNotesService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('card_notes')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    // Convert array to object format: { [cardId]: notes }
    return data.reduce((acc, row) => {
      acc[row.card_id] = row.notes;
      return acc;
    }, {});
  },

  async upsert(cardId, notes, userId) {
    const { data, error } = await supabase
      .from('card_notes')
      .upsert(
        {
          user_id: userId,
          card_id: cardId,
          notes: notes,
        },
        {
          onConflict: 'user_id,card_id',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
