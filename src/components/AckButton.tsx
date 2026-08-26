import { useState } from 'react';
import { Check } from 'lucide-react';

interface AckButtonProps {
  label: string;
  ackLabel?: string;
  icon: React.ReactNode;
  variant?: 'secondary' | 'danger' | 'primary';
  onAck?: () => void;
  /** If set, the confirmed state reverts after this many ms. Otherwise it stays confirmed until the page/state resets. */
  resetAfterMs?: number;
}

/**
 * A button for actions that log a real event but have no dedicated app state of their own
 * (Escalate, Continuity Issue, Send 5-Min Check-in, etc.). Gives immediate, honest visual
 * confirmation instead of behaving identically whether or not the click registered.
 */
export default function AckButton({ label, ackLabel, icon, variant = 'secondary', onAck, resetAfterMs }: AckButtonProps) {
  const [sent, setSent] = useState(false);

  const handleClick = () => {
    if (sent) return;
    onAck?.();
    setSent(true);
    if (resetAfterMs) {
      setTimeout(() => setSent(false), resetAfterMs);
    }
  };

  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-secondary';

  return (
    <button
      onClick={handleClick}
      disabled={sent && !resetAfterMs}
      className={`btn ${sent ? 'btn-secondary' : variantClass}`}
      style={sent ? { opacity: 0.7, cursor: 'default' } : undefined}
      aria-live="polite"
    >
      {sent ? <Check size={16} /> : icon}
      {sent ? (ackLabel ?? 'Sent') : label}
    </button>
  );
}
