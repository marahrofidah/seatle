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
  await send('Runtime.enable'); await send('Page.enable');
  await send('Storage.clearDataForOrigin', { origin:'http://127.0.0.1:5174', storageTypes:'indexeddb,local_storage' });
  await go('Page.navigate', {url:'http://127.0.0.1:5174/artifacts/teacher-review.html'});
  await waitFor("document.querySelectorAll('.teacher-student-card').length===2 && !document.querySelector('.teacher-delete-button').disabled");
  await evaluate("document.querySelector('.teacher-delete-button').click()");
  await waitFor("document.querySelector('.teacher-delete-dialog')?.open");
  await evaluate("document.querySelector('.teacher-delete-dialog .teacher-white').click()");
  assert.equal(await evaluate('deleteTest.calls.length'),0);
  await evaluate("deleteTest.fail=true; document.querySelector('.teacher-delete-button').click()");
  await waitFor("document.querySelector('.teacher-danger') !== null");
  await evaluate("document.querySelector('.teacher-danger').click()");
  await waitFor("document.querySelector('.teacher-delete-dialog [role=alert]') !== null");
  assert.equal(await evaluate("document.querySelectorAll('.teacher-student-card').length"),2);
  await evaluate("deleteTest.fail=false; document.querySelector('.teacher-danger').click()");
  await waitFor("document.querySelectorAll('.teacher-student-card').length===1 && !document.querySelector('.teacher-delete-dialog')");
  assert.equal(await evaluate('deleteTest.calls[1].p_name'),'Murid Kedua');
  assert.equal(await evaluate('deleteTest.calls[1].p_class'),'XI');
  await go('Page.reload');
  await waitFor("document.querySelectorAll('.teacher-student-card').length===1 && !document.querySelector('.teacher-delete-button').disabled");
  assert.equal(await evaluate("document.querySelector('.teacher-student-card').textContent.includes('Murid Uji')"),true);
  assert.deepEqual(errors,[]);
  console.log('Deletion UI passed: cancel makes no request; failure preserves roster; success targets exact name/class; deletion remains hidden after reload. Mock backend only.');
} finally { socket.close(); }
