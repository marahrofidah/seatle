import { useEffect, useRef, useState } from 'react';
import { currentStudent, saveStudentReport, syncStudentReports } from './studentReports';

let syncTimer;
function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void syncStudentReports().catch(() => {});
  }, 400);
}

export function activityKey(module) {
  const { name, studentClass } = currentStudent();
  return `seatle_activity:${JSON.stringify([name, studentClass])}:${module}`;
}

export function loadActivity(module) {
  try { return JSON.parse(localStorage.getItem(activityKey(module))) || {}; }
  catch { return {}; }
}

export default function useStudentReport(module, payload, enabled = true) {
  const serialized = JSON.stringify(payload);
  const [error, setError] = useState('');
  const started = useRef(false);
  useEffect(() => {
    if (!enabled && !started.current) return;
    started.current = true;
    let active = true;
    const parsed = JSON.parse(serialized);
    // The draft is written immediately so navigating away retains answers.
    try {
      if (parsed.raw) localStorage.setItem(activityKey(module), JSON.stringify(parsed.raw));
    } catch { /* The IndexedDB report below still provides a second copy. */ }
    saveStudentReport(module, parsed).then(() => {
      if (active) setError('');
      scheduleSync();
    }).catch(err => { if (active) setError(err.message); });
    // Let saved answers sync even if the student immediately moves to another page.
    return () => { active = false; };
  }, [module, serialized, enabled]);
  return error;
}
