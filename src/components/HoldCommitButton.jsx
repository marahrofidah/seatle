import { useEffect, useRef, useState } from 'react';
import { Check, Fingerprint } from 'lucide-react';

export default function HoldCommitButton({ disabled, onConfirm }) {
  const timer = useRef(null);
  const [holding, setHolding] = useState(false);

  function cancel() {
    window.clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }

  useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  function start(event) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    cancel();
    setHolding(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm();
    }, 1200);
  }

  return (
    <div className="care-hold-action">
      <button
        type="button"
        disabled={disabled}
        className={`care-hold-button ${holding ? 'is-holding' : ''}`}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
        onBlur={cancel}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) cancel();
        }}
        onClick={(event) => { if (event.detail === 0 && !disabled) onConfirm(); }}
        onContextMenu={(event) => event.preventDefault()}
        aria-label="Teguhkan komitmen. Tahan 1,2 detik, atau gunakan Enter atau Spasi."
      >
        <span className="care-hold-fill" aria-hidden="true" />
        <Fingerprint className="h-6 w-6" aria-hidden="true" />
        <span>{holding ? 'Tahan sebentar…' : 'Tahan untuk teguhkan janji'}</span>
        <Check className="care-hold-check h-4 w-4" aria-hidden="true" />
      </button>
      <span className="care-hold-hint">Tahan 1,2 detik, atau gunakan tombol simpan.</span>
    </div>
  );
}
