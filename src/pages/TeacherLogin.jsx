import { useEffect, useState } from 'react';
import { ArrowLeft, LoaderCircle, LogOut, RefreshCw } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const teacherEmail = import.meta.env.VITE_TEACHER_EMAIL || 'guru@seatle.local';

export default function TeacherLogin({ onBack }) {
  const [teacherName, setTeacherName] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadStudents = async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('students')
      .select('id, nama, kelas, created_at')
      .order('created_at', { ascending: false });
    setLoading(false);

    if (fetchError) {
      setError(`Daftar murid belum bisa dimuat: ${fetchError.message}`);
      return;
    }
    setStudents(data || []);
  };

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLoggedIn(true);
        loadStudents();
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
    await loadStudents();
  };

  const handleExit = async () => {
    if (supabase) await supabase.auth.signOut();
    onBack();
  };

  if (loggedIn) {
    return (
      <main className="min-h-screen bg-sky-100 p-4 text-sky-950 sm:p-7">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-700 to-cyan-500 p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-sm font-bold text-cyan-100">Dashboard Guru</p>
              <h1 className="font-brand text-3xl font-black">Halo, {teacherName.trim() || 'Guru SEATLE'}!</h1>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={loadStudents} className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 font-bold transition hover:bg-white/30"><RefreshCw className="h-4 w-4" /> Muat Ulang</button>
              <button type="button" onClick={handleExit} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-sky-800 transition hover:bg-cyan-50"><LogOut className="h-4 w-4" /> Keluar</button>
            </div>
          </header>

          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-sky-100 px-5 py-4 sm:px-7">
              <h2 className="font-brand text-xl font-black">Daftar Murid</h2>
              <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-black text-sky-700">{students.length} murid</span>
            </div>
            {error && <p role="alert" className="m-5 rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700">{error}</p>}
            {loading ? (
              <div className="flex min-h-52 items-center justify-center"><LoaderCircle className="h-9 w-9 animate-spin text-sky-600" /></div>
            ) : students.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center px-5 text-center font-bold text-slate-500">Belum ada murid yang masuk.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-sky-50 text-sm uppercase text-sky-700"><tr><th className="px-6 py-4">Nama</th><th className="px-6 py-4">Kelas</th><th className="px-6 py-4">Waktu Masuk</th></tr></thead>
                  <tbody className="divide-y divide-sky-50">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-sky-50/70"><td className="px-6 py-4 font-extrabold">{student.nama}</td><td className="px-6 py-4 font-bold text-sky-700">{student.kelas}</td><td className="px-6 py-4 text-sm font-semibold text-slate-500">{new Date(student.created_at).toLocaleString('id-ID')}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-600 bg-cover bg-center px-4 py-8" style={{ backgroundImage: `url(${loginBackground})` }}>
      <div className="absolute inset-0 bg-sky-950/10" />
      <button type="button" onClick={onBack} className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/50 text-sky-950 shadow-lg backdrop-blur-md transition hover:-translate-x-1" aria-label="Kembali"><ArrowLeft className="h-6 w-6 stroke-[3]" /></button>
      <section className="relative z-10 w-full max-w-md rounded-[2rem] border-4 border-emerald-200 bg-emerald-50/90 p-6 text-center shadow-[0_22px_55px_rgba(7,89,133,.35)] backdrop-blur-md sm:p-8">
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
