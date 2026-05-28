import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
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
          Hrishi<span className="text-silver-gradient" style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ pointerEvents: 'none', padding: '0 5px' }}>.</span>
            <span
              onMouseDown={(e) => {
                const x = e.clientX;
                const y = e.clientY;
                window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'suck', x, y } }));
              }}
              onMouseUp={() => window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }))}
              onDoubleClick={(e) => {
                const x = e.clientX;
                const y = e.clientY;
                window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'supernova_charge', x, y } }));
              }}
              style={{ 
                position: 'absolute',
                left: 0,
                bottom: '0.15em',
                width: '100%',
                height: '0.3em',
                cursor: 'crosshair',
                zIndex: 20
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
