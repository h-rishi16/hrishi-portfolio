import { useState, useEffect } from 'react';
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

  const smoothScrollTo = (targetY) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) return;

    // Calibrated duration based on travel distance:
    // Short hops (600px) take ~400ms; long cross-page leaps (3000px) take ~720ms.
    // This caps peak velocity at ~4,000 px/sec, perfectly within Safari's GPU tile rasterization rate.
    const duration = Math.min(750, Math.max(380, Math.abs(diff) * 0.16 + 280));
    let startTime = null;
    let animationId = null;

    const cancel = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
    };

    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchmove', cancel, { passive: true, once: true });

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-in-out curve
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + diff * ease);

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else {
        cancel();
      }
    };

    animationId = requestAnimationFrame(step);
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (id === 'top') {
      smoothScrollTo(0);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 70);
      smoothScrollTo(top);
    }
  };

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
          <a
            href="#"
            onClick={(e) => handleNavClick(e, 'top')}
            style={{ fontWeight: 700, fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)', textDecoration: 'none' }}
          >
            Hrishi.
          </a>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="nav-link">Projects</a>
            <a href="#academics" onClick={(e) => handleNavClick(e, 'academics')} className="nav-link">Academics</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">About</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">Contact</a>
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
