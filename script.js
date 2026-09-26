const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Reveal sections as they enter the viewport.
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Mobile navigation.
const menuButton = $('.menu-button');
const mainNav = $('.main-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
$$('.nav-link').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

// Highlight the section currently in view.
const sections = $$('main section[id]');
const navLinks = $$('.nav-link');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Interactive 3D hero: move the sculpture gently with the pointer.
const scene = $('#scene');
const orbitalSystem = $('.orbital-system');
if (scene && orbitalSystem && window.matchMedia('(pointer: fine)').matches) {
  scene.addEventListener('pointermove', (event) => {
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    orbitalSystem.style.setProperty('--rotate-x', `${y * -16 - 5}deg`);
    orbitalSystem.style.setProperty('--rotate-y', `${x * 25 - 10}deg`);
  });
  scene.addEventListener('pointerleave', () => {
    orbitalSystem.style.setProperty('--rotate-x', '-7deg');
    orbitalSystem.style.setProperty('--rotate-y', '-18deg');
  });
}

// Let the user restart the hero animation whenever they want.
$('#replay-scene')?.addEventListener('click', () => {
  const animated = [orbitalSystem, $('.core'), ...$$('.orbit-dot'), ...$$('.data-bars i')].filter(Boolean);
  animated.forEach((element) => {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  });
});

// Small magnetic cursor interaction for desktop.
const cursorDot = $('.cursor-dot');
const cursorRing = $('.cursor-ring');
if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
  const followCursor = () => {
    ringX += (mouseX - ringX) * .16;
    ringY += (mouseY - ringY) * .16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(followCursor);
  };
  followCursor();
  $$('a, button, input, textarea').forEach((element) => {
    element.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    element.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });
}

// Project details modal.
const projects = {
  pulse: {
    number: '01',
    title: 'Retail pulse',
    description: 'A responsive dashboard concept that turns a week of retail activity into one calm, readable point of view. The visual language pairs an honest data hierarchy with a live-system energy.',
    role: 'Analysis + UI direction',
    stack: 'Power BI · Figma',
    outcome: 'One clear weekly signal',
  },
  atlas: {
    number: '02',
    title: 'Sentiment atlas',
    description: 'An exploratory visual system for mapping the emotional texture of customer feedback. Instead of hiding qualitative nuance behind a single score, it lets patterns orbit in context.',
    role: 'Data story + visualization',
    stack: 'Python · D3 thinking',
    outcome: '128k signals, made human',
  },
  motion: {
    number: '03',
    title: 'Form in motion',
    description: 'A playful 3D study about the moment information becomes memorable. A small experiment in geometry, timing and the idea that a useful thing can still have a pulse.',
    role: 'Creative coding + 3D',
    stack: 'CSS · Blender mindset',
    outcome: 'A story you can feel',
  },
};
const modal = $('#project-modal');
const openProject = (key) => {
  const project = projects[key];
  if (!project || !modal) return;
  $('#modal-number').textContent = project.number;
  $('#modal-title').textContent = project.title;
  $('#modal-description').textContent = project.description;
  $('#modal-role').textContent = project.role;
  $('#modal-stack').textContent = project.stack;
  $('#modal-outcome').textContent = project.outcome;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  $('.modal-close', modal)?.focus();
};
$$('.project-card').forEach((card) => {
  $('.project-open', card)?.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('dblclick', () => openProject(card.dataset.project));
});
const closeModal = () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};
$$('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// The contact form is intentionally front-end only; it gives immediate feedback.
$('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $('.form-status', form);
  status.textContent = 'Signal received — I will be in touch soon.';
  form.reset();
});

$('#year').textContent = new Date().getFullYear();
