const loginKey = 'seatle_student_login';

export function saveStudentSession(name, studentClass, storage = localStorage, session = sessionStorage) {
  const student = { name: name.trim(), studentClass: studentClass.trim() };
  storage.setItem(loginKey, JSON.stringify(student));
  session.setItem('seatle_student_name', student.name);
  session.setItem('seatle_student_class', student.studentClass);
  return student;
}

export function restoreStudentSession(storage = localStorage, session = sessionStorage) {
  try {
    const raw = storage.getItem(loginKey);
    const student = raw ? JSON.parse(raw) : {
      name: session.getItem('seatle_student_name'),
      studentClass: session.getItem('seatle_student_class'),
    };
    if (typeof student?.name !== 'string' || !student.name.trim()
      || typeof student.studentClass !== 'string' || !student.studentClass.trim()) return null;
    return saveStudentSession(student.name, student.studentClass, storage, session);
  } catch {
    return null;
  }
}

export function clearStudentSession(storage = localStorage, session = sessionStorage) {
  storage.removeItem(loginKey);
  session.removeItem('seatle_student_name');
  session.removeItem('seatle_student_class');
}
