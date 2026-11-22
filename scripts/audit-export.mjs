import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const root = 'out'
const issues = []
let htmlCount = 0
let scriptCount = 0
const tracker = /(?:googletagmanager\.com|google-analytics\.com|segment\.(?:com|io)|posthog\.com|mixpanel\.com|amplitude\.com|plausible\.io|hotjar\.com|doubleclick\.net|vercel-scripts\.com|\/_vercel\/(?:insights|speed-insights)|connect\.facebook\.net|clarity\.ms)/gi

async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await inspect(path)
      continue
    }
    const ext = extname(path)
    if (!['.html', '.js'].includes(ext)) continue
    const source = await readFile(path, 'utf8')
    const filename = relative(root, path)
    if (ext === '.js') scriptCount++
    else {
      htmlCount++
      for (const [, url] of source.matchAll(/<script\b[^>]*?\bsrc=["']([^"']+)["']/gi)) {
        if (!url.startsWith('/_next/static/') && !url.startsWith('./')) issues.push(filename + ' unexpected script URL ' + url)
      }
    }
    for (const [host] of source.matchAll(tracker)) issues.push(filename + ' tracking marker: ' + host)
  }
}

await inspect(root)
if (!htmlCount || !scriptCount) throw new Error('Missing static export or client scripts')
console.log(`Checked ${htmlCount} exported HTML files and ${scriptCount} JS files for third-party script tags and known analytics markers.`)
for (const issue of issues) console.error(issue)
process.exitCode = issues.length ? 1 : 0
