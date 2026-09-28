import test from 'node:test';
import assert from 'node:assert/strict';
import { createImageQueue } from './galleryImageQueue.js';

test('limits simultaneous image downloads and continues after failures', async () => {
  const queue = createImageQueue(3);
  let running = 0;
  let peak = 0;
  const tasks = Array.from({ length: 8 }, (_, index) => queue(async () => {
    running++;
    peak = Math.max(peak, running);
    await new Promise(resolve => setTimeout(resolve, 5));
    running--;
    if (index === 1) throw new Error('Image failed');
    return index;
  }));
  const results = await Promise.allSettled(tasks);
  assert.equal(peak, 3);
  assert.equal(results.filter(item => item.status === 'fulfilled').length, 7);
  assert.equal(results[7].value, 7);
});
