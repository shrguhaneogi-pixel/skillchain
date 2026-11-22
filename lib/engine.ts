export type Answer = 'A' | 'B' | 'skip' | 'timeout'
export type Phase = 'running' | 'paused' | 'review' | 'feedback' | 'reviewer'
export type Mode = 'Timed practice' | 'Self-paced'
export const owners = ['Unassigned','Coordinator','Rahul','Alex','Meera'] as const
export const statuses = ['Waiting','In progress','Done'] as const
export type Task = {owner: typeof owners[number], status: typeof statuses[number]}
export const version = 'PC-FOUNDATION-01 v1.0'
export const welcome = {sender:'Diya Roy',role:'Account Lead',subject:'Client demo · 10:24 IST',text:'The client has twenty minutes before our demo. Alex is your contact for client updates. You can use the task board, calendar and budget sheet throughout.'}
export const incidents = [
 {sender:'Rahul Kapoor',role:'Senior Developer',subject:'Demo server down',time:'10:04',arrival:0,deadline:45000,task:'Recovery check',question:'The demo server is unresponsive. I can run a recovery check. Who owns it?',choices:['Assign Rahul and ask for a checkpoint','Hold while I investigate'],responses:['I’ll run the recovery check and report at 10:15. Restoration is unconfirmed.','I’ll wait for your direction. The recovery check hasn’t started.','I’m available. Nobody has assigned the recovery check.'],dimension:'Ownership',findings:['Named a recovery owner and checkpoint','Kept ownership but did not start the check'],strength:'You gave Rahul a clear task and a time to report back.',improvement:'Give the recovery check a named owner and ask when you can expect an update.'},
 {sender:'Alex Morgan',role:'Project Manager',subject:'Client update',time:'10:05',arrival:5000,deadline:85000,task:'Client update',question:'The client demo is at 10:24. What can I tell them now?',choices:['Send confirmed facts and set a 10:15 update','Tell the client the server will be ready'],responses:['I’ll tell the client the demo is at risk and promise an update at 10:15.','The client heard a recovery promise. I still need confirmation before the demo.','I’ve held the client update. We still need a confirmed status.'],dimension:'Client communication',findings:['Shared confirmed facts and a checkpoint','Promised readiness without confirmation'],strength:'You kept the client informed without promising recovery.',improvement:'Separate confirmed facts from a forecast and give the client a time for the next update.'},
 {sender:'Meera Sen',role:'Finance Lead',subject:'Vendor draft exceeds plan',time:'10:07',arrival:25000,deadline:125000,task:'Budget review',question:'The approved support budget is ₹18,000. The draft is ₹22,000. Can I release it?',choices:['Hold the draft and ask Meera to reconcile ₹4,000','Forward the draft for payment at ₹22,000'],responses:['I’ve held the draft. I’ll reconcile the ₹4,000 difference before requesting approval.','That exceeds the approval. I’ve blocked the request and flagged the difference.','The draft remains unpaid. I’m waiting for a decision on the difference.'],dimension:'Financial judgement',findings:['Held a draft outside the approved amount','Routed an over-budget draft for payment'],strength:'You identified the ₹4,000 variance and routed it for review.',improvement:'Compare the draft with the approved amount before requesting payment.'}
] as const
const transitions: Task[][] = [
 [{owner:'Rahul',status:'In progress'},{owner:'Coordinator',status:'Waiting'},{owner:'Unassigned',status:'Waiting'}],
 [{owner:'Alex',status:'Done'},{owner:'Alex',status:'Waiting'},{owner:'Alex',status:'Waiting'}],
 [{owner:'Meera',status:'In progress'},{owner:'Meera',status:'Waiting'},{owner:'Unassigned',status:'Waiting'}]
]
export type Entry = {id:string, incident:number, kind:'incoming'|'reply'|'close'|'consequence'|'board'|'calendar'|'budget'|'edit',actor:string,text:string,time:string,parent?:string,before?:Task,after?:Task}
export type Run = {id:string,mode:Mode,at:number,phase:Phase,events:Entry[],answers:(Answer|null)[],tasks:(Task|null)[]}
export type Action = {type:'tick'|'pause'|'resume'|'next'|'finish'|'reviewer'|'feedback',at?:number} | {type:'reply',i:number,answer:Answer,at:number} | {type:'edit',i:number,task:Task,at:number}
const timeline=[[0,'10:04'],[5000,'10:05'],[25000,'10:07'],[45000,'10:09'],[85000,'10:13'],[125000,'10:17']] as const
export function scenarioTime(at:number){return [...timeline].reverse().find(([ms])=>ms<=at)?.[1]??'10:04'}
function append(r:Run,i:number,kind:Entry['kind'],actor:string,text:string,extra:Partial<Entry>={}){
 const e={id:r.id+'-'+String(r.events.length+1).padStart(3,'0'),incident:i,kind,actor,text,time:scenarioTime(r.at),...extra};r.events.push(e);return e.id
}
function deliver(r:Run,i:number){
 if(r.tasks[i])return
 const d=incidents[i];r.tasks[i]={owner:i===1?'Alex':'Unassigned',status:'Waiting'}
 append(r,i,'incoming',d.sender,d.question)
}
export function start(mode:Mode,id='practice'):Run{
 const r:Run={id,mode,phase:'running',at:0,events:[],answers:[null,null,null],tasks:[null,null,null]}
 append(r,-1,'incoming',welcome.sender,welcome.text);deliver(r,0);return r
}
function resolve(r:Run,i:number,a:Answer){
 const d=incidents[i],k=a==='A'?0:a==='B'?1:2,source=r.events.find(e=>e.incident===i&&e.kind==='incoming')!.id
 const reply=k<2?d.choices[k as 0|1]:a==='timeout'?'Decision window closed without a reply.':'Continued without a reply.'
 const choice=append(r,i,k<2?'reply':'close',k<2?'Coordinator':'Scenario Controller',reply,{parent:source})
 let msg:string=d.responses[k]
 if(i===1&&a==='A')msg+=' '+(r.answers[0]==='A'?'I’ll name Rahul as the recovery owner.':r.answers[0]==='B'?'I’ll say you are investigating.':'I’ll say recovery ownership is still open.')
 const consequence=append(r,i,'consequence',d.sender,msg,{parent:choice})
 const next={...transitions[i][k]};append(r,i,'board','Task board',d.task+' · '+next.owner+' / '+next.status,{parent:consequence,before:r.tasks[i]!,after:next})
 r.tasks[i]=next;r.answers[i]=a
 if(i===1&&a==='A')append(r,i,'calendar','Alex Morgan','Client checkpoint · 10:15–10:20 IST',{parent:choice})
 if(i===2){append(r,i,'budget','Meera Sen',ledger(r),{parent:choice});r.phase='review'}
}
export function ledger(r:Run){return r.answers[2]==='A'?'Held for review':r.answers[2]==='B'?'Blocked':'Draft received'}
function advance(r:Run,end:number){
 for(const [t] of timeline){
  if(t<=r.at||t>end||r.phase!=='running')continue
  r.at=t
  incidents.forEach((d,i)=>{if(d.arrival===t)deliver(r,i)})
  incidents.forEach((d,i)=>{if(d.deadline===t&&!r.answers[i]&&r.mode==='Timed practice')resolve(r,i,'timeout')})
 }
 if(r.phase==='running')r.at=Math.max(r.at,end)
}
export function reduce(run:Run,action:Action):Run{
 const r:Run={...run,answers:[...run.answers],tasks:[...run.tasks],events:[...run.events]}
 if(action.type==='resume'&&r.phase==='paused'){r.phase='running';return r}
 if(action.type==='finish'&&r.phase==='review'){r.phase='feedback';return r}
 if(action.type==='reviewer'&&r.phase==='feedback'){r.phase='reviewer';return r}
 if(action.type==='feedback'&&r.phase==='reviewer'){r.phase='feedback';return r}
 if(r.phase!=='running')return run
 if(r.mode==='Timed practice'&&action.at!==undefined)advance(r,action.at)
 if(r.phase!=='running')return r
 const current=r.answers.findIndex(a=>a===null)
 if(action.type==='pause')r.phase='paused'
 if(action.type==='next'&&current>=0&&!r.tasks[current])advance(r,incidents[current].arrival)
 if(action.type==='reply'&&['A','B','skip'].includes(action.answer)&&current===action.i&&r.tasks[current]&&(action.answer!=='skip'||r.mode==='Self-paced')){
  resolve(r,current,action.answer)
  if(r.mode==='Self-paced'&&current<2)advance(r,incidents[current+1].arrival)
 }
 if(action.type==='edit'&&r.answers[action.i]&&r.tasks[action.i]){
  const old=r.tasks[action.i]!,n=action.task
  if(owners.includes(n.owner)&&statuses.includes(n.status)&&(old.owner!==n.owner||old.status!==n.status)){
   const parent=r.events.filter(e=>e.incident===action.i&&(e.kind==='board'||e.kind==='edit')).at(-1)!.id
   append(r,action.i,'edit','Coordinator',incidents[action.i].task+' · '+n.owner+' / '+n.status,{before:old,after:{...n},parent});r.tasks[action.i]={...n}
  }
 }
 return r
}
export function findings(r:Run){return incidents.map((d,i)=>{
 const a=r.answers[i];return {i,title:d.dimension,score:a==='A'?2:a==='B'?(i===0?1:0):null,text:a==='A'?d.findings[0]:a==='B'?d.findings[1]:'Insufficient evidence',source:r.events.filter(e=>e.incident===i&&e.kind!=='edit')}
})}
export function feedback(r:Run){
 const strengths=incidents.filter((_,i)=>r.answers[i]==='A').map(d=>String(d.strength)),areas=incidents.filter((_,i)=>r.answers[i]!=='A').map(d=>String(d.improvement))
 return {strengths:strengths.length?strengths:['This exercise did not capture a specific strength.'],areas:areas.length?areas:['For another practice run, try explaining how you would hand off the checkpoint if its owner became unavailable.']}
}
export function canonical(){
 let r=start('Timed practice','C-017');[8000,18000,38000].forEach((at,i)=>{r=reduce(r,{type:'reply',i,answer:'A',at})});return r
}
for(const d of incidents)if(d.deadline<=d.arrival||d.choices.length!==2)throw Error('Invalid incident fixture')
