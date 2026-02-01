import { supabase } from './client';
import { getDeviceId } from '../deviceId';

export const foldersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('device_id', getDeviceId())
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(mapToLocalFormat);
  },

  async create(folder) {
    const { data, error } = await supabase
      .from('folders')
      .insert({
        device_id: getDeviceId(),
        name: folder.name,
        local_id: folder.id,
        created_at: folder.createdAt,
      })
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('folders')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('device_id', getDeviceId())
      .select()
      .single();

    if (error) throw error;
    return mapToLocalFormat(data);
  },

  async delete(id) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)
      .eq('device_id', getDeviceId());

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
