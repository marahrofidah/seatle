import { Check, Fingerprint } from 'lucide-react';

export default function HoldCommitButton({ disabled, onConfirm }) {
  return <div className="care-hold-action">
    <button type="button" disabled={disabled} className="care-hold-button" onClick={onConfirm}>
      <Fingerprint className="h-6 w-6" aria-hidden="true" />
      <span>Teguhkan janji</span>
      <Check className="care-hold-check h-4 w-4" aria-hidden="true" />
    </button>
    <span className="care-hold-hint">Tekan sekali untuk menyimpan komitmenmu.</span>
  </div>;
}
