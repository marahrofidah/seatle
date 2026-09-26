import { isSupabaseConfigured, supabase } from './supabase';
import { canDocument, dateLegacyEntries, localDate } from './actionSchedule';
import { loadGallery, withGalleryTimeout } from './galleryLoader';

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

export async function readActionJournals() {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records');
    const store = tx.objectStore('records');
    const keys = store.getAllKeys();
    const values = store.getAll();
    tx.oncomplete = () => {
      db.close();
      resolve(keys.result.flatMap((key, index) => typeof key === 'string' && key.startsWith('action:') ? [{ key, data: values.result[index] }] : []));
    };
    tx.onabort = tx.onerror = () => { db.close(); reject(new Error('Dokumentasi lama belum dapat dibaca.')); };
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

export async function saveJournalDay(key, day, entry) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('records', 'readwrite');
    const records = transaction.objectStore('records');
    const request = records.get(key);
    let next;
    let blocked = false;
    request.onsuccess = () => {
      const current = request.result;
      if (!current || !canDocument(current, day)) {
        blocked = true;
        transaction.abort();
        return;
      }
      next = { ...current, days: { ...current.days, [day]: { ...entry, savedOn: localDate() } } };
      records.put(next, key);
    };
    transaction.oncomplete = () => { db.close(); resolve(next); };
    transaction.onabort = transaction.onerror = () => {
      db.close();
      reject(new Error(blocked ? 'Dokumentasi hanya sekali sehari dan harus berurutan. Silakan lanjutkan besok.' : 'Dokumentasi belum tersimpan. Coba lagi.'));
    };
  });
}

export async function readJournal(key) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('records', 'readwrite');
    const records = transaction.objectStore('records');
    const request = records.get(key);
    let data;
    request.onsuccess = () => {
      data = request.result;
      if (data && Object.values(data.days).some(entry => !entry.savedOn)) {
        data = dateLegacyEntries(data);
        records.put(data, key);
      }
    };
    transaction.oncomplete = () => { db.close(); resolve(data); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(new Error('Jurnal belum dapat dibuka. Coba lagi.')); };
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

export async function getPosters(onLocal, key = journalKey()) {
  return loadGallery({
    readLocal: async () => {
      const [saved, journal] = await Promise.all([readRecord('posters'), readRecord(key)]);
      const local = saved || [];
      return journal?.poster && !local.some(item => item.id === journal.poster.id)
        ? [journal.poster, ...local] : local;
    },
    onLocal,
    readRemote: isSupabaseConfigured ? async signal => {
      const { data, error } = await supabase.from('posters').select('*')
        .order('created_at', { ascending: false }).abortSignal(signal);
      if (error) throw posterError(error);
      return data;
    } : null,
  });
}

// Commit the gallery entry and its journal together, including a stable ID for retries.
async function storePoster(key, poster, fallback) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('records', 'readwrite');
    const records = transaction.objectStore('records');
    const galleryRequest = records.get('posters');
    const journalRequest = records.get(key);
    let journal;
    galleryRequest.onsuccess = () => {
      records.put([poster, ...(galleryRequest.result || []).filter(item => item.id !== poster.id)], 'posters');
    };
    journalRequest.onsuccess = () => {
      journal = { ...(journalRequest.result || fallback), poster };
      records.put(journal, key);
    };
    transaction.oncomplete = () => { db.close(); resolve(journal); };
    transaction.onabort = transaction.onerror = () => { db.close(); reject(new Error('Poster belum tersimpan di perangkat. Periksa ruang penyimpanan lalu coba lagi.')); };
  });
}

export async function publishPoster(poster, key, fallback) {
  let journal = await storePoster(key, { ...poster, syncStatus: isSupabaseConfigured ? 'pending' : 'local' }, fallback);
  if (!isSupabaseConfigured) return { journal, warning: '' };
  try {
    const { id, title, authors, image_url, created_at } = poster;
    const { error } = await withGalleryTimeout(signal => supabase.from('posters').upsert(
      { id, title, authors, image_url, created_at }, { onConflict: 'id', ignoreDuplicates: true }).abortSignal(signal));
    if (error) throw posterError(error);
    journal = await storePoster(key, { ...poster, syncStatus: 'published' }, fallback);
    return { journal, warning: '' };
  } catch (error) {
    return { journal, warning: `Poster tersimpan di perangkat, tetapi pengiriman online belum terkonfirmasi. ${error.message}` };
  }
}

function posterError(error) {
  if (['PGRST205', '42P01'].includes(error.code)) {
    return new Error('Galeri online belum siap. Tabel penyimpanan poster belum tersedia. Hubungi pengelola website.');
  }
  if (error.code === '42501') {
    return new Error('Akses galeri online belum diizinkan. Hubungi pengelola website.');
  }
  return new Error('Galeri online belum dapat diakses. Periksa koneksi lalu coba lagi.');
}
