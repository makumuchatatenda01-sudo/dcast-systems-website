/* DCAST PREMIUM COMPANY PROFILE — SCROLL REVEAL + SUBTLE PARALLAX */
(function(){
  'use strict';

  function init(){
    var section=document.querySelector('[data-company-profile]');
    if(!section) return;

    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items=section.querySelectorAll('.dcast-profile-reveal');

    if(reduce || !('IntersectionObserver' in window)){
      items.forEach(function(item){item.classList.add('is-visible');});
      return;
    }

    var revealObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});

    items.forEach(function(item){revealObserver.observe(item);});

    var visual=section.querySelector('[data-profile-parallax]');
    if(!visual) return;

    var frame=0;
    function updateParallax(){
      frame=0;
      var rect=visual.getBoundingClientRect();
      if(rect.bottom<0 || rect.top>window.innerHeight) return;
      var centre=rect.top+(rect.height/2);
      var distance=(window.innerHeight/2)-centre;
      var shift=Math.max(-18,Math.min(18,distance*.035));
      visual.style.setProperty('--profile-shift',shift.toFixed(1)+'px');
    }
    function requestParallax(){
      if(frame) return;
      frame=window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll',requestParallax,{passive:true});
    window.addEventListener('resize',requestParallax,{passive:true});
    requestParallax();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();