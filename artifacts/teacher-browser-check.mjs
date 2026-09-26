import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const tabs = await (await fetch('http://127.0.0.1:9223/json')).json();
const socket = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (!message.id) return;
  const waiter = pending.get(message.id);
  pending.delete(message.id);
  message.error ? waiter.reject(message.error) : waiter.resolve(message.result);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function go(method, params = {}) {
  const loaded = new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.removeEventListener('message', handler); reject(new Error('Page load timed out')); }, 20000);
    function handler(event) {
      if (JSON.parse(event.data).method !== 'Page.loadEventFired') return;
      clearTimeout(timer); socket.removeEventListener('message', handler); resolve();
    }
    socket.addEventListener('message', handler);
  });
  await send(method, params);
  await loaded;
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, replMode: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Timeout: ${expression}`);
}
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Storage.clearDataForOrigin', { origin: 'http://127.0.0.1:5174', storageTypes: 'indexeddb,local_storage' });
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await go('Page.navigate', { url: 'http://127.0.0.1:5174/artifacts/teacher-review.html' });
  await waitFor("document.querySelectorAll('.teacher-student-card').length === 2 && !document.body.innerText.includes('Memuat rekap murid...')");
  assert.equal(await evaluate("document.querySelectorAll('.teacher-student-card').length"), 2);
  await evaluate("document.querySelectorAll('.teacher-stats button')[2].click()");
  await waitFor("document.querySelectorAll('.teacher-student-card').length === 0");
  await evaluate("document.querySelectorAll('.teacher-stats button')[3].click()");
  await waitFor("document.querySelectorAll('.teacher-student-card').length === 1");
  await evaluate("document.querySelector('.teacher-reflection').click()");
  await waitFor("document.querySelectorAll('.teacher-module')[4]?.open === true");
  await evaluate("document.querySelector('.teacher-detail .teacher-button').click(); document.querySelectorAll('.teacher-stats button')[0].click()");
  await waitFor("document.querySelectorAll('.teacher-student-card').length === 2");
  await evaluate("[...document.querySelectorAll('.teacher-student-card')].find(row => row.textContent.includes('Murid Uji')).querySelector('.teacher-open').click()");
  await waitFor("document.querySelectorAll('.teacher-module').length === 5");
  assert.equal(await evaluate("document.querySelector('.teacher-detail').textContent.includes('Melindungi organ dalam tubuh')"), true);
  assert.equal(await evaluate("document.querySelector('.teacher-detail').textContent.includes('Sangat Setuju')"), true);
  await evaluate("document.querySelectorAll('.teacher-module')[3].open = true; document.querySelector('.teacher-photo > button').click()");
  assert.equal(await evaluate("document.querySelector('.teacher-photo dialog').open"), true);
  await evaluate("document.querySelector('.teacher-photo dialog button').click(); document.querySelector('.teacher-detail .teacher-button').click(); window.scrollTo(0,0); document.body.scrollTo(0,0); document.documentElement.scrollTo(0,0)");
  await new Promise(resolve => setTimeout(resolve, 300));
  const desktop = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/teacher-desktop.png', Buffer.from(desktop.data, 'base64'));
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("window.scrollTo(0,0); document.body.scrollTo(0,0); document.documentElement.scrollTo(0,0)");
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(await evaluate('document.documentElement.scrollWidth <= 390'), true);
  const mobile = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/teacher-mobile.png', Buffer.from(mobile.data, 'base64'));
  await evaluate("const input = document.querySelector('.teacher-search input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'TidakAda'); input.dispatchEvent(new Event('input', {bubbles:true}));");
  await waitFor("document.body.innerText.includes('Murid tidak ditemukan')");
  // Verify same-identity snapshots persist and replace, not append, locally.
  await evaluate("reportTest.saveStudentReport('refleksi', {submitted:true, entries:[{question:'Uji simpan',answer:'Setuju'}]}, {name:'Murid Persisten',studentClass:'XI'})");
  await evaluate("reportTest.saveStudentReport('refleksi', {submitted:true, entries:[{question:'Uji simpan',answer:'Sangat Setuju'}]}, {name:'Murid Persisten',studentClass:'XI'})");
  assert.equal(await evaluate("(await reportTest.localReports()).filter(row => row.student_name === 'Murid Persisten').length"), 1);
  await go('Page.reload');
  await waitFor("document.querySelectorAll('.teacher-student-card').length === 3 && !document.body.innerText.includes('Memuat rekap murid...')");
  assert.equal(await evaluate("(await reportTest.localReports()).find(row => row.student_name === 'Murid Persisten').payload.entries[0].answer"), 'Sangat Setuju');
  await go('Page.navigate', { url: 'http://127.0.0.1:5174/artifacts/teacher-review.html?activity=mengenal' });
  await waitFor("[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Sampah plastik di laut')");
  await evaluate("[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Sampah plastik di laut').click()");
  await waitFor("(await reportTest.localReports()).some(row => row.student_name === 'Murid Aktivitas' && row.module === 'mengenal-penyu' && row.payload.entries[0].answer === 'Sampah plastik di laut')");
  await go('Page.reload');
  await waitFor("[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Sampah plastik di laut' && button.querySelector('svg'))");
  // Clearing the last answer must replace the prior report with an empty draft.
  await evaluate("[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Sampah plastik di laut').click()");
  await waitFor("(await reportTest.localReports()).some(row => row.student_name === 'Murid Aktivitas' && row.module === 'mengenal-penyu' && row.payload.entries[0].answer === '')");
  await go('Page.navigate', { url: 'http://127.0.0.1:5174/artifacts/teacher-review.html?activity=ancaman' });
  await waitFor("document.querySelector('input[type=checkbox]') !== null");
  await evaluate("document.querySelector('input[type=checkbox]').click()");
  await waitFor("(await reportTest.localReports()).some(row => row.student_name === 'Murid Aktivitas' && row.module === 'ancaman-penyu' && row.payload.entries[0].answer === 'Sampah plastik')");
  await go('Page.reload');
  await waitFor("document.querySelector('input[type=checkbox]')?.checked === true");
  await evaluate("window.fetch = async () => { throw new Error('Offline test'); }; await reportTest.saveStudentReport('refleksi', {entries:[{question:'Offline',answer:'Tetap tersimpan'}]}, {name:'Murid Offline', studentClass:'XI'}); await reportTest.syncStudentReports().catch(() => {});");
  assert.equal(await evaluate("(await reportTest.localReports()).find(row => row.student_name === 'Murid Offline').pending"), true);
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: roster deduplication, all five sections, answers, photo dialog, mobile overflow, search, IndexedDB persistence, latest snapshot, actual activity answer capture/restoration/clearing and offline queue.');
} finally {
  socket.close();
}
