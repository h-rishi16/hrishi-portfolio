import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Academics from './components/Academics';
import About from './components/About';
import Contact from './components/Contact';
import Stars from './components/Stars';
import Cursor from './components/Cursor';
import Supernova from './components/Supernova';
import BlackHole from './components/BlackHole';
import { triggerGravity } from './utils/gravity';

function App() {
  const [isInverted, setIsInverted] = useState(false);
  const [eggState, setEggState] = useState('normal');
  const [supernovaOrigin, setSupernovaOrigin] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });
  const [blackHoleOrigin, setBlackHoleOrigin] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  });
  const [resetKey, setResetKey] = useState(0);
  const blackHoleTimerRef = useRef(null);

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
          if (e.detail.x !== undefined && e.detail.y !== undefined) {
            setSupernovaOrigin({ x: e.detail.x, y: e.detail.y });
          }
          setEggState('supernova_charge');

          setTimeout(() => {
            setEggState('supernova_explode');
            window.dispatchEvent(
              new CustomEvent('EASTER_EGG', {
                detail: { state: 'supernova_explode' },
              })
            );

            // Invert colors during the blast flash
            setTimeout(() => {
              setIsInverted((prev) => !prev);
            }, 150);

            // Allow the explosion & pixel star ejecta to disperse (900ms) before returning eggState to normal
            setTimeout(() => {
              setEggState('normal');
              window.dispatchEvent(
                new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } })
              );
            }, 900);
          }, 1850);
        } else if (e.detail.state === 'suck') {
          if (e.detail.x !== undefined && e.detail.y !== undefined) {
            setBlackHoleOrigin({ x: e.detail.x, y: e.detail.y });
          }
          setEggState('suck');

          // During 5 seconds the stars are getting sucked, and after 5 sec it explodes and resets!
          if (blackHoleTimerRef.current) clearTimeout(blackHoleTimerRef.current);
          blackHoleTimerRef.current = setTimeout(() => {
            setEggState('blackhole_explode');
            window.dispatchEvent(
              new CustomEvent('EASTER_EGG', {
                detail: { state: 'blackhole_explode' },
              })
            );

            // Explosion plays out for 900ms, then resets cleanly back to normal
            setTimeout(() => {
              setEggState('normal');
              window.dispatchEvent(
                new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } })
              );
            }, 900);
          }, 5000);
        } else if (e.detail.state === 'normal') {
          if (blackHoleTimerRef.current) {
            clearTimeout(blackHoleTimerRef.current);
            blackHoleTimerRef.current = null;
          }

          setEggState((prev) => {
            if (prev === 'suck') {
              // Trigger brief Hawking radiation release flash if released before 5s
              setTimeout(() => {
                setEggState('normal');
                window.dispatchEvent(
                  new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } })
                );
              }, 280);
              return 'hawking_burst';
            }
            if (prev === 'blackhole_explode') {
              return prev; // let explosion complete its 900ms reset
            }
            return 'normal';
          });
        }
      }
    };
    window.addEventListener('EASTER_EGG', handleEgg);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (blackHoleTimerRef.current) clearTimeout(blackHoleTimerRef.current);
      window.removeEventListener('EASTER_EGG', handleEgg);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Global safety hook: Ensure releasing mouse anywhere before 5s smoothly releases the black hole
  useEffect(() => {
    if (eggState !== 'suck') return;

    const handleGlobalRelease = () => {
      window.dispatchEvent(new CustomEvent('EASTER_EGG', { detail: { state: 'normal' } }));
    };

    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    return () => {
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
    };
  }, [eggState]);

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

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        smoothScrollTo(0);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          const top = hash === 'contact'
            ? element.getBoundingClientRect().top + window.scrollY
            : Math.max(0, element.getBoundingClientRect().top + window.scrollY - 70);
          smoothScrollTo(top);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (e.currentTarget && typeof e.currentTarget.blur === 'function') {
      e.currentTarget.blur();
    }

    if (id === 'top') {
      window.history.pushState(null, '', window.location.pathname);
      smoothScrollTo(0);
      return;
    }

    window.history.pushState(null, '', `#${id}`);

    const element = document.getElementById(id);
    if (element) {
      // Contact is a full-viewport (100vh) section with centered content and a footer at the bottom.
      // Align exactly to the element's top boundary so it perfectly fills the screen without cutting off the footer.
      const top = id === 'contact'
        ? element.getBoundingClientRect().top + window.scrollY
        : Math.max(0, element.getBoundingClientRect().top + window.scrollY - 70);
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
      <Supernova state={eggState} origin={supernovaOrigin} />
      <BlackHole state={eggState} origin={blackHoleOrigin} />
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
