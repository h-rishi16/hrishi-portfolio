import React from 'react';
import { motion } from 'framer-motion';
const academicData = [
  {
    tag: 'DEGREE',
    title: 'Bachelor of Computer Engineering',
    institution: 'Savitribai Phule Pune University',
    years: '2022 - 2026'
  },
  {
    tag: 'HIGHER SECONDARY',
    title: '12th Grade',
    institution: 'Narayana Junior College',
    years: '2020 - 2022'
  },
  {
    tag: 'SECONDARY',
    title: 'High School',
    institution: 'Omkar English Medium School (CBSE)',
    years: '2020'
  }
];

const Academics = () => {
  return (
    <section id="academics" className="section container">
      <motion.h2 
        className="heading-lg" 
        style={{ textAlign: 'center', marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        Academics
      </motion.h2>
        
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {academicData.map((edu, i) => (
          <motion.div 
            key={i}
            style={{ display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ width: '12px', height: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
              </span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0, fontWeight: 500 }}>
                {edu.tag}
              </p>
            </div>
            
            <h3 className="text-silver-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {edu.title}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 400, margin: 0, color: 'var(--text-secondary)' }}>
                {edu.institution}
              </h4>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                {edu.years}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Academics;
