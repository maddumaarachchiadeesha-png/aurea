var WA="94700000000"; /* EDIT: your WhatsApp number, country code, no + or spaces */
var C={email:"hello@yourdomain.lk",ig:"https://instagram.com/yourpage",fb:"https://facebook.com/yourpage",hours:"Monday to Saturday, 9:00 AM to 6:00 PM"};
document.querySelectorAll("[data-wa]").forEach(function(a){a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(a.dataset.wa)});
document.querySelectorAll("[data-k]").forEach(function(e){var k=e.dataset.k;if(k==="email"){e.textContent=C.email;e.href="mailto:"+C.email}else if(k==="hours")e.textContent=C.hours;else e.href=C[k]});
try{var n=0,c=JSON.parse(localStorage.getItem("aurea")||"{}");for(var k in c)n+=c[k];document.querySelectorAll("[data-cc]").forEach(function(e){e.textContent=n})}catch(e){}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll(".rv").forEach(function(e){io.observe(e)});
