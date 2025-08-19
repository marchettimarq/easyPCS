// easyPCS v3 — 5 phases + timeline. Vanilla JS + LocalStorage.
// Storage key bump so it doesn't collide with earlier tests.
const LS_KEY = 'easyPCS-v3';

// ------------------ Seed Data ------------------
function seedData() {
  return {
    phases: [
      {
        id:'p1', title:'Pre-Departure', suspense:'2025-09-23',
        tasks:[
          {id:'p1t1', title:'Complete Initial Assignment Briefing (vMPF).', due:'2025-08-15', desc:'', done:false, completedAt:null},
          {id:'p1t2', title:'Review PCS RIP and assignment details.', due:'2025-08-10', desc:'', done:false, completedAt:null},
          {id:'p1t3', title:'Begin FMTS/ITSQ for dependents (can take weeks).', due:'2025-09-23', desc:'', done:false, completedAt:null},
          {id:'p1t4', title:'Schedule immunizations clinic appointment.', due:'2025-08-25', desc:'', done:false, completedAt:null},
          {id:'p1t5', title:'Request Security Memo from Unit Security Manager.', due:'2025-09-10', desc:'', done:false, completedAt:null},
          {id:'p1t6', title:'Check retainability with CSS.', due:'2025-09-10', desc:'', done:false, completedAt:null},
          {id:'p1t7', title:'If dependents, complete DAF 965 (if required).', due:'2025-09-23', desc:'', done:false, completedAt:null},
          {id:'p1t8', title:'If TDY enroute, attach RIP + funding info.', due:'2025-09-23', desc:'', done:false, completedAt:null},
          {id:'p1t9', title:'If carrying firearms, record POF details.', due:'2025-09-23', desc:'', done:false, completedAt:null},
          {id:'p1t10', title:'(Optional) AOI Acknowledgement Memo.', due:'2025-09-01', desc:'', done:false, completedAt:null}
        ]
      },
      {
        id:'p2', title:'Mid Prep', suspense:'2025-11-30',
        tasks:[
          {id:'p2t1', title:'Ensure VIPER folder populated; CSS marks Final Out Ready.', due:'2025-11-15', desc:'', done:false, completedAt:null},
          {id:'p2t2', title:'Route Relocation Processing Memo (weapons, GTC, care plan, etc.)', due:'2025-11-10', desc:'', done:false, completedAt:null},
          {id:'p2t3', title:'Virtual Outprocessing (vMPF) — complete all items except Outbound Assignments.', due:'2025-11-20', desc:'', done:false, completedAt:null},
          {id:'p2t4', title:'Fitness test valid through RNLTD (31 Jan).', due:'2025-11-15', desc:'', done:false, completedAt:null},
          {id:'p2t5', title:'Orders review (dependents, RNLTD, remarks).', due:'2025-11-10', desc:'', done:false, completedAt:null},
          {id:'p2t6', title:'Household Goods scheduling (TMO).', due:'2025-11-05', desc:'', done:false, completedAt:null},
          {id:'p2t7', title:'Circuitous Travel Memo (if using alternate routing).', due:'2025-11-12', desc:'', done:false, completedAt:null}
        ]
      },
      {
        id:'p3', title:'Final Out', suspense:'2025-12-19',
        tasks:[
          {id:'p3t1', title:'CSS Outprocessing — 1 duty day before MPF.', due:'2025-12-18', desc:'', done:false, completedAt:null},
          {id:'p3t2', title:'Final Out Appointment (MPF) — bring orders, SGLI, relocation memos, vOP, immunizations, security memo.', due:'2025-12-19', desc:'', done:false, completedAt:null},
          {id:'p3t3', title:'Port Call — upload orders to PTA, confirm flight.', due:'2025-12-10', desc:'', done:false, completedAt:null},
          {id:'p3t4', title:'Finance outprocessing (CPTS) — DLA, voucher, GTC.', due:'2025-12-19', desc:'', done:false, completedAt:null}
        ]
      },
      {
        id:'p4', title:'Arrival (Hill AFB)', suspense:'2026-01-31',
        tasks:[
          {id:'p4t1', title:'Report to gaining unit CSS within 24 hrs.', due:'2026-01-02', desc:'', done:false, completedAt:null},
          {id:'p4t2', title:'In-process Finance (update BAH, COLA, entitlements).', due:'2026-01-05', desc:'', done:false, completedAt:null},
          {id:'p4t3', title:'In-process Medical/Dental at Hill Clinic.', due:'2026-01-05', desc:'', done:false, completedAt:null},
          {id:'p4t4', title:'Update DEERS/Tricare with new address.', due:'2026-01-06', desc:'', done:false, completedAt:null},
          {id:'p4t5', title:'Secure housing (on/off base).', due:'2026-01-15', desc:'', done:false, completedAt:null},
          {id:'p4t6', title:'Enroll dependents in school/childcare.', due:'2026-01-10', desc:'', done:false, completedAt:null},
          {id:'p4t7', title:'Register pets at Hill Vet Clinic.', due:'2026-01-06', desc:'', done:false, completedAt:null}
        ]
      },
      {
        id:'p5', title:'Personal', suspense:null,
        tasks:[
          // Pets
          {id:'p5t1', title:'Schedule vet appointments (baseline/shots).', due:'2025-09-01', desc:'', done:false, completedAt:null},
          {id:'p5t2', title:'Book pet travel (AMC or commercial).', due:'2025-09-20', desc:'', done:false, completedAt:null},
          {id:'p5t3', title:'Pet health certificate — within 10 days of flight.', due:'2025-12-12', desc:'', done:false, completedAt:null},
          // Vehicles
          {id:'p5t4', title:'Decide car plan: sell, ship, or drive.', due:'2025-08-25', desc:'', done:false, completedAt:null},
          {id:'p5t5', title:'Car detailing & photos for sale.', due:'2025-09-10', desc:'', done:false, completedAt:null},
          {id:'p5t6', title:'POV shipment booking / paperwork.', due:'2025-11-01', desc:'', done:false, completedAt:null},
          {id:'p5t7', title:'Vehicle maintenance (if driving).', due:'2025-12-05', desc:'', done:false, completedAt:null},
          {id:'p5t8', title:'Insurance update for Utah.', due:'2025-12-15', desc:'', done:false, completedAt:null},
          // Housing / Household
          {id:'p5t9', title:'Housing notice to landlord.', due:'2025-10-15', desc:'', done:false, completedAt:null},
          {id:'p5t10', title:'Utilities shutoff scheduling.', due:'2025-11-25', desc:'', done:false, completedAt:null},
          {id:'p5t11', title:'USPS forwarding + close Ramstein CMR.', due:'2025-11-25', desc:'', done:false, completedAt:null},
          {id:'p5t12', title:'Yard sales/donate items.', due:'2025-09-15', desc:'', done:false, completedAt:null},
          {id:'p5t13', title:'Sperrmüll pickup booking.', due:'2025-12-10', desc:'', done:false, completedAt:null},
          {id:'p5t14', title:'Book TLF at Hill AFB.', due:'2025-10-10', desc:'', done:false, completedAt:null},
          {id:'p5t15', title:'School transcripts/withdrawal.', due:'2025-10-20', desc:'', done:false, completedAt:null},
          {id:'p5t16', title:'Medical/dental records (family).', due:'2025-10-20', desc:'', done:false, completedAt:null},
          {id:'p5t17', title:'Pack PCS docs in carry-on.', due:'2025-12-15', desc:'', done:false, completedAt:null}
        ]
      }
    ],
    timeline: [
      {date:'2025-07-15', title:'Assignment RIP issued', phase:null, done:true},
      {date:'2025-08-15', title:'Initial Briefing complete; begin medical/security', phase:'Pre-Departure', done:true},
      {date:'2025-09-23', title:'Document suspense — upload all required items', phase:'Pre-Departure', done:false},
      {date:'2025-10-15', title:'VIPER check & leadership routing', phase:'Mid Prep', done:false},
      {date:'2025-11-15', title:'Relocation memo routing & vOP; fitness valid; HHG scheduling', phase:'Mid Prep', done:false},
      {date:'2025-12-18', title:'CSS Outprocessing', phase:'Final Out', done:false},
      {date:'2025-12-19', title:'MPF Final Out appointment', phase:'Final Out', done:false},
      {date:'2025-12-22', title:'Departure', phase:'Final Out', done:false},
      {date:'2026-01-31', title:'RNLTD — report to Hill AFB', phase:'Arrival (Hill AFB)', done:false}
    ]
  };
}

