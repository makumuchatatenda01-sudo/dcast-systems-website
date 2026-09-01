/* DCAST global hero parallax + text fade-in — 2026-08-26 */
(function () {
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const configurations = [
    {
      surface: '.hero',
      photo: '.hero-bg',
      content: ['.hero > .container', '.hero-msg', '.hero-strip']
    },
    {
      surface: '.dcast-about-v1-hero',
      photo: '.dcast-about-v1-photo',
      content: ['.dcast-about-v1-content']
    },
    {
      surface: '.sys-hero',
      content: ['.sys-hero-copy']
    },
    {
      surface: '.dcast-premium-contact-page',
      content: ['.dcast-contact-left']
    },
    {
      surface: '.dcast-page-banner',
      content: ['.dcast-page-banner > .container']
    }
  ];

  const heroes = [];

  configurations.forEach(function (config) {
    document.querySelectorAll(config.surface).forEach(function (surface) {
      const photo = config.photo ? surface.querySelector(config.photo) : null;
      const contents = [];

      config.content.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element) {
          if (!contents.includes(element)) contents.push(element);
        });
      });

      surface.classList.add('dcast-hero-fx-surface');
      if (photo) photo.classList.add('dcast-hero-fx-photo');
      contents.forEach(function (content) {
        content.classList.add('dcast-hero-fx-content');
      });

      heroes.push({ surface: surface, contents: contents });
    });
  });

  const clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  const updateParallax = function () {
    heroes.forEach(function (hero) {
      const rect = hero.surface.getBoundingClientRect();
      const offset = reducedMotion ? 0 : clamp(rect.top * 0.25, -72, 72);
      hero.surface.style.setProperty('--dcast-hero-parallax-y', offset.toFixed(2) + 'px');
    });
  };

  if (!reducedMotion && heroes.length) {
    let ticking = false;
    const requestUpdate = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateParallax();
        ticking = false;
      });
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    updateParallax();
  } else {
    updateParallax();
  }

  setTimeout(function () {
    heroes.forEach(function (hero) {
      hero.contents.forEach(function (content) {
        content.classList.add('in');
      });
    });
  }, reducedMotion ? 0 : 40);
})();
