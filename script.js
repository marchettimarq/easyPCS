
// easyPCS minimal SPA (patch build)
// - Safe-area header fix
// - Tappable phase cards -> #/phase/:id
// - Task rows expand to show description
// - Active/Completed lists without disappearing tasks

const LS_KEY = 'easyPCS';

// --- Seed data (short but realistic) ---
function seedData(){
  return {
    phases:[
      {id:'p1', title:'Pre-Departure', tasks:[
        {id:'p1t1', title:'Complete Initial Assignment Briefing in vMPF', due:'2025-08-15', desc:'Within 7 days of RIP', done:false, completedAt:null},
        {id:'p1t2', title:'Fill out and upload Assignment Information Worksheet', due:'2025-09-23', desc:'', done:false, completedAt:null},
        {id:'p1t3', title:'Verify dependents in DEERS / print DD 1172-2', due:'2025-09-23', desc:'', done:false, completedAt:null},
      ]},
      {id:'p2', title:'Mid Prep', tasks:[
        {id:'p2t1', title:'VIPER folder uploaded; CSS marks Final Out Ready', due:'2025-11-15', desc:'', done:false, completedAt:null},
      ]},
      {id:'p3', title:'Final Out', tasks:[
        {id:'p3t1', title:'CSS Outprocessing', due:'2025-12-18', desc:'1 duty day prior to MPF', done:false, completedAt:null},
      ]},
      {id:'p4', title:'Arrival (Hill AFB)', tasks:[
        {id:'p4t1', title:'Report to unit CSS within 24 hrs', due:'2026-01-02', desc:'', done:false, completedAt:null},
      ]},
      {id:'p5', title:'Personal', tasks:[
        {id:'p5t1', title:'Decide car plan: sell, ship, or drive', due:'2025-08-25', desc:'Get quotes / list car', done:false, completedAt:null},
      ]},
    ],
    timeline:[
      {date:'2025-07-15', title:'Assignment RIP issued', phase:null, done:true}
    ]
  };
}

// --- State ---
let app = null;
function load(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw){ app = seedData(); save(true); return; }
  try{ app = JSON.parse(raw); }catch(e){ app = seedData(); save(true); }
}
let saveTimer=null;
function save(immediate=false){
  const doSave = ()=>localStorage.setItem(LS_KEY, JSON.stringify(app));
  if(immediate){ doSave(); return; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(doSave, 180);
}

// --- Routing ---
function route(){
  const hash = location.hash || '#/home';
  if(!location.hash) history.replaceState(null,'','#/home');
  if(hash.startsWith('#/home')) renderHome();
  else if(hash.startsWith('#/phase/')){
    const id = hash.split('/')[2];
    const phase = app.phases.find(p=>p.id===id);
    renderPhaseView(phase || app.phases[0]);
  } else if(hash.startsWith('#/timeline')) renderTimeline();
}

// --- Helpers ---
const appNode = document.getElementById('app');
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function pctDone(p){ const d=p.tasks.filter(t=>t.done).length; return p.tasks.length? Math.round((d/p.tasks.length)*100):0; }
function doneCount(p){ return p.tasks.filter(t=>t.done).length; }
function nextDate(p){
  const upcoming = p.tasks.filter(t=>!t.done && t.due).sort((a,b)=>a.due.localeCompare(b.due))[0];
  return upcoming ? upcoming.due : '';
}

// --- Render: Home (phase carousel) ---
function renderHome(){
  appNode.innerHTML='';
  const wrap = document.createElement('div');
  wrap.className='phase-carousel';
  app.phases.forEach(p=>wrap.appendChild(renderPhaseCard(p)));
  appNode.appendChild(wrap);
}
function renderPhaseCard(phase){
  const card = document.createElement('article');
  card.className='phase-card';
  card.tabIndex=0;
  card.dataset.phaseId = phase.id;
  card.innerHTML = `
    <h3>${escapeHtml(phase.title)}</h3>
    <div class="bar"><span style="width:${pctDone(phase)}%"></span></div>
    <div class="meta">${doneCount(phase)}/${phase.tasks.length} complete • Next: ${nextDate(phase) || '—'}</div>
  `;
  card.addEventListener('click', ()=>{ location.hash = '#/phase/'+phase.id; });
  card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); location.hash='#/phase/'+phase.id; }});
  return card;
}

