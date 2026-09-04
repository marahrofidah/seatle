import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, KeyRound, LoaderCircle, UserRound, UsersRound } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.png';
import studentTurtle from '../assets/images/penyu_murid.png';
import teacherTurtle from '../assets/images/penyu_guru.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import BubbleEffects from '../components/BubbleEffects';

const teacherEmail = import.meta.env.VITE_TEACHER_EMAIL || 'guru@seatle.local';

export default function Login({ onBack, onTeacherSuccess }) {
  const [role, setRole] = useState('guru');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentDone, setStudentDone] = useState(false);

  const changeRole = (nextRole) => {
    if (nextRole === role) return;
    setRole(nextRole);
    setError('');
    setStudentDone(false);
    setName('');
    setPassword('');
    setStudentClass('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const cleanName = name.trim();

    if (!cleanName) {
      setError(role === 'guru' ? 'Nama guru wajib diisi.' : 'Nama murid wajib diisi.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase belum terhubung. Periksa konfigurasi pada file .env.');
      return;
    }

    setLoading(true);
    if (role === 'guru') {
      if (!password) {
        setLoading(false);
        setError('Password guru wajib diisi.');
        return;
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: teacherEmail, password });
      setLoading(false);
      if (loginError) {
        setError('Password guru salah atau akun guru belum dibuat.');
        return;
      }
      sessionStorage.setItem('seatle_teacher_name', cleanName);
      onTeacherSuccess?.();
      return;
    }

    const cleanClass = studentClass.trim();
    if (!cleanClass) {
      setLoading(false);
      setError('Kelas wajib diisi.');
      return;
    }
    const { error: insertError } = await supabase.from('students').insert({ nama: cleanName, kelas: cleanClass });
    setLoading(false);
    if (insertError) {
      setError(`Data belum berhasil disimpan: ${insertError.message}`);
      return;
    }
    setStudentDone(true);
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-600 bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <BubbleEffects />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 via-transparent to-sky-900/10" />

      <button type="button" onClick={onBack} className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/50 text-sky-950 shadow-lg backdrop-blur-md transition hover:-translate-x-1 hover:bg-white/70" aria-label="Kembali ke halaman utama">
        <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
      </button>

      <section className="relative z-10 mt-8 w-full max-w-md rounded-b-[2.2rem] rounded-t-[2.8rem] border-4 border-cyan-100/80 bg-gradient-to-b from-sky-500/95 via-sky-600/95 to-blue-800/95 p-5 pt-6 text-white shadow-[0_24px_0_rgba(7,89,133,.5),0_36px_60px_rgba(3,50,80,.38),inset_0_2px_0_rgba(255,255,255,.25)] backdrop-blur-md sm:p-8 sm:pt-7">
        <svg className="pointer-events-none absolute -top-[2.55rem] left-[-4px] h-16 w-[calc(100%+8px)] overflow-visible drop-shadow-[0_-3px_0_rgba(207,250,254,.85)]" viewBox="0 0 440 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M3 47 C48 4, 103 16, 145 34 C190 54, 220 56, 268 28 C311 4, 366 11, 437 40 L437 65 L3 65 Z" fill="#38a8e8" />
        </svg>
        <span className="pointer-events-none absolute left-5 top-8 h-3 w-3 rounded-full border-2 border-white/70" />
        <span className="pointer-events-none absolute right-7 top-28 h-5 w-5 rounded-full border-2 border-white/50" />

        <header className="relative flex min-h-28 items-center text-left">
          <div className="relative z-10 max-w-[62%]">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-black tracking-[0.16em] text-cyan-50 backdrop-blur-sm">LOGIN SEATLE</span>
            <h1 className="mt-2 font-brand text-3xl font-black leading-none text-white drop-shadow-md sm:text-4xl">Belajar Seru!</h1>
            <p className="mt-2 text-xs font-bold leading-relaxed text-cyan-50/90">Pilih peranmu dan mulai petualangan bawah laut.</p>
          </div>
          <img src={role === 'guru' ? teacherTurtle : studentTurtle} alt={role === 'guru' ? 'Penyu guru' : 'Penyu murid'} className="pointer-events-none absolute -right-4 -top-12 h-44 w-40 object-contain drop-shadow-[0_12px_10px_rgba(3,50,80,.35)] transition-all duration-500 sm:-right-8 sm:-top-16 sm:h-52 sm:w-48" />
        </header>

        <div className="relative mt-5 grid grid-cols-2 rounded-full border border-white/25 bg-blue-950/20 p-1 shadow-inner">
          <span className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_5px_14px_rgba(251,191,36,.35)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${role === 'guru' ? 'translate-x-0' : 'translate-x-full'}`} />
          <button type="button" onClick={() => changeRole('guru')} className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-black transition-colors duration-300 ${role === 'guru' ? 'text-amber-950' : 'text-white/80'}`}>
            <GraduationCap className="h-4 w-4" /> Guru
          </button>
          <button type="button" onClick={() => changeRole('murid')} className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-black transition-colors duration-300 ${role === 'murid' ? 'text-amber-950' : 'text-white/80'}`}>
            <UsersRound className="h-4 w-4" /> Murid
          </button>
        </div>

        <div className="relative mt-6 [perspective:900px]">
          <div key={role} className="animate-[login-panel-in_.45s_cubic-bezier(.22,1,.36,1)]">
            <style>{`
              @keyframes login-panel-in {
                from { opacity: 0; transform: rotateY(12deg) translateX(18px) scale(.97); }
                to { opacity: 1; transform: rotateY(0) translateX(0) scale(1); }
              }
            `}</style>

            {studentDone ? (
              <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-20 w-20 text-emerald-300 drop-shadow-lg" />
                <h2 className="mt-4 font-brand text-3xl font-black">Berhasil Masuk!</h2>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Data {name.trim()} sudah terhubung ke guru.</p>
                <button type="button" onClick={() => setStudentDone(false)} className="mt-7 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-8 py-3 font-black text-amber-950 shadow-lg transition hover:scale-105">Kembali</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white">
                    {role === 'guru' ? 'Nama Guru' : 'Nama Murid'}
                  </span>
                  <div className="group relative">
                    <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500 transition group-focus-within:text-sky-600" />
                    <input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" placeholder={role === 'guru' ? 'Masukkan nama guru' : 'Masukkan nama murid'} className="w-full rounded-2xl border-2 border-amber-200 bg-white/90 py-3.5 pl-12 pr-4 font-bold text-sky-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" />
                  </div>
                </label>

                {role === 'guru' ? (
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white">Password</span>
                    <div className="group relative">
                      <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500 transition group-focus-within:text-sky-600" />
                      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Masukkan password" className="w-full rounded-2xl border-2 border-amber-200 bg-white/90 py-3.5 pl-12 pr-4 font-bold text-sky-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" />
                    </div>
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white">Kelas</span>
                    <div className="group relative">
                      <BookOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500 transition group-focus-within:text-sky-600" />
                      <input value={studentClass} onChange={(event) => setStudentClass(event.target.value)} maxLength={30} placeholder="Contoh: 5A" className="w-full rounded-2xl border-2 border-amber-200 bg-white/90 py-3.5 pl-12 pr-4 font-bold text-sky-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" />
                    </div>
                  </label>
                )}

                {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-700">{error}</p>}

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 py-3.5 font-brand text-lg font-black text-amber-950 shadow-[0_8px_20px_rgba(251,191,36,.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
                  {loading ? <LoaderCircle className="h-6 w-6 animate-spin" /> : role === 'guru' ? 'MASUK SEBAGAI GURU' : 'MULAI BELAJAR'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
