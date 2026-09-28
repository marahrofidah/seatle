import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Play, Pause, Volume2, VolumeX } from 'lucide-react';
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

async function playMusic(element, graph, volume) {
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
}

export default function BackgroundMusic() {
  const audio = useRef(null);
  const container = useRef(null);
  const trigger = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const graph = useRef(null);
  const requested = useRef(false);
  const operation = useRef(0);
  const autoStart = useRef(true);
  const [volume, setVolume] = useState(savedVolume);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentVolume = useRef(volume);

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
    const element = audio.current;
    let active = true;
    let starting = false;
    const removeListeners = () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };
    async function startOnInteraction(event) {
      if (!active || !autoStart.current || starting) return;
      if (event && container.current?.contains(event.target)) return;
      if (event?.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
      starting = true;
      const id = ++operation.current;
      requested.current = true;
      try {
        // Use the media element on load; create Web Audio only after a gesture.
        if (event) await playMusic(element, graph, currentVolume.current);
        else {
          element.volume = currentVolume.current;
          await element.play();
        }
        if (active && operation.current === id) {
          autoStart.current = false;
          setPlaying(true);
          removeListeners();
        }
      } catch (err) {
        if (!active || operation.current !== id) return;
        requested.current = false;
        if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
          setError('Musik belum bisa dimuat. Coba nyalakan kembali.');
        }
      } finally { starting = false; }
    }
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('keydown', startOnInteraction);
    void startOnInteraction();
    return () => { active = false; removeListeners(); };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const dismiss = event => {
      if (!container.current?.contains(event.target)) setExpanded(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded]);

  function changeVolume(event) {
    const next = Number(event.target.value) / 100;
    setVolume(next);
    currentVolume.current = next;
    if (graph.current) graph.current.gain.gain.value = next;
    else if (audio.current) audio.current.volume = next;
    try { localStorage.setItem(volumeKey, String(next)); } catch { /* Controls still work without storage. */ }
  }

  async function toggleMusic() {
    autoStart.current = false;
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
      await playMusic(element, graph, volume);
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
  return <aside ref={container} className="music-control" aria-label="Kontrol musik latar" data-no-bubbles onKeyDown={event => { if (event.key === 'Escape') { setExpanded(false); trigger.current?.focus(); } }}>
    <audio ref={audio} src={musicUrl} loop preload="auto" playsInline
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={() => { requested.current = false; setPlaying(false); setLoading(false); setError('Musik belum bisa dimuat. Coba nyalakan kembali.'); }} />
    <button ref={trigger} type="button" className="music-trigger" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="music-popover" aria-label="Atur suara musik">
      {playing && volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
    {expanded && <div className="music-popover" id="music-popover">
      <div className="music-buttons">
        <button type="button" className="music-toggle" onClick={toggleMusic} aria-pressed={playing} aria-label={active ? 'Matikan musik' : 'Nyalakan musik'}>
          {loading ? <LoaderCircle size={18} className="music-spinner" /> : playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <input className="music-volume" type="range" min="0" max="100" step="1" value={Math.round(volume * 100)} onChange={changeVolume} aria-label="Volume musik" aria-valuetext={`${Math.round(volume * 100)} persen`} />
      </div>
      {error && <p className="music-error" role="alert">{error}</p>}
    </div>}
  </aside>;
}
