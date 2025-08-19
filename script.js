// easyPCS – mobile-first PWA (vanilla JS + LocalStorage)
// Routing: #/home, #/phase/:id, #/timeline
// Storage key: "easyPCS"
// Core guards: no disappearing tasks; render Active and Completed separately.

const STORAGE_KEY = "easyPCS";

/* ---------- Utilities ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const debounce = (fn, ms=200) => { let t; return (...a) => { clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };
const esc = (s="") => s.replace(/[&<>"']/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", """:"&quot;", "'":"&#39;" }[m]));

const byDueAsc = (a,b)=>{
  const ad = a.due||"", bd = b.due||"";
  if(ad && bd){ const c = ad.localeCompare(bd); if(c) return c; }
  if(ad && !bd) return -1; if(!ad && bd) return 1;
  return (a.title||"").localeCompare(b.title||"");
};
const byCompletedDesc = (a,b)=> (b.completedAt||0)-(a.completedAt||0);

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
const saveStateDebounced = debounce(saveState, 200);

/* ---------- Seed data ---------- */
function seedData(){
  return {
    phases: [
      { id:"p1", title:"Pre‑Departure", suspense:"2025-09-23", tasks:[
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
      ]},
      { id:"p2", title:"Mid Prep", suspense:"2025-11-30", tasks:[
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
      ]},
      { id:"p3", title:"Final Out", suspense:"2025-12-19", tasks:[
        {"id":"p3t1","title":"CSS Outprocessing — 1 duty day before MPF","due":"2025-12-18","desc":"","done":false,"completedAt":null},
        {"id":"p3t2","title":"Final Out Appointment (MPF) — WaitWhile; bring all docs","due":"2025-12-19","desc":"Checklist: PCS Orders (verified), Certified SOES/SGLI, 2× Relocation Memos (signed), vOP Checklist (all cleared), Immunizations Memo, Security Clearance Memo","done":false,"completedAt":null},
        {"id":"p3t3","title":"Port Call (Passenger Travel) — upload orders to PTA, confirm flight","due":"2025-12-10","desc":"","done":false,"completedAt":null},
        {"id":"p3t4","title":"Finance Outprocessing (CPTS) — DLA, travel voucher, GTC usage","due":"2025-12-19","desc":"","done":false,"completedAt":null}
      ]},
      { id:"p4", title:"Arrival (Hill AFB)", suspense:"2026-01-31", tasks:[
        {"id":"p4t1","title":"Report to unit CSS within 24 hrs","due":"2026-01-02","desc":"","done":false,"completedAt":null},
        {"id":"p4t2","title":"In‑process Finance (update BAH, COLA, etc.)","due":"2026-01-05","desc":"","done":false,"completedAt":null},
        {"id":"p4t3","title":"In‑process Medical at Hill AFB Clinic","due":"2026-01-05","desc":"","done":false,"completedAt":null},
        {"id":"p4t4","title":"Update DEERS/Tricare with new address","due":"2026-01-06","desc":"","done":false,"completedAt":null},
        {"id":"p4t5","title":"Secure housing (on/off base)","due":"2026-01-15","desc":"","done":false,"completedAt":null},
        {"id":"p4t6","title":"School/childcare enrollment for dependents","due":"2026-01-10","desc":"","done":false,"completedAt":null}
      ]}
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
    ]
  };
}

