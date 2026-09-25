export async function withGalleryTimeout(request, timeoutMs = 10000) {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => request(controller.signal)),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Galeri online terlalu lama merespons. Coba muat ulang.'));
          controller.abort();
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function loadGallery({ readLocal, readRemote, onLocal = () => {}, timeoutMs }) {
  const local = await readLocal();
  onLocal(local);
  if (!readRemote) return { items: local, warning: '' };
  try {
    const remote = await withGalleryTimeout(readRemote, timeoutMs);
    return { items: [...remote, ...local.filter(item => !remote.some(other => other.id === item.id))], warning: '' };
  } catch (error) {
    return { items: local, warning: `${error.message} ${local.length ? 'Poster di perangkat ini tetap ditampilkan.' : 'Belum ada poster tersimpan di perangkat ini.'}` };
  }
}
