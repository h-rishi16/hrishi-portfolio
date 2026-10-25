import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useVelocity, useSpring, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

const StarLayer = ({ count, size, baseSpeed, velocityMultiplier, initialZ = 0, eggStateRef }) => {
  const shadows = useMemo(() => {
    let s = [];
    for (let i = 0; i < count; i++) {
      // Wide edge-to-edge scatter so stars fill the entire viewport across all depths
      s.push(`${Math.floor(Math.random() * 260 - 80)}vw ${Math.floor(Math.random() * 260 - 80)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
    }
    return s.join(', ');
  }, [count]);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const zPos = useMotionValue(initialZ);

  useAnimationFrame((t, delta) => {
    if (eggStateRef.current === 'suck' || eggStateRef.current === 'supernova_charge') return;

    let moveBy = baseSpeed * (delta / 1000);
    
    // Scroll down = positive velocity. Forward motion on scroll down, backward on scroll up.
    let velocityMove = smoothVelocity.get() * (delta / 1000) * velocityMultiplier;
    // Clamp to prevent single-frame spikes from choking GPU rasterization at the focal plane
    velocityMove = Math.max(-100, Math.min(100, velocityMove));
    moveBy += velocityMove;
    
    zPos.set((zPos.get() + moveBy) % 2000);
  });

  // Original layer translates from -1000 to 1000
  const transform1 = useTransform(zPos, (z) => {
    let rawZ = (z % 2000);
    if (rawZ < 0) rawZ += 2000;
    return `translate3d(0, 0, ${rawZ - 1000}px)`;
  });

  // Duplicate layer spaced exactly 2000px behind (-3000 to -1000)
  const transform2 = useTransform(zPos, (z) => {
    let rawZ = (z % 2000);
    if (rawZ < 0) rawZ += 2000;
    return `translate3d(0, 0, ${rawZ - 3000}px)`;
  });

  return (
    <div style={{ position: 'absolute', inset: 0, perspective: '600px', transformStyle: 'preserve-3d' }}>
      <motion.div style={{ position: 'absolute', inset: 0, transform: transform1, willChange: 'transform' }}>
        <div style={{ position: 'absolute', width: size, height: size, boxShadow: shadows, background: 'transparent' }} />
      </motion.div>
      <motion.div style={{ position: 'absolute', inset: 0, transform: transform2, willChange: 'transform' }}>
        <div style={{ position: 'absolute', width: size, height: size, boxShadow: shadows, background: 'transparent' }} />
      </motion.div>
    </div>
  );
};

const Stars = () => {
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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <motion.div
        animate={{
          scale: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1,
          opacity: (eggState === 'suck' || eggState === 'supernova_charge' || eggState === 'supernova_explode') ? 0.01 : 1
        }}
        transition={{
          duration: eggState === 'supernova_charge' ? 2.0 : 0.6,
          ease: eggState === 'normal' ? 'easeOut' : 'easeIn'
        }}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: `${origin.x} ${origin.y}`
        }}
      >
        <StarLayer count={600} size="1px" baseSpeed={50} velocityMultiplier={2.5} initialZ={800} eggStateRef={eggStateRef} />
        <StarLayer count={200} size="2px" baseSpeed={100} velocityMultiplier={5.0} initialZ={1200} eggStateRef={eggStateRef} />
        <StarLayer count={100} size="3px" baseSpeed={250} velocityMultiplier={12.5} initialZ={500} eggStateRef={eggStateRef} />
      </motion.div>
    </div>
  );
};

export default Stars;