// ------------------ State ------------------
let app = null;
function loadState(){
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) { app = seedData(); saveState(true); }
  else { try { app = JSON.parse(raw); } catch(e){ app = seedData(); saveState(true); } }
}
let saveTimer = null;
function saveState(immediate=false){
  const doSave = ()=>localStorage.setItem(LS_KEY, JSON.stringify(app));
  if (immediate) return doSave();
  clearTimeout(saveTimer); saveTimer = setTimeout(doSave, 180);
}

// ------------------ Utilities ------------------
const byDue = (a,b)=> (a.due||'9999-12-31').localeCompare(b.due||'9999-12-31') || a.title.localeCompare(b.title);
const byCompletedAtDesc = (a,b)=> (b.completedAt||0) - (a.completedAt||0);
function fmtDue(d){ return d ? `Due: ${d}` : 'No date'; }
function el(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
function currentCardIndex(){ const sc= document.getElementById('carousel'); const w=sc.clientWidth; return Math.round(sc.scrollLeft / (w*0.88 + 14)); }

// ------------------ Rendering ------------------
function render(){
  renderHome();
  renderTimeline();
}
function renderHome(){
  const wrap = document.getElementById('carousel'); wrap.innerHTML='';
  app.phases.forEach((p,i)=> wrap.appendChild(renderPhaseCard(p,i)));
  // pager
  const pager = document.getElementById('pager'); pager.innerHTML='';
  app.phases.forEach((p,i)=>{
    const dot = el('button', i===0?'active':'');
    dot.addEventListener('click', ()=> {
      const sc= document.getElementById('carousel');
      const card = sc.children[i];
      card.scrollIntoView({behavior:'smooth', inline:'center'});
    });
    pager.appendChild(dot);
  });
  // update dots on scroll
  wrap.addEventListener('scroll', ()=>{
    const dots = [...document.querySelectorAll('.pager button')];
    const sc= wrap; const w=sc.clientWidth; 
    const idx = Math.round(sc.scrollLeft / (w*0.88 + 14));
    dots.forEach((d,k)=> d.classList.toggle('active', k===idx));
  }, {passive:true});
}

function renderPhaseCard(phase, index){
  const card = el('section','phase-card collapsed');

  // header
  const head = el('div','phase-head');
  const titleInput = el('input','phase-title'); titleInput.value = phase.title;
  titleInput.addEventListener('change', ()=>{ phase.title = titleInput.value.trim()||phase.title; saveState(); renderTimeline(); });
  head.appendChild(titleInput);
  const stat = el('div','stat');
  const done = phase.tasks.filter(t=>t.done).length;
  stat.textContent = `${done}/${phase.tasks.length} complete`;
  head.appendChild(stat);
  card.appendChild(head);

  const prog = el('div','progress'); const bar = el('span'); bar.style.width = `${phase.tasks.length? (done/phase.tasks.length*100):0}%`; prog.appendChild(bar); card.appendChild(prog);

  // Lists
  const listActive = el('div','list');
  const listCompleted = el('div','list completed');

  const active = phase.tasks.filter(t=>!t.done).sort(byDue);
  const completed = phase.tasks.filter(t=>t.done).sort(byCompletedAtDesc);

  if (active.length===0) listActive.appendChild(el('div','stat','No active tasks.'));
  active.forEach(t=> listActive.appendChild(renderTaskRow(phase,t)));

  // Completed toggle
  const toggle = el('button','btn completed-toggle',`Completed (${completed.length})`);
  toggle.addEventListener('click', ()=> card.classList.toggle('collapsed'));
  card.appendChild(listActive);
  card.appendChild(toggle);

  if (completed.length){
    completed.forEach(t=> listCompleted.appendChild(renderTaskRow(phase,t)));
    card.appendChild(listCompleted);
  }

  // quick add
  const add = el('form','list');
  add.innerHTML = `
    <label style="width:100%">
      <input type="text" placeholder="Quick add task…" style="width:100%;padding:10px;border-radius:12px;border:1px solid var(--border);background:transparent;color:var(--text)"/>
    </label>`;
  add.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = add.querySelector('input').value.trim(); if(!v) return;
    phase.tasks.push({id:'t'+Date.now(), title:v, due:null, desc:'', done:false, completedAt:null});
    add.querySelector('input').value=''; saveState(); render();
  });
  card.appendChild(add);

  return card;
}

