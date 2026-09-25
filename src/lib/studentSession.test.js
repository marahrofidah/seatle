import test from 'node:test';
import assert from 'node:assert/strict';
import { saveStudentSession, restoreStudentSession, clearStudentSession } from './studentSession.js';

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

test('closing the browser and opening a new session restores the same student', () => {
  const persistent = storage();
  saveStudentSession('PIDA', 'XII', persistent, storage());
  const reopened = storage();
  assert.deepEqual(restoreStudentSession(persistent, reopened), { name: 'PIDA', studentClass: 'XII' });
  assert.equal(reopened.getItem('seatle_student_name'), 'PIDA');
  assert.equal(reopened.getItem('seatle_student_class'), 'XII');
});

test('existing login is migrated without registering again', () => {
  const persistent = storage();
  restoreStudentSession(persistent, storage({ seatle_student_name: 'PIDA', seatle_student_class: 'XII' }));
  assert.equal(restoreStudentSession(persistent, storage()).name, 'PIDA');
});

test('explicit logout clears identity and preserves learning progress', () => {
  const persistent = storage({ seatle_progress: 'saved' });
  const session = storage();
  saveStudentSession('PIDA', 'XII', persistent, session);
  clearStudentSession(persistent, session);
  assert.equal(restoreStudentSession(persistent, session), null);
  assert.equal(restoreStudentSession(persistent, storage()), null);
  assert.equal(persistent.getItem('seatle_progress'), 'saved');
});

test('invalid stored login does not restore a student', () => {
  for (const value of ['broken', 'null', '{}', '{"name":"PIDA","studentClass":""}']) {
    assert.equal(restoreStudentSession(storage({ seatle_student_login: value }), storage()), null);
  }
});
