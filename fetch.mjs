/* ============================================================
   INDO-PACIFIC TERMINAL — fetcher (runs in GitHub Actions)
   Node 20+. No dependencies. Fetches native RSS directly
   (no CORS server-side), falls back to Google News per source,
   classifies by axis/sub-tag/theater, writes data.json.
   ============================================================ */
import { writeFileSync } from 'node:fs';
import { readFileSync, existsSync } from 'node:fs';
import { SOURCES, COUNTRIES, REGION_EXTRA, AXES, COUNTRY_TAGS, GAZETTEER, COUNTRY_CENTROID, SEVERE } from './registry.mjs';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const WINDOW_DAYS = 7, PER_SOURCE = 30, TOTAL_CAP = 2500, CONCURRENCY = 10, TIMEOUT = 20000;

const gnewsSite = d => `https://news.google.com/rss/search?q=${encodeURIComponent('site:'+d+' when:'+WINDOW_DAYS+'d')}&hl=en-US&gl=US&ceid=US:en`;

async function get(url){
  const r = await fetch(url,{signal:AbortSignal.timeout(TIMEOUT),headers:{'user-agent':UA,'accept':'application/rss+xml,application/xml,text/xml,*/*'},redirect:'follow'});
  if(!r.ok) throw new Error('http '+r.status);
  return await r.text();
}

