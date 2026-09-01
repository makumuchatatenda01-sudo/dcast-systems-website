/* Guarding hero parallax + fade-in */
(function(){
  const page = document.body;
  if (!page || !page.classList.contains('dcast-guarding-page')) return;

  const photo = document.querySelector('.dcast-about-v1-photo');
  const content = document.querySelector('.dcast-about-v1-content');
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (photo && !reducedMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const hero = photo.parentElement;
        if (hero) {
          const rect = hero.getBoundingClientRect();
          const speed = 0.25;
          const offset = rect.top * speed;
          photo.style.transform = `translateZ(0) scale(1.08) translateY(${offset}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  if (content) {
    if (reducedMotion) {
      content.classList.add('in');
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => content.classList.add('in')));
    }
  }
})();
