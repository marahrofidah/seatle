import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Award, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveUserData } from '../lib/supabase';

export default function Refleksi() {
  const [reflectionAnswers, setReflectionAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { id: 1, text: '1. Website ini membantu saya memahami materi tentang penyu laut.' },
    { id: 2, text: '2. Gambar, video, dan aktivitas pada website membuat saya lebih tertarik belajar.' },
    { id: 3, text: '3. Setelah menggunakan website ini, saya menjadi lebih peduli terhadap kelestarian penyu laut.' },
    { id: 4, text: '4. Aktivitas yang ada pada website mudah dipahami dan menyenangkan untuk dikerjakan.' },
    { id: 5, text: '5. Saya ingin menerapkan tindakan sederhana untuk membantu menjaga lingkungan setelah mengikuti pembelajaran ini.' }
  ];

  const ratingOptions = [
    { label: 'Sangat Setuju', emoji: '😊', color: 'bg-emerald-950 border-emerald-500/50 text-emerald-200' },
    { label: 'Setuju', emoji: '🙂', color: 'bg-teal-950 border-teal-500/50 text-teal-200' },
    { label: 'Kurang Setuju', emoji: '😐', color: 'bg-amber-950 border-amber-500/50 text-amber-200' },
    { label: 'Tidak Setuju', emoji: '☹', color: 'bg-rose-950 border-rose-500/50 text-rose-200' }
  ];

  const handleSubmit = async () => {
    await saveUserData('reflections', { answers: reflectionAnswers, type: 'website_evaluation' });
    confetti({ particleCount: 80, spread: 60 });
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 py-4 max-w-4xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Modul 6: Refleksi Pembelajaran
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Refleksi Pengalaman Belajar</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Yuk berikan pendapat jujurmu setelah mempelajari materi dan mencoba aktivitas pada website SEATLE!
        </p>
      </div>

      {/* FORM SURVEI REFLEKSI */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl space-y-8">
        
        {!submitted ? (
          <>
            <div className="space-y-6">
              {questions.map(q => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100">{q.text}</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ratingOptions.map((opt, idx) => {
                      const isSelected = reflectionAnswers[q.id] === opt.label;
                      return (
                        <button
                          key={idx}
                          onClick={() => setReflectionAnswers(prev => ({ ...prev, [q.id]: opt.label }))}
                          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                            isSelected
                              ? `${opt.color} font-bold scale-[1.03] shadow-md`
                              : 'bg-slate-950 border-white/5 text-slate-400 hover:border-purple-500/30'
                          }`}
                        >
                          <span className="text-base">{opt.emoji}</span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={Object.keys(reflectionAnswers).length < 5}
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-40 shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              Kirim Pendapat Refleksi Saya
            </button>
          </>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-950 border border-purple-500/40 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-3xl">
              🌟
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Terima Kasih Atas Pendapatmu!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Umpan balikmu sangat berharga dalam mendukung pengembangan media pembelajaran konservasi penyu yang lebih interaktif dan berdampak.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 text-left space-y-1">
              <span className="font-bold block">✨ Catatan Sahabat Penyu:</span>
              <p>Terus jaga kelestarian lautan kita dengan aksi-aksi sederhana setiap hari!</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
