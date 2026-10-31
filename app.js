
'use strict';
const KEY='fixlog-v1';
const $=s=>document.querySelector(s);
const uid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;
const today=()=>new Date().toISOString().slice(0,10);
const dayDiff=s=>s?Math.round((new Date(`${s}T12:00:00`)-new Date(`${today()}T12:00:00`))/86400000):null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const assetId=uid();
const seed={assets:[{id:assetId,name:'Kitchen refrigerator',category:'Appliance',location:'Kitchen'}],tasks:[{id:uid(),name:'Clean refrigerator coils',asset:assetId,priority:'Medium',date:'',status:'open',notes:'Vacuum dust behind the fridge',created:Date.now()},{id:uid(),name:'Test smoke alarms',asset:'',priority:'High',date:'',status:'open',notes:'Check every floor',created:Date.now()-1000}]};
let state;try{state=JSON.parse(localStorage.getItem(KEY))||seed;if(!Array.isArray(state.assets)||!Array.isArray(state.tasks))throw Error('Invalid data');}catch{state=seed;}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('Unable to save. Check browser storage settings.')}};
function toast(message){const el=$('#toast');el.textContent=message;el.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.add('hidden'),2500);}
function status(task){if(task.status==='done')return ['Completed','good'];const d=dayDiff(task.date);return d!==null&&d<0?['Overdue','bad']:d!==null&&d<=7?['Due soon','warn']:['Open',''];}
function render(){
 const q=$('#search').value.trim().toLowerCase(),st=$('#status-filter').value,p=$('#priority-filter').value,sort=$('#sort').value;
 const priority={High:0,Medium:1,Low:2};
 const rows=state.tasks.filter(t=>(t.name+' '+t.notes).toLowerCase().includes(q)&&(!st||t.status===st)&&(!p||t.priority===p)).sort((a,b)=>sort==='priority'?priority[a.priority]-priority[b.priority]:sort==='recent'?(b.created||0)-(a.created||0):(a.date||'9999').localeCompare(b.date||'9999'));
 $('#task-body').innerHTML=rows.map(t=>{const [label,tone]=status(t),asset=state.assets.find(a=>a.id===t.asset);return `<tr><td><div class="name">${esc(t.name)}</div><div class="sub">${esc(t.notes||'No notes')}</div></td><td>${asset?esc(asset.name):'—'}</td><td><span class="pill ${t.priority==='High'?'bad':t.priority==='Medium'?'warn':''}">${esc(t.priority)}</span></td><td>${t.date?esc(t.date):'—'}</td><td><span class="pill ${tone}">${label}</span></td><td><div class="actions"><button class="btn small" data-toggle="${esc(t.id)}">${t.status==='done'?'Reopen':'Done'}</button><button class="btn small" data-edit="${esc(t.id)}">Edit</button><button class="btn small danger" data-delete="${esc(t.id)}">×</button></div></td></tr>`}).join('');
 $('#task-empty').classList.toggle('hidden',rows.length>0);
 $('#asset-list').innerHTML=state.assets.map(a=>`<div class="list-item"><div><div class="name">${esc(a.name)}</div><div class="sub">${esc(a.category)}${a.location?' · '+esc(a.location):''}</div></div><div class="actions"><button class="btn small" data-edit-asset="${esc(a.id)}">Edit</button><button class="btn small danger" data-delete-asset="${esc(a.id)}">×</button></div></div>`).join('');
 $('#asset-empty').classList.toggle('hidden',state.assets.length>0);
 $('#stat-total').textContent=state.tasks.length;$('#stat-soon').textContent=state.tasks.filter(t=>t.status==='open'&&dayDiff(t.date)!==null&&dayDiff(t.date)>=0&&dayDiff(t.date)<=7).length;$('#stat-overdue').textContent=state.tasks.filter(t=>t.status==='open'&&dayDiff(t.date)!==null&&dayDiff(t.date)<0).length;$('#stat-done').textContent=state.tasks.filter(t=>t.status==='done').length;
}
function openTask(task){const f=$('#task-form');f.reset();$('#task-asset').innerHTML='<option value="">General / none</option>'+state.assets.map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('');for(const k of ['id','name','asset','priority','date','status','notes'])if(task&&f.elements[k])f.elements[k].value=task[k]||'';$('#task-title').textContent=task?'Edit maintenance task':'New maintenance task';$('#task-dialog').showModal();}
function openAsset(asset){const f=$('#asset-form');f.reset();for(const k of ['id','name','category','location'])if(asset&&f.elements[k])f.elements[k].value=asset[k]||'';$('#asset-title').textContent=asset?'Edit asset':'Add asset';$('#asset-dialog').showModal();}
$('#new-task').addEventListener('click',()=>openTask());
$('#new-asset').addEventListener('click',()=>openAsset());
$('#task-form').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));data.name=data.name.trim();if(!data.name)return;const i=state.tasks.findIndex(t=>t.id===data.id);if(i<0){data.id=uid();data.created=Date.now();state.tasks.unshift(data);}else state.tasks[i]={...state.tasks[i],...data};save();render();$('#task-dialog').close();toast('Task saved');});
$('#asset-form').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));data.name=data.name.trim();if(!data.name)return;const i=state.assets.findIndex(a=>a.id===data.id);if(i<0){data.id=uid();state.assets.push(data);}else state.assets[i]=data;save();render();$('#asset-dialog').close();toast('Asset saved');});
$('#task-body').addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]'),toggle=e.target.closest('[data-toggle]');if(edit)openTask(state.tasks.find(t=>t.id===edit.dataset.edit));if(toggle){const t=state.tasks.find(t=>t.id===toggle.dataset.toggle);if(t){t.status=t.status==='done'?'open':'done';save();render();}}if(del&&confirm('Delete this task?')){state.tasks=state.tasks.filter(t=>t.id!==del.dataset.delete);save();render();}});
$('#asset-list').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-asset]'),del=e.target.closest('[data-delete-asset]');if(edit)openAsset(state.assets.find(a=>a.id===edit.dataset.editAsset));if(del&&confirm('Delete this asset? Its tasks will be kept as general tasks.')){state.assets=state.assets.filter(a=>a.id!==del.dataset.deleteAsset);state.tasks.forEach(t=>{if(t.asset===del.dataset.deleteAsset)t.asset='';});save();render();}});
for(const id of ['search','status-filter','priority-filter','sort'])$('#'+id).addEventListener(id==='search'?'input':'change',render);
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.close).close()));
document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-go]').forEach(n=>n.classList.toggle('active',n===btn));$('#'+btn.dataset.go).scrollIntoView({behavior:'smooth'});}));
render();
