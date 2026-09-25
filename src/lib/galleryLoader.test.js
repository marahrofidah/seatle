import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGallery, withGalleryTimeout } from './galleryLoader.js';

const poster = { id: 'saved-poster', image_url: 'data:image/png;base64,test' };

test('saved images appear before an unresponsive online gallery finishes', async () => {
  let shown;
  let signal;
  const result = loadGallery({
    readLocal: async () => [poster],
    readRemote: abortSignal => { signal = abortSignal; return new Promise(() => {}); },
    onLocal: items => { shown = items; },
    timeoutMs: 20,
  });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(shown, [poster]);
  const finished = await result;
  assert.deepEqual(finished.items, [poster]);
  assert.match(finished.warning, /terlalu lama/);
  assert.equal(signal.aborted, true);
});

test('reopening the gallery retains saved images when offline', async () => {
  for (let visit = 0; visit < 2; visit++) {
    const result = await loadGallery({
      readLocal: async () => JSON.parse(JSON.stringify([poster])),
      readRemote: async () => { throw new Error('Offline'); },
    });
    assert.deepEqual(result.items, [poster]);
    assert.match(result.warning, /Offline/);
  }
});

test('online images merge with local images without duplicates', async () => {
  const remote = { ...poster, title: 'Published' };
  const pending = { id: 'pending-poster' };
  const result = await loadGallery({
    readLocal: async () => [poster, pending],
    readRemote: async () => [remote],
  });
  assert.deepEqual(result, { items: [remote, pending], warning: '' });
});

test('a failed empty gallery reports missing local data accurately', async () => {
  const result = await loadGallery({
    readLocal: async () => [],
    readRemote: async () => { throw new Error('Offline'); },
  });
  assert.match(result.warning, /Belum ada poster tersimpan/);
});

test('local-only gallery loads without an online request', async () => {
  assert.deepEqual(await loadGallery({ readLocal: async () => [poster] }), { items: [poster], warning: '' });
});

test('a hanging upload also times out instead of keeping the form busy', async () => {
  await assert.rejects(withGalleryTimeout(() => new Promise(() => {}), 10), /terlalu lama/);
});