/* ---------- Load state or seed ---------- */
function loadState(){
  try{
    const j = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if(!j || !Array.isArray(j.phases) || j.phases.length===0) return null;
    return j;
  }catch(e){ return null; }
}
let state = loadState();
if(!state){
  state = seedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- Router ---------- */
let currentPhaseId = null;
function show(id){ $$(".view").forEach(v=>v.classList.remove("active")); $("#"+id).classList.add("active"); }
function route(){
  const h = location.hash || "#/home";
  if(h.startsWith("#/phase/")){
    currentPhaseId = decodeURIComponent(h.split("/")[2]);
    show("viewPhase"); renderPhaseView(currentPhaseId);
  }else if(h.startsWith("#/timeline")){
    show("viewTimeline"); renderTimeline();
  }else{
    show("viewHome"); renderHome();
  }
}
window.addEventListener("hashchange", route);

/* ---------- Home (carousel) ---------- */
function phaseStats(p){
  const total = p.tasks.length;
  const done = p.tasks.filter(t=>t.done).length;
  const next = p.tasks.filter(t=>!t.done && t.due).map(t=>t.due).sort()[0] || null;
  return { total, done, next };
}
function renderHome(){
  const scroller = $("#phaseCarousel"); scroller.innerHTML = "";
  const dots = $("#carouselDots"); dots.innerHTML = "";

  state.phases.forEach((p, i)=>{
    const { total, done, next } = phaseStats(p);
    const card = document.createElement("button");
    card.className = "phase-card"; card.dataset.phaseId = p.id; card.setAttribute("aria-label", p.title);
    card.innerHTML = `
      <div class="phase-header-row">
        <div class="phase-title">${esc(p.title)}</div>
        <div class="phase-metrics">${done}/${total} complete</div>
      </div>
      <div class="progress"><div class="progress-fill" style="width:${total? Math.round(done/total*100):0}%"></div></div>
      <div class="next-date">Next: ${next || "—"}</div>`;
    scroller.appendChild(card);

    const dot = document.createElement("div");
    dot.className = "dot" + (i===0?" active":""); dot.dataset.index=i; dots.appendChild(dot);
  });

  scroller.onclick = (e)=>{
    const btn = e.target.closest(".phase-card"); if(!btn) return;
    location.hash = "#/phase/" + encodeURIComponent(btn.dataset.phaseId);
  };
  scroller.addEventListener("scroll", onCarouselScroll, {passive:true});
  requestAnimationFrame(onCarouselScroll);
}
function onCarouselScroll(){
  const scroller = $("#phaseCarousel");
  const center = scroller.getBoundingClientRect().left + scroller.clientWidth/2;
  const cards = $$(".phase-card", scroller);
  let best = 0, bestDist = Infinity;
  cards.forEach((c,i)=>{
    const r = c.getBoundingClientRect();
    const d = Math.abs((r.left+r.width/2)-center);
    if(d<bestDist){ bestDist=d; best=i; }
  });
  $$(".dot").forEach((d,i)=> d.classList.toggle("active", i===best));
}

/* ---------- Phase Detail ---------- */
function renderPhaseView(phaseId){
  const p = state.phases.find(x=>x.id===phaseId);
  if(!p){ location.hash="#/home"; return; }
  $("#phaseTitleInput").value = p.title;
  renderTaskLists(p);
}
function renderTaskLists(phase){
  const active = phase.tasks.filter(t=>!t.done).sort(byDueAsc);
  const completed = phase.tasks.filter(t=>t.done).sort(byCompletedDesc);

  const activeList = $("#activeList"), completedList = $("#completedList");
  activeList.innerHTML = ""; completedList.innerHTML = "";
  $("#emptyPhase").hidden = !(active.length===0 && completed.length===0);

  active.forEach(t=> activeList.appendChild(renderTaskRow(phase.id,t)));
  $("#completedLabel").textContent = `Completed (${completed.length})`;
  completed.forEach(t=> completedList.appendChild(renderTaskRow(phase.id,t,true)));

  // Collapse completed by default if many
  const block = $("#completedBlock");
  if(completed.length>5) block.open = false;
}
function renderTaskRow(phaseId, task, isCompleted=false){
  const row = document.createElement("div");
  row.className = "task-row";
  row.dataset.phaseId = phaseId;
  row.dataset.taskId = task.id;
  row.innerHTML = `
    <button class="check${task.done?' done':''}" aria-label="Toggle complete" title="Toggle complete">
      ${task.done? '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>':''}
    </button>
    <div class="task-main">
      <div class="task-title" contenteditable="true" spellcheck="false">${esc(task.title)}</div>
      <div class="task-date">${task.due || "No date"}</div>
    </div>
    <button class="expand-btn" aria-label="Expand details" title="Expand"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="currentColor"/></svg></button>`;

  const desc = document.createElement("div");
  desc.className="task-desc";
  desc.innerHTML = `
    <div class="desc-text">${esc(task.desc||"")}</div>
    <div class="desc-actions" style="display:flex; gap:8px; margin-top:8px;">
      <label class="sr-only" for="date-${task.id}">Due Date</label>
      <input id="date-${task.id}" class="input" type="date" value="${task.due||''}">
      <button class="btn small" data-action="edit-desc">Edit</button>
      <button class="btn danger small" data-action="delete-task">Delete</button>
    </div>`;
  const frag = document.createDocumentFragment();
  frag.appendChild(row); frag.appendChild(desc);
  return frag;
}

/* Task list interactions (event delegation) */
$("#taskLists").addEventListener("click", (e)=>{
  const row = e.target.closest(".task-row");
  const btn = e.target.closest("button");
  if(!row || !btn) return;
  const {phaseId, taskId} = row.dataset;
  const p = state.phases.find(x=>x.id===phaseId);
  const t = p.tasks.find(x=>x.id===taskId);

  if(btn.classList.contains("check")){
    t.done = !t.done;
    t.completedAt = t.done ? Date.now() : null;
    saveStateDebounced();
    renderTaskLists(p); renderHome();
    return;
  }
  if(btn.classList.contains("expand-btn")){
    row.classList.toggle("expanded");
    const desc = row.nextElementSibling;
    if(desc && desc.classList.contains("task-desc")){
      desc.style.display = row.classList.contains("expanded") ? "block" : "none";
    }
    return;
  }
  if(btn.dataset.action==="delete-task"){
    if(confirm(`Delete task “${t.title}”?`)){
      p.tasks = p.tasks.filter(x=>x.id!==t.id);
      saveStateDebounced(); renderTaskLists(p); renderHome();
    }
    return;
  }
  if(btn.dataset.action==="edit-desc"){
    const next = prompt("Edit description (max 180 chars):", (t.desc||"").slice(0,180));
    if(next!==null){ t.desc = (next||"").slice(0,180); saveStateDebounced(); renderTaskLists(p); }
    return;
  }
});
// Inline title edit
$("#taskLists").addEventListener("blur", (e)=>{
  if(!e.target.classList.contains("task-title")) return;
  const row = e.target.closest(".task-row");
  const {phaseId, taskId} = row.dataset;
  const p = state.phases.find(x=>x.id===phaseId);
  const t = p.tasks.find(x=>x.id===taskId);
  const v = (e.target.textContent||"").trim().slice(0,60) || "Untitled";
  if(t.title !== v){ t.title = v; saveStateDebounced(); renderTaskLists(p); renderHome(); }
}, true);
// Date change
$("#taskLists").addEventListener("change", (e)=>{
  if(!e.target.matches('input[type="date"]')) return;
  const desc = e.target.closest(".task-desc");
  const row = desc?.previousElementSibling;
  if(!row) return;
  const {phaseId, taskId} = row.dataset;
  const p = state.phases.find(x=>x.id===phaseId);
  const t = p.tasks.find(x=>x.id===taskId);
  t.due = e.target.value || null;
  saveStateDebounced(); renderTaskLists(p); renderHome();
});

/* Add Task (phase-scoped) */
$("#addTaskForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const title = ($("#taskTitle").value||"").trim().slice(0,60);
  if(!title){ $("#taskTitle").focus(); return; }
  const due = $("#taskDue").value || null;
  const desc = ($("#taskDesc").value||"").trim().slice(0,180);
  const p = state.phases.find(x=>x.id===currentPhaseId);
  p.tasks.push({ id:"t_"+Date.now()+"_"+Math.random().toString(36).slice(2,5), title, due, desc, done:false, completedAt:null });
  $("#taskTitle").value=""; $("#taskDue").value=""; $("#taskDesc").value="";
  saveStateDebounced(); renderTaskLists(p); renderHome(); toast("Task added");
});

