import { expect, it } from 'vitest'
import { estimate, mailDraft, prepareRequest, requestErrors, selectedTopic, type RequestFields } from '../lib/requests'

it.each([['30','1',30],['40','2',80],['0','3',0],['10000','3',30000]])('calculates %s × %s', (c, r, total) => {
  expect(estimate(c,r)).toEqual({c:Number(c),r:Number(r),total})
})
it.each([['','1'],['1.5','1'],['10001','1'],['30','4'],['-1','1'],['1','']])('clears invalid estimate %s × %s', (c,r) => {
  expect(estimate(c,r)).toBeNull()
})
it('whitelists topic values and validates the draft', () => {
  expect(selectedTopic('custom')).toBe('custom')
  expect(selectedTopic('constructor')).toBe('demo')
  const fields: RequestFields = {topic:'standard',email:'',organisation:'',message:'short',include:false}
  expect(Object.keys(requestErrors(fields))).toEqual(['email','message','include'])
  const valid = {...fields,email:'candidate@example.com',message:'A & B #1, in ₹',include:true}
  expect(requestErrors(valid)).toEqual({})
  const draft = new URL(mailDraft('team@example.com', prepareRequest(valid,estimate('40','2'))))
  expect(draft.pathname).toBe('team@example.com')
  expect(draft.searchParams.get('body')).toContain('A & B #1, in ₹')
  expect(draft.searchParams.get('body')).toContain('40 candidates × 2 runs = 80 credits')
})
