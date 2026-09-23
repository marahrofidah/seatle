import { isSupabaseConfigured, supabase } from './supabase';

export const challenges = [
  ['🥤', 'Tidak menggunakan sedotan plastik'],
  ['💧', 'Membawa botol minum sendiri'],
  ['🛍️', 'Membawa tas belanja kain'],
  ['🗑️', 'Membuang sampah pada tempatnya'],
  ['🌱', 'Mengurangi penggunaan plastik sekali pakai'],
  ['♻️', 'Mengajak keluarga memilah sampah'],
  ['🧹', 'Membersihkan lingkungan rumah'],
];

export function journalKey() {
  return `action:${JSON.stringify([sessionStorage.getItem('seatle_student_name') || 'Petualang', sessionStorage.getItem('seatle_student_class') || '-'])}`;
}

function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('seatle-actions', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Penyimpanan perangkat tidak tersedia.'));
  });
}

export async function readRecord(key) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction('records').objectStore('records').get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.transaction.oncomplete = () => db.close();
  });
}

export async function writeRecord(key, value) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('records', 'readwrite');
    transaction.objectStore('records').put(value, key);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(new Error('Belum tersimpan. Periksa ruang penyimpanan lalu coba lagi.')); };
  });
}

export function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return reject(new Error('Pilih gambar JPG, PNG, atau WebP.'));
    if (file.size > 5 * 1024 * 1024) return reject(new Error('Ukuran gambar maksimal 5 MB.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gambar tidak dapat dibaca. Coba file lain.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('File gambar rusak atau tidak dapat ditampilkan.'));
      image.onload = () => resolve(reader.result);
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function getPosters() {
  const local = await readRecord('posters') || [];
  if (!isSupabaseConfigured) return local;
  const { data, error } = await supabase.from('posters').select('*').order('created_at', { ascending: false });
  if (error) throw new Error('Galeri online belum dapat dimuat. Coba lagi.');
  return [...data, ...local.filter(item => !data.some(remote => remote.id === item.id))];
}

export async function publishPoster(poster) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('posters').upsert(poster, { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw new Error('Poster belum terkirim ke galeri online. Periksa koneksi lalu coba lagi.');
  }
  const local = await readRecord('posters') || [];
  await writeRecord('posters', [poster, ...local.filter(item => item.id !== poster.id)]);
}
