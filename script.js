
// easyPCS – minimal working build with robust home routing & reset
const LS_KEY = 'easyPCS';

/** Seed only when not present */
function seedData(){
  const data = {
    phases:[
      {id:'p1', title:'Pre-Departure', suspense:'2025-09-23', tasks:[
        {id:'p1t1', title:'Complete Initial Assignment Briefing in vMPF (within 7 days of RIP)', due:'2025-08-15', desc:'', done:false, completedAt:null},
        {id:'p1t2', title:'Fill out and upload Assignment Information Worksheet', due:'2025-09-23', desc:'', done:false, completedAt:null},
        {id:'p1t3', title:'Verify dependents in DEERS / print DD 1172-2', due:'2025-09-23', desc:'', done:false, completedAt:null},
      ]},
      {id:'p2', title:'Mid Prep', suspense:'2025-11-30', tasks:[
        {id:'p2t1', title:'VIPER Folder — upload all required docs', due:'2025-11-15', desc:'', done:false, completedAt:null},
      ]},
      {id:'p3', title:'Final Out', suspense:'2025-12-19', tasks:[
        {id:'p3t1', title:'CSS Outprocessing — 1 duty day before MPF', due:'2025-12-18', desc:'', done:false, completedAt:null},
      ]},
      {id:'p4', title:'Arrival (Hill AFB)', suspense:'2026-01-31', tasks:[
        {id:'p4t1', title:'Report to unit CSS within 24 hrs', due:'2026-01-02', desc:'', done:false, completedAt:null},
      ]},
    ],
    timeline: [
      {date:'2025-07-15', title:'Assignment RIP issued', phase:null, done:true},
      {date:'2025-08-15', title:'Initial Assignment Briefing complete', phase:'Pre-Departure', done:true}
    ]
  };
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
}

function loadState(){
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : seedData();
}

let state = loadState();

/** Router */
function route(){
  const hash = location.hash || '#/home';
  if(!location.hash) location.replace('#/home'); // ensure we land on home
  if(hash.startsWith('#/timeline')) renderTimeline();
  else if(hash.startsWith('#/home')) renderHome();
  else if(hash.startsWith('#/phase/')) {
    const id = hash.split('/')[2];
    renderPhase(id);
  } else {
    renderHome();
  }
}

window.addEventListener('hashchange', route);

/** Utilities */
const byDue = (a,b)=> (a.due||'9999').localeCompare(b.due||'9999');
const $ = (sel,root=document)=> root.querySelector(sel);

function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

/** Renderers */
function renderHome(){
  const view = document.getElementById('view') || (()=>{
    const el=document.createElement('main'); el.id='view'; document.body.appendChild(el); return el;
  })();
  view.innerHTML = '';
  state.phases.forEach(p=>{
    const done = p.tasks.filter(t=>t.done).length;
    const total = p.tasks.length;
    const next = p.tasks.filter(t=>!t.done && t.due).sort(byDue)[0]?.due || '—';
    const card = document.createElement('section');
    card.className = 'phase-card collapsed';
    card.innerHTML = `
      <div class="phase-head">
        <h2 class="phase-title">${p.title}</h2>
        <div class="counts">${done}/${total} complete</div>
      </div>
      <div class="progress"><i style="width:${ total? (done/total*100).toFixed(0):0 }%"></i></div>
      <div class="muted" style="margin-top:6px;color:var(--muted);font-size:12px">Next: ${next}</div>
      <div class="task-list"></div>
    `;
    // build tasks list
    const list = $('.task-list', card);
    const active = p.tasks.filter(t=>!t.done).sort(byDue);
    const completed = p.tasks.filter(t=>t.done).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));
    active.forEach(t=> list.appendChild(renderTaskRow(p,t)));
    if(completed.length){
      const sec = document.createElement('details');
      sec.style.marginTop='8px';
      const sum = document.createElement('summary');
      sum.textContent = `Completed (${completed.length})`;
      sec.appendChild(sum);
      const box = document.createElement('div');
      completed.forEach(t=> box.appendChild(renderTaskRow(p,t)));
      sec.appendChild(box);
      list.appendChild(sec);
    }
    // expand/collapse on header tap
    card.querySelector('.phase-head')?.addEventListener('click',()=>{
      card.classList.toggle('collapsed');
    });
    view.appendChild(card);
  });
}

