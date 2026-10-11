/* AUREA motion layer. Plain JavaScript, no libraries. */
(function(){
var D=document,H=D.documentElement,B=D.body;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
var FINE=matchMedia("(hover:hover) and (pointer:fine)").matches;
if(RM){H.classList.remove("pre");return}
H.classList.add("fx");if(FINE)H.classList.add("fine");
var $=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var mx=innerWidth/2,my=innerHeight/2,vel=0,lastY=scrollY,dir=1,hdr=$("header"),noHide=0;

/* ---------- preloader / page wipe in ---------- */
var first=false;try{first=!sessionStorage.fxp;sessionStorage.fxp=1}catch(e){}
var pl=D.createElement("div");pl.className="pl"+(first?"":" q");
pl.innerHTML='<img src="logo-white.png" alt="Aurea"><div class="lnb"><i></i></div>';B.appendChild(pl);
function start(){H.classList.remove("pre");pl.classList.add("out");setTimeout(function(){H.classList.add("go");$$(".hero h1.sp").forEach(function(h){h.classList.add("in")})},first?350:200);setTimeout(function(){pl.remove()},1100)}
if(first){requestAnimationFrame(function(){requestAnimationFrame(function(){pl.classList.add("run")})});setTimeout(start,1900)}else setTimeout(start,80);

/* ---------- page wipe out ---------- */
var pt=D.createElement("div");pt.className="pt";B.appendChild(pt);
D.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");
if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||a.target==="_blank"||a.hasAttribute("download")||a.hasAttribute("data-wa"))return;
var u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname&&u.search===location.search)return;
e.preventDefault();pt.classList.add("on");setTimeout(function(){location.href=a.href},520)});
addEventListener("pageshow",function(e){if(e.persisted)pt.classList.remove("on")});

/* ---------- scroll bar ---------- */
var sb=D.createElement("div");sb.className="scp";B.appendChild(sb);

/* ---------- headline word split + reveal ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.4});
$$("h1,section h2,.cta h2").forEach(function(h){if(h.children.length||h.classList.contains("sp"))return;var t=h.textContent.trim();if(!t)return;
h.setAttribute("aria-label",t);h.classList.add("sp");h.innerHTML=t.split(/\s+/).map(function(w,i){return'<span class="wd" aria-hidden="true"><span style="transition-delay:'+(i*.07)+'s">'+w+'</span></span> '}).join("");
if(!h.closest(".hero"))io.observe(h)});
if(!$(".hero"))setTimeout(function(){$$("h1.sp").forEach(function(h){h.classList.add("in")})},first?2200:500);
/* stagger children of revealed sections */
$$(".cats>*,.why>*,.ol>*,.pick>*,.cta>*,section details").forEach(function(c){var i=[].indexOf.call(c.parentNode.children,c);c.style.setProperty("--d",(.15+i*.1)+"s")});

/* ---------- cursor ---------- */
var cur,cud,cx=mx,cy=my,dx=mx,dy=my;
if(FINE){cur=D.createElement("div");cur.className="cur";cud=D.createElement("div");cud.className="cud";B.appendChild(cur);B.appendChild(cud)}
function state(t){if(!cur)return;var v=t.closest&&t.closest("img[data-z],.card");var h=t.closest&&t.closest("a,button,.cc,.ch,summary,label,select,.ol li");
cur.classList.toggle("v",!!v);cur.classList.toggle("h",!!h&&!v);cur.textContent=v?(v.matches("img")?"Zoom":"View"):""}

/* ---------- pointer: tilt, magnet, cursor ---------- */
var magEl=null,tiltEl=null;
D.addEventListener("pointermove",function(e){mx=e.clientX;my=e.clientY;if(cur){cur.classList.add("on");cud.classList.add("on")}
if(e.pointerType==="touch")return;var t=e.target;if(!t.closest)return;
var m=t.closest(".btn,.ch,.nv a");if(magEl&&magEl!==m){magEl.style.removeProperty("--tx");magEl.style.removeProperty("--ty");magEl=null}
if(m){var r=m.getBoundingClientRect();m.style.setProperty("--tx",((e.clientX-r.left-r.width/2)*.28).toFixed(1)+"px");m.style.setProperty("--ty",((e.clientY-r.top-r.height/2)*.4).toFixed(1)+"px");magEl=m}
var c=t.closest(".cc,.card,.ol li,.hero .w");if(tiltEl&&tiltEl!==c){reset(tiltEl);tiltEl=null}
if(c){var b=c.getBoundingClientRect(),px=(e.clientX-b.left)/b.width,py=(e.clientY-b.top)/b.height,k=c.matches(".hero .w")?3:9;
c.style.setProperty("--ry",((px-.5)*k).toFixed(2)+"deg");c.style.setProperty("--rx",((.5-py)*k).toFixed(2)+"deg");c.style.setProperty("--mx",(px*100)+"%");c.style.setProperty("--my",(py*100)+"%");tiltEl=c}
trail(e)},{passive:true});
function reset(el){el.style.removeProperty("--rx");el.style.removeProperty("--ry")}
D.addEventListener("pointerover",function(e){state(e.target)});
D.addEventListener("pointerdown",function(e){if(cur)cur.classList.add("d");burst(e.clientX,e.clientY,14);var b=e.target.closest&&e.target.closest(".btn");
if(b){var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,i=D.createElement("i");i.className="rp";i.style.cssText="width:"+s+"px;height:"+s+"px;left:"+(e.clientX-r.left-s/2)+"px;top:"+(e.clientY-r.top-s/2)+"px";b.appendChild(i);setTimeout(function(){i.remove()},720)}});
D.addEventListener("pointerup",function(){if(cur)cur.classList.remove("d")});
D.documentElement.addEventListener("mouseleave",function(){if(cur){cur.classList.remove("on");cud.classList.remove("on")}});

