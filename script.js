// easyPCS — seeded v2 (4 phases, full task list) — vanilla JS + localStorage
const KEY='easyPCS-seeded-v2';

// Seed object (id, title, tasks[])
const seed = {
  "phases": [
    {
      "id": "p1",
      "title": "Pre‑Departure",
      "tasks": [
        "Complete Initial Assignment Briefing in vMPF (within 7 days of RIP)",
        "Fill out and upload Assignment Information Worksheet",
        "Verify dependents in DEERS / print DD 1172-2",
        "Complete SOES/SGLI update in milConnect; print certified copy",
        "Start Family Member Travel Screening (FMTS) and Initial Travel Screening Questionnaire (ITSQ)",
        "Schedule/complete Immunizations Memo (86 MDG Immunizations)",
        "Obtain Security Clearance Memorandum from unit Security Manager (SECRET required; validate in DISS)",
        "Check if retainability is required → start process with CSS; obtain signed Retention memo",
        "If dependents, complete DAF 965 Overseas Tour Election (only if required)",
        "If TDY enroute, attach RIP + funding info",
        "If carrying firearms, record POF details (Make/Model/Serial)",
        "(Optional) Sign AOI Acknowledgement Memo",
        "(Optional) Upload Assignment Worksheet, medical clearance initiation screenshot, DD1172-2",
        "(Optional) Use AOI orders for HHG/Passenger Travel scheduling — cannot depart without amendment validating FMTS/security clearance",
        "Decide whether to ship vehicle or sell vehicle",
        "If shipping vehicle: collect title/registration/insurance; book POV shipment",
        "If selling vehicle: list, bill of sale template, DMV paperwork",
        "Book veterinarian appointments for 3 cats (check-ups + certificates)",
        "Request pet health certificates (within airline window)",
        "Book pet-friendly travel / airline pet reservations",
        "Buy travel kennels & labels; verify airline dimensions"
      ]
    },
    {
      "id": "p2",
      "title": "Mid Prep",
      "tasks": [
        "VIPER Folder – upload all required docs; CSS marks ‘In Person Final Out Ready – Submitted to MPF.’",
        "Relocation Processing Memorandum",
        "Weapons training current (AF 522 if required)",
        "Security debrief / badge turn‑in",
        "Family Care Plan (AF 357) if single parent/mil‑to‑mil",
        "GTC active / mission‑critical",
        "AT/FP Brief (not required CONUS)",
        "Fitness file closed/hand‑carried if applicable",
        "Route for CC/DO/CCF/First Sgt signature",
        "Virtual Outprocessing (vMPF) – complete all items except Outbound Assignments",
        "Physical Fitness valid through 2026‑01‑31 (retest if due)",
        "Orders Review – dependents, RNLTD, remarks",
        "Household Goods (TMO) – after orders/AOI, schedule pack‑out",
        "If traveling different routing: submit Circuitous Travel Memo",
        "Reserve lodging (TLF/Hotel) at Hill AFB ahead of house‑hunting",
        "Confirm pet‑friendly lodging / temporary housing",
        "Arrange mail forwarding & address change plan"
      ]
    },
    {
      "id": "p3",
      "title": "Final Out",
      "tasks": [
        "CSS Outprocessing – 1 duty day before MPF",
        "Final Out Appointment (MPF) – WaitWhile; bring all docs (Orders, Certified SOES/SGLI, 2× Relocation Memos, vOP Checklist, Immunizations Memo, Security Clearance Memo)",
        "Port Call (Passenger Travel) – upload orders to PTA, confirm flight",
        "Finance Outprocessing (CPTS) – DLA, travel voucher, GTC usage",
        "Confirm HHG pack/pickup dates; inventory photos",
        "Confirm pet travel bookings and crate drop‑off instructions",
        "Return GTC receipts organized for voucher"
      ]
    },
    {
      "id": "p4",
      "title": "Arrival (Hill AFB)",
      "tasks": [
        "Report to unit CSS within 24 hrs",
        "In‑process Finance (update BAH, COLA, etc.)",
        "In‑process Medical at Hill AFB Clinic",
        "Update DEERS/Tricare with new address",
        "Secure housing (on/off base)",
        "School/childcare enrollment for dependents",
        "Pick up POV or complete vehicle purchase/registration",
        "Register pets per base/state guidance; establish new vet",
        "Set up utilities; update driver’s license/address",
        "File final travel voucher if pending"
      ]
    }
  ]
};

