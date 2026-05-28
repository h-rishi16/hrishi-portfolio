import React from 'react';

const SpaceTimeGrid = () => {
  return (
    <div className="space-time-grid-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <div
        className="space-time-grid"
        style={{ animation: 'gridScroll 3s linear infinite' }}
      />
    </div>
  );
};

export default SpaceTimeGrid;
