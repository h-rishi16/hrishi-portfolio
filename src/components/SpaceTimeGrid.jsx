import React, { useState, useEffect } from 'react';

const SpaceTimeGrid = () => {
  const [eggState, setEggState] = useState('normal');

  useEffect(() => {
    const handleEgg = (e) => setEggState(e.detail);
    window.addEventListener('EASTER_EGG', handleEgg);
    return () => window.removeEventListener('EASTER_EGG', handleEgg);
  }, []);

  return (
    <div className="space-time-grid-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <div
        className="space-time-grid"
        style={{ 
          animation: `gridScroll ${eggState === 'blackhole' || eggState === 'charging' ? '0.5s' : '3s'} linear infinite`,
          animationDirection: eggState === 'blackhole' ? 'reverse' : 'normal'
        }}
      />
    </div>
  );
};

export default SpaceTimeGrid;
