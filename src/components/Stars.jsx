import React, { useMemo } from 'react';
import { motion, useScroll, useVelocity, useSpring, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

const StarLayer = ({ count, size, baseSpeed, velocityMultiplier }) => {
  const shadows = useMemo(() => {
    let s = [];
    for (let i = 0; i < count; i++) {
      // Scatter stars in a wide area so they don't clip out when zooming past the camera
      s.push(`${Math.floor(Math.random() * 200 - 50)}vw ${Math.floor(Math.random() * 200 - 50)}vh rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`);
    }
    return s.join(', ');
  }, [count]);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const zPos = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    let moveBy = baseSpeed * (delta / 1000);
    
    // Scroll down = positive velocity. User wants scroll down -> forward motion.
    let velocityMove = smoothVelocity.get() * (delta / 1000) * velocityMultiplier;
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
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', background: 'radial-gradient(ellipse at bottom, #0f0f13 0%, #000000 100%)' }}>
      <StarLayer count={250} size="1px" baseSpeed={50} velocityMultiplier={5.0} />
      <StarLayer count={100} size="2px" baseSpeed={100} velocityMultiplier={10.0} />
      <StarLayer count={50} size="3px" baseSpeed={250} velocityMultiplier={25.0} />
    </div>
  );
};

export default Stars;
