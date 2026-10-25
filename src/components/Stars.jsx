import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Stars = () => {
  const canvasRef = useRef(null);
  const [eggState, setEggState] = useState('normal');
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const eggStateRef = useRef('normal');

  useEffect(() => {
    const handleEgg = (e) => {
      if (e.detail) {
        if (e.detail.state === 'suck' || e.detail.state === 'supernova_charge') {
          eggStateRef.current = e.detail.state;
          setEggState(e.detail.state);
          if (e.detail.x !== undefined) {
            setOrigin({ x: `${e.detail.x}px`, y: `${e.detail.y}px` });
          }
        } else if (e.detail.state === 'normal') {
          setEggState('normal');
          setTimeout(() => {
            eggStateRef.current = 'normal';
          }, 600);
        }
      }
    };
    window.addEventListener('EASTER_EGG', handleEgg);
    return () => window.removeEventListener('EASTER_EGG', handleEgg);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let rafId;

    const FOV = 600;
    const MAX_Z = 2000;
    const MARGIN = 100;
    const STAR_COUNT = 1600;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let cx = w / 2;
    let cy = h / 2;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cx = w / 2;
      cy = h / 2;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const initOrResetStar = (star, isInitial = false) => {
      star.z = isInitial ? Math.random() * MAX_Z : MAX_Z;

      // Full frustum spread at depth z so stars uniformly cover the viewport with zero empty margins
      const spreadX = (w + MARGIN * 2) * (star.z / FOV);
      const spreadY = (h + MARGIN * 2) * (star.z / FOV);

      star.x = (Math.random() - 0.5) * spreadX;
      star.y = (Math.random() - 0.5) * spreadY;

      const r = Math.random();
      if (r < 0.70) {
        star.baseSize = 0.9;
        star.color = Math.random() < 0.2 ? '195, 220, 255' : '255, 255, 255';
      } else if (r < 0.92) {
        star.baseSize = 1.6;
        star.color = Math.random() < 0.25 ? '255, 242, 225' : '255, 255, 255';
      } else {
        star.baseSize = 2.4;
        star.color = Math.random() < 0.3 ? '210, 235, 255' : '255, 255, 255';
      }

      star.twinklePhase = Math.random() * Math.PI * 2;
      star.twinkleSpeed = 0.8 + Math.random() * 1.6;
      star.baseAlpha = 0.55 + Math.random() * 0.45;
    };

    const stars = Array.from({ length: STAR_COUNT }, () => {
      const s = {};
      initOrResetStar(s, true);
      return s;
    });

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let scrollVelocity = 0;

    const tick = (now) => {
      const delta = Math.min(now - lastTime, 50);
      lastTime = now;
      const dt = delta / 1000;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      scrollVelocity = scrollVelocity * 0.85 + scrollDelta * 0.15;
      const thrust = scrollVelocity * 25;
      const clampedThrust = Math.min(Math.max(thrust, -40), 900);
      const forwardSpeed = Math.max(10, 65 + clampedThrust);

      ctx.clearRect(0, 0, w, h);

      const isFrozen = eggStateRef.current === 'suck' || eggStateRef.current === 'supernova_charge';

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!isFrozen) {
          star.z -= forwardSpeed * dt;
        }

        const scale = FOV / star.z;
        const projX = cx + star.x * scale;
        const projY = cy + star.y * scale;

        // Reset if star has flown behind camera or outside visible frustum
        if (!isFrozen && (star.z <= 1 || projX < -MARGIN || projX > w + MARGIN || projY < -MARGIN || projY > h + MARGIN)) {
          initOrResetStar(star, false);
          continue;
        }

        // Seamless opacity fading (emerge smoothly in deep space, dissolve near camera)
        let depthAlpha = 1;
        if (star.z > MAX_Z - 400) {
          depthAlpha = (MAX_Z - star.z) / 400;
        } else if (star.z < 250) {
          depthAlpha = star.z / 250;
        }

        const twinkle = 0.8 + 0.2 * Math.sin(star.twinklePhase + now * 0.002 * star.twinkleSpeed);
        const finalAlpha = Math.max(0, Math.min(1, depthAlpha * star.baseAlpha * twinkle));

        if (finalAlpha <= 0.01) continue;

        const starSize = star.baseSize * Math.min(2.2, Math.max(0.6, scale));

        if (starSize <= 1.3) {
          // Sharp pixel diamond for distant stars (zero Retina blur)
          ctx.fillStyle = `rgba(${star.color}, ${finalAlpha})`;
          ctx.fillRect(
            Math.round(projX - starSize / 2),
            Math.round(projY - starSize / 2),
            Math.max(1, Math.round(starSize)),
            Math.max(1, Math.round(starSize))
          );
        } else {
          // Crisp circle for closer stars
          ctx.beginPath();
          ctx.fillStyle = `rgba(${star.color}, ${finalAlpha})`;
          ctx.arc(projX, projY, starSize / 2, 0, Math.PI * 2);
          ctx.fill();

          // Delicate celestial aura for foreground stars
          if (starSize > 2.0 && finalAlpha > 0.4) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${star.color}, ${finalAlpha * 0.22})`;
            ctx.arc(projX, projY, starSize * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <motion.div
        animate={{ scale: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1, opacity: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1 }}
        transition={{ duration: eggState === 'supernova_charge' ? 2.0 : 0.6, ease: eggState === 'normal' ? 'easeOut' : 'easeIn' }}
        style={{ position: 'absolute', inset: 0, transformOrigin: `${origin.x} ${origin.y}`, willChange: 'transform, opacity' }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
      </motion.div>
    </div>
  );
};

export default Stars;
