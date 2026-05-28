import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SpaceTimeGrid = () => {
  const [eggState, setEggState] = useState('normal');
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const eggStateRef = useRef('normal');

  useEffect(() => {
    const handleEgg = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        if (e.detail.state === 'suck') {
          eggStateRef.current = 'suck';
          setEggState('suck');
          if (e.detail.x !== undefined) {
            setOrigin({ x: `${e.detail.x}px`, y: `${e.detail.y}px` });
          }
        } else if (e.detail.state === 'normal') {
          setEggState('normal');
          setTimeout(() => {
            eggStateRef.current = 'normal';
          }, 600);
        }
      } else {
        eggStateRef.current = e.detail;
        setEggState(e.detail);
      }
    };
    window.addEventListener('EASTER_EGG', handleEgg);
    return () => window.removeEventListener('EASTER_EGG', handleEgg);
  }, []);

  return (
    <div className="space-time-grid-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <motion.div
        animate={{ 
          scale: eggState === 'suck' ? 0.01 : (eggState === 'blackhole' ? 0.05 : 1),
          opacity: eggState === 'suck' ? 0.01 : (eggState === 'blackhole' ? 0 : 1)
        }}
        transition={{ duration: eggState === 'suck' ? 0.6 : (eggState === 'blackhole' ? 2 : 0.5), ease: eggState === 'suck' ? 'easeIn' : 'easeOut' }}
        style={{ width: '100%', height: '100%', transformOrigin: `${origin.x} ${origin.y}`, willChange: 'transform, opacity' }}
      >
        <div
          className="space-time-grid"
          style={{ 
            animation: `gridScroll ${eggState === 'blackhole' || eggState === 'charging' ? '0.5s' : '3s'} linear infinite`,
            animationDirection: eggState === 'blackhole' ? 'reverse' : 'normal'
          }}
        />
      </motion.div>
    </div>
  );
};

export default SpaceTimeGrid;
