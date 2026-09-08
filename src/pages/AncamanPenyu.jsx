import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flag, Search } from 'lucide-react';
import background from '../assets/images/tanpa_penyu.png';
import turtle from '../assets/images/ancaman_penyu.png';
import BubbleEffects from '../components/BubbleEffects';
import ThreatConnections from '../components/ThreatConnections';
import { completeAspect } from '../lib/studentProgress';
import { suspectedCauses, causes, actionQuestions, createEffectOrder } from '../lib/threatActivities';

const steps = ['Temukan penyebab', 'Hubungkan dampak', 'Tentukan tindakan'];
const wavyCard = 'relative isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:content-[\'\'] before:[clip-path:url(#threat-wavy-card)] before:backdrop-blur-xl [filter:drop-shadow(0_20px_30px_rgba(7,89,133,.25))]';
const primaryButton = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-amber-300 px-6 py-3 text-sm font-black text-amber-950 shadow-md transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500';

export default function AncamanPenyu({ onBack }) {
  const [step, setStep] = useState(0);
  const [suspicions, setSuspicions] = useState([]);
  const [identified, setIdentified] = useState(false);
  const [matches, setMatches] = useState({});
  const [effectOrder] = useState(createEffectOrder);
  const [checkedMatches, setCheckedMatches] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const allMatched = checkedMatches && causes.every((cause, index) => matches[index] === cause.effect);
  const question = actionQuestions[questionIndex];
  const answerChecked = checkedAnswers[questionIndex];
  const answerCorrect = answerChecked && answers[questionIndex] === 0;
  const allAnsweredCorrectly = actionQuestions.every((_, index) => checkedAnswers[index] && answers[index] === 0);

  function goToStep(next) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finishMission() {
    if (!allAnsweredCorrectly || !allMatched || !identified) return;
    completeAspect('ancaman-penyu');
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-sky-800 bg-cover bg-fixed bg-center pb-16 text-sky-950" style={{ backgroundImage: `url(${background})` }}>
      <BubbleEffects />
      <div className="pointer-events-none absolute inset-0 bg-sky-950/20" />
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id="threat-wavy-card" clipPathUnits="objectBoundingBox">
            <path d="M .03,.04 C .12,.005 .25,.03 .38,.01 C .51,-0.01 .64,.035 .77,.01 C .88,.005 .96,.025 .985,.07 C .995,.18 .975,.32 .99,.45 C 1.005,.58 .98,.72 .985,.85 C .975,.93 .93,.985 .84,.98 C .72,.995 .59,.965 .46,.99 C .33,.97 .21,.995 .09,.97 C .03,.96 .005,.915 .01,.82 C .02,.69 -.005,.55 .01,.42 C .025,.29 -.005,.16 .01,.08 C .015,.05 .025,.04 .03,.04 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="relative z-10 mx-auto w-full max-w-[96%] px-2 sm:max-w-7xl sm:px-4">
        <header className="relative z-20 flex items-center gap-3 py-4">
          <button type="button" onClick={onBack} aria-label="Kembali ke Dashboard" title="Kembali ke Dashboard" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/85 text-sky-900 shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white cursor-pointer">
            <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          <div className="rounded-full border border-white/70 bg-white/85 px-7 py-3 shadow-lg backdrop-blur-md">
            <span className="font-brand text-lg sm:text-xl font-black text-sky-950 tracking-wide">Ancaman Penyu</span>
          </div>
        </header>

        <section className={`${wavyCard} mb-6 flex items-center gap-2 px-8 py-10 before:bg-sky-50/90 sm:gap-8 sm:px-14 sm:py-12 md:px-16`}>
          <div className="min-w-0 flex-1">
            <h1 className="font-brand text-3xl font-black sm:text-5xl">Ancaman Penyu</h1>
            <p className="mt-3 max-w-lg text-sm font-bold leading-relaxed text-sky-800">Ada penyu yang terdampar. Telusuri penyebabnya, pahami dampaknya, lalu tentukan tindakanmu.</p>
          </div>
          <img src={turtle} alt="Penyu di antara ancaman sampah laut" className="w-24 shrink-0 object-contain drop-shadow-xl sm:w-48" />
        </section>

        {finished ? (
          <section className={`${wavyCard} px-8 py-12 text-center before:bg-amber-50 sm:px-14 sm:py-16 md:px-16`}>
            <Flag className="mx-auto mb-5 h-16 w-16 text-amber-600" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[.25em] text-amber-800">Penyelidikan selesai</p>
            <h2 className="mt-3 font-brand text-3xl font-black">Misi Ancaman Penyu tuntas!</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-bold leading-relaxed">Kamu sudah mengidentifikasi dugaan penyebab, memasangkan lima dampak, dan menentukan tindakan pada lima situasi. Misi ini menyumbang 25% progress belajarmu.</p>
            <button type="button" onClick={onBack} className={`${primaryButton} mt-8`}>Kembali ke peta <ArrowRight className="h-4 w-4" /></button>
          </section>
        ) : (
          <>
            <nav aria-label="Tahapan misi" className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
              {steps.map((label, index) => (
                <button key={label} type="button" disabled={(index === 1 && !identified) || (index === 2 && !allMatched)} onClick={() => goToStep(index)} aria-current={step === index ? 'step' : undefined} className={`flex flex-col items-start gap-2 rounded-2xl border p-3 text-left text-xs font-black transition sm:flex-row sm:items-center sm:p-4 sm:text-sm ${step === index ? 'border-amber-200 bg-amber-200 text-amber-950 shadow-lg' : 'border-white/40 bg-white/85 text-sky-800'} disabled:opacity-60 disabled:cursor-not-allowed`}>
                  <span className="font-brand text-xl">0{index + 1}</span>{label}
                </button>
              ))}
            </nav>

            <section className={`${wavyCard} px-8 py-16 before:bg-white/90 sm:px-16 sm:py-20 md:px-24 md:py-24`}>
              {step === 0 && (
                <>
                  <div className="mb-5 flex items-center gap-3"><Search className="h-6 w-6 shrink-0 text-sky-600" /><h2 className="font-brand text-2xl font-black">Apa yang mungkin terjadi?</h2></div>
                  <p className="text-sm font-bold leading-relaxed">Berdasarkan studi kasus yang telah kamu amati, menurutmu faktor apa saja yang mungkin menyebabkan penyu tersebut terdampar?</p>
                  <details className="my-5 border-y border-sky-200 py-3">
                    <summary className="cursor-pointer text-sm font-black text-sky-700">Tonton kembali video studi kasus</summary>
                    <video controls playsInline preload="none" aria-label="Video studi kasus penyu terdampar" src="https://tbrbbmcsxtiwtwnlwtbz.supabase.co/storage/v1/object/public/video-pembelajaran/video_misi.mp4" className="mt-4 aspect-video w-full rounded-xl bg-slate-950" />
                  </details>
                  <fieldset disabled={identified}>
                    <legend className="mb-4 text-sm font-black text-sky-700">Pilih beberapa dugaan penyebab.</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {suspectedCauses.map((cause, index) => (
                        <label key={cause} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-sm font-bold ${suspicions.includes(index) ? 'border-sky-500 bg-sky-50' : 'border-sky-100 bg-white'}`}>
                          <input type="checkbox" checked={suspicions.includes(index)} onChange={() => setSuspicions((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])} className="h-5 w-5 shrink-0 accent-sky-600" />{cause}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {identified && <p role="status" className="mt-5 border-l-4 border-sky-500 bg-sky-50 p-4 text-sm font-bold leading-relaxed">Dugaanmu sudah dicatat untuk kegiatan ini. Selanjutnya, kita akan menelusuri lima penyebab beserta dampaknya. Dugaan awal masih perlu diperiksa melalui bukti.</p>}
                  <div className="mt-6 flex justify-end"><button type="button" className={primaryButton} disabled={suspicions.length === 0} onClick={() => identified ? goToStep(1) : setIdentified(true)}>{identified ? 'Telusuri dampaknya' : 'Simpan dugaan'}<ArrowRight className="h-4 w-4" /></button></div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-brand text-2xl font-black">Setiap ancaman meninggalkan dampak</h2>
                  <p className="mt-3 text-sm font-bold leading-relaxed text-sky-700">Pasangkan setiap penyebab dengan dampak yang sesuai. Gunakan setiap dampak satu kali, lalu periksa hasil penyelidikanmu.</p>
                  <ThreatConnections effectOrder={effectOrder} matches={matches} checked={checkedMatches} locked={allMatched} onChange={(next) => { setMatches(next); setCheckedMatches(false); }} />
                  <div aria-live="polite" className="mt-5 text-sm font-black text-sky-800">{checkedMatches && `${causes.filter((cause, index) => matches[index] === cause.effect).length} dari 5 pasangan benar.`}</div>
                  <div className="mt-5 flex justify-end"><button type="button" className={primaryButton} disabled={!causes.every((_, index) => matches[index] !== undefined)} onClick={() => allMatched ? goToStep(2) : setCheckedMatches(true)}>{allMatched ? 'Tentukan tindakan' : 'Periksa pasangan'}<ArrowRight className="h-4 w-4" /></button></div>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-xs font-black uppercase tracking-widest text-sky-600">Situasi {questionIndex + 1} dari 5</p>
                  <h2 className="mt-2 font-brand text-2xl font-black">{question.title}</h2>
                  <p className="mt-4 text-sm font-bold leading-relaxed sm:text-base">{question.question}</p>
                  <fieldset className="mt-6 space-y-3" disabled={Boolean(answerCorrect)}>
                    <legend className="sr-only">Pilih tindakan yang paling tepat</legend>
                    {question.options.map((option, index) => (
                      <label key={`${questionIndex}-${index}`} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-sm font-bold leading-relaxed ${answers[questionIndex] === index ? 'border-sky-500 bg-sky-50' : 'border-sky-100'}`}>
                        <input type="radio" name={`action-${questionIndex}`} checked={answers[questionIndex] === index} onChange={() => { setAnswers({ ...answers, [questionIndex]: index }); setCheckedAnswers({ ...checkedAnswers, [questionIndex]: false }); }} className="mt-1 h-4 w-4 shrink-0 accent-sky-600" />
                        <span><span className="mr-2 font-black text-sky-600">{String.fromCharCode(65 + index)}.</span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div aria-live="polite">{answerChecked && <p className={`mt-5 border-l-4 p-4 text-sm font-bold leading-relaxed ${answerCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-rose-400 bg-rose-50 text-rose-800'}`}>{answerCorrect ? `Benar! ${question.explanation}` : 'Belum tepat. Pertimbangkan tindakan yang melindungi penyu dan habitatnya, lalu coba lagi.'}</p>}</div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" disabled={questionIndex === 0} onClick={() => setQuestionIndex(questionIndex - 1)} className="px-2 py-3 text-sm font-black text-sky-700 disabled:opacity-40">Sebelumnya</button>
                    {!answerCorrect ? <button type="button" className={primaryButton} disabled={answers[questionIndex] === undefined} onClick={() => setCheckedAnswers({ ...checkedAnswers, [questionIndex]: true })}>Periksa jawaban</button>
                      : questionIndex < actionQuestions.length - 1 ? <button type="button" className={primaryButton} onClick={() => { setQuestionIndex(questionIndex + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Situasi berikutnya <ArrowRight className="h-4 w-4" /></button>
                        : <button type="button" className={primaryButton} disabled={!allAnsweredCorrectly} onClick={finishMission}>Tuntaskan misi <Check className="h-5 w-5" /></button>}
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