/* Phase title edit + delete + back */
$("#btnBack").addEventListener("click", ()=> location.hash="#/home");
let prevTitle = "";
$("#phaseTitleInput").addEventListener("focus", e=> prevTitle = e.target.value);
$("#phaseTitleInput").addEventListener("keydown", e=>{
  if(e.key==="Escape"){ e.target.value = prevTitle; e.target.blur(); }
  if(e.key==="Enter"){ e.preventDefault(); e.target.blur(); }
});
$("#phaseTitleInput").addEventListener("blur", e=>{
  const p = state.phases.find(x=>x.id===currentPhaseId); if(!p) return;
  const v = (e.target.value||"").trim() || "Untitled";
  if(p.title!==v){ p.title = v; saveStateDebounced(); renderHome(); }
});
$("#btnDeletePhase").addEventListener("click", ()=>{
  const p = state.phases.find(x=>x.id===currentPhaseId);
  if(!p) return;
  if(confirm(`Delete phase “${p.title}” and all tasks? This cannot be undone.`)){
    state.phases = state.phases.filter(x=>x.id!==p.id);
    saveStateDebounced();
    location.hash = "#/home";
  }
});

/* Bottom Nav */
$("#navHome").addEventListener("click", ()=> location.hash="#/home");
$("#navTimeline").addEventListener("click", ()=> location.hash="#/timeline");
$("#navAdd").addEventListener("click", ()=>{
  if(currentPhaseId){
    $("#taskTitle").focus();
  }else{
    // From home/timeline, choose the first phase for quick add
    location.hash="#/phase/" + state.phases[0].id;
    setTimeout(()=> $("#taskTitle").focus(), 0);
  }
});

