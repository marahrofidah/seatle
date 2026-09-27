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
  await go('Page.navigate', {url:'https://seatle-one.vercel.app/'});
  console.log(await evaluate(`await Promise.all(['sedih-B2Q6C6Sj.webp','prihatin-D38X13PM.webp','senang_ingin_membantu-rs88yrtf.webp','peduli-jVy0jzjC.webp','terkejut-DTFB_ZGD.webp'].map(file => new Promise(resolve => { const img=new Image(); img.onload=()=>resolve({file,loaded:true,width:img.naturalWidth,height:img.naturalHeight}); img.onerror=()=>resolve({file,loaded:false}); img.src='/assets/'+file; })))`));
} finally { await send('Browser.close'); socket.close(); }

