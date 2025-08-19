
/* easyPCS - minimal vertical phases + working routing + reset + full seed
   - Always route to #/home
   - Render vertical phase cards (collapsed by default)
   - Toggle tasks between Active/Completed without dropping list
   - Timeline view
*/

const LS_KEY = "easyPCS";

// Ensure we always land on #/home
function ensureHomeRoute() {
  if (!location.hash || location.hash === "#") {
    location.replace("#/home");
  }
}
ensureHomeRoute();

/* ---------- Seed Data (full) ---------- */
function seedData() {
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
          {"id":"p1t14","title":"(Optional) Use AOI orders for HHG/Passenger Travel scheduling — cannot depart without amendment validating FMTS/security clearance","due":"2025-09-10","desc":"","done":false,"completedAt":null},
          {"id":"p1t15","title":"Book pet transport if flying","due":"2025-09-20","desc":"","done":false,"completedAt":null},
          {"id":"p1t16","title":"Schedule vet appointment for 3 cats (checkups, vaccines)","due":"2025-09-05","desc":"","done":false,"completedAt":null},
          {"id":"p1t17","title":"Decide car plan: sell, ship, or drive","due":"2025-08-25","desc":"","done":false,"completedAt":null},
          {"id":"p1t18","title":"Start yard sales / donate items","due":"2025-09-15","desc":"","done":false,"completedAt":null},
          {"id":"p1t19","title":"Start car sale prep (detailing, photos, title/lien)","due":"2025-09-18","desc":"","done":false,"completedAt":null},
          {"id":"p1t20","title":"Plan Sperrmüll pickup (book a slot 30 days out)","due":"2025-09-28","desc":"","done":false,"completedAt":null},
          {"id":"p1t21","title":"Book temporary lodging at Hill (TLF)","due":"2025-10-05","desc":"","done":false,"completedAt":null}
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
          {"id":"p2t14","title":"If traveling different routing: submit Circuitous Travel Memo","due":"2025-11-12","desc":"","done":false,"completedAt":null},
          {"id":"p2t15","title":"Schedule HHG pre‑inspection","due":"2025-10-20","desc":"","done":false,"completedAt":null},
          {"id":"p2t16","title":"Confirm school records/transcripts for dependents","due":"2025-10-25","desc":"","done":false,"completedAt":null},
          {"id":"p2t17","title":"Request medical/dental records for family","due":"2025-10-25","desc":"","done":false,"completedAt":null}
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
          {"id":"p3t4","title":"Finance Outprocessing (CPTS) — DLA, travel voucher, GTC usage","due":"2025-12-19","desc":"","done":false,"completedAt":null},
          {"id":"p3t5","title":"Pack PCS docs in carry‑on","due":"2025-12-15","desc":"","done":false,"completedAt":null},
          {"id":"p3t6","title":"Close Ramstein PO Box","due":"2025-12-16","desc":"","done":false,"completedAt":null},
          {"id":"p3t7","title":"Sperrmüll pickup for final disposals","due":"2025-12-12","desc":"","done":false,"completedAt":null},
          {"id":"p3t8","title":"Car insurance switched for Utah (if shipping/driving)","due":"2025-12-17","desc":"","done":false,"completedAt":null},
          {"id":"p3t9","title":"Clean housing for final inspection","due":"2025-12-17","desc":"","done":false,"completedAt":null},
          {"id":"p3t10","title":"Complete pet health certificate (within 10 days of flight)","due":"2025-12-14","desc":"","done":false,"completedAt":null}
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
          {"id":"p4t6","title":"School/childcare enrollment for dependents","due":"2026-01-10","desc":"","done":false,"completedAt":null},
          {"id":"p4t7","title":"Register pets at Hill Vet Clinic","due":"2026-01-07","desc":"","done":false,"completedAt":null}
        ]
      }
    ],
    timeline: [
      {"date":"2025-07-15","title":"Assignment RIP issued","phase":null,"done":true},
      {"date":"2025-08-10","title":"Pre‑Departure: Review PCS RIP and assignment details.","phase":"Pre‑Departure","done":false},
      {"date":"2025-08-15","title":"Initial Briefing complete; begin medical/security","phase":"Pre‑Departure","done":true},
      {"date":"2025-08-15","title":"Pre‑Departure: Complete Initial Assignment Briefing (vMPF).","phase":"Pre‑Departure","done":true},
      {"date":"2025-08-25","title":"Personal: Decide car plan: sell, ship, or drive.","phase":"Pre‑Departure","done":false},
      {"date":"2025-08-25","title":"Pre‑Departure: Schedule immunizations clinic appointment.","phase":"Pre‑Departure","done":false},
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
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
}

