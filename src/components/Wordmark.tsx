interface WordmarkProps {
  size?: number;
  light?: boolean;
  showMark?: boolean;
}

/**
 * The On Cue wordmark: a single signal-red lamp (the andon light, the seal
 * stamp, the tally light) beside a tight, unadorned setting of the name.
 * The lamp is the only color in the mark — the same restraint the rest of
 * the interface holds to.
 */
export default function Wordmark({ size = 18, light = true, showMark = true }: WordmarkProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.45 }}>
      {showMark && (
        <span
          aria-hidden="true"
          style={{
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: '50%',
            background: 'var(--red)',
            flexShrink: 0
          }}
        />
      )}
      <span
        style={{
          fontSize: size,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: light ? '#ffffff' : 'var(--text-primary)',
          lineHeight: 1,
          whiteSpace: 'nowrap'
        }}
      >
        On Cue
      </span>
    </div>
  );
}
