import React from 'react';
import { motion } from 'framer-motion';

const projectData = [
  {
    title: 'OURE (Orbital Engine)',
    category: 'Aerospace Engineering',
    description: 'Orbital Uncertainty & Risk Engine (OURE) for LEO collision avoidance. Features SGP4 propagation and Monte Carlo Pc estimation.',
    tech: ['Python', 'SciPy', 'Celery', 'Docker'],
    link: 'https://github.com/h-rishi16/OURE',
    demoLink: 'https://oure-pi.vercel.app'
  },
  {
    title: 'Sentinel Risk Intelligence',
    category: 'Financial Engineering',
    description: 'A high-performance quantitative risk management terminal for real-time fraud detection, credit risk modeling, and Monte Carlo VaR forecasting.',
    tech: ['Python', 'FastAPI', 'HTMX', 'Tailwind', 'XGBoost'],
    link: 'https://github.com/h-rishi16/sentinel',
    demoLink: 'https://sentinel-risk-platform.onrender.com/'
  },
  {
    title: 'Loan Default Risk',
    category: 'Machine Learning',
    description: 'Predictive ML solution for LendingClub data using XGBoost. Enhanced transparency with SHAP-based feature importance.',
    tech: ['Python', 'XGBoost', 'Logistic Regression', 'SHAP'],
    link: 'https://github.com/h-rishi16/Loan-Default-Prediction'
  },
  {
    title: 'Credit Card Fraud',
    category: 'Data Science',
    description: 'Fraud detection system utilizing an optimized XGBoost model with dual-mode integration for real transactions and custom inputs.',
    tech: ['Machine Learning', 'XGBoost', 'Data Analytics', 'Python'],
    link: 'https://github.com/h-rishi16/Credit-Card-Fraud-Prediction'
  },
  {
    title: 'Quantitative Risk Platform',
    category: 'Financial Engineering',
    description: 'Comprehensive risk assessment and quantitative modeling platform for financial decision-making and asset analysis.',
    tech: ['Python', 'Pandas', 'NumPy', 'Financial Modeling'],
    link: 'https://github.com/h-rishi16/Quantitative-Risk-Platform'
  }
];

const Projects = () => {
  return (
    <section id="projects" className="section container">
      <motion.h2 
        className="heading-lg" 
        style={{ textAlign: 'center', marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        Projects
      </motion.h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', maxWidth: '800px', margin: '0 auto' }}>
          {projectData.map((p, i) => (
            <motion.div 
              key={i} 
              style={{ display: 'flex', flexDirection: 'column' }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '12px', height: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                </span>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0, fontWeight: 500 }}>
                  {p.category}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  <span className="text-silver-gradient">{p.title}</span>
                </h3>
                
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
                  {p.demoLink && (
                    <a href={p.demoLink} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '2px' }}>
                      Live Demo ↗
                    </a>
                  )}
                  {p.link !== '#' && (
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '1rem', maxWidth: '700px' }}>
                {p.description}
              </p>
              
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
                {p.tech.join('  /  ')}
              </p>
            </motion.div>
          ))}
        </div>
    </section>
  );
};

export default Projects;