function loadState(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw){ return seedData(); }
  try{ return JSON.parse(raw); }catch(e){ console.warn("State parse failed, reseeding",e); return seedData(); }
}
let state = loadState();

// Debounced save
let saveTimer=null;
function saveState(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>localStorage.setItem(LS_KEY, JSON.stringify(state)), 180);
}

/* ---------- Helpers ---------- */
const byDue = (a,b)=> (a.due||"9999-12-31").localeCompare(b.due||"9999-12-31");
const byCompletedAtDesc = (a,b)=> (b.completedAt||0) - (a.completedAt||0);
function fmtNextDue(tasks){
  const upcoming = tasks.filter(t=>!t.done && t.due).sort(byDue)[0];
  return upcoming ? upcoming.due : "—";
}
function qs(sel,root=document){ return root.querySelector(sel); }
function qsa(sel,root=document){ return [...root.querySelectorAll(sel)]; }

/* ---------- Rendering ---------- */
const app = document.getElementById("app");

function renderHome(){
  app.innerHTML = "";
  state.phases.forEach(phase=>{
    const done = phase.tasks.filter(t=>t.done).length;
    const total = phase.tasks.length;
    const next = fmtNextDue(phase.tasks);
    const card = document.createElement("section");
    card.className = "phase-card";
    card.innerHTML = `
      <div class="phase-head">
        <div>
          <h2 class="phase-title">${phase.title}</h2>
          <div class="phase-meta">${done}/${total} complete • Next: ${next}</div>
        </div>
        <button class="icon-btn toggle" aria-expanded="false" data-id="${phase.id}">▼</button>
      </div>
      <div class="progress"><i style="width:${total? (done/total*100).toFixed(0) : 0}%"></i></div>
      <div class="tasks" id="tasks-${phase.id}"></div>
    `;
    app.appendChild(card);
    // collapsed by default; no open class initially
    renderTaskLists(phase);
  });
}

function renderTaskLists(phase){
  const container = document.getElementById("tasks-"+phase.id);
  if(!container) return;
  const active = phase.tasks.filter(t=>!t.done).sort(byDue);
  const completed = phase.tasks.filter(t=>t.done).sort(byCompletedAtDesc);

  const makeRow = (t)=>{
    const row = document.createElement("div");
    row.className = "task-row";
    row.dataset.pid = phase.id; row.dataset.tid = t.id;
    row.innerHTML = `
      <div class="cb ${t.done?'checked':''}" role="checkbox" aria-checked="${t.done}">
        <span class="tick">✓</span>
      </div>
      <div class="task-main">
        <div class="task-title">${t.title}</div>
        <div class="task-sub">${t.due? t.due : 'No date'}</div>
      </div>
      <div class="task-actions">
        <button class="icon-btn expand" aria-label="Details">▾</button>
        <button class="icon-btn del" aria-label="Delete">✕</button>
      </div>
    `;
    const desc = document.createElement("div");
    desc.className="desc";
    desc.textContent = t.desc || "No additional details.";
    return [row, desc];
  };

  const frag = document.createDocumentFragment();
  // Active
  const hA = document.createElement("div"); hA.className="section-title"; hA.textContent=`Active (${active.length})`;
  frag.appendChild(hA);
  active.forEach(t=>{ const [r,d]=makeRow(t); frag.appendChild(r); frag.appendChild(d); });
  // Completed (collapsed by default)
  const hC = document.createElement("div"); hC.className="section-title"; hC.textContent=`Completed (${completed.length})`;
  hC.dataset.collapsed = "true";
  frag.appendChild(hC);
  const wrapC = document.createElement("div");
  wrapC.style.display = "none";
  completed.forEach(t=>{ const [r,d]=makeRow(t); frag.appendChild(wrapC); wrapC.appendChild(r); wrapC.appendChild(d); });
  frag.appendChild(wrapC);

  container.innerHTML = ""; // within phase container only
  container.appendChild(frag);
}

