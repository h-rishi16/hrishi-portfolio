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
      let thrust = scrollVelocity * 20;

      if (eggStateRef.current !== 'suck' && eggStateRef.current !== 'supernova_charge') {
        z1 = (z1 + (10 + thrust) * dt) % 2000;
        z2 = (z2 + (20 + thrust * 3) * dt) % 2000;
        z3 = (z3 + (40 + thrust * 8) * dt) % 2000;

        if (z1 < 0) z1 += 2000;
        if (z2 < 0) z2 += 2000;
        if (z3 < 0) z3 += 2000;

        layer1Refs.current.forEach((ref, i) => {
          if (ref) ref.style.transform = `translateZ(${((z1 + i * 1000) % 2000) - 1000}px)`;
        });
        layer2Refs.current.forEach((ref, i) => {
          if (ref) ref.style.transform = `translateZ(${((z2 + i * 1000) % 2000) - 1000}px)`;
        });
        layer3Refs.current.forEach((ref, i) => {
          if (ref) ref.style.transform = `translateZ(${((z3 + i * 1000) % 2000) - 1000}px)`;
        });
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
          <div ref={el => layer1Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '1px', height: '1px', boxShadow: SHADOWS_1, background: 'transparent' }} />
          </div>
          <div ref={el => layer1Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '1px', height: '1px', boxShadow: SHADOWS_1, background: 'transparent' }} />
          </div>
        </div>

        {/* Layer 2 - Medium */}
        <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
          <div ref={el => layer2Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '2px', height: '2px', boxShadow: SHADOWS_2, background: 'transparent' }} />
          </div>
          <div ref={el => layer2Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '2px', height: '2px', boxShadow: SHADOWS_2, background: 'transparent' }} />
          </div>
        </div>

        {/* Layer 3 - Fastest */}
        <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
          <div ref={el => layer3Refs.current[0] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '3px', height: '3px', boxShadow: SHADOWS_3, background: 'transparent' }} />
          </div>
          <div ref={el => layer3Refs.current[1] = el} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <div style={{ position: 'absolute', width: '3px', height: '3px', boxShadow: SHADOWS_3, background: 'transparent' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Stars;
