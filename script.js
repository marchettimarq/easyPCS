
// easyPCS – final build with full seed, add/delete tasks, reset, vertical phases
const LS_KEY = 'easyPCS';

/* ---------- Seed data ---------- */
function seedData(){
  const data = {
    phases: [
      {
        id: "p1",
        title: "Pre‑Departure",
        suspense: "2025-09-23",
        tasks: [
          {"id":"p1t1","title":"Complete Initial Assignment Briefing in vMPF (within 7 days of RIP)","due":"2025-08-15","desc":"","done":false,"completedAt":null},
          {"id":"p1t2","title":"Fill out and upload Assignment Information Worksheet","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t3","title":"Verify dependents in DEERS / print DD 1172-2","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t4","title":"Complete SOES/SGLI update in milConnect; print certified copy","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t5","title":"Start Family Member Travel Screening (FMTS) and Initial Travel Screening Questionnaire (ITSQ)","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t6","title":"Schedule/complete Immunizations Memo (86 MDG Immunizations)","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t7","title":"Obtain Security Clearance Memorandum from unit Security Manager (SECRET required; validate in DISS)","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t8","title":"Check if retainability is required → start process with CSS; obtain signed Retention memo","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t9","title":"If dependents, complete DAF 965 Overseas Tour Election (only if required)","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t10","title":"If TDY enroute, attach RIP + funding info","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t11","title":"If carrying firearms, record POF details (Make/Model/Serial)","due":"2025-09-23","desc":"","done":false,"completedAt":null},
          {"id":"p1t12","title":"(Optional) Sign AOI Acknowledgement Memo","due":"2025-09-01","desc":"","done":false,"completedAt":null},
          {"id":"p1t13","title":"(Optional) Upload Assignment Worksheet, medical clearance initiation screenshot, DD1172-2","due":"2025-09-01","desc":"","done":false,"completedAt":null},
          {"id":"p1t14","title":"(Optional) Use AOI orders for HHG/Passenger Travel scheduling — cannot depart without amendment validating FMTS/security clearance","due":"2025-09-10","desc":"","done":false,"completedAt":null}
        ]
      },
      {
        id: "p2",
        title: "Mid Prep",
        suspense: "2025-11-30",
        tasks: [
          {"id":"p2t1","title":"VIPER Folder — upload all required docs; CSS marks 'In Person Final Out Ready – Submitted to MPF.'","due":"2025-11-15","desc":"","done":false,"completedAt":null},
          {"id":"p2t2","title":"Relocation Processing Memorandum","due":"2025-11-10","desc":"","done":false,"completedAt":null},
          {"id":"p2t3","title":"Weapons training current (AF 522 if required)","due":"2025-10-31","desc":"","done":false,"completedAt":null},
          {"id":"p2t4","title":"Security debrief / badge turn‑in","due":"2025-11-30","desc":"","done":false,"completedAt":null},
          {"id":"p2t5","title":"Family Care Plan (AF 357) if single parent/mil‑to‑mil","due":"2025-10-15","desc":"","done":false,"completedAt":null},
          {"id":"p2t6","title":"GTC active / mission‑critical","due":"2025-10-01","desc":"","done":false,"completedAt":null},
          {"id":"p2t7","title":"AT/FP Brief (not required CONUS)","due":"2025-11-10","desc":"","done":false,"completedAt":null},
          {"id":"p2t8","title":"Fitness file closed/hand‑carried if applicable","due":"2025-11-20","desc":"","done":false,"completedAt":null},
          {"id":"p2t9","title":"Route for CC/DO/CCF/First Sgt signature","due":"2025-11-25","desc":"","done":false,"completedAt":null},
          {"id":"p2t10","title":"Virtual Outprocessing (vMPF) — complete all items except Outbound Assignments","due":"2025-11-20","desc":"","done":false,"completedAt":null},
          {"id":"p2t11","title":"Physical Fitness valid through 2026‑01‑31 (retest if due)","due":"2025-11-15","desc":"","done":false,"completedAt":null},
          {"id":"p2t12","title":"Orders Review — dependents, RNLTD, remarks","due":"2025-11-10","desc":"","done":false,"completedAt":null},
          {"id":"p2t13","title":"Household Goods (TMO) — after orders/AOI, schedule pack‑out","due":"2025-11-05","desc":"","done":false,"completedAt":null},
          {"id":"p2t14","title":"If traveling different routing: submit Circuitous Travel Memo","due":"2025-11-12","desc":"","done":false,"completedAt":null}
        ]
      },
      {
        id: "p3",
        title: "Final Out",
        suspense: "2025-12-19",
        tasks: [
          {"id":"p3t1","title":"CSS Outprocessing — 1 duty day before MPF","due":"2025-12-18","desc":"","done":false,"completedAt":null},
          {"id":"p3t2","title":"Final Out Appointment (MPF) — WaitWhile; bring all docs","due":"2025-12-19","desc":"Checklist: PCS Orders (verified), Certified SOES/SGLI, 2× Relocation Memos (signed), vOP Checklist (all cleared), Immunizations Memo, Security Clearance Memo","done":false,"completedAt":null},
          {"id":"p3t3","title":"Port Call (Passenger Travel) — upload orders to PTA, confirm flight","due":"2025-12-10","desc":"","done":false,"completedAt":null},
          {"id":"p3t4","title":"Finance Outprocessing (CPTS) — DLA, travel voucher, GTC usage","due":"2025-12-19","desc":"","done":false,"completedAt":null}
        ]
      },
      {
        id: "p4",
        title: "Arrival (Hill AFB)",
        suspense: "2026-01-31",
        tasks: [
          {"id":"p4t1","title":"Report to unit CSS within 24 hrs","due":"2026-01-02","desc":"","done":false,"completedAt":null},
          {"id":"p4t2","title":"In‑process Finance (update BAH, COLA, etc.)","due":"2026-01-05","desc":"","done":false,"completedAt":null},
          {"id":"p4t3","title":"In‑process Medical at Hill AFB Clinic","due":"2026-01-05","desc":"","done":false,"completedAt":null},
          {"id":"p4t4","title":"Update DEERS/Tricare with new address","due":"2026-01-06","desc":"","done":false,"completedAt":null},
          {"id":"p4t5","title":"Secure housing (on/off base)","due":"2026-01-15","desc":"","done":false,"completedAt":null},
          {"id":"p4t6","title":"School/childcare enrollment for dependents","due":"2026-01-10","desc":"","done":false,"completedAt":null}
        ]
      }
    ],
    timeline: [
      {"date":"2025-07-15","title":"Assignment notification RIP issued","phase":null,"done":true},
      {"date":"2025-08-15","title":"Initial Assignment Briefing complete; begin medical/security/immunizations","phase":"Pre‑Departure","done":true},
      {"date":"2025-09-23","title":"Document suspense — AW, DD1172‑2, FMTS/ITSQ, Immunizations, Security Memo, Retainability memo uploaded","phase":"Pre‑Departure","done":false},
      {"date":"2025-10-15","title":"Follow up FMTS clearance; VIPER folder check","phase":"Mid Prep","done":false},
      {"date":"2025-11-15","title":"Relocation Memo routing, vOP, fitness test if due. Schedule HHG. Circuitous Travel if needed.","phase":"Mid Prep","done":false},
      {"date":"2025-12-05","title":"Confirm orders and port call","phase":"Final Out","done":false},
      {"date":"2025-12-18","title":"CSS Outprocessing","phase":"Final Out","done":false},
      {"date":"2025-12-19","title":"MPF Final Out appointment","phase":"Final Out","done":false},
      {"date":"2025-12-22","title":"Projected Departure","phase":"Final Out","done":false},
      {"date":"2026-01-31","title":"Report to Hill AFB by RNLTD 31 Jan; in‑process unit, finance, housing, medical","phase":"Arrival (Hill AFB)","done":false}
    ],
    ui: { collapsed: {} }
  };
  // collapsed by default
  data.phases.forEach(p => data.ui.collapsed[p.id] = true);
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
}

