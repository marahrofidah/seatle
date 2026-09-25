import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureStudent } from './studentRegistration.js';

function database(rows = [], readError = null) {
  let inserts = 0;
  return {
    rows,
    get inserts() { return inserts; },
    from(table) {
      assert.equal(table, 'students');
      const filters = {};
      return {
        select() { return this; },
        eq(key, value) { filters[key] = value; return this; },
        async limit() {
          return { data: rows.filter(row => row.nama === filters.nama && row.kelas === filters.kelas).slice(0, 1), error: readError };
        },
        async insert(row) { inserts++; rows.push({ id: rows.length + 1, ...row }); return { error: null }; },
      };
    },
  };
}

test('repeated login reuses the same name and class', async () => {
  const db = database();
  await ensureStudent(db, 'PIDA', 'XII');
  await ensureStudent(db, ' PIDA ', ' XII ');
  assert.equal(db.inserts, 1);
});

test('existing duplicate rows do not cause another insert', async () => {
  const db = database([{ id: 116, nama: 'PIDA', kelas: 'XII' }, { id: 117, nama: 'PIDA', kelas: 'XII' }]);
  await ensureStudent(db, 'PIDA', 'XII');
  assert.equal(db.inserts, 0);
  assert.equal(db.rows.length, 2);
});

test('different class creates a separate student', async () => {
  const db = database([{ id: 116, nama: 'PIDA', kelas: 'XII' }]);
  await ensureStudent(db, 'PIDA', 'XI');
  assert.equal(db.inserts, 1);
});

test('failed lookup never falls through to insertion', async () => {
  const db = database([], new Error('Offline'));
  await assert.rejects(ensureStudent(db, 'PIDA', 'XII'), /Offline/);
  assert.equal(db.inserts, 0);
});

test('simultaneous submissions on the page share one operation', async () => {
  const db = database();
  await Promise.all([ensureStudent(db, 'PIDA', 'XII'), ensureStudent(db, 'PIDA', 'XII')]);
  assert.equal(db.inserts, 1);
});

function browserStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('repeat login does not insert when RLS hides all existing students', async () => {
  const storage = browserStorage();
  const firstVisit = database();
  await ensureStudent(firstVisit, 'PIDA', 'XII', { storage });
  assert.equal(firstVisit.inserts, 1);
  // A fresh client sees no rows, as with a successful SELECT filtered by RLS.
  const nextVisit = database();
  await ensureStudent(nextVisit, ' pida ', ' xii ', { storage });
  assert.equal(nextVisit.inserts, 0);
});

test('existing successful session is remembered after the session ends', async () => {
  const storage = browserStorage();
  const session = browserStorage({ seatle_student_name: 'PIDA', seatle_student_class: 'XII' });
  const db = database();
  await ensureStudent(db, 'PIDA', 'XII', { storage, session });
  await ensureStudent(db, 'PIDA', 'XII', { storage, session: browserStorage() });
  assert.equal(db.inserts, 0);
});

test('failed insert is not remembered as a successful registration', async () => {
  const storage = browserStorage();
  const broken = database();
  const from = broken.from.bind(broken);
  broken.from = table => ({ ...from(table), insert: async () => ({ error: new Error('Insert failed') }) });
  await assert.rejects(ensureStudent(broken, 'PIDA', 'XII', { storage }), /Insert failed/);
  const retry = database();
  await ensureStudent(retry, 'PIDA', 'XII', { storage });
  assert.equal(retry.inserts, 1);
});
