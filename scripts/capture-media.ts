import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { setTimeout as wait } from 'node:timers/promises'
import { chromium, type Browser, type Page } from '@playwright/test'

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const output = resolve(process.argv[2] || 'test-results/media')
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
const revision = execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim()
const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' })
const thread = (page: Page, name: string) => button(page, new RegExp(name)).click()
const pickA = (page: Page) => page.locator('input[name=reply]').first().check()
const submit = (page: Page) => button(page, 'Send reply').click()
const fixture = 'PC-FOUNDATION-01 v1.0'

async function open(page: Page, route: string) {
  await page.goto(new URL(route, base).href)
  await page.evaluate(() => document.fonts.ready.then(() => true))
}

async function startPractice(page: Page, selfPaced = false) {
  if (selfPaced) await page.getByRole('radio', { name: 'Self-paced', exact: true }).check()
  await page.getByRole('checkbox').check()
  await button(page, 'Start simulation').click()
}

const tiles = [
  { name: 'mail', route: '/demo/', width: 1440, height: 900, choices: '', pane: 'Rahul before D1', alt: 'Rahul asks who owns the demo server recovery check.', setup: async (p: Page) => startPractice(p, true) },
  { name: 'board', route: '/demo/', width: 1200, height: 900, choices: 'A', pane: 'Tasks', alt: 'The recovery check is assigned to Rahul and marked In progress.', setup: async (p: Page) => {
    await startPractice(p, true); await pickA(p); await submit(p); await button(p, 'Tasks').click()
    await p.getByText('Rahul / In progress', { exact: true }).waitFor()
  } },
  { name: 'brief', route: '/simulations/', width: 960, height: 720, choices: '', pane: 'Project Coordinator · Foundation', alt: 'Foundation brief for the playable Project Coordinator role.', setup: async (p: Page) => {
    await p.locator('[data-capture=brief]').scrollIntoViewIfNeeded()
    await p.getByRole('link', { name: 'Start this simulation' }).waitFor()
  } },
  { name: 'credential', route: '/trustchain/#credential', width: 960, height: 720, choices: '', pane: 'DEMO-ORG-04 · Employer details', alt: 'Sample employer record with a fictional verification status.', setup: async (p: Page) => {
    await p.getByText('Reference details', {exact:true}).click()
    await p.getByText(/Network: none/).waitFor()
  } },
  { name: 'evidence', route: '/fairhire/#report', width: 960, height: 720, choices: 'A/A/A', pane: 'C-017 · Client communication source', alt: 'A sample communication finding points to the reply to Alex.', setup: async (p: Page) => {
    await button(p, 'View source for Client communication').click()
    await p.getByText(/name Rahul/).waitFor()
  } },
]

type Shot = readonly [second: number, action: string, execute: (page: Page) => Promise<unknown>]

const candidate: Shot[] = [
  [2, 'Acknowledge fictional exercise', p => p.getByRole('checkbox').check()],
  [5, 'Start timed practice', p => button(p, 'Start simulation').click()],
  [15, 'Select Rahul A', pickA], [18, 'Send Rahul reply', submit],
  [19, 'Open Tasks', p => button(p, 'Tasks').click()],
  [23, 'Open task source', p => button(p, 'View source · Demo server down').click()],
  [26, 'Open Alex and select A', async p => { await thread(p, 'Alex Morgan'); await pickA(p) }],
  [31, 'Send Alex reply', submit],
  [33, 'Open Calendar', p => button(p, 'Calendar').click()],
  [36, 'Open the 10:15 checkpoint', p => p.getByText(/Client checkpoint/).click()],
  [39, 'Open Budget', p => button(p, 'Budget').click()],
  [43, 'Open Meera and select A', async p => { await button(p, 'Inbox').click(); await thread(p, 'Meera Sen'); await pickA(p) }],
  [47, 'Send Meera reply', submit],
  [50, 'Finish the simulation', p => button(p, 'Finish simulation').click()],
  [56, 'Open educator reviewer lens', p => button(p, 'Explore fictional recruiter view').click()],
  [59, 'Inspect the client communication source', p => button(p, 'View source for Client communication').click()],
  [67, 'Open replay confirmation', p => button(p, 'Play again').click()],
]

const employer: Shot[] = [
  [6, 'Open Employer setup', p => open(p, '/fairhire/')],
  [13, 'Select Finance-first', p => p.getByLabel('Review order').selectOption('Finance-first')],
  [17, 'Preview report', p => button(p, 'Preview report').click()],
  [21, 'Open finance source', p => button(p, 'View source for Financial judgement').click()],
  [35, 'Return to finding', p => button(p, 'Back to finding').click()],
]

async function films(browser: Browser, name: string, length: number, route: string, shots: Shot[]) {
  const viewport = {width: 1920, height: 1080}
  const context = await browser.newContext({viewport, recordVideo:{dir:join(output,'recordings'),size:viewport}})
  try {
    const creation = performance.now()
    const page = await context.newPage()
    const video = page.video()
    if (!video) throw new Error('Missing Playwright recording')
    await open(page, route)
    if (name === 'employer') await page.getByText('Reference details', {exact:true}).click()
    const start = performance.now()
    const timing = []
    for (const [second, action, execute] of shots) {
      await wait(Math.max(0, start + second * 1000 - performance.now()))
      await execute(page)
      timing.push({action, second: (performance.now() - start) / 1000})
    }
    await wait(Math.max(0, start + length * 1000 - performance.now()))
    await context.close()
    const input = await video.path()
    const file = join(output, name + '-walkthrough.mp4')
    execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-ss',((start-creation)/1000).toFixed(3),'-i',input,
      '-t',String(length),'-vf','fps=30,tpad=stop_mode=clone:stop_duration=1','-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',file])
    execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-ss',name==='candidate'?'12.5':'25','-i',file,
      '-frames:v','1','-vf','scale=960:540','-c:v','libwebp','-quality','84',join(output,name+'-walkthrough-poster.webp')])
    await writeFile(join(output,name+'-timeline.json'),JSON.stringify({revision,fixture,viewport,route,timing},null,2))
  } finally {
    await context.close()
  }
}

async function run() {
  await mkdir(output, {recursive:true})
  const browser = await chromium.launch({executablePath})
  try {
    const manifest = []
    for (const tile of tiles) {
      const viewport = {width:tile.width,height:tile.height}
      const page = await browser.newPage({viewport,deviceScaleFactor:1})
      try {
        await open(page, tile.route)
        await tile.setup(page)
        const filename = 'bento-'+tile.name+'.png'
        await page.screenshot({path:join(output,filename),type:'png',animations:'disabled'})
        manifest.push({filename,route:tile.route,viewport,fixture,choices:tile.choices,pane:tile.pane,alt:tile.alt,
          revision,capturedAt:new Date().toISOString(),procedure:'Fresh context and approved UI controls'})
      } finally { await page.close() }
    }
    await writeFile(join(output,'capture-manifest.json'),JSON.stringify(manifest,null,2))
    await films(browser,'candidate',70,'/demo/',candidate)
    await films(browser,'employer',40,'/trustchain/#credential',employer)
  } finally { await browser.close() }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
