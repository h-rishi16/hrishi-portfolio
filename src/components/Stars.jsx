import { useRef, useEffect, useState } from 'react';
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
          eggStateRef.current = 'normal';
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
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Exact 3-tiered star distribution matching original aesthetic (900 stars total)
    // Tier 1: 600 stars, 1px square, subtle depth
    // Tier 2: 200 stars, 2px square, mid-field
    // Tier 3: 100 stars, 3px square, foreground warp
    const starConfigs = [
      { count: 600, size: 1, baseSpeed: 50, velocityMult: 2.5 },
      { count: 200, size: 2, baseSpeed: 100, velocityMult: 5.0 },
      { count: 100, size: 3, baseSpeed: 250, velocityMult: 12.5 },
    ];

    const stars = [];
    starConfigs.forEach((tier) => {
      for (let i = 0; i < tier.count; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 3,
          y: (Math.random() - 0.5) * height * 3,
          z: Math.random() * 2000 + 1,
          baseSize: tier.size,
          baseSpeed: tier.baseSpeed,
          velocityMult: tier.velocityMult,
          alpha: Math.random() * 0.8 + 0.2, // exact original brightness distribution
        });
      }
    });

    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let smoothVelocity = 0;

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Real-time trackpad / scroll velocity tracking with smooth lerp
      const currentScrollY = window.scrollY;
      const instantVelocity = (currentScrollY - lastScrollY) / (dt || 0.016);
      lastScrollY = currentScrollY;

      // Smooth decay & spring-like tracking
      smoothVelocity += (instantVelocity - smoothVelocity) * Math.min(1, dt * 10);

      ctx.clearRect(0, 0, width, height);

      const fov = 600;
      const centerX = width / 2;
      const centerY = height / 2;
      const isEggActive = eggStateRef.current === 'suck' || eggStateRef.current === 'supernova_charge';

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!isEggActive) {
          // Dynamic warp speed: responsive 1-to-1 parallax with trackpad and link clicks
          let speed = star.baseSpeed + (smoothVelocity * star.velocityMult * 0.3);
          // High-dynamic clamp: allows vivid warp acceleration without glitchy teleportation
          speed = Math.max(-2000, Math.min(4500, speed));
          star.z -= speed * dt;

          // Infinite independent recycling:
          // When a star flies past the camera (Z <= 60), recycle back to deep space (Z = 2000)
          if (star.z <= 60) {
            star.z += 1940;
            star.x = (Math.random() - 0.5) * width * 3;
            star.y = (Math.random() - 0.5) * height * 3;
          } else if (star.z > 2000) {
            star.z -= 1940;
          }
        }

        // True 3D perspective projection
        const scale = fov / star.z;
        const screenX = centerX + star.x * scale;
        const screenY = centerY + star.y * scale;

        // Skip rendering if completely offscreen
        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        // Near-plane dissolve: smooth fade between Z = 60 and Z = 260
        // Prevents stars from expanding into oversized blocks near the camera
        let renderAlpha = star.alpha;
        if (star.z < 260) {
          renderAlpha *= Math.max(0, (star.z - 60) / 200);
        }

        if (renderAlpha <= 0.01) continue;

        // Render crisp square pixel stars (exact Path A aesthetic)
        const renderSize = Math.max(1, Math.round(star.baseSize * Math.min(scale, 1.8)));
        ctx.fillStyle = `rgba(255, 255, 255, ${renderAlpha})`;
        ctx.fillRect(Math.floor(screenX), Math.floor(screenY), renderSize, renderSize);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
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
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />
      </motion.div>
    </div>
  );
};

export default Stars;
