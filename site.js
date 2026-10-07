var WA="94763503675"; /* EDIT: your WhatsApp number, country code, no + or spaces */
var C={email:"aurea20.lk@gmail.com",ig:"https://instagram.com/yourpage",fb:"https://facebook.com/yourpage",hours:"Monday to Saturday, 9:00 AM to 6:00 PM"};
document.querySelectorAll("[data-wa]").forEach(function(a){a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(a.dataset.wa)});
document.querySelectorAll("[data-k]").forEach(function(e){var k=e.dataset.k;if(k==="email"){e.textContent=C.email;e.href="mailto:"+C.email}else if(k==="hours")e.textContent=C.hours;else e.href=C[k]});
try{var n=0,c=JSON.parse(localStorage.getItem("aurea")||"{}");for(var k in c)n+=c[k];document.querySelectorAll("[data-cc]").forEach(function(e){e.textContent=n})}catch(e){}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll(".rv").forEach(function(e){io.observe(e)});
/* Photos: images/<id>.jpg, images/<id>-2.jpg ... up to 10 (p.pics = how many) */
function PIC(p){var a=[],n=Math.max(1,Math.min(p.pics||1,10));for(var i=1;i<=n;i++)a.push("images/"+p.id+(i>1?"-"+i:"")+".jpg");return a}
/* Full-screen photo viewer */
(function(){var L,im,ct,list=[],i=0,sx=0;
function build(){L=document.createElement("div");L.className="lb";L.hidden=true;L.setAttribute("role","dialog");L.setAttribute("aria-label","Photo viewer");
L.innerHTML='<button class="lx" aria-label="Close">&times;</button><button class="lp" aria-label="Previous photo">&#8249;</button><img alt=""><button class="ln" aria-label="Next photo">&#8250;</button><span class="lc"></span>';
document.body.appendChild(L);im=L.querySelector("img");ct=L.querySelector(".lc");
L.onclick=function(e){var c=e.target.className;if(c==="lx"||e.target===L)close();else if(c==="lp")go(-1);else if(c==="ln")go(1)};
L.addEventListener("touchstart",function(e){sx=e.touches[0].clientX},{passive:true});
L.addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(d<0?1:-1)});
document.addEventListener("keydown",function(e){if(L.hidden)return;if(e.key==="Escape")close();else if(e.key==="ArrowLeft")go(-1);else if(e.key==="ArrowRight")go(1)})}
function show(){im.src=list[i];im.alt="Photo "+(i+1);ct.textContent=list.length>1?(i+1)+" / "+list.length:"";L.classList.toggle("one",list.length<2)}
function go(d){i=(i+d+list.length)%list.length;show()}
function close(){L.hidden=true;document.body.style.overflow=""}
window.openLB=function(l,k){if(!L)build();list=l;i=k||0;show();L.hidden=false;document.body.style.overflow="hidden";L.querySelector(".lx").focus()};
document.addEventListener("click",function(e){var t=e.target;if(!t.closest)return;
if(t.matches&&t.matches("img[data-t]")){var m=t.closest(".tile").querySelector("img.mi");if(m){m.src=t.src;m.removeAttribute("hidden")}t.parentNode.querySelectorAll("img").forEach(function(x){x.classList.toggle("on",x===t)});e.preventDefault();return}
if(t.matches&&t.matches("img[data-z]")){var th=t.closest(".tile").querySelectorAll("img[data-t]"),l=[],k=0;th.forEach(function(x){if(x.src===t.src)k=l.length;l.push(x.src)});if(!l.length)l=[t.src];openLB(l,k);e.preventDefault()}})})();
