import { supabase } from './client';

export const readingsService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapToLocalFormat);
  },

  async create(reading, userId) {
    const { data, error } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
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

  async update(id, updates, userId) {
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
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async delete(id, userId) {
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async deleteByFolderId(folderId, userId) {
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('folder_id', folderId)
      .eq('user_id', userId);

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