/* ---------- add to cart: item flies to the cart ---------- */
D.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button");if(!b||!/^\s*add/i.test(b.textContent)||b.disabled)return;
var src=$(".tile img.mi")||b.closest(".card,.mdl,.modal,[role=dialog]")&&$("img",b.closest(".card,.mdl,.modal,[role=dialog]"))||b;
var tg=$("#cb")||$('a[href$="#cart"]');if(!tg)return;var hh=hdr&&hdr.classList.contains("hd");noHide=Date.now()+1800;if(hh)hdr.classList.remove("hd");var s=src.getBoundingClientRect(),t0=tg.getBoundingClientRect(),t={left:t0.left,top:hh?(hdr.offsetHeight-t0.height)/2:t0.top,width:t0.width,height:t0.height};
var f=D.createElement("div");f.className="fly";if(src.tagName==="IMG")f.style.backgroundImage="url("+src.currentSrc+")";else f.style.background="var(--pop)";
var w=Math.min(Math.max(s.width,60),150);f.style.width=f.style.height=w+"px";f.style.left=(s.left+s.width/2-w/2)+"px";f.style.top=(s.top+s.height/2-w/2)+"px";B.appendChild(f);
var ex=t.left+t.width/2-(s.left+s.width/2),ey=t.top+t.height/2-(s.top+s.height/2);
var an=f.animate([{transform:"translate(0,0) scale(1)",opacity:1},{transform:"translate("+(ex*.5)+"px,"+(Math.min(ey,0)-120)+"px) scale(.7) rotate(120deg)",opacity:1,offset:.45},{transform:"translate("+ex+"px,"+ey+"px) scale(.12) rotate(360deg)",opacity:.9}],{duration:900,easing:"cubic-bezier(.5,0,.3,1)"});
an.onfinish=function(){f.remove();tg.classList.remove("bump");void tg.offsetWidth;tg.classList.add("bump");burst(t.left+t.width/2,t.top+t.height/2,18)}});

/* ---------- header hide / progress / scroll velocity ---------- */
addEventListener("scroll",function(){var y=scrollY;if(Date.now()<noHide)return;if(hdr)hdr.classList.toggle("hd",y>lastY&&y>160);},{passive:true});

