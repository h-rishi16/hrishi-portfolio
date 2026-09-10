import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Academics from './components/Academics';
import About from './components/About';
import Contact from './components/Contact';
import Stars from './components/Stars';
import Cursor from './components/Cursor';
import { triggerGravity } from './utils/gravity';

function App() {
  const [isInverted, setIsInverted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState('white');
  const [eggState, setEggState] = useState('normal');
  const [implosionOrigin, setImplosionOrigin] = useState({ x: 0, y: 0 });
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const handleReset = () => setResetKey(prev => prev + 1);
    window.addEventListener('RESET_DOM', handleReset);
    return () => window.removeEventListener('RESET_DOM', handleReset);
  }, []);

  useEffect(() => {
    let konamiCode = '';
    const handleKeyDown = (e) => {
      if (e.key.length === 1) {
        konamiCode += e.key.toLowerCase();
        if (konamiCode.length > 20) konamiCode = konamiCode.slice(-20);
        
        if (konamiCode.includes('antigravity')) {
          triggerGravity(true);
          konamiCode = '';
        } else if (konamiCode.includes('gravity')) {
          triggerGravity(false);
          konamiCode = '';
        }
      }
    };

    const handleEgg = (e) => {
      if (e.detail) {
        if (e.detail.state === 'supernova_charge') {
          setImplosionOrigin({ x: e.detail.x, y: e.detail.y });
          setEggState('supernova_charge');
          
          setTimeout(() => {
            setFlashColor(isInverted ? 'black' : 'white');
            setIsFlashing(true);
            setEggState('supernova_explode');
            window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'supernova_explode' } }));
            setTimeout(() => {
              setIsInverted(prev => !prev);
              setEggState('normal');
              window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }));
              setTimeout(() => {
                setIsFlashing(false);
              }, 800); 
            }, 200); 
          }, 2000);
        } else if (e.detail.state === 'normal') {
          setEggState('normal');
        }
      }
    };
    window.addEventListener('EASTER_EGG', handleEgg);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('EASTER_EGG', handleEgg);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInverted]);

  useEffect(() => {
    document.documentElement.style.filter = '';
    document.documentElement.style.transition = '';
    document.documentElement.style.backgroundColor = '';
  }, []);

  return (
    <div key={resetKey} className={`app ${eggState === 'supernova_charge' ? 'charging-elements' : ''}`}>
      {isInverted && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'white',
          mixBlendMode: 'difference',
          zIndex: 999998,
          pointerEvents: 'none'
        }} />
      )}
      {isFlashing && (
        <div style={{ 
          position: 'fixed', inset: 0, backgroundColor: flashColor, zIndex: 999999, 
          animation: 'flashAnim 0.8s ease-out forwards', pointerEvents: 'none' 
        }} />
      )}
      <Cursor />
      <Stars />
      <header>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#" style={{ fontWeight: 700, fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)', textDecoration: 'none' }}>Hrishi.</a>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#academics" className="nav-link">Academics</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Projects />
        <Academics />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default App;
