/* Shop data lives in data.js. Edit it with admin.html */
var D=window.AUREA,WA=D.wa,DEL=D.delivery,P=D.products,MX=Math.max(100,Math.ceil(Math.max.apply(null,P.map(function(p){return p.price}))/100)*100);
var $=function(i){return document.getElementById(i)},cats=["All","Cleanse","Treat","Hydrate","Protect"],skins=["Oily","Combination","Dry","Normal","Sensitive"],
F={c:"All",s:[],max:MX,st:false,q:"",o:"f"},cart={},sel=null,pq=1;
try{cart=JSON.parse(localStorage.getItem("aurea")||"{}")}catch(e){}
function m(n){return"Rs. "+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",")}
function pk(p){if(p.img)return'<img class="pi" src="'+p.img+'" alt="">';return'<div class="pk '+p.t+'"><i>'+p.l+'</i></div>'}
function bd(p){return p.stock<=0?'<span class="badge out">Out of stock</span>':p.stock<=5?'<span class="badge low">Only '+p.stock+' left</span>':""}
function get(id){return P.filter(function(p){return p.id===id})[0]}
function card(p){return'<article class="card"><button class="tile c-'+p.c+'" data-o="'+p.id+'" aria-label="View '+p.n+'">'+pk(p)+bd(p)+'</button><div class="cb"><small>'+p.c+" &middot; "+p.size+'</small><h3>'+p.n+'</h3><div class="sk">'+p.skin.map(function(s){return"<i>"+s+"</i>"}).join("")+'</div><div class="row"><span class="pr">'+m(p.price)+'</span><button class="add" data-a="'+p.id+'" aria-label="Add '+p.n+' to cart"'+(p.stock<1?" disabled":"")+'>+</button></div></div></article>'}
function save(){try{localStorage.setItem("aurea",JSON.stringify(cart))}catch(e){}var n=0;for(var k in cart)n+=cart[k];$("cc").textContent=n;rc()}
function add(id,q){var p=get(id);cart[id]=Math.min(p.stock,(cart[id]||0)+q);save()}
function lines(){return Object.keys(cart).map(function(k){var p=get(k);return p&&{p:p,q:cart[k]}}).filter(Boolean)}
function rc(){var L=lines(),t=0;L.forEach(function(l){t+=l.p.price*l.q});$("st").textContent=m(t);var dv=L.length?DEL:0;$("dv").textContent=m(dv);$("tt").textContent=m(t+dv);
$("dl").innerHTML=L.length?L.map(function(l){return'<div class="li"><span>'+l.p.n+'</span><b>'+m(l.p.price*l.q)+'</b><span class="qty"><button data-q="'+l.p.id+'" data-d="-1" aria-label="Less">&minus;</button><span>'+l.q+'</span><button data-q="'+l.p.id+'" data-d="1" aria-label="More">+</button></span></div>'}).join(""):'<p style="color:var(--mute)">Your cart is empty. Add something you like.</p>'}
function dr(on){$("dr").classList.toggle("on",on);$("ov").classList.toggle("on",on||($("sb")&&$("sb").classList.contains("on")))}
function openProduct(id){sel=get(id);pq=1;var p=sel;
$("md").innerHTML='<button class="x" id="mx" aria-label="Close">&times;</button><div class="dg"><div class="tile c-'+p.c+'">'+pk(p)+bd(p)+'</div><div class="di"><small>'+p.c+' &middot; '+p.size+'</small><h2>'+p.n+'</h2><div class="pr">'+m(p.price)+'</div><p>'+p.d+'</p>'+
'<dl class="fa"><dt>Skin type</dt><dd>'+(p.skin[0]==="All"?"All skin types":p.skin.join(", "))+'</dd><dt>Use</dt><dd>'+p.when+'</dd><dt>Size</dt><dd>'+p.size+'</dd></dl>'+
'<details open><summary>Benefits</summary><ul>'+p.ben.map(function(b){return"<li>"+b+"</li>"}).join("")+'</ul></details><details><summary>Key ingredients</summary><ul>'+p.ing.map(function(b){return"<li>"+b+"</li>"}).join("")+'</ul></details><details><summary>How to use</summary><p>'+p.use+'</p><p><b>Tip:</b> '+p.tip+'</p></details>'+
'<div style="margin-top:20px">'+(p.stock>0?'<span class="qty"><button id="mq-" aria-label="Less">&minus;</button><span id="mqn">1</span><button id="mq+" aria-label="More">+</button></span><button class="btn" id="ma">Add to cart</button>':'<button class="btn" disabled>Out of stock</button>')+'</div></div></div>';
$("md").showModal()}
document.addEventListener("click",function(e){var t=e.target.closest("[data-o],[data-a],[data-q],[data-s],[data-c]");
if(e.target.id==="md")$("md").close();
if(e.target.id==="mx")$("md").close();
if(e.target.id==="mq-"||e.target.id==="mq+"){pq=Math.max(1,Math.min(sel.stock,pq+(e.target.id==="mq+"?1:-1)));$("mqn").textContent=pq}
if(e.target.id==="ma"){add(sel.id,pq);$("md").close();dr(true)}
if(!t)return;var d=t.dataset;
if(d.o)openProduct(d.o);
if(d.a){add(d.a,1);t.textContent="\u2713";setTimeout(function(){t.textContent="+"},900)}
if(d.q){var q=(cart[d.q]||0)+ +d.d;if(q<1)delete cart[d.q];else cart[d.q]=Math.min(get(d.q).stock,q);save()}
});
$("cb").onclick=function(){dr(true)};$("cl").onclick=function(){dr(false)};
$("ov").onclick=function(){dr(false);if(typeof fl==="function")fl(false)};
$("wa").onclick=function(){var L=lines(),n=$("nm").value.trim(),ph=$("ph").value.trim(),a=$("ad").value.trim(),t=0;
if(!L.length){$("er").textContent="Your cart is empty.";return}
if(!n||ph.replace(/\D/g,"").length<9||a.length<6){$("er").textContent="Please enter your name, a working phone number and your delivery address.";return}
$("er").textContent="";L.forEach(function(l){t+=l.p.price*l.q});
var msg="Hi Aurea, I would like to order:\n"+L.map(function(l){return"- "+l.q+" x "+l.p.n+" ("+m(l.p.price*l.q)+")"}).join("\n")+"\n\nSubtotal: "+m(t)+"\nDelivery: "+m(DEL)+"\nTotal: "+m(t+DEL)+"\nName: "+n+"\nPhone: "+ph+"\nAddress: "+a;
window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank","noopener")};
if(D.logo)document.querySelector(".logo").innerHTML='<img src="'+D.logo+'" alt="Aurea" style="height:40px;display:block">';
save();
