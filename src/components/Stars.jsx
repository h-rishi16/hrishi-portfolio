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
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by disabling canvas transparency since we paint a solid background
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Generate 2500 stars for a massive, dense universe
    const numStars = 2500;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2000,
        size: Math.random() * 1.5 + 0.5,
        baseSpeed: Math.random() * 1.5 + 0.2
      });
    }

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const tick = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // Smooth out scroll velocity
      scrollVelocity = scrollVelocity * 0.85 + scrollDelta * 0.15;
      const thrust = scrollVelocity * 0.4; // Multiplier for hyperspace speed

      // Paint dark space background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, canvas.height
      );
      gradient.addColorStop(0, '#0f0f13');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 600;

      if (eggStateRef.current !== 'suck' && eggStateRef.current !== 'supernova_charge') {
        for (let i = 0; i < numStars; i++) {
          const star = stars[i];

          // Move star forward (z approaches 0)
          star.z -= (star.baseSpeed + thrust);

          // Wrap around logic
          if (star.z <= 0) {
            star.z = 2000;
            star.x = Math.random() * 4000 - 2000;
            star.y = Math.random() * 4000 - 2000;
          } else if (star.z > 2000) {
            star.z = 0;
          }

          // 3D to 2D projection
          const projX = cx + (star.x / star.z) * fov;
          const projY = cy + (star.y / star.z) * fov;

          // Smooth opacity fading (in from distance, out near camera)
          let opacity = 1;
          if (star.z > 1700) {
            opacity = (2000 - star.z) / 300; 
          } else if (star.z < 300) {
            opacity = star.z / 300;
          }

          // Scale star size based on depth
          const scale = fov / star.z;
          const finalSize = Math.max(0.1, star.size * scale);

          // Only draw if visible on screen to save GPU cycles
          if (projX > 0 && projX < canvas.width && projY > 0 && projY < canvas.height && opacity > 0) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.arc(projX, projY, finalSize, 0, Math.PI * 2);
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
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden' }}>
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
