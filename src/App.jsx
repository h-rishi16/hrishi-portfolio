import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
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
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
    });
    lenis.resize();
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleScrollKeys = (e) => {
      const tag = document.activeElement?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) {
        return;
      }

      const ARROW_STEP = 100;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentTarget = (lenis.isScrolling ? lenis.targetScroll : lenis.scroll) ?? lenis.scroll ?? 0;
        const maxScroll = lenis.limit || (document.documentElement.scrollHeight - window.innerHeight);
        const target = Math.min(currentTarget + ARROW_STEP, maxScroll);
        lenis.scrollTo(target, {
          lerp: 0.18,
          lock: false,
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentTarget = (lenis.isScrolling ? lenis.targetScroll : lenis.scroll) ?? lenis.scroll ?? 0;
        const target = Math.max(currentTarget - ARROW_STEP, 0);
        lenis.scrollTo(target, {
          lerp: 0.18,
          lock: false,
        });
      } else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        const currentTarget = (lenis.isScrolling ? lenis.targetScroll : lenis.scroll) ?? lenis.scroll ?? 0;
        const maxScroll = lenis.limit || (document.documentElement.scrollHeight - window.innerHeight);
        const target = Math.min(currentTarget + window.innerHeight * 0.8, maxScroll);
        lenis.scrollTo(target, {
          lerp: 0.12,
          lock: false,
        });
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        const currentTarget = (lenis.isScrolling ? lenis.targetScroll : lenis.scroll) ?? lenis.scroll ?? 0;
        const target = Math.max(currentTarget - window.innerHeight * 0.8, 0);
        lenis.scrollTo(target, {
          lerp: 0.12,
          lock: false,
        });
      } else if (e.key === 'Home') {
        e.preventDefault();
        lenis.scrollTo(0, { lerp: 0.14 });
      } else if (e.key === 'End') {
        e.preventDefault();
        lenis.scrollTo(lenis.limit, { lerp: 0.14 });
      }
    };

    window.addEventListener('keydown', handleScrollKeys);

    return () => {
      window.removeEventListener('keydown', handleScrollKeys);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      setTimeout(() => {
        lenisRef.current?.resize();
      }, 50);
    }
  }, [resetKey]);

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

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        offset: -60,
        duration: 0.35,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
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
            onClick={(e) => {
              e.preventDefault();
              if (lenisRef.current) {
                lenisRef.current.scrollTo(0, {
                  duration: 0.35,
                  easing: (t) => 1 - Math.pow(1 - t, 3),
                });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
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