/* ---- tiny dependency-free RSS/Atom parsing ---- */
const ENT = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&apos;':"'",'&nbsp;':' '};
function decode(s){ return (s||'').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&[a-z]+;/gi,m=>ENT[m]??m); }
function unCdata(s){ return (s||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1'); }
function stripTags(s){ return decode(unCdata(s||'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim(); }
function tag(block,name){
  const m = block.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));
  return m ? m[1] : '';
}
function atomLink(block){
  const m = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i);
  return m ? decode(m[1]) : '';
}
function parseFeed(xml){
  let blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  if(!blocks.length) blocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b=>{
    let link = stripTags(tag(b,'link'));
    if(!link) link = atomLink(b);
    return {
      title: stripTags(tag(b,'title')),
      link,
      desc: stripTags(tag(b,'description')||tag(b,'summary')||tag(b,'content')||tag(b,'content:encoded')).slice(0,320),
      date: stripTags(tag(b,'pubDate')||tag(b,'published')||tag(b,'updated')||tag(b,'dc:date')),
    };
  }).filter(a=>a.title && a.link);
}
function cleanTitle(t){ return t.replace(/\s+-\s+[^-]+$/,'').trim() || t; }
function parseDate(s){ if(!s) return null; let d = new Date(s); if(isNaN(d)) d = new Date(s.replace(' ','T')); return isNaN(d) ? null : d; }

/* ---- classification ---- */
function hits(text, kws){ const t=' '+text.toLowerCase()+' '; return kws.filter(k=>t.includes(k)); }
function classify(text){
  let axis=null, sub=null, matched=[], best=0;
  const perAxis = {};
  for(const ax in AXES){
    let axHits=[];
    for(const s in AXES[ax]){
      const h = hits(text, AXES[ax][s]);
      axHits = axHits.concat(h);
      if(h.length > best){ best=h.length; axis=ax; sub=s; matched=h; }
    }
    perAxis[ax] = axHits.length;
  }
  const nexus = perAxis.Conflict>0 && perAxis.Climate>0;
  return {axis, sub, nexus, matched};
}
function geoOf(text, home){
  const cc=[], score={};
  for(const name in COUNTRIES){
    const c=COUNTRIES[name], n=hits(text, c.kw).length;
    if(n){ cc.push([name,n]); if(c.region) score[c.region]=(score[c.region]||0)+n; }
  }
  for(const r in REGION_EXTRA){
    const n=hits(text, REGION_EXTRA[r]).length;
    if(n) score[r]=(score[r]||0)+n;
  }
  cc.sort((a,b)=>b[1]-a[1]);
  let region=null, best=0;
  for(const r in score){ if(score[r]>best){ best=score[r]; region=r; } }
  return { region: region || home || null, matchedRegion: !!region, countries: cc.slice(0,3).map(x=>x[0]) };
}
function geoPoint(text, countries){
  const t=' '+text.toLowerCase()+' ';
  for(const k in GAZETTEER){ if(t.includes(k)) { const g=GAZETTEER[k]; return {geo:[g[0],g[1]], place:g[2]}; } }
  if(countries.length && COUNTRY_CENTROID[countries[0]]) return {geo:COUNTRY_CENTROID[countries[0]], place:countries[0]};
  return {geo:null, place:null};
}

/* ---- per-source fetch ---- */
async function fetchSource(s){
  const t0 = Date.now();
  let raw=[], method='';
  if(s.feed){ try{ raw = parseFeed(await get(s.feed)); if(raw.length) method='native'; }catch(e){} }
  if(!raw.length){ try{ raw = parseFeed(await get(gnewsSite(s.domain))); if(raw.length) method='gnews'; }catch(e){} }
  const now = Date.now(), horizon = now - WINDOW_DAYS*864e5;
  let items = raw.map(a=>{
    const title = cleanTitle(a.title);
    const date = parseDate(a.date);
    const text = title+' '+a.desc;
    const cls = classify(text);
    const g = geoOf(text, s.home);
    if(!g.countries.length && s.tier==='LOC' && s.country && s.country!=='—') g.countries=[s.country]; // domestic default
    const gp = geoPoint(text, g.countries);
    return { title, link:a.link, desc:a.desc, date: date?date.toISOString():null,
      src:s.code, tier:s.tier, region:g.region, countries:g.countries, matchedRegion:g.matchedRegion,
      geo:gp.geo, place:gp.place,
      axis:cls.axis, sub:cls.sub, nexus:cls.nexus, hits:cls.matched.slice(0,8) };
  })
  .filter(a=>!a.date || Date.parse(a.date)>=horizon)
  .filter(a=>!s.gate || a.matchedRegion)        // gated sources must name the region
  .slice(0, PER_SOURCE);
  return { items, diag:{code:s.code,name:s.name,country:s.country,tier:s.tier,method:method||'—',status:items.length?'ok':(method?'empty':'fail'),count:items.length,ms:Date.now()-t0} };
}

async function pool(tasks, limit){
  const out=new Array(tasks.length); let i=0;
  await Promise.all(Array.from({length:Math.min(limit,tasks.length)},async()=>{
    while(i<tasks.length){ const idx=i++; out[idx]=await tasks[idx](); }
  }));
  return out;
}

/* ---- main ---- */
const results = await pool(SOURCES.map(s=>()=>fetchSource(s)), CONCURRENCY);

/* ---- corroboration clustering (near-duplicate titles → one item, ×N sources) ---- */
const STOP = new Set(['the','a','an','of','in','on','at','to','for','and','or','as','is','are','was','with','by','after','over','amid','from','into','its','his','her','their','new','says','say','said']);
const toks = t => [...new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>2&&!STOP.has(w)))];
const jac = (A,B)=>{ let i=0; for(const x of A) if(B.has(x)) i++; return i/(A.size+B.size-i||1); };
const raw = [];
const seen0 = new Set();
for(const r of results) for(const a of r.items){
  const k = a.title.toLowerCase().slice(0,80);
  if(seen0.has(k)){ // exact-start dup: attach as corroboration to the earlier one
    const prev = raw.find(p=>p.title.toLowerCase().slice(0,80)===k);
    if(prev && prev.src!==a.src) (prev.also=prev.also||[]).push({src:a.src,link:a.link});
    continue;
  }
  seen0.add(k); raw.push(a);
}
/* fuzzy pass within (country, axis, day) buckets */
const buckets = {};
raw.forEach((a,i)=>{ const key=((a.countries&&a.countries[0])||'')+'|'+(a.axis||'')+'|'+(a.date?a.date.slice(0,10):''); (buckets[key]=buckets[key]||[]).push(i); });
const gone = new Set();
for(const key in buckets){
  const idx = buckets[key]; if(idx.length<2) continue;
  const sets = idx.map(i=>new Set(toks(raw[i].title)));
  for(let x=0;x<idx.length;x++){ if(gone.has(idx[x])) continue;
    for(let y=x+1;y<idx.length;y++){ if(gone.has(idx[y])) continue;
      if(jac(sets[x],sets[y])>=0.55 && raw[idx[x]].src!==raw[idx[y]].src){
        (raw[idx[x]].also=raw[idx[x]].also||[]).push({src:raw[idx[y]].src,link:raw[idx[y]].link});
        gone.add(idx[y]);
      } } } }
const items = raw.filter((a,i)=>!gone.has(i));

/* ---- severity scoring ---- */
for(const a of items){
  const text=(a.title+' '+(a.desc||'')).toLowerCase();
  const sevHits = SEVERE.filter(k=>text.includes(k));
  const corrob = 1+(a.also?a.also.length:0);
  a.corrob = corrob;
  a.sev = Math.min(6,(a.hits||[]).length) + Math.min(6,sevHits.length*2) + (a.tier==='ALERT'?3:0) + Math.min(3,corrob-1);
  a.band = a.sev>=10?'CRIT':(a.sev>=6?'HIGH':(a.sev>=3?'WATCH':null));
  a.sevWhy = `${(a.hits||[]).length} axis hits` + (sevHits.length?` + severe: ${sevHits.slice(0,4).join(', ')}`:'') + (a.tier==='ALERT'?' + alert-tier':'') + (corrob>1?` + ×${corrob} sources`:'');
}
items.sort((x,y)=>(Date.parse(y.date)||0)-(Date.parse(x.date)||0));


