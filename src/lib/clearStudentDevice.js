import { studentIdentity } from './reportModel.js';

export function clearStudentDevice(name, studentClass, localStorage = globalThis.localStorage, sessionStorage = globalThis.sessionStorage) {
  const identity = studentIdentity(name, studentClass);
  for (const key of Object.keys(localStorage)) {
    const prefix = ['seatle_care_', 'seatle_website_reflection:', 'seatle_progress_', 'seatle_activity:', 'seatle_registered_student:'].find(value => key.startsWith(value));
    if (!prefix) continue;
    try {
      let raw = key.slice(prefix.length);
      if (prefix === 'seatle_activity:') raw = raw.slice(0, raw.lastIndexOf(':'));
      if (prefix === 'seatle_registered_student:') raw = raw.slice(raw.indexOf('['));
      const pair = JSON.parse(raw);
      if (studentIdentity(...pair) === identity) localStorage.removeItem(key);
    } catch { /* Keep unrelated storage entries. */ }
  }
  let saved;
  try { saved = JSON.parse(localStorage.getItem('seatle_student_login')); } catch { /* Invalid session. */ }
  const sessionMatches = studentIdentity(sessionStorage.getItem('seatle_student_name'), sessionStorage.getItem('seatle_student_class')) === identity;
  const savedMatches = saved && studentIdentity(saved.name, saved.studentClass) === identity;
  if (savedMatches) localStorage.removeItem('seatle_student_login');
  if (sessionMatches) {
    // A different tab may already have saved another student's persistent session.
    sessionStorage.removeItem('seatle_student_name');
    sessionStorage.removeItem('seatle_student_class');
  }
}
