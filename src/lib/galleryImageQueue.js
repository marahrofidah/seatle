export function createImageQueue(limit = 3) {
  let running = 0;
  const waiting = [];
  function next() {
    while (running < limit && waiting.length) {
      const { task, resolve, reject } = waiting.shift();
      running++;
      Promise.resolve().then(task).then(resolve, reject).finally(() => { running--; next(); });
    }
  }
  return task => new Promise((resolve, reject) => { waiting.push({ task, resolve, reject }); next(); });
}