// --- Render: Phase view (tasks) ---
function renderPhaseView(phase){
  if(!phase){ appNode.innerHTML='<p class="empty">No phases.</p>'; return; }
  appNode.innerHTML='';
  const h = document.createElement('h2');
  h.textContent = phase.title;
  appNode.appendChild(h);

  const active = phase.tasks.filter(t=>!t.done).sort((a,b)=>(a.due||'').localeCompare(b.due||''));
  const completed = phase.tasks.filter(t=>t.done).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));

  const sectionA = document.createElement('section'); sectionA.className='section';
  sectionA.innerHTML='<h4>Active</h4>';
  if(active.length===0) sectionA.appendChild(elEmpty());
  else active.forEach(t=>{ const [row,desc]=renderTaskRow(phase.id,t); sectionA.appendChild(row); sectionA.appendChild(desc); });
  appNode.appendChild(sectionA);

  const sectionC = document.createElement('section'); sectionC.className='section';
  sectionC.innerHTML='<h4>Completed</h4>';
  if(completed.length===0) sectionC.appendChild(elEmpty());
  else completed.forEach(t=>{ const [row,desc]=renderTaskRow(phase.id,t); sectionC.appendChild(row); sectionC.appendChild(desc); });
  appNode.appendChild(sectionC);
}
function elEmpty(){ const e=document.createElement('div'); e.className='empty'; e.textContent='Nothing here yet.'; return e; }

function renderTaskRow(phaseId, task){
  const row = document.createElement('div');
  row.className='task-row';
  row.dataset.taskId = task.id;
  row.innerHTML = `
    <label class="check">
      <input type="checkbox" ${task.done?'checked':''} aria-label="Mark complete">
      <span class="dot"></span>
    </label>
    <div class="task-main">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-date">${task.due || ''}</div>
    </div>
    <button class="chev" aria-label="Show details">▾</button>
  `;
  const details = document.createElement('div');
  details.className='task-desc';
  details.textContent = task.desc || 'No additional details.';

  // events
  row.querySelector('input').addEventListener('change', (e)=>{
    const phase = app.phases.find(p=>p.id===phaseId);
    const t = phase.tasks.find(x=>x.id===task.id);
    t.done = e.target.checked;
    t.completedAt = t.done ? Date.now() : null;
    save();
    renderPhaseView(phase); // re-render both sections
    // also update progress bar if user goes home later (no-op here)
  });
  row.querySelector('.chev').addEventListener('click', (e)=>{
    e.stopPropagation();
    row.classList.toggle('expanded');
  });

  return [row, details];
}

// --- Render: Timeline (simple grouped list) ---
function renderTimeline(){
  appNode.innerHTML='<h2>Master Timeline</h2>';
  const list = [...app.timeline];
  // add all tasks that have a date
  app.phases.forEach(p=>p.tasks.forEach(t=>{ if(t.due) list.push({date:t.due, title:`${p.title}: ${t.title}`, phase:p.title, done:t.done}); }));
  list.sort((a,b)=>a.date.localeCompare(b.date));

  let currentMonth='';
  list.forEach(item=>{
    const month = new Date(item.date+'T12:00:00').toLocaleString(undefined,{month:'long',year:'numeric'});
    if(month!==currentMonth){
      currentMonth=month;
      const h=document.createElement('h4');h.className='section';h.textContent=month;appNode.appendChild(h);
    }
    const card=document.createElement('article');card.className='phase-card';card.style.minWidth='auto';
    card.innerHTML = `<div class="meta">${item.date}</div><h3>${escapeHtml(item.title)}</h3>`;
    appNode.appendChild(card);
  });
}

// --- Nav buttons ---
document.getElementById('navHome').addEventListener('click', ()=>location.hash='#/home');
document.getElementById('navTimeline').addEventListener('click', ()=>location.hash='#/timeline');
document.getElementById('navAdd').addEventListener('click', ()=>{
  // Minimal: add a blank task to current phase (first) to keep patch small
  const phase = app.phases[0];
  const id = 't'+Date.now();
  phase.tasks.unshift({id, title:'New task', due:'', desc:'', done:false, completedAt:null});
  save();
  location.hash = '#/phase/'+phase.id;
});
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Reset app data?')){ localStorage.removeItem(LS_KEY); load(); route(); }
});

// --- Init ---
load();
window.addEventListener('hashchange', route);
route();
