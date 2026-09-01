/* Enhance the eight-logo list without hiding its no-JavaScript fallback. */
(function () {
  'use strict';
  function initClientBrands() {
    document.querySelectorAll('[data-client-brands]').forEach(function (section) {
      if (section.dataset.clientBrandsReady) return;
      var track = section.querySelector('.dcast-client-brands__track');
      var original = section.querySelector('.dcast-client-brands__group');
      var toggle = section.querySelector('.dcast-client-brands__toggle');
      if (!track || !original || !toggle) return;
      section.dataset.clientBrandsReady = 'true';

      var duplicate = original.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.setAttribute('data-clone', '');
      duplicate.removeAttribute('id');
      duplicate.querySelectorAll('[id]').forEach(function (node) { node.removeAttribute('id'); });
      duplicate.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
      track.appendChild(duplicate);
      section.classList.add('is-ready');

      var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      function updateMotion() {
        section.classList.toggle('is-reduced-motion', motion.matches);
        toggle.hidden = motion.matches;
      }
      updateMotion();
      if (motion.addEventListener) motion.addEventListener('change', updateMotion);
      else if (motion.addListener) motion.addListener(updateMotion);

      toggle.addEventListener('click', function () {
        var paused = section.classList.toggle('is-paused');
        toggle.querySelector('[data-motion-label]').textContent = paused ? 'Play logos' : 'Pause logos';
        toggle.querySelector('[data-motion-icon]').textContent = paused ? '\u25b6' : '\u2161';
      });

      function updateVisibility() {
        section.classList.toggle('is-document-hidden', document.hidden);
      }
      updateVisibility();
      document.addEventListener('visibilitychange', updateVisibility);

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            section.classList.toggle('is-offscreen', !entry.isIntersecting);
          });
        }, { threshold: 0 });
        observer.observe(section);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initClientBrands, { once: true });
  else initClientBrands();
})();
