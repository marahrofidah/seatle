import { useEffect, useState } from 'react';
import TeacherDashboard from './TeacherDashboard';
import Login from './Login';
import { supabase } from '../lib/supabase';

const teacherEmail = import.meta.env.VITE_TEACHER_EMAIL || 'guru@seatle.local';

export default function TeacherLogin({ onBack, onStudentSuccess }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setLoggedIn(data.session?.user?.email?.toLowerCase() === teacherEmail.toLowerCase());
    }).catch(() => {}).finally(() => {
      if (active) setCheckingSession(false);
    });
    return () => { active = false; };
  }, []);

  const handleExit = async () => {
    if (supabase) await supabase.auth.signOut();
    onBack();
  };

  if (checkingSession) return <main className="flex min-h-screen items-center justify-center bg-sky-50 text-sky-800" role="status">Memuat...</main>;
  if (loggedIn) return <TeacherDashboard teacherName={sessionStorage.getItem('seatle_teacher_name') || ''} onExit={handleExit} />;
  return <Login initialRole="guru" onBack={onBack} onTeacherSuccess={() => setLoggedIn(true)} onStudentSuccess={onStudentSuccess} />;
}