function renderTaskRow(phase, task){
  const row = document.createElement('div');
  row.className = 'task-row' + (task.done?' done':'');
  row.innerHTML = `
     <button class="chk ${task.done?'done':''}" aria-label="toggle">${task.done?'✓':''}</button>
     <div class="task-main">
       <p class="task-title">${task.title}</p>
       <div class="task-date">${task.due?('Due: '+task.due):'No date'}</div>
     </div>
     <button class="chev" aria-label="expand">⌄</button>
  `;
  const desc = document.createElement('div');
  desc.className = 'task-desc';
  desc.textContent = task.desc || '—';
  // toggle
  row.querySelector('.chk').addEventListener('click',()=>{
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    save();
    route(); // re-render current view
  });
  row.querySelector('.chev').addEventListener('click',()=>{
    row.classList.toggle('expanded');
  });
  const wrapper = document.createElement('div');
  wrapper.appendChild(row);
  wrapper.appendChild(desc);
  return wrapper;
}

function renderPhase(id){
  const p = state.phases.find(x=>x.id===id) || state.phases[0];
  const view = document.getElementById('view');
  view.innerHTML = '';
  const card = document.createElement('section');
  card.className='phase-card';
  card.innerHTML = `<div class="phase-head"><h2 class="phase-title">${p.title}</h2><div class="counts"></div></div><div class="progress"><i></i></div><div class="task-list"></div>`;
  view.appendChild(card);
  // fill counts and list
  const done = p.tasks.filter(t=>t.done).length;
  const total = p.tasks.length;
  card.querySelector('.counts').textContent = `${done}/${total} complete`;
  card.querySelector('.progress i').style.width = total? (done/total*100).toFixed(0)+'%':'0%';
  const list = card.querySelector('.task-list');
  const active = p.tasks.filter(t=>!t.done).sort(byDue);
  const completed = p.tasks.filter(t=>t.done).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));
  active.forEach(t=> list.appendChild(renderTaskRow(p,t)));
  if(completed.length){
    const sec=document.createElement('details'); const sum=document.createElement('summary');
    sum.textContent = `Completed (${completed.length})`; sec.appendChild(sum);
    const box=document.createElement('div'); completed.forEach(t=> box.appendChild(renderTaskRow(p,t))); sec.appendChild(box);
    list.appendChild(sec);
  }
}

function renderTimeline(){
  const view = document.getElementById('view');
  view.innerHTML = '<h2 class="phase-title">Master Timeline</h2>';
  const all = [];
  state.timeline.forEach(m=> all.push({date:m.date, title:m.title}));
  state.phases.forEach(p=> p.tasks.forEach(t=> t.due && all.push({date:t.due, title:`${p.title}: ${t.title}`})));
  all.sort((a,b)=> a.date.localeCompare(b.date));
  all.forEach(item=>{
    const row=document.createElement('div');
    row.className='task-row';
    row.innerHTML = `<div class="task-main"><p class="task-title">${item.title}</p><div class="task-date">${item.date}</div></div>`;
    view.appendChild(row);
  });
}

/** Global listeners */
document.addEventListener('click',(e)=>{
  const btn = e.target.closest('[data-route]');
  if(btn){ location.hash = btn.getAttribute('data-route'); return; }
  // reset
  const t = e.target;
  const isReset = t.matches('.reset-btn') || (t.tagName==='BUTTON' && t.textContent.trim().toLowerCase()==='reset');
  if(isReset){
    localStorage.removeItem(LS_KEY);
    state = seedData();
    location.replace('#/home');
    route();
  }
});

// FAB (placeholder – could open add sheet)
document.getElementById('addFab').addEventListener('click',()=>{
  alert('“Add” action is coming next. For now, tap a phase to see and toggle tasks.');
});

// Start app – guarantee a home route on first load
window.addEventListener('DOMContentLoaded', ()=>{
  if(!location.hash || location.hash==='#'){ location.replace('#/home'); }
  route();
});
