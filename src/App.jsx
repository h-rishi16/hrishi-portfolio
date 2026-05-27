import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Academics from './components/Academics';
import About from './components/About';
import Contact from './components/Contact';
import SpaceTimeGrid from './components/SpaceTimeGrid';
import Stars from './components/Stars';
import Cursor from './components/Cursor';

function App() {
  return (
    <div className="app">
      <Cursor />
      <Stars />
      <SpaceTimeGrid />
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
      
      <footer style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} Hrishikesh Joshi. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
