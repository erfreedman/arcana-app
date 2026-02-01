import { supabase } from './client';
import { getDeviceId } from '../deviceId';

export const cardNotesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('card_notes')
      .select('*')
      .eq('device_id', getDeviceId());

    if (error) throw error;

    // Convert array to object format: { [cardId]: notes }
    return data.reduce((acc, row) => {
      acc[row.card_id] = row.notes;
      return acc;
    }, {});
  },

  async upsert(cardId, notes) {
    const { data, error } = await supabase
      .from('card_notes')
      .upsert(
        {
          device_id: getDeviceId(),
          card_id: cardId,
          notes: notes,
        },
        {
          onConflict: 'device_id,card_id',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
