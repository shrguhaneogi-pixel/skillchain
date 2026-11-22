import {describe,it,expect} from 'vitest'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {CandidateFeedback} from '../components/Report'
import {reduce,start,incidents,feedback,findings,ledger,canonical,type Answer} from '../lib/engine'
const opts=['A','B','skip'] as const
describe('27 fixture paths',()=>{for(const a of opts)for(const b of opts)for(const c of opts)it([a,b,c].join('/'),()=>{
 let r=start('Self-paced');[a,b,c].forEach((ans,i)=>{r=reduce(r,{type:'reply',i,answer:ans,at:r.at})})
 expect(r.phase).toBe('review');expect(r.answers).toEqual([a,b,c])
 expect(findings(r).map(f=>f.score)).toEqual([a==='A'?2:a==='B'?1:null,b==='A'?2:b==='B'?0:null,c==='A'?2:c==='B'?0:null])
 expect(r.tasks.map(t=>[t?.owner,t?.status])).toEqual([[a==='A'?'Rahul':a==='B'?'Coordinator':'Unassigned',a==='A'?'In progress':'Waiting'],['Alex',b==='A'?'Done':'Waiting'],[c==='skip'?'Unassigned':'Meera',c==='A'?'In progress':'Waiting']])
 expect(ledger(r)).toBe(c==='A'?'Held for review':c==='B'?'Blocked':'Draft received')
 expect(r.events.filter(e=>e.kind==='calendar')).toHaveLength(b==='A'?1:0)
 for(const [i,v] of [a,b,c].entries()){const evidence=findings(r)[i].source;expect(evidence[0].text).toBe(incidents[i].question);expect(evidence[1].text).toBe(v==='skip'?'Continued without a reply.':incidents[i].choices[v==='A'?0:1]);expect(evidence[2].text).toContain(incidents[i].responses[v==='A'?0:v==='B'?1:2]);expect(evidence[2].parent).toBe(evidence[1].id)}
 if(b==='A')expect(findings(r)[1].source[2].text).toContain(a==='A'?'name Rahul':a==='B'?'you are investigating':'ownership is still open')
})})
for(const [i,d] of incidents.entries())it('deadline '+d.deadline,()=>{let r=start('Timed practice');for(let j=0;j<i;j++)r=reduce(r,{type:'reply',i:j,answer:'A',at:incidents[j].arrival});expect(reduce(r,{type:'reply',i,answer:'A',at:d.deadline-1}).answers[i]).toBe('A');const late=reduce(r,{type:'reply',i,answer:'A',at:d.deadline});expect(late.answers[i]).toBe('timeout');expect(findings(late)[i].score).toBeNull();expect(reduce(late,{type:'tick',at:d.deadline}).events).toEqual(late.events)})
it('pause, double commit, immutable task evidence',()=>{let r=start('Timed practice');r=reduce(r,{type:'pause',at:100});expect(reduce(r,{type:'tick',at:200000})).toEqual(r);r=reduce(r,{type:'resume'});const act={type:'reply' as const,i:0,answer:'A' as Answer,at:200};r=reduce(r,act);expect(reduce(r,act)).toEqual(r);const snapshot=findings(r);r=reduce(r,{type:'edit',i:0,task:{owner:'Alex',status:'Done'},at:201});expect(findings(r)).toEqual(snapshot);expect(r.events.at(-1)?.before?.owner).toBe('Rahul')})
it('candidate renderer receives only strings and preserves audience boundaries',()=>{const f=feedback(canonical());expect(Object.keys(f)).toEqual(['strengths','areas']);const html=renderToStaticMarkup(createElement(CandidateFeedback,f));expect(html).toContain('Areas to practise');expect(html).not.toMatch(/score|\/2|percentile|rank|grade/i)})
