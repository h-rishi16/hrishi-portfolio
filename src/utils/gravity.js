import Matter from 'matter-js';

let runnerRef = null;
let bodiesRef = [];
let updateLoopId = null;
let startScrollY = 0;

export const triggerGravity = (turnOn = true) => {
  if (turnOn) {
    if (window.physicsRunning) return;
    window.physicsRunning = true;
    startScrollY = window.scrollY;
  } else {
    if (!window.physicsRunning) return;
    
    if (runnerRef) Matter.Runner.stop(runnerRef);
    if (updateLoopId) cancelAnimationFrame(updateLoopId);
    
    window.scrollTo({ top: startScrollY, behavior: 'smooth' });

    bodiesRef.forEach(({ el, originalX, originalY }) => {
      el.style.transition = 'transform 1.5s cubic-bezier(0.5, 0, 0.2, 1)';
      el.style.transform = `translate(${originalX}px, ${originalY}px) rotate(0deg)`;
    });

    setTimeout(() => {
      bodiesRef.forEach(({ el }) => el.remove());
      window.dispatchEvent(new CustomEvent('RESET_DOM'));
      
      window.physicsRunning = false;
      runnerRef = null;
      updateLoopId = null;
      bodiesRef = [];
    }, 1500);
    return;
  }

  const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;

  const engine = Engine.create();
  const world = engine.world;

  // Turn off gravity for a zero-g floating effect
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;

  // Split large text blocks into individual words
  const textContainers = document.querySelectorAll('h1, h2, h3, p, li, a');
  
  // Freeze container dimensions before modifying text to prevent flexbox shrink-wrap collapse
  textContainers.forEach(container => {
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      container.style.width = `${rect.width}px`;
      container.style.height = `${rect.height}px`;
    }
  });

  const textNodes = [];
  
  textContainers.forEach(container => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() !== '') {
        textNodes.push(node);
      }
    }
  });

  textNodes.forEach(textNode => {
    const text = textNode.nodeValue;
    const words = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    let hasWord = false;
    
    words.forEach(word => {
      if (word.trim() === '') {
        fragment.appendChild(document.createTextNode(word));
      } else {
        const span = document.createElement('span');
        span.className = 'physics-word';
        span.style.display = 'inline-block';
        span.textContent = word;
        
        // Copy text gradient classes from parent so it doesn't become invisible
        if (textNode.parentNode && textNode.parentNode.className && typeof textNode.parentNode.className === 'string') {
          if (textNode.parentNode.className.includes('gradient')) {
            span.className += ' ' + textNode.parentNode.className;
          }
        }
        
        // Fallback color from parent
        try {
          span.style.color = window.getComputedStyle(textNode.parentNode).color;
        } catch(e) {}

        fragment.appendChild(span);
        hasWord = true;
      }
    });
    
    if (hasWord) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });

  const selectors = '.physics-word, .project-card, .skill-badge, img, button';
  const rawElements = Array.from(document.querySelectorAll(selectors)).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 5 && rect.height > 5 && window.getComputedStyle(el).display !== 'none';
  });

  // Calculate ALL rects and styles BEFORE detaching anything to prevent layout collapse
  const elementData = rawElements.map(el => ({
    el,
    rect: el.getBoundingClientRect(),
    computed: {
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight,
      color: window.getComputedStyle(el).color,
      fontFamily: window.getComputedStyle(el).fontFamily,
      lineHeight: window.getComputedStyle(el).lineHeight,
      letterSpacing: window.getComputedStyle(el).letterSpacing,
      textTransform: window.getComputedStyle(el).textTransform
    }
  }));

  const bodies = [];

  elementData.forEach(({ el, rect, computed }) => {
    // Bake inherited font styles inline before we detach them from their parent tags
    el.style.fontSize = computed.fontSize;
    el.style.fontWeight = computed.fontWeight;
    el.style.color = computed.color;
    el.style.fontFamily = computed.fontFamily;
    el.style.lineHeight = computed.lineHeight;
    el.style.letterSpacing = computed.letterSpacing;
    el.style.textTransform = computed.textTransform;
    
    const body = Bodies.rectangle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      rect.width,
      rect.height,
      {
        restitution: 1, // Perfectly bouncy
        friction: 0.1,
        frictionAir: 0, // No air resistance, float forever
        frictionStatic: 0,
        density: 0.001
      }
    );

    // Initial gentle random push
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.position = 'fixed';
    el.style.margin = '0';
    el.style.zIndex = 10000;
    el.style.transformOrigin = 'center center';
    el.style.top = '0px';
    el.style.left = '0px';
    
    document.body.appendChild(el);

    bodies.push({ body, el, originalX: rect.left, originalY: rect.top });
    Composite.add(world, body);
  });
  
  bodiesRef = bodies;

  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth * 2, 100, { isStatic: true, restitution: 1, friction: 0 });
  const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true, restitution: 1, friction: 0 });
  const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight * 2, { isStatic: true, restitution: 1, friction: 0 });
  const ceiling = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth * 2, 100, { isStatic: true, restitution: 1, friction: 0 });
  
  Composite.add(world, [ground, leftWall, rightWall, ceiling]);

  const mouse = Mouse.create(document.body);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  Composite.add(world, mouseConstraint);

  // Keep mouse in sync with scrolling
  mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
  mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

  const runner = Runner.create();
  runnerRef = runner;
  Runner.run(runner, engine);

  const updateLoop = () => {
    bodies.forEach(({ body, el }) => {
      const x = body.position.x - el.offsetWidth / 2;
      const y = body.position.y - el.offsetHeight / 2;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
    });
    updateLoopId = requestAnimationFrame(updateLoop);
  };
  updateLoop();
};