function renderTaskRow(phase, task){
  const row = el('div','task');
  const chk = el('div','chk'+(task.done?' checked':'')); chk.appendChild(el('div','dot'));
  chk.addEventListener('click', ()=>{
    task.done = !task.done; task.completedAt = task.done? Date.now(): null; saveState(); render();
  });
  row.appendChild(chk);

  const meta = el('div','meta');
  const title = el('div','title'); title.contentEditable = 'true'; title.textContent = task.title;
  title.addEventListener('blur', ()=>{ task.title = title.textContent.trim()||task.title; saveState(); });
  meta.appendChild(title);
  meta.appendChild(el('div','sub', fmtDue(task.due)));
  row.appendChild(meta);

  const actions = el('div','actions');
  const del = el('button','btn','✕');
  del.addEventListener('click', ()=>{
    if (!confirm('Delete this task?')) return;
    phase.tasks = phase.tasks.filter(t=>t!==task); saveState(); render();
  });
  actions.appendChild(del);
  row.appendChild(actions);
  return row;
}

// ------------------ Timeline ------------------
function renderTimeline(){
  const list = document.getElementById('timelineList'); list.innerHTML='';
  // Build a flat list of timeline items + any task that has a due date.
  const items = [...app.timeline.map(m => ({date:m.date, title:m.title, tag:m.phase||'General', done:!!m.done}))];
  app.phases.forEach(p=> p.tasks.forEach(t=> {
    if (t.due) items.push({date:t.due, title:`${p.title}: ${t.title}`, tag:'Task', done:!!t.done});
  }));
  items.sort((a,b)=> (a.date||'9999-12-31').localeCompare(b.date||'9999-12-31') || a.title.localeCompare(b.title));

  if (!items.length){ list.appendChild(el('div','stat','No dated items yet.')); return; }

  let lastMonth = '';
  items.forEach(it=>{
    const m = (it.date||'').slice(0,7);
    if (m && m!==lastMonth){
      lastMonth = m;
      const hdr = el('div','stat', new Date(it.date).toLocaleString(undefined, {month:'long', year:'numeric'}));
      list.appendChild(hdr);
    }
    const row = el('div','time-row');
    row.appendChild(el('div','date', it.date||'No date'));
    row.appendChild(el('div','title', it.title));
    list.appendChild(row);
  });
}