/* Menu (Reset + About) */
const menuBtn = $("#btnMenu"), menu = $("#menu");
menuBtn.addEventListener("click", ()=> menu.hidden = !menu.hidden);
document.addEventListener("click", (e)=>{
  if(e.target===menuBtn || menu.contains(e.target)) return;
  menu.hidden = true;
});
$("#actionReset").addEventListener("click", ()=>{
  if(confirm("Reset all data and reseed? This cannot be undone.")){
    localStorage.removeItem(STORAGE_KEY);
    state = seedData(); saveState(); location.hash="#/home"; route(); toast("Data reset");
  }
});
$("#actionAbout").addEventListener("click", ()=>{
  alert("easyPCS • mobile-first PWA\nLocal-only storage. Built with vanilla HTML/CSS/JS.");
});

/* ---------- Timeline ---------- */
function renderCalendar(container){
  const now = new Date();
  const y = now.getFullYear(); const m = now.getMonth();
  const first = new Date(y,m,1);
  const startDay = first.getDay(); // 0=Sun
  const daysInMonth = new Date(y,m+1,0).getDate();
  container.innerHTML = "";
  for(let i=0;i<startDay;i++){
    const pad = document.createElement("div"); pad.className="day"; pad.style.visibility="hidden"; container.appendChild(pad);
  }
  for(let d=1; d<=daysInMonth; d++){
    const el = document.createElement("div"); el.className="day"; el.textContent = d;
    const isToday = (d===now.getDate());
    if(isToday) el.classList.add("today");
    container.appendChild(el);
  }
}
function renderTimeline(){
  renderCalendar($("#calendar"));

  const filter = $(".chip.active")?.dataset.filter || "all";
  const items = [];

  // Seeded milestones
  state.timeline.forEach(x=> items.push({ date:x.date, title:x.title, phase:x.phase, source:"milestone" }));
  // All tasks with dates
  state.phases.forEach(p=>{
    p.tasks.forEach(t=>{
      if(t.due){
        items.push({ date:t.due, title:t.title, phase:p.title, taskRef:{phaseId:p.id, taskId:t.id}, source:"task" });
      }
    });
  });

  // Filter
  const filtered = items.filter(it=> filter==="all" || it.phase===filter);
  // Sort by date ASC, then title
  filtered.sort((a,b)=>{
    const c = (a.date||"").localeCompare(b.date||""); if(c) return c;
    return (a.title||"").localeCompare(b.title||"");
  });

  const list = $("#timelineList"); list.innerHTML="";
  filtered.forEach(it=>{
    const row = document.createElement("button");
    row.className="item"; row.innerHTML = `
      <div class="title"><strong>${esc(it.title)}</strong></div>
      <div class="date">${it.date || "No date"} • ${esc(it.phase || "General")}</div>`;
    row.addEventListener("click", ()=>{
      if(it.taskRef){
        location.hash = "#/phase/" + it.taskRef.phaseId;
        setTimeout(()=>{
          // expand the task
          const row = document.querySelector('.task-row[data-task-id="'+it.taskRef.taskId+'"]');
          if(row){ row.classList.add("expanded"); const desc=row.nextElementSibling; if(desc) desc.style.display="block"; }
        }, 0);
      }
    });
    list.appendChild(row);
  });

  // Filter chip clicks
  $(".filters").onclick = (e)=>{
    const btn = e.target.closest(".chip"); if(!btn) return;
    $$(".chip").forEach(c=>c.classList.remove("active"));
    btn.classList.add("active");
    renderTimeline();
  };
}

/* ---------- Toast ---------- */
function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.remove("hidden");
  clearTimeout(toast._t); toast._t=setTimeout(()=> t.classList.add("hidden"), 1600);
}

/* ---------- Boot ---------- */
route(); // initial