/* ---------- Safe load / init ---------- */
function safeLoad(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.phases) || parsed.phases.length===0) return null;
    if(!parsed.ui) parsed.ui = { collapsed: {} };
    return parsed;
  }catch(e){ return null; }
}

let app = safeLoad() ?? seedData();

const save = debounce(()=> localStorage.setItem(LS_KEY, JSON.stringify(app)), 180);
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms);}}

/* ---------- Router ---------- */
window.addEventListener('hashchange', route);
function route(){
  const hash = location.hash || '#/home';
  if(!location.hash) location.replace('#/home');
  if(hash.startsWith('#/timeline')) renderTimeline();
  else renderHome();
}

/* ---------- Helpers ---------- */
const $ = (sel, root=document)=> root.querySelector(sel);
function byDue(a,b){ return (a.due||'9999').localeCompare(b.due||'9999'); }
function doneCount(p){ return p.tasks.filter(t=>t.done).length; }
function nextDate(p){ const u=p.tasks.filter(t=>!t.done && t.due).sort(byDue)[0]; return u?u.due:'—'; }

/* ---------- Renderers ---------- */
function renderHome(){
  const v = $('#view'); v.innerHTML = '';
  app.phases.forEach(p=>{
    const card = document.createElement('section');
    card.className = 'phase-card' + (app.ui.collapsed[p.id] ? ' collapsed' : '');
    card.innerHTML = `
      <div class="phase-head">
        <h2 class="phase-title">${p.title}</h2>
        <div class="counts">${doneCount(p)}/${p.tasks.length} complete</div>
      </div>
      <div class="progress"><span style="width:${p.tasks.length ? (doneCount(p)/p.tasks.length*100).toFixed(0):0}%"></span></div>
      <div class="meta">Next: ${nextDate(p)}</div>
      <div class="task-list"></div>
      <div class="meta"><button class="pill small add-in-phase" data-phase="${p.id}">＋ Add Task</button></div>
    `;
    const list = $('.task-list', card);
    const active = p.tasks.filter(t=>!t.done).sort(byDue);
    const completed = p.tasks.filter(t=>t.done).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));
    if(active.length===0) list.appendChild(elEmpty('No active tasks.'));
    else active.forEach(t=> list.appendChild(renderTaskRow(p,t)));
    if(completed.length){
      const sec=document.createElement('details');
      const sum=document.createElement('summary'); sum.textContent = `Completed (${completed.length})`; sec.appendChild(sum);
      const box=document.createElement('div');
      completed.forEach(t=> box.appendChild(renderTaskRow(p,t)));
      sec.appendChild(box); list.appendChild(sec);
    }
    // collapse toggle
    card.querySelector('.phase-head').addEventListener('click',()=>{
      app.ui.collapsed[p.id] = !app.ui.collapsed[p.id];
      save(); card.classList.toggle('collapsed');
    });
    v.appendChild(card);
  });
}
function elEmpty(text){ const e=document.createElement('div'); e.className='empty'; e.textContent=text; return e; }

