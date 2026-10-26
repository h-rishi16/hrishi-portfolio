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

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.h1
            className="heading-xl text-silver-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ margin: 0, userSelect: 'none' }}
          >
            Hrishi.
          </motion.h1>

          {/* Dot 1: Tittle on first 'i' -> Supernova Burst & Color Inversion (Hidden Easter Egg) */}
          <span
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'supernova_charge', x, y } }));
            }}
            style={{
              position: 'absolute',
              left: '34%',
              width: '11%',
              top: '4%',
              height: '35%',
              zIndex: 30,
              userSelect: 'none',
            }}
          />

          {/* Dot 2: Tittle on second 'i' -> Black Hole Suction (Hold 5s to Explode & Reset) (Hidden Easter Egg) */}
          <span
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'suck', x, y } }));
            }}
            onMouseUp={() => window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }))}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'suck', x, y } }));
            }}
            onTouchEnd={() => window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }))}
            style={{
              position: 'absolute',
              left: '80%',
              width: '11%',
              top: '4%',
              height: '35%',
              zIndex: 30,
              userSelect: 'none',
            }}
          />
        </div>

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
