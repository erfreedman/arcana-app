import { supabase } from './client';

export const foldersService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(mapToLocalFormat);
  },

  async create(folder, userId) {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        name: folder.name,
        local_id: folder.id,
        created_at: folder.createdAt,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async update(id, updates, userId) {
    const { data, error } = await supabase
      .from('folders')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async delete(id, userId) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};

function mapToLocalFormat(dbRow) {
  return {
    id: dbRow.id,
    name: dbRow.name,
    createdAt: dbRow.created_at,
    localId: dbRow.local_id,
  };
}
