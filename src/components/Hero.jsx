import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [eggState, setEggState] = useState('normal');
  const timerRef = useRef(null);

  const handleEnter = () => {
    setEggState('blackhole');
    window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'blackhole' }));
    
    timerRef.current = setTimeout(() => {
      setEggState('supernova');
      window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'supernova' }));
    }, 2000);
  };

  const handleLeave = () => {
    clearTimeout(timerRef.current);
    setEggState('normal');
    window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: 'normal' }));
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
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
      {/* Supernova Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: eggState === 'supernova' ? 1 : 0 }}
        transition={{ duration: 0.1, repeat: eggState === 'supernova' ? 3 : 0, repeatType: 'reverse' }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'white',
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'difference'
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
            <motion.span
              key={i}
              animate={
                eggState === 'supernova'
                  ? { y: window.innerHeight, x: (Math.random() - 0.5) * 400, rotate: (Math.random() - 0.5) * 720, opacity: 0 }
                  : { y: 0, x: 0, rotate: 0, opacity: 1 }
              }
              transition={
                eggState === 'supernova'
                  ? { type: 'spring', bounce: 0.6, duration: 2, delay: Math.random() * 0.2 }
                  : { type: 'spring', bounce: 0.4 }
              }
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            animate={
              eggState === 'blackhole' 
                ? { scale: [1, 1.5, 1], color: '#a855f7' } 
                : eggState === 'supernova'
                ? { scale: 20, opacity: 0, color: '#ffffff' }
                : { scale: 1, color: 'inherit' }
            }
            transition={
              eggState === 'blackhole' 
                ? { repeat: Infinity, duration: 0.2 }
                : { duration: 0.5 }
            }
            style={{ display: 'inline-block', cursor: 'crosshair', userSelect: 'none' }}
          >
            .
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={eggState === 'supernova' ? { opacity: 0, y: 100 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: eggState === 'normal' ? 0.4 : 0 }}
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
