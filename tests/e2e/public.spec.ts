import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = ['/', '/about/', '/contact/', '/demo/', '/fairhire/', '/pricing/', '/privacy/', '/simulations/', '/skillproof/', '/terms/', '/trustchain/']
const viewports = [{width:1440,height:900},{width:834,height:1112},{width:390,height:844},{width:320,height:640}]

for (const viewport of viewports) test('public visual and accessibility checks at '+viewport.width, async ({page}, info) => {
  test.setTimeout(120_000)
  await page.setViewportSize(viewport)
  const broken: string[] = []
  page.on('pageerror', error => broken.push(error.message))
  page.on('response', response => { if (response.status() >= 400) broken.push(response.url()) })
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main h1')).toHaveCount(1)
    await page.screenshot({path:info.outputPath((route.replaceAll('/','')||'home')+'.png'),fullPage:true})
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
    const audit = await new AxeBuilder({page}).analyze()
    expect(audit.violations.filter(item=>['critical','serious'].includes(item.impact??'')),route).toEqual([])
  }
  expect(broken).toEqual([])
})

test('untouched Home transfers zero video and the product tiles reload at their fixture states', async ({page}) => {
  const mediaRequests: string[] = []
  page.on('request', request => { if (/\.mp4(?:\?|$)/.test(request.url())) mediaRequests.push(request.url()) })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.walkthrough video')).toHaveCount(0)
  expect(mediaRequests).toEqual([])
  const states = [
    ['Inside the mailbox','Demo server down'],
    ['On the task board','Starting board'],
    ['In the role brief','Try the simulation'],
    ['On the credential record','DEMO-ORG-04'],
    ['View a sample report','Candidate C-017'],
  ]
  for (const [title, marker] of states) {
    await page.locator('.bento-tile').filter({hasText:title}).click()
    await page.reload()
    await expect(page.getByText(marker,{exact:true}).first()).toBeVisible()
    await page.goto('/')
  }
})

test('candidate player plays native video with captions, supports seek and exposes a media fallback', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button',{name:'Play walkthrough: A day inside SkillProof'}).click()
  const player = page.locator('.walkthrough video').first()
  await expect.poll(()=>player.evaluate((video:HTMLVideoElement)=>video.currentTime)).toBeGreaterThan(0)
  await expect.poll(()=>player.evaluate((video:HTMLVideoElement)=>video.textTracks[0].mode)).toBe('showing')
  await player.evaluate((video:HTMLVideoElement)=>{video.pause();video.currentTime=35})
  await expect.poll(()=>player.evaluate((video:HTMLVideoElement)=>video.currentTime)).toBeCloseTo(35,0)
  await page.locator('.walkthrough summary').first().click()
  await expect(page.getByText(/The recording is silent/).first()).toBeVisible()
  await page.route('**/candidate-walkthrough.mp4', route => route.abort())
  await page.reload()
  await page.getByRole('button',{name:'Play walkthrough: A day inside SkillProof'}).click()
  await expect(page.getByText('Video playback is unavailable.',{exact:false})).toBeVisible()
})