/* ---------- Timeline ---------- */
function renderTimeline(){
  app.innerHTML = `<h2 class="h1">Master Timeline</h2>`;
  // Gather dated tasks
  const items = [];
  state.phases.forEach(p=>p.tasks.forEach(t=>{
    if(t.due){ items.push({date:t.due, title:`${p.title}: ${t.title}`, phase:p.title}); }
  }));
  state.timeline.forEach(m=> items.push({date:m.date, title:m.title, phase:m.phase||""}));
  items.sort((a,b)=>a.date.localeCompare(b.date));

  // group by month
  let lastMonth = "";
  items.forEach(it=>{
    const month = new Date(it.date+"T00:00:00").toLocaleString(undefined,{month:'long',year:'numeric'});
    if(month!==lastMonth){
      const m = document.createElement("div"); m.className="month"; m.textContent = month; app.appendChild(m); lastMonth=month;
    }
    const card = document.createElement("div"); card.className="time-card";
    card.innerHTML = `<div class="time-date">${it.date}</div><div>${it.title}</div>`;
    app.appendChild(card);
  });
}

/* ---------- Events ---------- */
document.getElementById("btnReset").addEventListener("click", ()=>{
  if(confirm("Reset easyPCS to factory data?")){ localStorage.removeItem(LS_KEY); state = seedData(); renderHome(); }
});

document.getElementById("navHome").addEventListener("click", ()=>{ location.hash = "#/home"; });
document.getElementById("navTimeline").addEventListener("click", ()=>{ location.hash = "#/timeline"; });
document.getElementById("navAdd").addEventListener("click", ()=>{
  alert("Add sheet coming in the next build. For now, expand a phase and manage tasks there.");
});

// expand/collapse phase tasks & task interactions using event delegation
app.addEventListener("click",(e)=>{
  const t = e.target;
  // Toggle phase open
  if(t.classList.contains("toggle")){
    const id = t.dataset.id;
    const box = document.getElementById("tasks-"+id);
    if(!box) return;
    const open = box.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
    return;
  }
  // Completed section open/close
  if(t.classList.contains("section-title")){
    const next = t.nextElementSibling;
    if(next && next.style){
      const collapsed = next.style.display === "none";
      next.style.display = collapsed ? "block" : "none";
    }
    return;
  }
  // Inside a task row
  const row = t.closest(".task-row");
  if(row){
    const pid = row.dataset.pid; const tid = row.dataset.tid;
    const phase = state.phases.find(p=>p.id===pid);
    const task = phase?.tasks.find(x=>x.id===tid);
    if(!task) return;

    if(t.closest(".cb")){
      task.done = !task.done;
      task.completedAt = task.done ? Date.now() : null;
      saveState();
      renderHome(); // refresh counts & lists
      return;
    }
    if(t.classList.contains("expand")){
      row.classList.toggle("expanded");
      return;
    }
    if(t.classList.contains("del")){
      if(confirm("Delete this task?")){
        phase.tasks = phase.tasks.filter(x=>x.id!==tid);
        saveState();
        renderHome();
      }
      return;
    }
  }
});

/* ---------- Router ---------- */
function onRoute(){
  ensureHomeRoute();
  const h = location.hash;
  if(h.startsWith("#/timeline")) renderTimeline();
  else renderHome();
}
window.addEventListener("hashchange", onRoute);
onRoute();
