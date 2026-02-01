import { supabase } from './client';
import { getDeviceId } from '../deviceId';

export const readingsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('device_id', getDeviceId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToLocalFormat);
  },

  async create(reading) {
    const { data, error } = await supabase
      .from('readings')
      .insert({
        device_id: getDeviceId(),
        folder_id: reading.folderId,
        cards: reading.cards,
        interpretation: reading.interpretation,
        reading_date: reading.date,
        local_id: reading.id,
        created_at: reading.createdAt,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async update(id, updates) {
    const updateData = {};

    if (updates.interpretation !== undefined) {
      updateData.interpretation = updates.interpretation;
    }
    if (updates.cards !== undefined) {
      updateData.cards = updates.cards;
    }

    const { data, error } = await supabase
      .from('readings')
      .update(updateData)
      .eq('id', id)
      .eq('device_id', getDeviceId())
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', id)
      .eq('device_id', getDeviceId());

    if (error) throw error;
  },

  async deleteByFolderId(folderId) {
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('folder_id', folderId)
      .eq('device_id', getDeviceId());

    if (error) throw error;
  },
};

function mapToLocalFormat(dbRow) {
  return {
    id: dbRow.id,
    folderId: dbRow.folder_id,
    cards: dbRow.cards,
    interpretation: dbRow.interpretation,
    date: dbRow.reading_date,
    createdAt: dbRow.created_at,
    localId: dbRow.local_id,
  };
}
