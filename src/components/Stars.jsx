import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Stars = () => {
  const canvasRef = useRef(null);
  const [eggState, setEggState] = useState('normal');
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const eggStateRef = useRef('normal');
  const blackHoleOriginRef = useRef({ x: 500, y: 400 });

  useEffect(() => {
    const handleEgg = (e) => {
      if (e.detail) {
        if (e.detail.state === 'suck') {
          eggStateRef.current = 'suck';
          setEggState('suck');
          if (e.detail.x !== undefined && e.detail.y !== undefined) {
            blackHoleOriginRef.current = { x: e.detail.x, y: e.detail.y };
          }
        } else if (e.detail.state === 'blackhole_explode') {
          eggStateRef.current = 'blackhole_explode';
          setEggState('blackhole_explode');
        } else if (e.detail.state === 'supernova_charge') {
          eggStateRef.current = 'supernova_charge';
          setEggState('supernova_charge');
          if (e.detail.x !== undefined) {
            setOrigin({ x: `${e.detail.x}px`, y: `${e.detail.y}px` });
          }
        } else if (e.detail.state === 'supernova_explode') {
          eggStateRef.current = 'supernova_explode';
          setEggState('supernova_explode');
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

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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
          vx: 0,
          vy: 0,
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
      const isSupernovaCharging = eggStateRef.current === 'supernova_charge';

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 1. Perspective projection
        let scale = fov / star.z;
        let screenX = centerX + star.x * scale;
        let screenY = centerY + star.y * scale;

        // 2. Black Hole Gravitational Suction & Orbital Capture (During 5s hold)
        if (eggStateRef.current === 'suck') {
          const bhX = blackHoleOriginRef.current.x;
          const bhY = blackHoleOriginRef.current.y;

          const dx = bhX - screenX;
          const dy = bhY - screenY;
          const dist = Math.hypot(dx, dy);

          if (dist < 15) {
            // Star has crossed the Schwarzschild event horizon: swallowed!
            star.z = 1900 + Math.random() * 400;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.max(width, height) * (0.8 + Math.random() * 0.5);
            const spawnX = bhX + Math.cos(angle) * r;
            const spawnY = bhY + Math.sin(angle) * r;
            const sScale = fov / star.z;
            star.x = (spawnX - centerX) / sScale;
            star.y = (spawnY - centerY) / sScale;
            star.vx = 0;
            star.vy = 0;
            continue;
          }

          const nx = dx / dist; // Inward radial unit vector
          const ny = dy / dist;
          const tx = -ny;       // Tangential orbital unit vector (counter-clockwise)
          const ty = nx;

          if (dist > 95) {
            // A. Infall Phase: Background stars are gravitationally accelerated toward the black hole
            const pull = Math.min(680, 260000 / (dist + 45));
            const swirl = Math.min(0.85, 140 / dist);

            star.vx += (nx + tx * swirl * 0.7) * pull * dt;
            star.vy += (ny + ty * swirl * 0.7) * pull * dt;

            // Terminal velocity cap
            const v = Math.hypot(star.vx, star.vy);
            if (v > 800) {
              star.vx *= 800 / v;
              star.vy *= 800 / v;
            }

            screenX += star.vx * dt;
            screenY += star.vy * dt;

            // Pull closer toward camera as it accretes
            if (star.z > 350) star.z = Math.max(350, star.z - 340 * dt);
          } else {
            // B. Captured Orbital Phase: Stars spin rapidly around the black hole!
            const vOrbit = 2300 / Math.sqrt(dist + 6); // Relativistic Keplerian speed
            const inwardDrift = vOrbit * 0.09;

            const targetVx = tx * vOrbit + nx * inwardDrift;
            const targetVy = ty * vOrbit + ny * inwardDrift;

            // Rapidly blend velocity into circular orbit
            const blend = Math.min(1, dt * 11);
            star.vx += (targetVx - star.vx) * blend;
            star.vy += (targetVy - star.vy) * blend;

            screenX += star.vx * dt;
            screenY += star.vy * dt;

            if (star.z > 260) star.z = Math.max(260, star.z - 200 * dt);
          }

          // Sync back to 3D star coordinates
          scale = fov / star.z;
          star.x = (screenX - centerX) / scale;
          star.y = (screenY - centerY) / scale;
        } else if (eggStateRef.current === 'blackhole_explode') {
          // 3. Black Hole Explosion Blast Wave (After 5 seconds hold):
          // Stars are blown violently outward in a 360-degree shockwave!
          const bhX = blackHoleOriginRef.current.x;
          const bhY = blackHoleOriginRef.current.y;
          const dx = screenX - bhX;
          const dy = screenY - bhY;
          const dist = Math.hypot(dx, dy) || 1;

          const blastSpeed = Math.max(350, 4800 / (dist + 20));
          const nx = dx / dist;
          const ny = dy / dist;

          star.vx = nx * blastSpeed;
          star.vy = ny * blastSpeed;

          screenX += star.vx * dt;
          screenY += star.vy * dt;

          scale = fov / star.z;
          star.x = (screenX - centerX) / scale;
          star.y = (screenY - centerY) / scale;
          star.z -= star.baseSpeed * 2 * dt;
        } else if (eggStateRef.current === 'hawking_burst') {
          // 4. Standard Hawking Radiation Centrifugal Slingshot (< 5s release)
          screenX += star.vx * dt;
          screenY += star.vy * dt;
          star.vx *= 0.94;
          star.vy *= 0.94;

          scale = fov / star.z;
          star.x = (screenX - centerX) / scale;
          star.y = (screenY - centerY) / scale;
          star.z -= star.baseSpeed * dt;
        } else {
          // 5. Normal Starfield Navigation & Deep Space Drift
          if (Math.abs(star.vx) > 0.5 || Math.abs(star.vy) > 0.5) {
            screenX += star.vx * dt;
            screenY += star.vy * dt;
            star.vx *= 0.88;
            star.vy *= 0.88;

            scale = fov / star.z;
            star.x = (screenX - centerX) / scale;
            star.y = (screenY - centerY) / scale;
          }

          if (!isSupernovaCharging) {
            let speed = star.baseSpeed + (smoothVelocity * star.velocityMult * 0.3);
            speed = Math.max(-2000, Math.min(4500, speed));
            star.z -= speed * dt;

            if (star.z <= 60) {
              star.z += 1940;
              star.x = (Math.random() - 0.5) * width * 3;
              star.y = (Math.random() - 0.5) * height * 3;
            } else if (star.z > 2000) {
              star.z -= 1940;
            }
          }
        }

        // Near-plane dissolve: smooth fade between Z = 60 and Z = 260
        // Prevents stars from expanding into oversized blocks near the camera
        let renderAlpha = star.alpha;
        if (star.z < 260) {
          renderAlpha *= Math.max(0, (star.z - 60) / 200);
        }

        // Skip rendering if completely offscreen
        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        if (renderAlpha <= 0.01) continue;

        // Render crisp square pixel stars (exact Path A aesthetic)
        const renderSize = Math.max(1, Math.round(star.baseSize * Math.min(scale, 1.8)));
        ctx.fillStyle = `rgba(255, 255, 255, ${renderAlpha})`;
        ctx.fillRect(Math.floor(screenX), Math.floor(screenY), renderSize, renderSize);

        // Motion streak trail for fast-orbiting stars in the accretion disk
        if (eggStateRef.current === 'suck') {
          const bhX = blackHoleOriginRef.current.x;
          const bhY = blackHoleOriginRef.current.y;
          const orbDist = Math.hypot(bhX - screenX, bhY - screenY);
          if (orbDist < 110 && orbDist > 14 && renderAlpha > 0.2) {
            ctx.fillStyle = `rgba(255, 255, 255, ${renderAlpha * 0.45})`;
            ctx.fillRect(
              Math.floor(screenX - star.vx * 0.016),
              Math.floor(screenY - star.vy * 0.016),
              renderSize,
              renderSize
            );
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const isCollapsed = eggState === 'supernova_charge';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <motion.div
        animate={{
          scale: isCollapsed ? 0.01 : 1,
          opacity: isCollapsed ? 0.01 : 1
        }}
        transition={{
          duration: isCollapsed ? 1.85 : 0.45,
          ease: isCollapsed ? 'easeIn' : [0.15, 0.9, 0.25, 1]
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
