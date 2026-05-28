import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Cursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.8 };
  const lensXSpring = useSpring(cursorX, springConfig);
  const lensYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('nav-link') ||
        target.classList.contains('btn')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          position: 'fixed',
          left: -25,
          top: -25,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backdropFilter: 'blur(2px) contrast(1.8) brightness(1.1) saturate(1.2)',
          WebkitBackdropFilter: 'blur(2px) contrast(1.8) brightness(1.1) saturate(1.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: 'inset 0px 4px 10px rgba(255, 255, 255, 0.5), inset 0px -4px 10px rgba(0, 0, 0, 0.5), 0px 10px 20px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none',
          zIndex: 9997,
          x: lensXSpring,
          y: lensYSpring,
        }}
      />
      
      {/* Core dot */}
      <motion.div
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? '#ffffff' : '#d4d4d4'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          position: 'fixed',
          left: -2,
          top: -2,
          width: 4,
          height: 4,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          x: cursorX,
          y: cursorY,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
        }}
      />
    </>
  );
};

export default Cursor;
