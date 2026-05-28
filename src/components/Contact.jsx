import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="section container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="heading-lg">Let's build something.</h2>
        <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto 3rem', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Bengaluru, India
        </p>
        
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <a href="mailto:hrishirjoshi16324@gmail.com" className="nav-link" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Email ↗</a>
          <a href="https://github.com/h-rishi16" target="_blank" rel="noreferrer" className="nav-link" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>GitHub ↗</a>
          <a href="https://www.linkedin.com/in/hrishikesh-joshi-93607b23a" target="_blank" rel="noreferrer" className="nav-link" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>LinkedIn ↗</a>
        </div>
      </motion.div>
      
      <footer style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} Hrishikesh Joshi. All rights reserved.
        </p>
      </footer>
    </section>
  );
};

export default Contact;
