import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SpaceTimeGrid = () => {
  const [eggState, setEggState] = useState('normal');

  useEffect(() => {
    const handleEgg = (e) => setEggState(e.detail);
    window.addEventListener('EASTER_EGG', handleEgg);
    return () => window.removeEventListener('EASTER_EGG', handleEgg);
  }, []);

  return (
    <div className="space-time-grid-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <motion.div
        animate={{ 
          scale: eggState === 'blackhole' ? 0.05 : 1,
          opacity: eggState === 'blackhole' ? 0 : 1
        }}
        transition={{ duration: eggState === 'blackhole' ? 2 : 0.5, ease: 'easeIn' }}
        style={{ width: '100%', height: '100%', transformOrigin: 'center center' }}
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
