import React from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, useMotionValue } from 'framer-motion';

const SpaceTimeGrid = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  const yPos = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    let moveBy = 20 * (delta / 1000); // Synced base speed
    
    // User wants: scroll down -> move forward. Scroll down = positive velocity.
    let velocityMove = smoothVelocity.get() * (delta / 1000) * 2.0;
    
    moveBy += velocityMove;
    
    // Wrap around at 60px to match the grid size and seamlessly loop (handle negative modulo)
    let newY = (yPos.get() + moveBy) % 60;
    if (newY < 0) newY += 60;
    
    yPos.set(newY);
  });

  // Use hardware-accelerated translate3d to prevent sub-pixel vibration
  const transform = useTransform(yPos, (y) => `perspective(600px) rotateX(60deg) translate3d(0, ${y}px, 0)`);

  return (
    <div className="space-time-grid-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <motion.div 
        className="space-time-grid"
        style={{ transform, willChange: 'transform' }}
      />
    </div>
  );
};

export default SpaceTimeGrid;
