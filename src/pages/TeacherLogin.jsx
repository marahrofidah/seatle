import TeacherDashboard from './TeacherDashboard';
import TeacherWave from '../components/TeacherWave';
import './TeacherDashboard.css';
import { useEffect, useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.webp';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import BubbleEffects from '../components/BubbleEffects';

const teacherEmail = import.meta.env.VITE_TEACHER_EMAIL || 'guru@seatle.local';

export default function TeacherLogin({ onBack }) {
  const [teacherName, setTeacherName] = useState(() => sessionStorage.getItem('seatle_teacher_name') || '');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email?.toLowerCase() === teacherEmail.toLowerCase()) {
        setLoggedIn(true);
      }
    });
    return undefined;
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    if (!teacherName.trim() || !password) {
      setError('Nama guru dan password wajib diisi.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase belum terhubung. Periksa konfigurasi pada file .env.');
      return;
    }

    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: teacherEmail,
      password,
    });
    setLoading(false);

    if (loginError) {
      setError('Password guru salah atau akun guru belum dibuat.');
      return;
    }
    setLoggedIn(true);
    sessionStorage.setItem('seatle_teacher_name', teacherName.trim());
  };

  const handleExit = async () => {
    if (supabase) await supabase.auth.signOut();
    onBack();
  };

  if (loggedIn) return <TeacherDashboard teacherName={teacherName.trim()} onExit={handleExit} />;

  return (
    <main className="page-background relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-600 bg-cover bg-center px-4 py-8" style={{ '--page-background': `url(${loginBackground})` }}>
      <BubbleEffects /><TeacherWave />
      <button type="button" onClick={onBack} className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/50 text-sky-950 shadow-lg backdrop-blur-md transition hover:-translate-x-1" aria-label="Kembali"><ArrowLeft className="h-6 w-6 stroke-[3]" /></button>
      <section className="teacher-panel teacher-login-card relative z-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 to-emerald-500 text-3xl shadow-lg" aria-hidden="true">✦</div>
        <h1 className="font-brand text-3xl font-black text-sky-950 sm:text-4xl">Masuk Sebagai Guru</h1>
        <p className="mt-2 text-sm font-bold text-sky-700">Gunakan password guru SEATLE.</p>
        <form onSubmit={handleLogin} className="mt-7 space-y-5 text-left">
          <label className="block"><span className="mb-2 block pl-1 text-sm font-black text-sky-950">Nama Guru</span><input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} maxLength={100} autoComplete="name" placeholder="Contoh: Bu Rina" className="w-full rounded-2xl border-2 border-emerald-200 bg-white/90 px-5 py-3.5 font-bold text-sky-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" /></label>
          <label className="block"><span className="mb-2 block pl-1 text-sm font-black text-sky-950">Password Guru</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Masukkan password" className="w-full rounded-2xl border-2 border-emerald-200 bg-white/90 px-5 py-3.5 font-bold text-sky-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 py-3.5 font-brand text-xl font-black text-emerald-950 shadow-lg transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70">{loading ? <LoaderCircle className="h-6 w-6 animate-spin" /> : 'MASUK'}</button>
        </form>
      </section>
    </main>
  );
}
