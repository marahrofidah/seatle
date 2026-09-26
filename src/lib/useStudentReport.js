import { useEffect, useRef, useState } from 'react';
import { currentStudent, saveStudentReport, syncStudentReports } from './studentReports';

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
    }).catch(err => { if (active) setError(err.message); });
    const timer = setTimeout(() => {
      syncStudentReports().catch(() => { /* Pending records retry on the next connection. */ });
    }, 1500);
    return () => { active = false; clearTimeout(timer); };
  }, [module, serialized, enabled]);
  return error;
}
