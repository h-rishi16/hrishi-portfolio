import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [eggMode, setEggMode] = useState(0); // 0: blackhole, 1: supernova
  const [eggState, setEggState] = useState('normal'); // 'normal', 'blackhole', 'charging', 'blasted'
  
  const modeSwitchTimer = useRef(null);
  const chargeTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(modeSwitchTimer.current); // Stop mode shifting while interacting

    if (eggMode === 0) {
      setEggState('blackhole');
      window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'blackhole' }));
    } else if (eggMode === 1) {
      setEggState('charging');
      window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'charging' }));
      
      // Charge for 3 seconds before blasting
      chargeTimer.current = setTimeout(() => {
        setEggState('blasted');
        window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'blasted' }));
      }, 3000);
    }
  };

  const handleLeave = () => {
    clearTimeout(chargeTimer.current);
    setEggState('normal');
    window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'normal' }));
    
    // Shift to the next mode after 5 seconds of inactivity
    modeSwitchTimer.current = setTimeout(() => {
      setEggMode((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(modeSwitchTimer.current);
      clearTimeout(chargeTimer.current);
    };
  }, []);

  const letters = ['H', 'r', 'i', 's', 'h', 'i'];

  return (
    <section
      id="home"
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Supernova Flash - Inverts Colors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: eggState === 'blasted' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'white',
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'difference' // Inverts all colors underneath
        }}
      />

      {/* Ambient Glows */}
      <div className="ambient-glow" style={{ top: "30%", left: "20%" }} />
      <div
        className="ambient-glow"
        style={{ bottom: "20%", right: "20%", animationDelay: "2s" }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            color: "var(--text-tertiary)",
            fontSize: "1.125rem",
            marginBottom: "1rem",
          }}
        >
          Hello, I am
        </motion.p>

        <motion.h1
          className="heading-xl text-silver-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {letters.map((char, i) => (
            <span key={i} style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
          <span
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{ display: 'inline-block', position: 'relative', cursor: 'crosshair', userSelect: 'none' }}
          >
            <span style={{ opacity: eggState !== 'normal' ? 0 : 1 }}>.</span>
            <motion.div
              animate={
                eggState === 'blackhole'
                  ? { 
                      width: 50, height: 50,
                      backgroundColor: '#000000', 
                      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
                      opacity: 1
                    }
                  : eggState === 'charging'
                  ? { 
                      width: 50, height: 50,
                      backgroundColor: '#ffffff', 
                      boxShadow: '0 0 50px rgba(255, 255, 255, 1)',
                      opacity: 1
                    }
                  : eggState === 'blasted'
                  ? { width: 50, height: 50, opacity: 0 }
                  : { 
                      width: 0, height: 0, 
                      backgroundColor: 'transparent', 
                      boxShadow: '0 0 0 0px rgba(255, 255, 255, 0)',
                      opacity: 0
                    }
              }
              transition={{
                width: { duration: eggState === 'charging' ? 3 : 0.3, ease: 'linear' },
                height: { duration: eggState === 'charging' ? 3 : 0.3, ease: 'linear' },
                backgroundColor: { duration: 0.3 },
                opacity: { duration: 0.3 }
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: -1
              }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            color: "var(--text-tertiary)",
            fontSize: "1.125rem",
            maxWidth: "32rem",
            margin: "1.5rem auto 3rem",
          }}
        >
          Specializing in Machine Learning, Data Science, and modern Python
          engineering to solve complex real-world challenges.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
