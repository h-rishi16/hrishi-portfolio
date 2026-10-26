import { motion, AnimatePresence } from 'framer-motion';

const BlackHole = ({ state, origin }) => {
  const isActive = state === 'suck';
  const isExploding = state === 'blackhole_explode';
  const isBursting = state === 'hawking_burst';

  if (!isActive && !isExploding && !isBursting) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999992,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {/* Phase 1: Active Black Hole (Sucking background stars for 5 seconds) */}
        {isActive && (
          <div
            key="singularity-core"
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Relativistic Photon Sphere Ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.15, 1],
                opacity: 1,
                rotate: 360,
              }}
              transition={{
                scale: { duration: 0.35, ease: 'easeOut' },
                opacity: { duration: 0.2 },
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              }}
              style={{
                position: 'absolute',
                left: -20,
                top: -20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow:
                  '0 0 15px rgba(255, 255, 255, 0.95), 0 0 35px rgba(226, 232, 240, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4)',
              }}
            />

            {/* Pitch Black Event Horizon Shadow (Schwarzschild Core) */}
            <motion.div
              initial={{ scale: 0.2 }}
              animate={{ scale: [0.2, 1.1, 1] }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: -15,
                top: -15,
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#000000',
                boxShadow:
                  'inset 0 0 12px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 0.9)',
              }}
            />
          </div>
        )}

        {/* Phase 2: Black Hole Detonation & Explosion (Triggered after 5 seconds) */}
        {isExploding && (
          <div
            key="blackhole-detonation"
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Blinding Core Explosion Flash */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 5.5, 9.0],
                opacity: [1, 0.9, 0],
              }}
              transition={{
                duration: 0.85,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: -20,
                top: -20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.95) 35%, rgba(226, 232, 240, 0.5) 70%, transparent 100%)',
                boxShadow:
                  '0 0 40px #ffffff, 0 0 85px #ffffff, 0 0 160px rgba(226, 232, 240, 0.8)',
              }}
            />

            {/* Primary Expansion Blast Wave Ring */}
            <motion.div
              initial={{ width: 40, height: 40, left: -20, top: -20, opacity: 1 }}
              animate={{
                width: [40, 180, 360],
                height: [40, 180, 360],
                left: [-20, -90, -180],
                top: [-20, -90, -180],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.95)',
                pointerEvents: 'none',
              }}
            />

            {/* Secondary Macro Blast Wave */}
            <motion.div
              initial={{ width: 40, height: 40, left: -20, top: -20, opacity: 0.8 }}
              animate={{
                width: [40, 260, 560],
                height: [40, 260, 560],
                left: [-20, -130, -280],
                top: [-20, -130, -280],
                opacity: [0.8, 0.5, 0],
              }}
              transition={{
                duration: 0.85,
                ease: 'easeOut',
                delay: 0.05,
              }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* Premature Release: Hawking Radiation Evaporation Flash (< 5s hold) */}
        {isBursting && (
          <div
            key="hawking-burst"
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 2.8, 4.2], opacity: [1, 0.7, 0] }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: -15,
                top: -15,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.9) 35%, rgba(226, 232, 240, 0.4) 65%, transparent 100%)',
                boxShadow:
                  '0 0 25px #ffffff, 0 0 50px rgba(255, 255, 255, 0.8), 0 0 90px rgba(226, 232, 240, 0.4)',
              }}
            />

            <motion.div
              initial={{ width: 30, height: 30, left: -15, top: -15, opacity: 1 }}
              animate={{
                width: [30, 85, 140],
                height: [30, 85, 140],
                left: [-15, -42.5, -70],
                top: [-15, -42.5, -70],
                opacity: [1, 0.6, 0],
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '1.5px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlackHole;
