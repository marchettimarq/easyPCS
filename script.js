// easyPCS localStorage demo with checkable tasks
const KEY='easyPCS-demo-v1';

// Default in case nothing saved
const seed = [
  {id:'phase1', title:'Pre-PCS', tasks:[
    {id:'t1', title:'Get orders', done:false},
    {id:'t2', title:'Schedule HHG', done:false}
  ]},
  {id:'phase2', title:'PCS Move', tasks:[
    {id:'t3', title:'Book travel', done:false}
  ]},
  {id:'phase3', title:'Post-PCS', tasks:[]}
];

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return seed;
    const data = JSON.parse(raw);
    if(!Array.isArray(data)) return seed;
    return data;
  }catch(e){ console.warn('Storage error, using seed', e); return seed; }
}
let phases = load();

const save = (()=>{ let t; return ()=>{ clearTimeout(t); t=setTimeout(()=>{
  try{ localStorage.setItem(KEY, JSON.stringify(phases)); }catch(e){ console.warn('Persist failed', e); }
}, 150); };})();

const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

const phasesEl = $("#phases");
const phaseTpl = $("#phaseTpl");
const taskTpl = $("#taskTpl");

// Render all
function render(){
  phasesEl.innerHTML='';
  phases.forEach(p=>{
    const node = phaseTpl.content.firstElementChild.cloneNode(true);
    node.dataset.phaseId = p.id;
    $(".phase-title", node).textContent = p.title;
    const ul = $(".task-list", node);

    // metrics
    $(".total", node).textContent = p.tasks.length;
    $(".done", node).textContent = p.tasks.filter(t=>t.done).length;

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

// Delegated events
phasesEl.addEventListener('click', (e)=>{
  const del = e.target.closest('.delete');
  const addBtn = e.target.closest('.add-task');
  const check = e.target.closest('.check input');

  // Add task
  if(addBtn){
    const card = e.target.closest('.phase-card');
    const id = card.dataset.phaseId;
    const input = card.querySelector('.add-input');
    const title = (input.value||'').trim().slice(0,60);
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
    const v = (e.target.textContent||'').trim().slice(0,40) || 'Untitled';
    if(p.title!==v){ p.title=v; save(); render(); }
  }
  // task title
  if(e.target.classList.contains('task-title')){
    const li = e.target.closest('.task-row');
    const card = e.target.closest('.phase-card');
    const p = phases.find(x=>x.id===card.dataset.phaseId);
    const t = p.tasks.find(x=>x.id===li.dataset.taskId);
    const v = (e.target.textContent||'').trim().slice(0,80) || 'Untitled task';
    if(t.title!==v){ t.title=v; save(); render(); }
  }
}, true);

// Reset
$("#resetBtn").addEventListener('click', ()=>{
  if(!confirm('Reset demo data?')) return;
  localStorage.removeItem(KEY);
  phases = load();
  render();
});
