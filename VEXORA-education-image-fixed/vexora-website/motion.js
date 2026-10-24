/* VEXORA cinematic text motion. Independent of Three.js and the site's legacy .reveal styles. */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const targets = [
    '.section-meta', '.display-heading', '.intro-copy', '.intro-bottom',
    '.section-title-row > p', '.service-row', '.services-aside > *',
    '.project', '.project-caption > *', '.work-cta', '.manifesto-label',
    '.manifesto-heading', '.manifesto-foot', '.about-copy > *', '.about-grid > *',
    '.principles > div', '.why-layout > *', '.why-copy li', '.process-step',
    '.collab-content > *', '.contact-copy > *', '.contact-aside',
    '.contact-form > *', '.page-hero-inner > *', '.page-card', '.orbital-card', '.orbital-intro > *', '.page-cta > *', '.footer-main > *', '.footer-links > *', '.footer-bottom > *'
  ];
  const unique = new Set();
  targets.forEach(selector => $$(selector).forEach(el => {
    if (el.closest('.hero') || unique.has(el)) return;
    unique.add(el);
  }));
  const animate = (el, opts = {}) => {
    if (!el || el.dataset.vexoraMotionPlayed === '1') return;
    el.dataset.vexoraMotionPlayed = '1';
    // Remove legacy reveal class so old reduced-motion/transition rules cannot override this animation.
    el.classList.remove('reveal', 'is-visible', 'motion-reveal', 'motion-in');
    const from = opts.from || { opacity: 0, transform: 'translate3d(0, 120px, 0) scale(.92)', filter: 'blur(16px)' };
    const to = { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'blur(0px)' };
    if (el.animate) {
      el.animate([from, to], { duration: opts.duration || 1000, delay: opts.delay || 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    } else {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none';
    }
  };
  // Make content visible by default if JS/observer support is missing.
  unique.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none'; });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...(el.parentElement?.children || [])].filter(n => unique.has(n));
      const i = Math.max(0, siblings.indexOf(el));
      let from = { opacity: 0, transform: 'translate3d(0,120px,0) scale(.92)', filter: 'blur(16px)' };
      if (el.matches('.service-row')) from = { opacity: 0, transform: 'translate3d(-150px,65px,0)', filter: 'blur(14px)' };
      if (el.matches('.project')) from = { opacity: 0, transform: 'translate3d(0,165px,0) scale(.86)', filter: 'blur(18px)', clipPath: 'inset(16% 0 0 0)' };
      if (el.matches('.process-step')) from = { opacity: 0, transform: 'translate3d(0,110px,0) rotateX(12deg)', filter: 'blur(14px)' };
      if (el.matches('.contact-form')) from = { opacity: 0, transform: 'translate3d(150px,60px,0)', filter: 'blur(16px)' };
      animate(el, { from, duration: 1000, delay: Math.min(i * 120, 480) });
      observer.unobserve(el);
    }), { threshold: .04, rootMargin: '0px 0px -3% 0px' });
    unique.forEach(el => observer.observe(el));
  } else unique.forEach(el => animate(el));

  // Cinematic hero sequence; Three.js canvas and animation code are untouched.
  const hero = $('.hero');
  if (hero) {
    const sequence = [$('.hero .eyebrow'), ...$$('.hero-title .title-line'), $('.hero-description'), $('.hero-actions'), $('.hero-foot')].filter(Boolean);
    sequence.forEach((el, i) => {
      el.classList.remove('reveal', 'is-visible');
      el.style.opacity = '0'; el.style.transform = 'translate3d(0,115px,0) scale(.94)'; el.style.filter = 'blur(18px)';
      setTimeout(() => animate(el, { from: { opacity: 0, transform: 'translate3d(0,115px,0) scale(.94)', filter: 'blur(18px)' }, duration: 1000 }), 300 + i * 180);
    });
  }
})();