/* ---- daily history for surge/sparklines (upsert today, keep 30 days) ---- */
let history={days:[]};
try{ if(existsSync('history.json')) history=JSON.parse(readFileSync('history.json','utf8')); }catch(e){}
const today=new Date().toISOString().slice(0,10);
const H24=Date.now()-864e5;
const d1=items.filter(a=>a.date&&Date.parse(a.date)>H24);
const entry={date:today,regions:{},countries:{}};
for(const rg of ['South Asia','Southeast Asia']) entry.regions[rg]={c:d1.filter(a=>a.region===rg&&a.axis==='Conflict').length,l:d1.filter(a=>a.region===rg&&a.axis==='Climate').length,x:d1.filter(a=>a.region===rg&&a.nexus).length};
for(const co of Object.keys(COUNTRIES)) { const n=d1.filter(a=>(a.countries||[]).includes(co)); if(n.length) entry.countries[co]={c:n.filter(a=>a.axis==='Conflict').length,l:n.filter(a=>a.axis==='Climate').length}; }
history.days=history.days.filter(d=>d.date!==today); history.days.push(entry); history.days=history.days.slice(-30);
writeFileSync('history.json', JSON.stringify(history));
const data = {
  generated_at: new Date().toISOString(),
  window_days: WINDOW_DAYS,
  sources: results.map(r=>r.diag),
  source_meta: Object.fromEntries(SOURCES.map(s=>[s.code,{name:s.name,country:s.country,tier:s.tier,owner:s.owner,lean:s.lean,domain:s.domain}])),
  country_tags: COUNTRY_TAGS,
  gaz: Object.fromEntries(Object.entries(GAZETTEER).map(([k,v])=>[v[2],[v[0],v[1]]])),
  centroids: COUNTRY_CENTROID,
  items: items.slice(0,TOTAL_CAP),
};
writeFileSync('data.json', JSON.stringify(data));

/* ---- KML export: import as a layer in Google My Maps ---- */
const kesc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const KCOL = { Conflict:'ff3a47b0', Climate:'ff6b7d2e', Nexus:'ff8a4a5b', Other:'ff9aa0a7' }; // aabbggrr
const kstyle = id => `<Style id="${id}"><IconStyle><color>${KCOL[id]}</color><scale>0.9</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon></IconStyle></Style>`;
const geoItems = data.items.filter(a=>a.geo);
const marks = geoItems.map(a=>{
  const st = a.nexus?'Nexus':(a.axis||'Other');
  const when = a.date?new Date(a.date).toUTCString():'';
  return `<Placemark><name>${kesc(a.title)}</name><styleUrl>#${st}</styleUrl>`+
    `<description><![CDATA[${a.src} · ${a.tier} · ${when}${a.axis?` · ${a.axis}${a.sub?'/'+a.sub:''}`:''}${a.nexus?' · NEXUS':''}<br/><a href="${a.link}">open article</a>]]></description>`+
    `<Point><coordinates>${a.geo[1]},${a.geo[0]},0</coordinates></Point></Placemark>`;
}).join('\n');
const kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document>`+
  `<name>IP Terminal — live items ${data.generated_at.slice(0,16)}Z</name>`+
  Object.keys(KCOL).map(kstyle).join('')+ marks + `</Document></kml>`;
writeFileSync('data.kml', kml);
const layerKml=(name,list)=>`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${name}</name>`+Object.keys(KCOL).map(kstyle).join('')+list.map(a=>{const st=a.nexus?'Nexus':(a.axis||'Other');const when=a.date?new Date(a.date).toUTCString():'';return `<Placemark><name>${kesc(a.title)}</name><styleUrl>#${st}</styleUrl><description><![CDATA[${a.src} · ${when}<br/><a href="${a.link}">open article</a>]]></description><Point><coordinates>${a.geo[1]},${a.geo[0]},0</coordinates></Point></Placemark>`;}).join('\n')+`</Document></kml>`;
writeFileSync('conflict.kml', layerKml('IP Terminal — Conflict', geoItems.filter(a=>a.axis==='Conflict')));
writeFileSync('climate.kml', layerKml('IP Terminal — Climate', geoItems.filter(a=>a.axis==='Climate')));
writeFileSync('nexus.kml', layerKml('IP Terminal — Nexus', geoItems.filter(a=>a.nexus)));

const live = data.sources.filter(d=>d.status==='ok').length;
console.log(`data.json written: ${data.items.length} items (${geoItems.length} geolocated → data.kml), ${live}/${data.sources.length} sources live`);
