import { useState } from 'react';
import { ArrowLeft, CheckCircle2, LoaderCircle } from 'lucide-react';
import loginBackground from '../assets/images/tanpa_penyu.png';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function StudentLogin({ onBack }) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanClass = studentClass.trim();

    if (cleanName.length < 2 || !cleanClass) {
      setError('Isi nama dan kelas dengan benar, ya.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase belum terhubung. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase
      .from('students')
      .insert({ nama: cleanName, kelas: cleanClass });
    setLoading(false);

    if (insertError) {
      setError(`Data belum berhasil disimpan: ${insertError.message}`);
      return;
    }

    setSubmitted(true);
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-600 bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="absolute inset-0 bg-sky-950/10" />
      <button type="button" onClick={onBack} className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-white/50 text-sky-950 shadow-lg backdrop-blur-md transition hover:-translate-x-1 hover:bg-white/70" aria-label="Kembali">
        <ArrowLeft className="h-6 w-6 stroke-[3]" />
      </button>

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border-4 border-amber-200 bg-amber-50/90 p-6 text-center shadow-[0_22px_55px_rgba(7,89,133,.35)] backdrop-blur-md sm:p-8">
        {submitted ? (
          <div className="flex min-h-[20rem] flex-col items-center justify-center">
            <CheckCircle2 className="mb-5 h-20 w-20 text-emerald-500" />
            <h1 className="font-brand text-3xl font-black text-sky-950">Berhasil Masuk!</h1>
            <p className="mt-3 font-bold text-sky-800">
              Halo, {name.trim()} dari kelas {studentClass.trim()}.
            </p>
            <p className="mt-1 text-sm font-semibold text-sky-700">Data kamu sudah terhubung ke guru.</p>
            <button type="button" onClick={onBack} className="mt-7 rounded-full bg-gradient-to-b from-yellow-300 to-amber-400 px-8 py-3 font-black text-amber-950 shadow-lg transition hover:scale-105">
              Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 text-3xl shadow-lg" aria-hidden="true">★</div>
            <h1 className="font-brand text-3xl font-black text-sky-950 sm:text-4xl">Masuk Sebagai Murid</h1>
            <p className="mt-2 text-sm font-bold text-sky-700">Isi nama dan kelasmu untuk mulai belajar.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5 text-left">
              <label className="block">
                <span className="mb-2 block pl-1 text-sm font-black text-sky-950">Nama Murid</span>
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} autoComplete="name" placeholder="Contoh: Naya" className="w-full rounded-2xl border-2 border-amber-200 bg-white/90 px-5 py-3.5 font-bold text-sky-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" />
              </label>
              <label className="block">
                <span className="mb-2 block pl-1 text-sm font-black text-sky-950">Kelas</span>
                <input value={studentClass} onChange={(event) => setStudentClass(event.target.value)} maxLength={30} placeholder="Contoh: 5A" className="w-full rounded-2xl border-2 border-amber-200 bg-white/90 px-5 py-3.5 font-bold text-sky-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/60" />
              </label>

              {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-700">{error}</p>}

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-full bg-gradient-to-b from-yellow-300 to-amber-400 py-3.5 font-brand text-xl font-black text-amber-950 shadow-lg transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70">
                {loading ? <LoaderCircle className="h-6 w-6 animate-spin" /> : 'MULAI BELAJAR'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
