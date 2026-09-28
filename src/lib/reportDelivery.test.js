import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverReport } from './reportDelivery.js';

const identity = { name: 'Naya', studentClass: '5A' };
const payload = { submitted: true, entries: [{ question: 'Website', answer: 'Setuju' }] };
const record = { student_name: 'Naya', student_class: '5A', module: 'refleksi', payload, pending: false };

test('submission waits for storage and syncs again after an in-flight draft sync', async () => {
  let saved = false;
  let passes = 0;
  await deliverReport('refleksi', payload, identity, {
    save: async () => { await Promise.resolve(); saved = true; },
    sync: async () => { assert.equal(saved, true); passes++; },
    read: async () => [{ ...record, pending: passes < 2 }],
  });
  assert.equal(passes, 2);
});

test('offline submission surfaces failure and does not claim delivery', async () => {
  await assert.rejects(deliverReport('refleksi', payload, identity, {
    save: async () => {}, sync: async () => { throw new Error('Offline'); }, read: async () => [record],
  }), /Offline/);
});

test('pending, missing, outdated and other-student reports cannot confirm delivery', async () => {
  for (const rows of [[], [{ ...record, pending: true }], [{ ...record, payload: { submitted: false } }], [{ ...record, student_name: 'Budi' }]]) {
    await assert.rejects(deliverReport('refleksi', payload, identity, {
      save: async () => {}, sync: async () => {}, read: async () => rows,
    }), /belum terkirim/);
  }
});
