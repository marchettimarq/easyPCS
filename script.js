
/* ==== PATCH: open Home by default, phases collapsed by default, toggle collapse, icon-only plus ==== */

const STORAGE_KEY = 'easyPCS';

function safeLoad(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    const s = JSON.parse(raw);
    if(!s || !Array.isArray(s.phases) || s.phases.length===0) return null;
    return s;
  }catch(e){ return null; }
}

// Seed only if missing/bad
function seedData(){
  const seed = {
    phases:[
      { id:'p1', title:'Pre‑Departure', suspense:'2025-09-23', tasks:[] },
      { id:'p2', title:'Mid Prep', suspense:'2025-11-30', tasks:[] },
      { id:'p3', title:'Final Out', suspense:'2025-12-19', tasks:[] },
      { id:'p4', title:'Arrival (Hill AFB)', suspense:'2026-01-31', tasks:[] },
    ],
    timeline:[],
    ui:{ collapsed:{} }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

let appState = safeLoad() ?? seedData();

// Ensure UI map exists and start collapsed by default
if(!appState.ui) appState.ui = { collapsed:{} };
for(const ph of appState.phases){
  if(!(ph.id in appState.ui.collapsed)) appState.ui.collapsed[ph.id] = true; // collapsed by default
}

const save = debounce(()=>localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)), 180);

function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

// Router: default to #/home
function startRouter(){
  if(!location.hash) location.replace('#/home');
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}

function renderRoute(){
  const hash = location.hash || '#/home';
  if(hash.startsWith('#/timeline')) return renderTimeline();
  // default home
  renderHome();
}

function qs(sel,root=document){ return root.querySelector(sel); }
function el(tag,attrs={},...children){
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==='class') n.className=v;
    else if(k==='html') n.innerHTML=v;
    else n.setAttribute(k,v);
  }
  for(const c of children) n.append(c);
  return n;
}

function renderHome(){
  const root = qs('#home'); if(!root) return;
  root.innerHTML = '';
  const stack = el('div',{class:'phase-stack'});
  for(const ph of appState.phases){
    stack.append(renderPhaseCard(ph));
  }
  root.append(stack);
}

function renderPhaseCard(phase){
  const card = el('section',{class:'phase-card'+(appState.ui.collapsed[phase.id]?'':' open')});
  const hdr = el('header',{},
    el('div',{class:'title',html:phase.title}),
    el('button',{'aria-label':'Toggle','data-id':phase.id,class:'toggle'},'▾')
  );
  const body = el('div',{class:'body'});
  // simple task list preview
  if(phase.tasks && phase.tasks.length){
    const ul = el('div',{});
    for(const t of phase.tasks.slice(0,3)){
      ul.append(el('div',{class:'task-row'},
        el('div',{class:'check'+(t.done?' done':'')}),
        el('div',{},
          el('div',{class:'task-title',html:t.title}),
          el('div',{class:'task-date',html:t.due?`Due: ${t.due}`:''})
        )
      ));
    }
    body.append(ul);
  }else{
    body.append(el('div',{class:'task-date',html:'No tasks yet'}));
  }

  card.append(hdr, body);

  // events
  hdr.addEventListener('click',()=>{
    const cur = !!appState.ui.collapsed[phase.id];
    appState.ui.collapsed[phase.id] = !cur;
    save();
    card.classList.toggle('open', !appState.ui.collapsed[phase.id]);
  });

  return card;
}

// Placeholder timeline (kept intact)
function renderTimeline(){
  const root = qs('#home'); if(!root) root = document.body;
  root.innerHTML = '<div style="padding:16px">Timeline view placeholder</div>';
}

document.addEventListener('DOMContentLoaded', startRouter);
