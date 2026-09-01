/* DCAST Systems service deep links. No forms or hero effects are changed. */
(function(){
"use strict";
const systemsPath="/security-systems/";
const ids=new Set(["cctv-installation","access-control","alarm-systems","electric-fence","fibre-installation","boomgates","mantrap-doors","fire-suppression"]);
const onSystems=location.pathname===systemsPath;
const root=document.documentElement;
const menu=document.querySelector(".nav-systems-menu");
const mobile=document.getElementById("mmenu");
const burger=document.getElementById("burger");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
let highlightTimer=0;
let initialInterrupted=false;
function offset(){
 const nav=document.querySelector(".navwrap");
 const bottom=nav?nav.getBoundingClientRect().bottom:90;
 root.style.setProperty("--dcast-service-offset",Math.ceil(Math.max(80,bottom)+22)+"px");
}
function targetFor(hash){
 let id;
 try{id=decodeURIComponent(hash.slice(1));}catch(e){return null;}
 if(id!=="systems"&&!ids.has(id))return null;
 return document.getElementById(id);
}
function mark(hash){
 document.querySelectorAll('a[href^="/security-systems/#"]').forEach(function(a){
  if(a.hash===hash){a.setAttribute("aria-current","location");}
  else{a.removeAttribute("aria-current");}
 });
 if(onSystems&&menu){
  const parent=menu.querySelector(":scope > a");
  if(parent){parent.classList.add("active");parent.setAttribute("aria-current","page");}
 }
}
function closeMenus(){
 if(mobile){mobile.classList.remove("open");mobile.querySelectorAll("details[open]").forEach(d=>d.open=false);}
 if(burger){burger.classList.remove("open");burger.setAttribute("aria-expanded","false");}
 if(menu){menu.classList.add("dcast-menu-dismissed");}
}
function reveal(hash,smooth,focus){
 if(!onSystems)return false;
 const target=targetFor(hash);
 if(!target){mark("");return false;}
 offset(); mark(hash);
 target.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));
 target.classList.add("in");
 document.querySelectorAll(".is-service-target").forEach(el=>el.classList.remove("is-service-target"));
 clearTimeout(highlightTimer);
 if(target.classList.contains("sys-service-detail")){
  void target.offsetWidth;
  target.classList.add("is-service-target");
  highlightTimer=setTimeout(()=>target.classList.remove("is-service-target"),2200);
 }
 target.scrollIntoView({block:"start",behavior:smooth&&!reduce.matches?"smooth":"instant"});
 if(focus){
  const heading=target.querySelector("h3, h2");
  if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}
 }
 return true;
}
offset();
window.addEventListener("resize",offset,{passive:true});
if(menu){
 const trigger=menu.querySelector(":scope > a");
 if(trigger){
  trigger.addEventListener("pointerenter",()=>menu.classList.remove("dcast-menu-dismissed"));
  trigger.addEventListener("pointermove",()=>menu.classList.remove("dcast-menu-dismissed"));
 }
 menu.addEventListener("pointerleave",()=>menu.classList.remove("dcast-menu-dismissed"));
 menu.addEventListener("pointerenter",()=>menu.classList.remove("dcast-menu-dismissed"));
 menu.addEventListener("focusin",()=>menu.classList.remove("dcast-menu-dismissed"));
 menu.addEventListener("keydown",function(event){
  if(event.key==="Escape"){
   const parent=menu.querySelector(":scope > a");
   if(parent)parent.focus();
   menu.classList.add("dcast-menu-dismissed");
  }
 });
}
if(burger){
 burger.setAttribute("aria-controls","mmenu");
 burger.setAttribute("aria-expanded",String(!!mobile&&mobile.classList.contains("open")));
 burger.addEventListener("click",()=>burger.setAttribute("aria-expanded",String(!!mobile&&mobile.classList.contains("open"))));
}
document.addEventListener("click",function(event){
 if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const a=event.target.closest&&event.target.closest("a[href]");
 if(!a||a.target==="_blank"||a.hasAttribute("download"))return;
 const url=new URL(a.href,location.href);
 if(!onSystems||url.origin!==location.origin||url.pathname!==systemsPath||!targetFor(url.hash))return;
 event.preventDefault();
 initialInterrupted=true;
 closeMenus();
 if(location.hash!==url.hash)history.pushState(null,"",url.pathname+url.search+url.hash);
 reveal(url.hash,true,true);
});
if(onSystems){
 const stopInitial=()=>{initialInterrupted=true;};
 window.addEventListener("wheel",stopInitial,{passive:true,once:true});
 window.addEventListener("touchstart",stopInitial,{passive:true,once:true});
 window.addEventListener("keydown",stopInitial,{once:true});
 function initial(){if(!initialInterrupted)reveal(location.hash,false,true);}
 requestAnimationFrame(initial);
 if(document.readyState==="complete")initial();
 else window.addEventListener("load",initial,{once:true});
 if(document.fonts)document.fonts.ready.then(initial);
 window.addEventListener("hashchange",()=>{closeMenus();reveal(location.hash,false,true);});
 window.addEventListener("popstate",()=>{closeMenus();reveal(location.hash,false,true);});
 mark(location.hash);
}
})();
