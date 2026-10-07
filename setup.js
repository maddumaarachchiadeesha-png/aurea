// Run after you know your website address:  node setup.js https://your-site.pages.dev
// Also run it again whenever you add or remove products. It rebuilds sitemap.xml and robots.txt.
const fs=require('fs'),vm=require('vm');
const site=(process.argv[2]||'').replace(/\/+$/,'');
if(!/^https?:\/\/\S+$/.test(site)){console.log('Usage: node setup.js https://your-site.pages.dev');process.exit(1)}
const prev=fs.existsSync('site.txt')?fs.readFileSync('site.txt','utf8').trim():'https://YOUR-SITE.example';
fs.readdirSync('.').filter(f=>f.endsWith('.html')).forEach(f=>fs.writeFileSync(f,fs.readFileSync(f,'utf8').split(prev).join(site)));
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('products.js','utf8')+';this.P=P',ctx);
const urls=['','about.html','services.html','products.html','policy.html','privacy.html'].map(p=>site+'/'+p).concat(ctx.P.map(p=>site+'/product.html?id='+p.id));
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'<url><loc>'+u+'</loc></url>').join('\n')+'\n</urlset>\n');
fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\nSitemap: '+site+'/sitemap.xml\n');
fs.writeFileSync('site.txt',site);console.log('Done. Website address set to '+site+' and '+urls.length+' pages added to the sitemap.');
