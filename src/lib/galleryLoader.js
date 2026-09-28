export async function withGalleryTimeout(request, timeoutMs = 10000, signal) {
  const controller = new AbortController();
  let timer;
  let cancel;
  try {
    if (signal?.aborted) throw new DOMException('Dibatalkan', 'AbortError');
    return await Promise.race([
      Promise.resolve().then(() => request(controller.signal)),
      new Promise((_, reject) => {
        cancel = () => { controller.abort(); reject(new DOMException('Dibatalkan', 'AbortError')); };
        signal?.addEventListener('abort', cancel, { once: true });
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Galeri online terlalu lama merespons. Coba muat ulang.'));
          controller.abort();
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}

export function mergeGalleryPosters(remote, local) {
  const saved = new Map(local.map(item => [item.id, item]));
  const remoteIds = new Set(remote.map(item => item.id));
  return [...remote.map(item => ({ ...saved.get(item.id), ...item })), ...local.filter(item => !remoteIds.has(item.id))];
}

export async function loadGallery({ readLocal, readRemote, onLocal = () => {}, timeoutMs, signal }) {
  // Start online loading immediately; a broken device cache must not block it.
  const online = readRemote ? withGalleryTimeout(readRemote, timeoutMs, signal)
    .then(items => ({ items }), error => ({ error })) : null;
  let local = [];
  let localWarning = '';
  try {
    local = await withGalleryTimeout(() => readLocal(), 2000, signal);
    onLocal(local);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    localWarning = 'Salinan poster di perangkat belum dapat dibaca.';
  }
  if (!online) return { items: local, warning: localWarning };
  const result = await online;
  if (result.error) {
    if (result.error.name === 'AbortError') throw result.error;
    return { items: local, warning: `${result.error.message} ${local.length ? 'Poster di perangkat ini tetap ditampilkan.' : 'Belum ada poster tersimpan di perangkat ini.'}` };
  }
  return { items: mergeGalleryPosters(result.items, local), warning: '' };
}
