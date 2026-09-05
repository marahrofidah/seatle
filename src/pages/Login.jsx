import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Eye, EyeOff, GraduationCap, KeyRound, LoaderCircle, UserRound, UsersRound } from 'lucide-react';
import loginBackground from '../assets/images/login_bg.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import BubbleEffects from '../components/BubbleEffects';

const teacherEmail = import.meta.env.VITE_TEACHER_EMAIL || 'guru@seatle.local';

export default function Login({ onBack, onTeacherSuccess, onStudentSuccess }) {
  const [role, setRole] = useState('guru');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentDone, setStudentDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    sessionStorage.setItem('seatle_student_name', cleanName);
    sessionStorage.setItem('seatle_student_class', cleanClass);
    setStudentDone(true);
    window.setTimeout(() => onStudentSuccess?.(), 650);
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-600 bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <BubbleEffects />
      <div className="absolute inset-0 bg-sky-900/10" />

      <button type="button" onClick={onBack} className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-sky-100 bg-white text-sky-950 shadow-lg transition hover:-translate-x-1 hover:bg-sky-50" aria-label="Kembali ke halaman utama">
        <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
      </button>

      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="login-organic-card" clipPathUnits="objectBoundingBox">
            <path d="M .075,.035 C .16,.005 .245,.075 .34,.045 C .43,.015 .515,.005 .605,.04 C .7,.075 .79,.005 .895,.03 C .96,.045 .99,.085 .985,.15 C .975,.225 1,.29 .985,.37 C .97,.45 1,.525 .985,.605 C .97,.69 1,.77 .975,.855 C .955,.925 .91,.97 .84,.975 C .755,.985 .68,.95 .59,.975 C .5,1 .42,.955 .33,.975 C .24,.995 .17,.955 .09,.97 C .035,.95 .015,.905 .02,.845 C .03,.77 .005,.7 .02,.62 C .035,.535 .005,.46 .02,.38 C .035,.295 .005,.225 .02,.145 C .025,.09 .045,.055 .075,.035 Z" />
          </clipPath>
        </defs>
      </svg>

      <section
        className="relative z-10 w-full max-w-lg bg-white/55 px-7 py-11 text-sky-950 [clip-path:url(#login-organic-card)] [filter:drop-shadow(0_28px_32px_rgba(7,89,133,.3))] [backdrop-filter:blur(22px)_saturate(115%)] sm:px-14 sm:py-14 md:translate-x-10 lg:translate-x-16"
      >
        <span className="pointer-events-none absolute left-5 top-8 h-3 w-3 rounded-full border-2 border-sky-300/50" />
        <span className="pointer-events-none absolute right-7 top-28 h-5 w-5 rounded-full border-2 border-sky-300/40" />

        <header className="relative px-3 pt-5 text-center sm:pt-6">
          <h1 className="font-brand text-3xl font-black leading-tight text-sky-950 drop-shadow-sm sm:text-4xl">Welcome to Seatle</h1>
          <p className="mt-2 text-sm font-bold text-sky-900">Masuk untuk mulai Belajar</p>
        </header>

        <div className="relative mt-7 grid grid-cols-2 rounded-full bg-sky-100 p-1.5 shadow-[inset_0_2px_6px_rgba(14,116,144,.1)] sm:mt-8">
          <span className={`pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-sky-800 shadow-[0_5px_12px_rgba(7,89,133,.28)] transition-transform duration-300 ease-out ${role === 'guru' ? 'translate-x-0' : 'translate-x-full'}`} />
          <button type="button" onClick={() => changeRole('guru')} className={`relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-full px-3 py-3 text-center text-sm font-black transition-colors duration-200 ${role === 'guru' ? 'text-white' : 'text-sky-700'}`}>
            <GraduationCap className="h-4 w-4" /> Guru
          </button>
          <button type="button" onClick={() => changeRole('murid')} className={`relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-full px-3 py-3 text-center text-sm font-black transition-colors duration-200 ${role === 'murid' ? 'text-white' : 'text-sky-700'}`}>
            <UsersRound className="h-4 w-4" /> Murid
          </button>
        </div>

        <div className="relative mt-8 sm:mt-9">
          <div>
            {studentDone ? (
              <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-20 w-20 text-emerald-300 drop-shadow-lg" />
                <h2 className="mt-4 font-brand text-3xl font-black">Berhasil Masuk!</h2>
                <p className="mt-2 text-sm font-semibold text-sky-700">Data {name.trim()} sudah terhubung ke guru.</p>
                <button type="button" onClick={() => setStudentDone(false)} className="mt-7 rounded-full bg-amber-400 px-8 py-3 font-black text-amber-950 shadow-lg transition hover:scale-105">Kembali</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block">
                  <span className="mb-3 block text-xs font-black uppercase tracking-wide text-sky-950">
                    {role === 'guru' ? 'Nama Guru' : 'Nama Murid'}
                  </span>
                  <div className="group relative">
                    <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-800 transition group-focus-within:text-sky-900" />
                    <input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" placeholder={role === 'guru' ? 'Masukkan nama guru' : 'Masukkan nama murid'} className="w-full rounded-full border border-sky-200 bg-white py-3 pl-12 pr-4 text-sm font-bold text-sky-950 shadow-[0_5px_14px_rgba(3,105,161,.1)] outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200/50" />
                  </div>
                </label>

                {role === 'guru' ? (
                  <label className="block">
                    <span className="mb-3 block text-xs font-black uppercase tracking-wide text-sky-950">Password</span>
                    <div className="group relative">
                      <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-800 transition group-focus-within:text-sky-900" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Masukkan password" className="w-full rounded-full border border-sky-200 bg-white py-3 pl-12 pr-12 text-sm font-bold text-sky-950 shadow-[0_5px_14px_rgba(3,105,161,.1)] outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200/50" />
                      <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-800 transition hover:text-sky-950" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-3 block text-xs font-black uppercase tracking-wide text-sky-950">Kelas</span>
                    <div className="group relative">
                      <BookOpen className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-800 transition group-focus-within:text-sky-900" />
                      <input value={studentClass} onChange={(event) => setStudentClass(event.target.value)} maxLength={30} placeholder="Contoh: 5A" className="w-full rounded-full border border-sky-200 bg-white py-3 pl-12 pr-4 text-sm font-bold text-sky-950 shadow-[0_5px_14px_rgba(3,105,161,.1)] outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-200/50" />
                    </div>
                  </label>
                )}

                {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-700">{error}</p>}

                <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-4 text-base font-black text-amber-950 shadow-[0_8px_18px_rgba(217,119,6,.22)] transition-colors hover:bg-amber-500 disabled:cursor-wait disabled:opacity-70">
                  {loading ? <LoaderCircle className="h-6 w-6 animate-spin" /> : role === 'guru' ? 'Masuk Sebagai Guru' : 'Mulai Belajar'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
