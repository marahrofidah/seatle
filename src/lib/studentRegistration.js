const pending = new Map();

export function ensureStudent(client, name, studentClass, {
  storage = globalThis.localStorage,
  locks = globalThis.navigator?.locks,
} = {}) {
  const nama = name.trim();
  const kelas = studentClass.trim();
  const normalize = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id');
  const identity = JSON.stringify([normalize(nama), normalize(kelas)]);
  const key = `seatle_registered_student:${client.supabaseUrl || 'default'}:${identity}`;
  if (pending.has(key)) return pending.get(key);

  const register = async () => {
    if (storage?.getItem(key) === '1') return;
    const { data, error } = await client.from('students').select('id')
      .eq('nama', nama).eq('kelas', kelas).limit(1);
    // Do not insert if checking existing students failed.
    if (error) throw error;
    if (!data.length) {
      const { error: insertError } = await client.from('students').insert({ nama, kelas });
      if (insertError) throw insertError;
    }
    storage?.setItem(key, '1');
  };
  // Serialize registrations across tabs on browsers supporting Web Locks.
  const operation = (locks ? locks.request(key, register) : register())
    .finally(() => pending.delete(key));
  pending.set(key, operation);
  return operation;
}
