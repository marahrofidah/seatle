import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Music2, Pause, Play, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';
import musicUrl from '../assets/music/musik_bg.mp3';
import './BackgroundMusic.css';

const volumeKey = 'seatle_music_volume';
function savedVolume() {
  try {
    const raw = localStorage.getItem(volumeKey);
    const value = raw === null ? 0.3 : Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.3;
  } catch { return 0.3; }
}

export default function BackgroundMusic() {
  const audio = useRef(null);
  const graph = useRef(null);
  const container = useRef(null);
  const settingsButton = useRef(null);
  const requested = useRef(false);
  const operation = useRef(0);
  const [volume, setVolume] = useState(savedVolume);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const element = audio.current;
    const currentOperation = operation;
    return () => {
      currentOperation.current++;
      requested.current = false;
      element?.pause();
      if (graph.current) {
        void graph.current.context.close().catch(() => {});
        graph.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const closeOutside = event => {
      if (!container.current?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [expanded]);

  function changeVolume(event) {
    const next = Number(event.target.value) / 100;
    setVolume(next);
    if (graph.current) graph.current.gain.gain.value = next;
    else if (audio.current) audio.current.volume = next;
    try { localStorage.setItem(volumeKey, String(next)); } catch { /* Controls still work without storage. */ }
  }

  async function toggleMusic() {
    const element = audio.current;
    const id = ++operation.current;
    if (requested.current && (loading || !element.paused)) {
      requested.current = false;
      element.pause();
      setPlaying(false);
      setLoading(false);
      return;
    }
    requested.current = true;
    setLoading(true);
    setError('');
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!graph.current && AudioContext) {
        const context = new AudioContext();
        const source = context.createMediaElementSource(element);
        const gain = context.createGain();
        source.connect(gain).connect(context.destination);
        graph.current = { context, gain };
      }
      if (graph.current) {
        element.volume = 1;
        graph.current.gain.gain.value = volume;
      } else element.volume = volume;
      // Start both operations during the click gesture for mobile browsers.
      await Promise.all([graph.current?.context.resume(), element.play()]);
      if (operation.current !== id) return;
      setPlaying(true);
    } catch {
      if (operation.current !== id) return;
      requested.current = false;
      element.pause();
      setPlaying(false);
      setError('Musik belum bisa diputar. Tekan nyalakan untuk mencoba lagi.');
    } finally {
      if (operation.current === id) setLoading(false);
    }
  }

  const active = playing || loading;
  return <aside className="music-control" ref={container} aria-label="Kontrol musik latar" data-no-bubbles
    onKeyDown={event => {
      if (event.key === 'Escape' && expanded) { setExpanded(false); settingsButton.current?.focus(); }
    }}>
    <audio ref={audio} src={musicUrl} loop preload="none" playsInline
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={() => { requested.current = false; setPlaying(false); setLoading(false); setError('Musik belum bisa dimuat. Coba nyalakan kembali.'); }} />
    {expanded && <section className="music-settings" id="music-settings" aria-label="Pengaturan volume">
      <div className="music-settings-heading"><Music2 size={18} /><strong>Musik laut</strong></div>
      <label htmlFor="music-volume">Volume <output htmlFor="music-volume">{Math.round(volume * 100)}%</output></label>
      <div className="music-volume-row">{volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}<input id="music-volume" type="range" min="0" max="100" step="1" value={Math.round(volume * 100)} onChange={changeVolume} aria-valuetext={`${Math.round(volume * 100)} persen`} /></div>
      <p>{volume === 0 ? 'Volume nol ? geser untuk mendengar musik.' : active ? 'Musik menemani petualanganmu.' : 'Tekan nyalakan untuk mulai mendengarkan.'}</p>
    </section>}
    {error && <p className="music-error" role="alert">{error}</p>}
    <div className="music-buttons">
      <button type="button" className="music-toggle" onClick={toggleMusic} aria-pressed={playing} aria-label={active ? 'Matikan musik latar' : 'Nyalakan musik latar'}>
        {loading ? <LoaderCircle size={18} className="music-spinner" /> : playing ? <Pause size={18} /> : <Play size={18} />}
        <span>{loading ? 'Memuat...' : playing ? 'Musik nyala' : 'Musik mati'}</span>
      </button>
      <button type="button" className="music-settings-toggle" ref={settingsButton} onClick={() => setExpanded(value => !value)} aria-label="Atur volume musik" aria-expanded={expanded} aria-controls="music-settings"><SlidersHorizontal size={18} /></button>
    </div>
  </aside>;
}
