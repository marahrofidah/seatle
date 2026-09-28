import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Volume2, VolumeX } from 'lucide-react';
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
  const requested = useRef(false);
  const operation = useRef(0);
  const [volume, setVolume] = useState(savedVolume);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
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
  return <aside className="music-control" aria-label="Kontrol musik latar" data-no-bubbles>
    <audio ref={audio} src={musicUrl} loop preload="none" playsInline
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={() => { requested.current = false; setPlaying(false); setLoading(false); setError('Musik belum bisa dimuat. Coba nyalakan kembali.'); }} />
    {error && <p className="music-error" role="alert">{error}</p>}
    <div className="music-buttons">
      <button type="button" className="music-toggle" onClick={toggleMusic} aria-pressed={playing} aria-label={active ? 'Matikan musik latar' : 'Nyalakan musik latar'} title={active ? 'Matikan musik' : 'Nyalakan musik'}>
        {loading ? <LoaderCircle size={18} className="music-spinner" /> : playing && volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      <input className="music-volume" type="range" min="0" max="100" step="1" value={Math.round(volume * 100)} onChange={changeVolume} aria-label="Volume musik" aria-valuetext={`${Math.round(volume * 100)} persen`} />
    </div>
  </aside>;
}
