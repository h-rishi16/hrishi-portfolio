import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const generateShadows = (count) => {
  let s = [];
  for (let i = 0; i < count; i++) {
    s.push(`${Math.floor(Math.random() * 200 - 50)}vw ${Math.floor(Math.random() * 200 - 50)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
  }
  return s.join(', ');
};

const SHADOWS_1 = generateShadows(600);
const SHADOWS_2 = generateShadows(250);
const SHADOWS_3 = generateShadows(100);

// Hybrid Cosmic Horizon & Photonic Distance Falloff:
// 1. Spawns deep in the void at -2500px, emerging with smooth photonic attenuation (0.0 -> 1.0)
// 2. Sustains rock-solid, constant brilliance across the entire visible sky (-1700px to +50px)
// 3. Gently dissolves (+50px to +250px) well before the camera eye (perspective: 600px)
const getLayerOpacity = (z) => {
  if (z < -1700) {
    return Math.max(0, (z + 2500) / 800);
  }
  if (z <= 50) {
    return 1;
  }
  if (z < 250) {
    return Math.max(0, (250 - z) / 200);
  }
  return 0;
};

const Stars = () => {
  const layer1Refs = useRef([]);
  const layer2Refs = useRef([]);
  const layer3Refs = useRef([]);
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
          
          // Freeze the physical drift for exactly the duration of the scale animation (600ms)
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
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let scrollVelocity = 0;
    let z1 = 0, z2 = 0, z3 = 0;
    let rafId;

    const tick = (now) => {
      const delta = Math.min(now - lastTime, 50);
      lastTime = now;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity = scrollVelocity * 0.85 + scrollDelta * 0.15;

      const dt = delta / 1000;
      // Clamp scroll thrust to maintain smooth hyperspace feel without violent coordinate jumps
      const rawThrust = scrollVelocity * 15;
      const thrust = Math.min(Math.max(rawThrust, -60), 350);

      if (eggStateRef.current !== 'suck' && eggStateRef.current !== 'supernova_charge') {
        z1 = (z1 + (15 + thrust) * dt) % 2800;
        z2 = (z2 + (30 + thrust * 2) * dt) % 2800;
        z3 = (z3 + (60 + thrust * 3.5) * dt) % 2800;

        if (z1 < 0) z1 += 2800;
        if (z2 < 0) z2 += 2800;
        if (z3 < 0) z3 += 2800;

        const updateLayer = (refs, z) => {
          refs.forEach((ref, i) => {
            if (!ref) return;
            // 2 planes spaced by 1400px over a 2800px cosmic cycle spanning [-2500px, +300px]
            const layerZ = ((z + i * 1400) % 2800) - 2500;
            ref.style.transform = `translateZ(${layerZ}px)`;
            ref.style.opacity = getLayerOpacity(layerZ);
          });
        };

        updateLayer(layer1Refs.current, z1);
        updateLayer(layer2Refs.current, z2);
        updateLayer(layer3Refs.current, z3);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <motion.div
        animate={{ scale: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1, opacity: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1 }}
        transition={{ duration: eggState === 'supernova_charge' ? 2.0 : 0.6, ease: eggState === 'normal' ? 'easeOut' : 'easeIn' }}
        style={{ position: 'absolute', inset: 0, transformOrigin: `${origin.x} ${origin.y}`, willChange: 'transform, opacity' }}
      >
        {/* Layer 1 - Slowest */}
        <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
          <div ref={el => layer1Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '1px', height: '1px', borderRadius: '50%', boxShadow: SHADOWS_1, background: 'transparent' }} />
          </div>
          <div ref={el => layer1Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '1px', height: '1px', borderRadius: '50%', boxShadow: SHADOWS_1, background: 'transparent' }} />
          </div>
        </div>

        {/* Layer 2 - Medium */}
        <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
          <div ref={el => layer2Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', boxShadow: SHADOWS_2, background: 'transparent' }} />
          </div>
          <div ref={el => layer2Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', boxShadow: SHADOWS_2, background: 'transparent' }} />
          </div>
        </div>

        {/* Layer 3 - Fastest */}
        <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
          <div ref={el => layer3Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', boxShadow: SHADOWS_3, background: 'transparent' }} />
          </div>
          <div ref={el => layer3Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform, opacity' }}>
            <div style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', boxShadow: SHADOWS_3, background: 'transparent' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Stars;