function renderTaskRow(phase, task){
  const wrap=document.createElement('div');
  const row = document.createElement('div');
  row.className = 'task-row';
  row.innerHTML = `
    <button class="chk ${task.done?'done':''}" aria-label="toggle">${task.done?'✓':''}</button>
    <div class="task-main">
      <p class="task-title">${task.title}</p>
      <div class="task-date">${task.due?('Due: '+task.due):'No date'}</div>
    </div>
    <div class="row-actions">
      <button class="icon-btn expand" aria-label="expand">⌄</button>
      <button class="icon-btn delete" aria-label="delete">🗑</button>
    </div>
  `;
  const desc = document.createElement('div'); desc.className='task-desc'; desc.textContent = task.desc || '—';
  // toggle complete
  row.querySelector('.chk').addEventListener('click',()=>{
    task.done = !task.done; task.completedAt = task.done ? Date.now() : null; save(); renderHome();
  });
  // expand
  row.querySelector('.expand').addEventListener('click',()=>{ row.classList.toggle('expanded'); });
  // delete
  row.querySelector('.delete').addEventListener('click',()=>{
    if(confirm(`Delete “${task.title}”?`)){
      phase.tasks = phase.tasks.filter(t=>t.id!==task.id);
      save(); renderHome();
    }
  });
  wrap.appendChild(row); wrap.appendChild(desc); return wrap;
}

