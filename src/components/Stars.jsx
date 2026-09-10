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

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    const generateStars = (count, layer) => {
      const arr = [];
      const spreadX = window.innerWidth * 3;
      const spreadY = window.innerHeight * 3;
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * spreadX - spreadX / 2,
          y: Math.random() * spreadY - spreadY / 2,
          z: Math.random() * 2000,
          layer: layer,
          size: layer === 1 ? 0.8 : layer === 2 ? 1.5 : 2.2
        });
      }
      return arr;
    };

    const stars = [
      ...generateStars(1200, 1),
      ...generateStars(600, 2),
      ...generateStars(300, 3)
    ];

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
      const thrust = scrollVelocity * 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fov = 600;

      if (eggStateRef.current !== 'suck' && eggStateRef.current !== 'supernova_charge') {
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];

          let speed = 0;
          if (star.layer === 1) speed = 10 + thrust;
          else if (star.layer === 2) speed = 20 + thrust * 3;
          else if (star.layer === 3) speed = 40 + thrust * 8;

          star.z -= speed * dt;

          const spreadX = canvas.width * 3;
          const spreadY = canvas.height * 3;

          if (star.z <= 0) {
            star.z += 2000;
            star.x = Math.random() * spreadX - spreadX / 2;
            star.y = Math.random() * spreadY - spreadY / 2;
          } else if (star.z > 2000) {
            star.z -= 2000;
            star.x = Math.random() * spreadX - spreadX / 2;
            star.y = Math.random() * spreadY - spreadY / 2;
          }

          const scale = fov / (star.z + 1);
          const projX = cx + star.x * scale;
          const projY = cy + star.y * scale;

          let opacity = 1;
          if (star.z > 1900) {
            opacity = (2000 - star.z) / 100; 
          } else if (star.z < 400) {
            opacity = star.z / 400;
          }

          if (opacity > 0 && projX > 0 && projX < canvas.width && projY > 0 && projY < canvas.height) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.arc(projX, projY, Math.max(0.1, star.size * scale), 0, Math.PI * 2);
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
