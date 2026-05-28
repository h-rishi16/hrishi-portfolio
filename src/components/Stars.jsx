import React, { useMemo, useRef, useEffect } from 'react';

const Stars = () => {
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  const shadows1 = useMemo(() => {
    let s = [];
    for (let i = 0; i < 600; i++) {
      s.push(`${Math.floor(Math.random() * 200 - 50)}vw ${Math.floor(Math.random() * 200 - 50)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
    }
    return s.join(', ');
  }, []);

  const shadows2 = useMemo(() => {
    let s = [];
    for (let i = 0; i < 250; i++) {
      s.push(`${Math.floor(Math.random() * 200 - 50)}vw ${Math.floor(Math.random() * 200 - 50)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
    }
    return s.join(', ');
  }, []);

  const shadows3 = useMemo(() => {
    let s = [];
    for (let i = 0; i < 100; i++) {
      s.push(`${Math.floor(Math.random() * 200 - 50)}vw ${Math.floor(Math.random() * 200 - 50)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
    }
    return s.join(', ');
  }, []);

  const eggStateRef = useRef('normal');

  useEffect(() => {
    const handleEgg = (e) => {
      eggStateRef.current = e.detail;
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

      // Easter egg overrides
      if (eggStateRef.current === 'blackhole') {
        thrust = -1000; // Violent reverse warp
      } else if (eggStateRef.current === 'supernova') {
        thrust = 3000; // Explosive forward warp
      }

      // Very slow idle drift, massive scroll warp
      z1 = (z1 + (10 + thrust) * dt) % 2000;
      z2 = (z2 + (20 + thrust * 3) * dt) % 2000;
      z3 = (z3 + (40 + thrust * 8) * dt) % 2000;

      if (z1 < 0) z1 += 2000;
      if (z2 < 0) z2 += 2000;
      if (z3 < 0) z3 += 2000;

      if (layer1Ref.current) layer1Ref.current.style.transform = `translateZ(${z1 - 1000}px)`;
      if (layer2Ref.current) layer2Ref.current.style.transform = `translateZ(${z2 - 1000}px)`;
      if (layer3Ref.current) layer3Ref.current.style.transform = `translateZ(${z3 - 1000}px)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
        <div ref={layer1Ref} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div style={{ position: 'absolute', width: '1px', height: '1px', boxShadow: shadows1, background: 'transparent' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
        <div ref={layer2Ref} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div style={{ position: 'absolute', width: '2px', height: '2px', boxShadow: shadows2, background: 'transparent' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, perspective: '600px' }}>
        <div ref={layer3Ref} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div style={{ position: 'absolute', width: '3px', height: '3px', boxShadow: shadows3, background: 'transparent' }} />
        </div>
      </div>
    </div>
  );
};

export default Stars;