function renderTimeline(){
  const v = $('#view'); v.innerHTML = '<h2 class="phase-title">Master Timeline</h2>';
  // collect milestones + any task with a due date
  const items = [...app.timeline.map(m=>({date:m.date,title:m.title}))];
  app.phases.forEach(p=> p.tasks.forEach(t=>{ if(t.due){ items.push({date:t.due, title:`${p.title}: ${t.title}`}); }}));
  items.sort((a,b)=> a.date.localeCompare(b.date));
  // month headers
  let cur='';
  items.forEach(it=>{
    const month = new Date(it.date+'T12:00:00').toLocaleString(undefined,{month:'long',year:'numeric'});
    if(month!==cur){ cur=month; const h=document.createElement('h3'); h.className='phase-title'; h.textContent=month; v.appendChild(h); }
    const r=document.createElement('div'); r.className='task-row'; r.innerHTML=`<div class="task-main"><p class="task-title">${it.title}</p><div class="task-date">${it.date}</div></div>`; v.appendChild(r);
  });
}

/* ---------- Add Task modal ---------- */
const modal = document.getElementById('addModal');
const backdrop = document.getElementById('modalBackdrop');
const addBtn = document.getElementById('addFab');
const addForm = document.getElementById('addForm');
const phaseSelect = document.getElementById('phaseSelect');

function openAddModal(defaultPhaseId=null){
  // fill phases
  phaseSelect.innerHTML='';
  app.phases.forEach(p=>{
    const opt=document.createElement('option'); opt.value=p.id; opt.textContent=p.title;
    if(defaultPhaseId && p.id===defaultPhaseId) opt.selected=true;
    phaseSelect.appendChild(opt);
  });
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  document.body.style.overflow='hidden';
  addForm.reset();
}
function closeAddModal(){
  backdrop.classList.add('hidden');
  modal.classList.add('hidden');
  document.body.style.overflow='';
}
addBtn.addEventListener('click', ()=> openAddModal(app.phases[0]?.id));
document.querySelectorAll('.close-add').forEach(b=> b.addEventListener('click', closeAddModal));
backdrop.addEventListener('click', closeAddModal);
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !modal.classList.contains('hidden')) closeAddModal(); });

// Add from phase-specific button
document.addEventListener('click', (e)=>{
  const add = e.target.closest('.add-in-phase');
  if(add){ openAddModal(add.dataset.phase); }
});

addForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(addForm);
  const title = (fd.get('title')||'').trim();
  if(!title){ alert('Title is required'); return; }
  const due = fd.get('due') || '';
  const desc = fd.get('desc') || '';
  const phaseId = fd.get('phase');
  const phase = app.phases.find(p=>p.id===phaseId);
  const id = `${phaseId}_${Date.now()}`;
  phase.tasks.push({id, title, due, desc, done:false, completedAt:null});
  save(); closeAddModal(); renderHome();
});

/* ---------- Global listeners: nav + reset ---------- */
document.addEventListener('click',(e)=>{
  const nav = e.target.closest('[data-route]');
  if(nav){ location.hash = nav.getAttribute('data-route'); }
  const isReset = e.target.closest('.reset-btn');
  if(isReset){ if(confirm('Reset all data?')){ localStorage.removeItem(LS_KEY); app = seedData(); location.replace('#/home'); renderHome(); } }
});

/* ---------- Start ---------- */
window.addEventListener('DOMContentLoaded', ()=>{
  if(!location.hash || location.hash==='#') location.replace('#/home');
  route();
});
