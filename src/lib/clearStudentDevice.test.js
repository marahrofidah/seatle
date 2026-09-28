import test from 'node:test';
import assert from 'node:assert/strict';
import { clearStudentDevice } from './clearStudentDevice.js';

function storage(initial = {}) {
  const values = { ...initial };
  Object.defineProperties(values, {
    getItem: { value: key => values[key] ?? null },
    setItem: { value: (key, value) => { values[key] = value; } },
    removeItem: { value: key => { delete values[key]; } },
  });
  return values;
}

test('deletion clears all matching drafts, registration receipt and restored login', () => {
  const pair = JSON.stringify([' Naya ', '5A']);
  const keys = [`seatle_care_${pair}`, `seatle_website_reflection:${pair}`, `seatle_progress_${pair}`, `seatle_activity:${pair}:mengenal-penyu`, 'seatle_registered_student:https://example.test:["naya","5a"]'];
  const local = storage(Object.fromEntries(keys.map(key => [key, 'old progress'])));
  local.setItem('seatle_student_login', JSON.stringify({ name: 'Naya', studentClass: '5A' }));
  const session = storage({ seatle_student_name: 'Naya', seatle_student_class: '5A' });
  clearStudentDevice('naya', '5a', local, session);
  assert.deepEqual(Object.keys(local), []);
  assert.deepEqual(Object.keys(session), []);
});

test('deletion preserves another student, class and unrelated browser data', () => {
  const otherProgress = 'seatle_progress_["Naya","5B"]';
  const local = storage({ [otherProgress]: '["mengenal-penyu"]', theme: 'blue', 'seatle_care_broken': 'keep', seatle_student_login: JSON.stringify({ name: 'Budi', studentClass: '5A' }) });
  const session = storage({ seatle_student_name: 'Budi', seatle_student_class: '5A' });
  const before = JSON.stringify(local);
  clearStudentDevice('Naya', '5A', local, session);
  assert.equal(JSON.stringify(local), before);
  assert.equal(session.getItem('seatle_student_name'), 'Budi');
});

test('a different tab login survives cleanup of the deleted session', () => {
  const local = storage({ seatle_student_login: JSON.stringify({ name: 'Budi', studentClass: '5A' }) });
  const session = storage({ seatle_student_name: 'Naya', seatle_student_class: '5A' });
  clearStudentDevice('Naya', '5A', local, session);
  assert.equal(JSON.parse(local.getItem('seatle_student_login')).name, 'Budi');
  assert.deepEqual(Object.keys(session), []);
});