// ------------------ Nav / Sheet ------------------
function switchView(which){
  document.getElementById('viewHome').classList.toggle('hidden', which!=='home');
  document.getElementById('viewTimeline').classList.toggle('hidden', which!=='timeline');
}
function openSheet(){ document.getElementById('sheet').classList.remove('hidden'); }
function closeSheet(){ document.getElementById('sheet').classList.add('hidden'); }

// ------------------ Boot ------------------
function boot(){
  loadState();
  render();

  document.getElementById('navHome').onclick = ()=> switchView('home');
  document.getElementById('navTimeline').onclick = ()=> switchView('timeline');
  document.getElementById('navAdd').onclick = ()=> {
    // Add task to the currently visible phase (by scroll position)
    const sc = document.getElementById('carousel');
    const dots = [...document.querySelectorAll('.pager button')];
    let idx = dots.findIndex(d=>d.classList.contains('active'));
    if (idx<0) idx = 0;
    openSheet();
    const form = document.getElementById('addTaskForm');
    form.onsubmit = (e)=>{
      e.preventDefault();
      const title = document.getElementById('taskTitle').value.trim();
      const due = document.getElementById('taskDue').value || null;
      const desc = document.getElementById('taskDesc').value.trim();
      if(!title) return;
      app.phases[idx].tasks.push({id:'t'+Date.now(), title, due, desc, done:false, completedAt:null});
      saveState(); closeSheet(); render();
      form.reset();
    };
    document.getElementById('cancelAdd').onclick = ()=>{ form.reset(); closeSheet(); };
  };

  document.getElementById('btnReset').onclick = ()=>{
    if (!confirm('Reset data to seed?')) return;
    localStorage.removeItem(LS_KEY); loadState(); render();
  };

  // default to Home
  switchView('home');
}
document.addEventListener('DOMContentLoaded', boot);
