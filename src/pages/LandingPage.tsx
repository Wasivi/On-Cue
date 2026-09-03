import { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';
import Constellation from '../components/Constellation';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: '#0f1f2e',
  border: '1px solid rgba(138,180,199,0.25)',
  borderRadius: 4,
  color: '#e8f0f5',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 13,
  outline: 'none'
};

const socialButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 0',
  background: 'transparent',
  border: '1px solid rgba(138,180,199,0.25)',
  borderRadius: 4,
  color: '#e8f0f5',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer'
};

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSignIn) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setShowSignIn(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSignIn(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSignIn]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d3a4d 0%, #0a2a3a 30%, #071820 70%, #051015 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Playfair Display', Georgia, serif",
      color: '#e8f0f5'
    }}>
      {/* One constellation, full-bleed, genuinely large and anchored hard
          left — no second/third stretched copy competing with it or
          flattening the read of it as an actual rotating sphere. */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Constellation onEnter={onEnter} originXFrac={0.16} originYFrac={0.52} radiusFrac={1.05} interactive />
      </div>

      {/* Subtle vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        // Centered further left/up, over the constellation's own territory
        // — the old center (50%,40%) crushed the top-left corner in
        // shadow, which is exactly where the constellation needs to read.
        background: 'radial-gradient(ellipse at 22% 45%, transparent 42%, rgba(5,16,21,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Top header — no bar, no seam: the page's own gradient shows straight
          through, nothing but the sign-in control sits on it */}
      <div style={{
        width: '100%',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        zIndex: 3
      }}>
        <div ref={signInRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSignIn(v => !v)}
            aria-haspopup="true"
            aria-expanded={showSignIn}
            title="Sign in"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34,
              background: showSignIn ? 'rgba(230,184,0,0.14)' : 'none',
              border: 'none', borderRadius: 17, cursor: 'pointer',
              color: '#e6b800',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,184,0,0.14)'; }}
            onMouseLeave={e => { if (!showSignIn) e.currentTarget.style.background = 'none'; }}
          >
            <User size={18} />
          </button>

          {showSignIn && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 232,
              background: '#0a1620',
              border: '1px solid rgba(230,184,0,0.25)',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              zIndex: 10
            }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 14, fontWeight: 700, fontStyle: 'italic',
                color: '#e8f0f5', marginBottom: 12
              }}>
                Sign in to On Cue
              </div>

              <form onSubmit={e => { e.preventDefault(); onEnter(); }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ ...inputStyle, padding: '8px 10px', fontSize: 12 }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, padding: '8px 10px', fontSize: 12, marginTop: 8 }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%', marginTop: 12, padding: '9px 0',
                    background: '#e6b800', border: 'none', borderRadius: 4,
                    color: '#0a0e17', fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                    textTransform: 'uppercase', cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(138,180,199,0.15)' }} />
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 10, color: '#4a6b7d' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(138,180,199,0.15)' }} />
              </div>

              <button onClick={onEnter} style={{ ...socialButtonStyle, padding: '8px 0', fontSize: 12 }}>Continue with Google</button>
              <button onClick={onEnter} style={{ ...socialButtonStyle, padding: '8px 0', fontSize: 12, marginTop: 6 }}>Continue with Apple</button>

              {/* Internal tool, not open signup — access is provisioned, not
                  self-served. One quiet line, no separate flow. */}
              <div style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid rgba(138,180,199,0.1)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 10.5,
                color: '#4a6b7d',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                No account? Ask your production office to add you.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area — right side, clear of the skeleton anchored left */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: 1200,
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {/* Title section — the wordmark: Big Caslon, upright, not Playfair */}
        <div style={{ textAlign: 'right', marginBottom: 8, transform: 'translateY(-35px)' }}>
          <div style={{
            fontFamily: "'Big Caslon', 'Big Caslon Medium', Didot, Georgia, serif",
            fontSize: 117,
            fontWeight: 500,
            fontStyle: 'normal',
            letterSpacing: '-0.01em',
            color: '#e1ded2', // pulled ~10% toward bluish-gray — cooler than the tan tea-stain, still warm
            lineHeight: 1.05,
            textShadow: '0 0 80px rgba(230,184,0,0.12)'
          }}>
            On Cue
          </div>
        </div>

        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 14,
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
          color: '#6b9ab0',
          textAlign: 'right'
        }}>
          21 departments · 87 crew · 12 cast · 4 locations
        </div>
      </div>

    </div>
  );
}
