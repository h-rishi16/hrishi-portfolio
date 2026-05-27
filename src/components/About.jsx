import React from 'react';
import { motion } from 'framer-motion';
const About = () => {
  const skills = [
    'Python', 'Machine Learning', 'Data Science', 'Model Explainability', 
    'Analytics', 'Problem Solving', 'Teamwork', 'Communication'
  ];

  return (
    <section id="about" className="section container">
      <motion.h2 
        className="heading-lg" 
        style={{ textAlign: 'center', marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        About Me
      </motion.h2>
        
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.h3 
            className="text-silver-gradient" 
            style={{ fontSize: '1.5rem', marginBottom: '3rem', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.5 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
          >
            I am Hrishikesh Joshi, a motivated and detail-oriented Computer Science student with hands-on experience in machine learning, data analysis, and software development.
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ width: '12px', height: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
              </span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0, fontWeight: 500 }}>
                CORE CAPABILITIES
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {skills.map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontFamily: '"SF Mono", "Fira Code", monospace', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
    </section>
  );
};

export default About;
