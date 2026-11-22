import {test,expect} from '@playwright/test'
for(const path of ['A','B'])test('real UI '+path+'/'+path+'/'+path,async({page})=>{
 const outbound:string[]=[];page.on('request',q=>{if(q.method()!=='GET'||q.postData())outbound.push(q.url())})
 await page.goto('/demo/');await page.getByLabel('Self-paced',{exact:true}).check();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Start simulation'}).click()
 for(const [i,sender] of ['Rahul Kapoor','Alex Morgan','Meera Sen'].entries()){
  if(i)await page.getByRole('button',{name:new RegExp(sender)}).click()
  await page.getByRole('radio').nth(path==='A'?0:1).check();await page.getByRole('button',{name:'Send reply',exact:true}).click()
 }
 await page.getByRole('button',{name:'Finish simulation'}).click();const result=page.getByTestId('candidate-feedback');await expect(result.getByRole('heading')).toHaveCount(2);await expect(result).not.toContainText(/score|\/2|grade|percentile|rank/i)
 await page.getByRole('button',{name:'Explore fictional recruiter view'}).click();await expect(page.locator('.finding b')).toHaveText(path==='A'?['2/2','2/2','2/2']:['1/2','0/2','0/2']);await page.getByRole('button',{name:'View source for Client communication'}).click();await expect(page.locator('.source')).toContainText(path==='A'?'name Rahul':'recovery promise');await page.screenshot({path:'docs/evidence/reviewer-'+path+'.png'})
 await page.goto('/fairhire/#report');await expect(page.locator('.finding b')).toHaveText(['2/2','2/2','2/2']);expect(outbound).toEqual([]);expect(await page.evaluate(()=>localStorage.length)).toBe(0)
})
test('timing, pause, skipped windows, task edits and restart',async({page})=>{
 await page.clock.install();await page.goto('/demo/');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Start simulation'}).click()
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.clock.fastForward(150000);await page.getByRole('button',{name:'Resume'}).click();await expect(page.getByRole('radio')).toHaveCount(2)
 await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Send reply'}).click();await page.getByRole('button',{name:'Tasks',exact:true}).click();await page.getByRole('button',{name:'Edit task'}).click();await page.getByLabel('Change owner').selectOption('Alex');await page.getByRole('button',{name:'Save change'}).click();await expect(page.locator('.taskcard').first()).toContainText('At decision: Rahul')
 await page.clock.fastForward(126000);await page.getByRole('button',{name:'Finish simulation'}).click();await page.getByRole('button',{name:'Explore fictional recruiter view'}).click();await expect(page.locator('.finding b')).toHaveText(['2/2','Insufficient evidence','Insufficient evidence'])
 await page.getByRole('button',{name:'Play again',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Play again'}).click();await expect(page.getByRole('checkbox')).not.toBeChecked();await page.reload();await expect(page.getByRole('button',{name:'Start simulation'})).toBeDisabled()
})
