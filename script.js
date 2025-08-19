
const KEY='easyPCS-carousel-v2';
function seedData(){
  if(!localStorage.getItem(KEY)) {
    const seed = {"phases": [{"id": "p1", "title": "Pre‑Departure", "suspense": "2025-09-23", "tasks": [{"id": "p1t1", "title": "Complete Initial Assignment Briefing in vMPF (within 7 days of RIP)", "done": false, "completedAt": null}, {"id": "p1t2", "title": "Fill out and upload Assignment Information Worksheet", "done": false, "completedAt": null}, {"id": "p1t3", "title": "Verify dependents in DEERS / print DD 1172-2", "done": false, "completedAt": null}]}, {"id": "p2", "title": "Mid Prep", "suspense": "2025-11-30", "tasks": [{"id": "p2t1", "title": "VIPER Folder — upload all required docs", "done": false, "completedAt": null}]}, {"id": "p3", "title": "Final Out", "suspense": "2025-12-19", "tasks": [{"id": "p3t1", "title": "CSS Outprocessing — 1 duty day before MPF", "done": false, "completedAt": null}]}, {"id": "p4", "title": "Arrival (Hill AFB)", "suspense": "2026-01-31", "tasks": [{"id": "p4t1", "title": "Report to unit CSS within 24 hrs", "done": false, "completedAt": null}]}]};
    localStorage.setItem(KEY, JSON.stringify(seed));
  }
}
seedData();
function load(){ return JSON.parse(localStorage.getItem(KEY)); }
let state = load();
const save = (()=>{let t; return ()=>{ clearTimeout(t); t=setTimeout(()=>localStorage.setItem(KEY, JSON.stringify(state)), 180); };})();
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const carousel = document.getElementById('carousel'); const dots = document.getElementById('dots');
const cardTpl = document.getElementById('cardTpl'); const rowTpl = document.getElementById('rowTpl');
function render(){
  carousel.innerHTML=''; dots.innerHTML='';
  state.phases.forEach((p, idx)=>{
    const card = cardTpl.content.firstElementChild.cloneNode(true);
    card.dataset.phaseId = p.id; $(".phase-title", card).textContent = p.title;
    const total = p.tasks.length; const done = p.tasks.filter(t=>t.done).length;
    $(".total", card).textContent = total; $(".done", card).textContent = done;
    $(".progress .bar", card).style.width = total? ((done/total)*100).toFixed(0)+'%':'0%';
    $(".comp-count", card).textContent = done;
    const activeUl = $(".task-list.active", card); const compUl = $(".completed .task-list", card);
    const active = p.tasks.filter(t=>!t.done);
    const completed = p.tasks.filter(t=>t.done).sort((a,b)=> (b.completedAt||0)-(a.completedAt||0));
    active.forEach(t=> activeUl.appendChild(taskRow(p,t))); completed.forEach(t=> compUl.appendChild(taskRow(p,t)));
    carousel.appendChild(card);
    const d = document.createElement('button'); d.setAttribute('aria-label', p.title); d.addEventListener('click', ()=> scrollToCard(idx)); dots.appendChild(d);
  });
  updateDots();
}
function taskRow(phase, task){ const li = rowTpl.content.firstElementChild.cloneNode(true); li.dataset.taskId = task.id; $(".title", li).textContent = task.title; $(".check input", li).checked = !!task.done; return li; }
function updateDots(){ const cw = carousel.firstElementChild? carousel.firstElementChild.getBoundingClientRect().width + 14 : 1; const idx = Math.round(carousel.scrollLeft / cw); $$(".dots button").forEach((b,i)=> b.classList.toggle('active', i===idx)); }
function scrollToCard(i){ const cw = carousel.firstElementChild.getBoundingClientRect().width + 14; carousel.scrollTo({left: i*cw, behavior:'smooth'}); }
carousel.addEventListener('scroll', ()=>{ requestAnimationFrame(updateDots); });
carousel.addEventListener('click', (e)=>{ const add = e.target.closest('.add-task'); if(add){ const card = e.target.closest('.phase-card'); const input = card.querySelector('.add-input'); const title = (input.value||'').trim().slice(0,160); if(!title) return input.focus(); const p = state.phases.find(x=>x.id===card.dataset.phaseId); p.tasks.push({id:'t'+Date.now(), title, done:false, completedAt:null}); input.value=''; save(); render(); return; } const del = e.target.closest('.delete'); if(del){ const card = e.target.closest('.phase-card'); const li = e.target.closest('.task-row'); const p = state.phases.find(x=>x.id===card.dataset.phaseId); p.tasks = p.tasks.filter(t=>t.id!==li.dataset.taskId); save(); render(); return; } });
carousel.addEventListener('change', (e)=>{ if(e.target.matches('.check input')){ const card = e.target.closest('.phase-card'); const li = e.target.closest('.task-row'); const p = state.phases.find(x=>x.id===card.dataset.phaseId); const t = p.tasks.find(x=>x.id===li.dataset.taskId); t.done = e.target.checked; t.completedAt = t.done ? Date.now() : null; save(); render(); return; } });
carousel.addEventListener('blur', (e)=>{ if(e.target.classList.contains('phase-title')){ const card = e.target.closest('.phase-card'); const p = state.phases.find(x=>x.id===card.dataset.phaseId); const v = (e.target.textContent||'').trim().slice(0,60) || 'Untitled'; if(v!==p.title){ p.title=v; save(); render(); } } if(e.target.classList.contains('title')){ const card = e.target.closest('.phase-card'); const li = e.target.closest('.task-row'); const p = state.phases.find(x=>x.id===card.dataset.phaseId); const t = p.tasks.find(x=>x.id===li.dataset.taskId); const v = (e.target.textContent||'').trim().slice(0,160) || 'Untitled task'; if(v!==t.title){ t.title=v; save(); render(); } } }, true);
document.getElementById('resetBtn').addEventListener('click', ()=>{ if(!confirm('Reset to seeded data?')) return; localStorage.removeItem(KEY); seedData(); state = load(); render(); });
render();