/* ---------- marquee ---------- */
var tk=$(".tk"),tkd=tk&&$("div",tk),tx=0,tw=0;
/* ---------- droplets (home page) ---------- */
var bg=$(".bgfix"),cv,cx2,W,Hh,dpr=Math.min(devicePixelRatio||1,1.5),dots=[],parts=[],lastT=null;
if(bg){cv=D.createElement("canvas");cv.className="gel";bg.parentNode.insertBefore(cv,bg.nextSibling);cx2=cv.getContext("2d");
function size(){W=innerWidth;Hh=innerHeight;cv.width=W*dpr;cv.height=Hh*dpr;cx2.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener("resize",size);
var N=innerWidth<700?14:30;for(var i=0;i<N;i++)dots.push(mk(true))}
function mk(any){var r=7+Math.pow(Math.random(),2.2)*34;return{x:Math.random()*innerWidth,y:any?Math.random()*innerHeight:innerHeight+r+Math.random()*200,r:r,vx:0,vy:-(.18+Math.random()*.5)*(1.2-r/60),ph:Math.random()*6.28,sw:.3+Math.random()*.7}}
function trail(e){if(!bg||e.pointerType==="touch")return;var l=trail.l||{x:e.clientX,y:e.clientY},d=Math.hypot(e.clientX-l.x,e.clientY-l.y);if(d<34)return;trail.l={x:e.clientX,y:e.clientY};
parts.push({x:e.clientX,y:e.clientY,r:3+Math.random()*5,vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8+.2,life:1})}
function burst(x,y,n){if(!bg)return;for(var i=0;i<n;i++){var a=Math.random()*6.28,s=1.5+Math.random()*4.5;parts.push({x:x,y:y,r:2+Math.random()*7,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:1})}}
function bubble(x,y,r,a){var g=cx2.createRadialGradient(x-r*.3,y-r*.35,r*.04,x,y,r);g.addColorStop(0,"rgba(255,255,255,"+(.95*a)+")");g.addColorStop(.5,"rgba(255,255,255,"+(.38*a)+")");g.addColorStop(.88,"rgba(255,206,70,"+(.38*a)+")");g.addColorStop(1,"rgba(255,255,255,"+(.7*a)+")");
cx2.fillStyle=g;cx2.beginPath();cx2.arc(x,y,r,0,6.283);cx2.fill();cx2.strokeStyle="rgba(140,95,0,"+(.28*a)+")";cx2.lineWidth=1.2;cx2.stroke();
cx2.fillStyle="rgba(255,255,255,"+a+")";cx2.beginPath();cx2.ellipse(x-r*.36,y-r*.4,r*.22,r*.12,-.7,0,6.283);cx2.fill();
cx2.fillStyle="rgba(255,255,255,"+(.55*a)+")";cx2.beginPath();cx2.arc(x+r*.42,y+r*.45,Math.max(1,r*.07),0,6.283);cx2.fill()}

/* ---------- main loop ---------- */
function frame(t){requestAnimationFrame(frame);if(D.hidden)return;var dt=lastT?Math.min(t-lastT,50)/16.7:1;lastT=t;
var y=scrollY,dv=y-lastY;lastY=y;if(dv)dir=dv>0?1:-1;vel+=(dv-vel)*.12;
var max=D.documentElement.scrollHeight-innerHeight;sb.style.transform="scaleX("+(max>0?y/max:0)+")";
if(cur){cx+=(mx-cx)*.2*dt;cy+=(my-cy)*.2*dt;dx+=(mx-dx)*.9;dy+=(my-dy)*.9;cur.style.transform="translate3d("+cx+"px,"+cy+"px,0)";cud.style.transform="translate3d("+mx+"px,"+my+"px,0)"}
if(tkd){if(!tw)tw=tkd.scrollWidth/2;tx-=(1.1+Math.min(Math.abs(vel),60)*.5)*dir*dt;if(tx<-tw)tx+=tw;if(tx>0)tx-=tw;tkd.style.transform="translate3d("+tx+"px,0,0)";tk.style.transform="skewX("+Math.max(-9,Math.min(9,-vel*.35)).toFixed(2)+"deg)"}
var hw=$(".hero .w");if(hw&&y<innerHeight){hw.style.translate="0 "+(y*.22)+"px";hw.style.opacity=H.classList.contains("go")||!H.classList.contains("pre")?Math.max(0,1-y/(innerHeight*.75)):0}
if(bg){var px=(mx/innerWidth-.5),py=(my/innerHeight-.5);bg.style.setProperty("--bx",(-px*26)+"px");bg.style.setProperty("--by",(-py*18)+"px");bg.style.setProperty("--bs",(1.07+Math.sin(t/5200)*.018+Math.min(y/innerHeight,3)*.045).toFixed(4));
cx2.clearRect(0,0,W,Hh);
dots.forEach(function(d){d.ph+=.012*dt*d.sw;d.x+=Math.sin(d.ph)*.35*dt+d.vx*dt;d.y+=(d.vy-vel*.12)*dt;d.vx*=.94;
var ddx=d.x-mx,ddy=d.y-my,ds=Math.hypot(ddx,ddy),rr=d.r+120;if(ds<rr&&ds>.1){var f=(1-ds/rr)*2.2;d.vx+=ddx/ds*f;d.y+=ddy/ds*f*.8}
if(d.y<-d.r*2||d.y>innerHeight+d.r*4||d.x<-d.r*3||d.x>innerWidth+d.r*3){Object.assign(d,mk(false))}
bubble(d.x,d.y,d.r,.9)});
for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.06*dt;p.vx*=.985;p.life-=.016*dt;if(p.life<=0){parts.splice(i,1);continue}bubble(p.x,p.y,p.r*(.6+p.life*.4),p.life)}}
}
requestAnimationFrame(frame);
/* cart count bump */
$$("[data-cc],#cb").forEach(function(el){new MutationObserver(function(){var h=el.closest("a,button")||el;h.classList.remove("bump");void h.offsetWidth;h.classList.add("bump")}).observe(el,{childList:true,characterData:true,subtree:true})});
})();
