
// easyPCS vertical phases build (collapsible).
// - Stacked vertical phase blocks (no horizontal scroll).
// - Tap a phase header to expand/collapse tasks.
// - Task rows expand to show description via chevron.
// - Active/Completed lists with stable rendering (no disappearing tasks).

const LS_KEY = 'easyPCS';

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
let app=null;
function load(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw){ app=seedData(); save(true); return; }
  try{ app = JSON.parse(raw); }catch(e){ app=seedData(); save(true); }
}
let saveTimer=null;
function save(immediate=false){
  const doSave=()=>localStorage.setItem(LS_KEY, JSON.stringify(app));
  if(immediate){ doSave(); return; }
  clearTimeout(saveTimer); saveTimer = setTimeout(doSave, 180);
}

// --- Routing ---
function route(){
  const h = location.hash || '#/home';
  if(!location.hash) history.replaceState(null,'','#/home');
  if(h.startsWith('#/home')) renderHome();
  else if(h.startsWith('#/timeline')) renderTimeline();
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
function elEmpty(){ const e=document.createElement('div'); e.className='empty'; e.textContent='Nothing here yet.'; return e; }

// --- Render Home as vertical stack ---
function renderHome(){
  appNode.innerHTML='';
  const stack = document.createElement('div'); stack.className='phase-stack';
  app.phases.forEach(p=> stack.appendChild(renderPhaseBlock(p)));
  appNode.appendChild(stack);
}

function renderPhaseBlock(phase){
  const block = document.createElement('section'); block.className='phase-block';
  // default expanded; if you want default collapsed, add 'collapsed' here
  const head = document.createElement('div'); head.className='phase-head'; head.setAttribute('role','button'); head.tabIndex=0;
  const name = document.createElement('h3'); name.className='phase-name'; name.textContent = phase.title;
  const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${doneCount(phase)}/${phase.tasks.length} • Next: ${nextDate(phase)||'—'}`;
  head.appendChild(name); head.appendChild(meta);
  const bar = document.createElement('div'); bar.className='bar'; const barInner=document.createElement('span'); barInner.style.width=pctDone(phase)+'%'; bar.appendChild(barInner);

  // body with lists
  const body = document.createElement('div'); body.className='phase-body';
  const active = phase.tasks.filter(t=>!t.done).sort((a,b)=>(a.due||'').localeCompare(b.due||''));
  const completed = phase.tasks.filter(t=>t.done).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));

  const sectionA=document.createElement('section'); sectionA.className='section'; sectionA.innerHTML='<h4>Active</h4>';
  if(active.length===0) sectionA.appendChild(elEmpty());
  else active.forEach(t=>{ const [row,desc]=renderTaskRow(phase.id,t); sectionA.appendChild(row); sectionA.appendChild(desc); });

  const sectionC=document.createElement('section'); sectionC.className='section'; sectionC.innerHTML='<h4>Completed</h4>';
  if(completed.length===0) sectionC.appendChild(elEmpty());
  else completed.forEach(t=>{ const [row,desc]=renderTaskRow(phase.id,t); sectionC.appendChild(row); sectionC.appendChild(desc); });

  body.appendChild(sectionA); body.appendChild(sectionC);

  // toggle collapse
  head.addEventListener('click', ()=>{
    block.classList.toggle('collapsed');
  });
  head.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); block.classList.toggle('collapsed'); }
  });

  block.appendChild(head); block.appendChild(bar); block.appendChild(body);
  return block;
}

function renderTaskRow(phaseId, task){
  const row = document.createElement('div'); row.className='task-row'; row.dataset.taskId=task.id;
  row.innerHTML = `
    <label class="check">
      <input type="checkbox" ${task.done?'checked':''} aria-label="Mark complete">
      <span class="dot"></span>
    </label>
    <div class="task-main">
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-date">${task.due||''}</div>
    </div>
    <button class="chev" aria-label="Show details">▾</button>
  `;
  const desc = document.createElement('div'); desc.className='task-desc'; desc.textContent = task.desc || 'No additional details.';

  // events
  row.querySelector('input').addEventListener('change', (e)=>{
    const phase = app.phases.find(p=>p.id===phaseId);
    const t = phase.tasks.find(x=>x.id===task.id);
    t.done = e.target.checked;
    t.completedAt = t.done ? Date.now() : null;
    save();
    renderHome(); // re-render all so progress/meta update
  });
  row.querySelector('.chev').addEventListener('click', (e)=>{
    e.stopPropagation();
    row.classList.toggle('expanded');
  });

  return [row, desc];
}

// --- Timeline (simple) ---
function renderTimeline(){
  appNode.innerHTML='<h2>Master Timeline</h2>';
  const list = [...app.timeline];
  app.phases.forEach(p=>p.tasks.forEach(t=>{ if(t.due) list.push({date:t.due, title:`${p.title}: ${t.title}`, phase:p.title, done:t.done}); }));
  list.sort((a,b)=>a.date.localeCompare(b.date));

  let current='';
  list.forEach(item=>{
    const month = new Date(item.date+'T12:00:00').toLocaleString(undefined,{month:'long',year:'numeric'});
    if(month!==current){ current=month; const h=document.createElement('h4');h.className='section';h.textContent=month;appNode.appendChild(h); }
    const card=document.createElement('article');card.className='phase-block';
    const head=document.createElement('div');head.className='phase-head';const n=document.createElement('h3');n.className='phase-name';n.textContent=item.title; const m=document.createElement('div');m.className='meta';m.textContent=item.date; head.appendChild(n); head.appendChild(m);
    card.appendChild(head);
    appNode.appendChild(card);
  });
}

// --- Nav ---
document.getElementById('navHome').addEventListener('click', ()=>location.hash='#/home');
document.getElementById('navTimeline').addEventListener('click', ()=>location.hash='#/timeline');
document.getElementById('navAdd').addEventListener('click', ()=>{
  // add a new task to the first phase as a simple demo
  const phase = app.phases[0];
  phase.tasks.unshift({id:'t'+Date.now(), title:'New task', due:'', desc:'', done:false, completedAt:null});
  save();
  location.hash='#/home';
});
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Reset app data?')){ localStorage.removeItem(LS_KEY); load(); route(); }
});

// --- Init ---
load();
window.addEventListener('hashchange', route);
route();