// Convert to runtime structure with task ids
function expandedSeed() {
  const withIds = structuredClone(seed);
  withIds.phases.forEach((p) => {
    p.tasks = p.tasks.map((t, j) => ({ id: `${p.id}-t${j+1}`, title: t, done: false }));
  });
  return withIds.phases;
}

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return expandedSeed();
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed) ? parsed : expandedSeed();
  }catch(e){ console.warn('Storage error, using seed', e); return expandedSeed(); }
}

let phases = load();
const save = (()=>{ let t; return ()=>{ clearTimeout(t); t=setTimeout(()=>{
  try{ localStorage.setItem(KEY, JSON.stringify(phases)); }catch(e){ console.warn('Persist failed', e); }
}, 180); };})();

const $ = (s, r=document)=>r.querySelector(s);
const phasesEl = $("#phases");
const phaseTpl = $("#phaseTpl");
const taskTpl = $("#taskTpl");

// Render all phases and tasks
function render(){
  phasesEl.innerHTML='';
  phases.forEach(p=>{
    const node = phaseTpl.content.firstElementChild.cloneNode(true);
    node.dataset.phaseId = p.id;
    $(".phase-title", node).textContent = p.title;
    const ul = $(".task-list", node);

    const total = p.tasks.length;
    const doneCount = p.tasks.filter(t=>t.done).length;
    $(".total", node).textContent = total;
    $(".done", node).textContent = doneCount;

    p.tasks.forEach(t=>{
      const li = taskTpl.content.firstElementChild.cloneNode(true);
      li.dataset.taskId = t.id;
      $(".task-title", li).textContent = t.title;
      $(".check input", li).checked = !!t.done;
      ul.appendChild(li);
    });

    phasesEl.appendChild(node);
  });
}
render();

// Delegated events for add/delete/toggle/edit
phasesEl.addEventListener('click', (e)=>{
  const del = e.target.closest('.delete');
  const addBtn = e.target.closest('.add-task');
  const check = e.target.closest('.check input');

  // Add task
  if(addBtn){
    const card = e.target.closest('.phase-card');
    const id = card.dataset.phaseId;
    const input = card.querySelector('.add-input');
    const title = (input.value||'').trim().slice(0,120);
    if(!title){ input.focus(); return; }
    const p = phases.find(x=>x.id===id);
    p.tasks.push({id:'t'+Date.now(), title, done:false});
    input.value='';
    save(); render();
    return;
  }

  // Delete task
  if(del){
    const li = del.closest('.task-row');
    const card = del.closest('.phase-card');
    const p = phases.find(x=>x.id===card.dataset.phaseId);
    p.tasks = p.tasks.filter(t=>t.id!==li.dataset.taskId);
    save(); render();
    return;
  }

  // Toggle checkbox
  if(check){
    const li = check.closest('.task-row');
    const card = check.closest('.phase-card');
    const p = phases.find(x=>x.id===card.dataset.phaseId);
    const t = p.tasks.find(x=>x.id===li.dataset.taskId);
    t.done = check.checked;
    save(); render();
    return;
  }
});

// Inline edits
phasesEl.addEventListener('blur', (e)=>{
  // phase title
  if(e.target.classList.contains('phase-title')){
    const card = e.target.closest('.phase-card');
    const p = phases.find(x=>x.id===card.dataset.phaseId);
    const v = (e.target.textContent||'').trim().slice(0,60) || 'Untitled';
    if(p.title!==v){ p.title=v; save(); render(); }
  }
  // task title
  if(e.target.classList.contains('task-title')){
    const li = e.target.closest('.task-row');
    const card = e.target.closest('.phase-card');
    const p = phases.find(x=>x.id===card.dataset.phaseId);
    const t = p.tasks.find(x=>x.id===li.dataset.taskId);
    const v = (e.target.textContent||'').trim().slice(0,160) || 'Untitled task';
    if(t.title!==v){ t.title=v; save(); render(); }
  }
}, true);

// Reset
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(!confirm('Reset to full PCS seed?')) return;
  localStorage.removeItem(KEY);
  phases = load();
  render();
});
