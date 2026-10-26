import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Supernova = ({ state, origin }) => {
  const canvasRef = useRef(null);

  // High-Fidelity Astrophysical Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const ox = origin.x;
    const oy = origin.y;
    const startTime = performance.now();

    // ----------------------------------------------------
    // 1. Core Collapse Phase: Infalling Accretion Streamers
    // ----------------------------------------------------
    const streamerCount = 42;
    const streamers = [];
    if (state === 'supernova_charge') {
      for (let i = 0; i < streamerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 160 + 60;
        streamers.push({
          angle,
          dist,
          speed: Math.random() * 0.9 + 0.6,
          angularSpeed: (Math.random() - 0.5) * 0.04,
          size: Math.random() > 0.7 ? 2 : 1,
          alpha: Math.random() * 0.5 + 0.3,
        });
      }
    }

    // ----------------------------------------------------
    // 2. Detonation Phase: Astrophysical Clustered Ejecta
    // ----------------------------------------------------
    const ejectaCount = 220;
    const ejecta = [];
    // Asymmetric bipolar expansion axis (observed in SN 1987A & Cas A)
    const bipolarAngle = Math.PI * 0.28;

    if (state === 'supernova_explode') {
      for (let i = 0; i < ejectaCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rand = Math.random();

        // 3-Tier star distribution matching site's Stars.jsx aesthetic
        let size = 1;
        let baseSpeed = Math.random() * 20 + 6;
        let alpha = Math.random() * 0.4 + 0.6;

        if (rand > 0.88) {
          size = 3; // Dense foreground debris knots
          baseSpeed = Math.random() * 26 + 14;
          alpha = 1.0;
        } else if (rand > 0.6) {
          size = 2; // Mid-velocity ejecta
          baseSpeed = Math.random() * 20 + 10;
          alpha = Math.random() * 0.3 + 0.7;
        }

        // Bipolar kinetic energy boost along axis
        const axisAlignment = Math.abs(Math.cos(angle - bipolarAngle));
        const velocity = baseSpeed * (0.8 + 0.45 * axisAlignment);

        // Monochrome silver & diamond-white palette
        const color = rand > 0.65 ? '#ffffff' : rand > 0.25 ? '#f8fafc' : '#e2e8f0';

        ejecta.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size,
          alpha,
          decay: Math.random() * 0.02 + 0.012,
          color,
        });
      }
    }

    // Seed for deterministic Rayleigh-Taylor turbulence perturbations
    const perturbationSeed = 42.7;

    const render = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const elapsed = (now - startTime) / 1000;

      // ====================================================
      // PHASE 1: GRAVITATIONAL COLLAPSE (Charge)
      // ====================================================
      if (state === 'supernova_charge') {
        const progress = Math.min(1, elapsed / 1.85);

        // A. Infalling accretion streamers spiraling into the singularity
        for (let i = 0; i < streamers.length; i++) {
          const s = streamers[i];
          s.dist -= (s.speed + progress * 2.2);
          s.angle += s.angularSpeed;
          s.alpha = Math.min(1, s.alpha + 0.01);

          if (s.dist > 4) {
            const sx = ox + Math.cos(s.angle) * s.dist;
            const sy = oy + Math.sin(s.angle) * s.dist;

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = s.alpha * (1 - progress * 0.2);
            ctx.fillRect(Math.floor(sx), Math.floor(sy), s.size, s.size);

            // Motion trail toward singularity
            ctx.globalAlpha = s.alpha * 0.35;
            const tx = ox + Math.cos(s.angle) * (s.dist + 3);
            const ty = oy + Math.sin(s.angle) * (s.dist + 3);
            ctx.fillRect(Math.floor(tx), Math.floor(ty), 1, 1);
          }
        }

        // B. Concentric gravitational collapse wavefronts (accelerating inward)
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          const wavePhase = (progress * 2.5 + w / waveCount) % 1;
          const radius = Math.max(0, 160 * (1 - Math.pow(wavePhase, 0.75)));
          const waveAlpha = Math.sin(wavePhase * Math.PI) * 0.55;

          if (radius > 3 && waveAlpha > 0.01) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(ox, oy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(render);
      }

      // ====================================================
      // PHASE 2: THERMONUCLEAR BREAKOUT & FILAMENTARY BLAST
      // ====================================================
      else if (state === 'supernova_explode') {
        const progress = Math.min(1, elapsed / 0.95);
        let hasActiveEjecta = false;

        // A. Primary Relativistic Filamentary Blast Wave (with Rayleigh-Taylor Instability)
        // Shock front expands rapidly: R(t) = R_max * (1 - (1 - progress)^2.5)
        const primaryRadius = 2200 * (1 - Math.pow(1 - progress, 2.5));
        const primaryAlpha = Math.max(0, Math.pow(1 - progress, 1.4));

        if (primaryRadius > 8 && primaryAlpha > 0.01) {
          ctx.save();
          const segments = 128;
          ctx.beginPath();

          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            // Harmonic perturbations matching fluid-dynamic Rayleigh-Taylor fingers
            const perturb =
              Math.sin(angle * 4 + perturbationSeed) * 0.038 +
              Math.cos(angle * 7 + perturbationSeed * 1.5) * 0.024 +
              Math.sin(angle * 13 + perturbationSeed * 2.2) * 0.014;
            const r = primaryRadius * (1 + perturb);
            const x = ox + Math.cos(angle) * r;
            const y = oy + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.closePath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${primaryAlpha * 0.95})`;
          ctx.lineWidth = Math.max(1, 2.8 * (1 - progress));
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = Math.min(45, 12 + primaryRadius * 0.03);
          ctx.stroke();

          // Compression knots (luminous knots along shock front)
          if (primaryRadius > 40 && primaryRadius < 1800) {
            const knotCount = 20;
            for (let k = 0; k < knotCount; k++) {
              const kAngle = (k / knotCount) * Math.PI * 2 + perturbationSeed * 0.15;
              const kPerturb =
                Math.sin(kAngle * 4 + perturbationSeed) * 0.038 +
                Math.cos(kAngle * 7 + perturbationSeed * 1.5) * 0.024;
              const kr = primaryRadius * (1 + kPerturb);
              const kx = ox + Math.cos(kAngle) * kr;
              const ky = oy + Math.sin(kAngle) * kr;
              const kSize = k % 3 === 0 ? 2 : 1;

              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = primaryAlpha * 0.9;
              ctx.fillRect(Math.floor(kx), Math.floor(ky), kSize, kSize);
            }
          }
          ctx.restore();
        }

        // B. Secondary Reverse Shock Shell (Trailing behind the primary front)
        const reverseRadius = primaryRadius * 0.72;
        const reverseAlpha = primaryAlpha * 0.55;
        if (reverseRadius > 10 && reverseAlpha > 0.01) {
          ctx.save();
          const segments = 96;
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const perturb =
              Math.cos(angle * 5 + perturbationSeed * 0.8) * 0.03 +
              Math.sin(angle * 9 + perturbationSeed * 1.2) * 0.02;
            const r = reverseRadius * (1 + perturb);
            const x = ox + Math.cos(angle) * r;
            const y = oy + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(226, 232, 240, ${reverseAlpha})`;
          ctx.lineWidth = Math.max(1, 1.8 * (1 - progress));
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.restore();
        }

        // C. 220+ Stellar Ejecta Knots (Crisp Square Pixel Stars)
        for (let i = 0; i < ejecta.length; i++) {
          const p = ejecta[i];
          if (p.alpha <= 0.01) continue;
          hasActiveEjecta = true;

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.963; // Hydrodynamic drag through interstellar medium
          p.vy *= 0.963;
          p.alpha -= p.decay;

          const currentAlpha = Math.max(0, p.alpha);

          // Render as crisp square pixel star matching Stars.jsx
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

          // Trailing ejecta dust trail for fast Tier 2 & 3 knots
          if (p.size >= 2 && currentAlpha > 0.25) {
            ctx.globalAlpha = currentAlpha * 0.35;
            ctx.fillRect(
              Math.floor(p.x - p.vx * 0.45),
              Math.floor(p.y - p.vy * 0.45),
              p.size - 1,
              p.size - 1
            );
          }
        }

        ctx.globalAlpha = 1;

        if (progress < 1 || hasActiveEjecta) {
          animId = requestAnimationFrame(render);
        }
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [state, origin]);

  const isCharging = state === 'supernova_charge';
  const isExploding = state === 'supernova_explode';

  if (!isCharging && !isExploding) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999990,
        overflow: 'hidden',
      }}
    >
      {/* High-Performance Canvas: Shock Breakout, Filamentary Shock Shell, and Pixel Star Ejecta */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <AnimatePresence>
        {/* Phase 1: Core Condensation & Monochromatic Telescope Optics */}
        {isCharging && (
          <div
            key="charge-phase"
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Rotating 6-Ray Monochromatic JWST Astronomical Diffraction Spikes */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[0, 60, 120].map((angle, idx) => (
                <motion.div
                  key={`spike-${idx}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 1.25, 1.0, 1.6],
                    opacity: [0, 0.7, 0.9, 1],
                  }}
                  transition={{ duration: 1.85, ease: 'easeIn' }}
                  style={{
                    position: 'absolute',
                    width: 380,
                    height: idx === 0 ? 2 : 1.2,
                    transform: `rotate(${angle}deg)`,
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 25%, #ffffff 50%, rgba(255, 255, 255, 0.4) 75%, transparent 100%)',
                    boxShadow: '0 0 14px rgba(255, 255, 255, 0.8), 0 0 30px #ffffff',
                  }}
                />
              ))}
            </motion.div>

            {/* Expanding Progenitor Core (The dot swelling & pulsating with nuclear energy, scaled +30%) */}
            <motion.div
              initial={{ scale: 1, opacity: 0.95 }}
              animate={{
                scale: [1, 1.75, 1.55, 2.35, 2.1, 3.0],
                opacity: [0.95, 1, 0.92, 1, 0.95, 1],
              }}
              transition={{
                duration: 1.85,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: -5,
                top: -5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow:
                  '0 0 13px #ffffff, 0 0 28px rgba(255, 255, 255, 0.95), 0 0 50px rgba(226, 232, 240, 0.7)',
              }}
            />
          </div>
        )}

        {/* Phase 2: Detonation Breakout (The swollen dot violently blows up, scaled +30%) */}
        {isExploding && (
          <div
            key="explode-phase"
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Breakout Explosion: The swollen dot expands explosively and flashes */}
            <motion.div
              initial={{ scale: 3.0, opacity: 1 }}
              animate={{
                scale: [3.0, 7.15, 9.75],
                opacity: [1, 0.85, 0],
              }}
              transition={{
                duration: 0.38,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: -5,
                top: -5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.95) 40%, rgba(226, 232, 240, 0.5) 75%, transparent 100%)',
                boxShadow:
                  '0 0 26px #ffffff, 0 0 58px rgba(255, 255, 255, 0.9), 0 0 98px rgba(226, 232, 240, 0.5)',
              }}
            />

            {/* Detonation Shock Ringlet */}
            <motion.div
              initial={{
                width: 30,
                height: 30,
                left: -15,
                top: -15,
                opacity: 1,
              }}
              animate={{
                width: [30, 85, 143],
                height: [30, 85, 143],
                left: [-15, -42.5, -71.5],
                top: [-15, -42.5, -71.5],
                opacity: [1, 0.75, 0],
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Supernova;
