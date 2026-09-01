/* Scoped to the existing homepage badge; no changes to other reveal effects. */
(function(){
  "use strict";
  const seal=document.getElementById("dcastSeal");
  if(!seal||!("IntersectionObserver" in window))return;
  const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  let entered=false;
  const observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      const visible=entry.isIntersecting&&entry.intersectionRatio>=.6;
      if(visible&&!entered){
        entered=true;
        seal.classList.remove("in-view");
        if(!motion.matches){
          void seal.offsetWidth;
          seal.classList.add("in-view");
        }
      }else if(!visible){
        entered=false;
        seal.classList.remove("in-view");
      }
    });
  },{threshold:[0,.6]});
  observer.observe(seal);
  if(motion.addEventListener)motion.addEventListener("change",function(){
    if(motion.matches)seal.classList.remove("in-view");
  });
})();
