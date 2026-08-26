interface WordmarkProps {
  size?: number;
  light?: boolean;
  showMark?: boolean;
}

/**
 * The On Cue brand mark — kept separate from the operational interface's
 * andon-line palette on purpose. A navy badge with a gold diagonal cue
 * stripe, ivory "On," gold "Cue" — the one place in the product that carries
 * a distinct brand register (procedural-drama title card, badge gravitas)
 * rather than the flat signal system the rest of the UI runs on.
 */
export default function Wordmark({ size = 18, light = true, showMark = true }: WordmarkProps) {
  const badgeSize = size * 1.15;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.5 }}>
      {showMark && (
        <span
          aria-hidden="true"
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: 4,
            background: '#1B3A6B',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, transparent 45%, #D4A72C 45%, #D4A72C 62%, transparent 62%)'
            }}
          />
        </span>
      )}
      <span
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ color: light ? '#F5F0E1' : 'var(--text-primary)' }}>On </span>
        <span style={{ color: '#D4A72C' }}>Cue</span>
      </span>
    </div>
  );
}
