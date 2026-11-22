import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { Window } from 'happy-dom'

const routes = ['/', '/about/', '/contact/', '/demo/', '/fairhire/', '/pricing/', '/privacy/', '/simulations/', '/skillproof/', '/terms/', '/trustchain/', '/404.html']
const queryPaths = [
  '/demo/?tool=tasks', '/contact/?topic=standard&c=30&r=1', '/contact/?topic=standard&c=10000&r=3',
  '/contact/?topic=demo', '/contact/?topic=custom', '/contact/?topic=institution', '/contact/?topic=privacy',
]
const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const parsed = new Map()
const failures = []
const requests = new Set(queryPaths)
const window = new Window({settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}})
for (const path of routes) {
  const filename = join('out',path,path.endsWith('/') ? 'index.html' : '')
  const document = new window.DOMParser().parseFromString(await readFile(filename,'utf8'),'text/html')
  parsed.set(path, document)
  requests.add(path)
}

for (const [path, document] of parsed) {
  const base = new URL(path, origin)
  const links = []
  for (const element of document.querySelectorAll('a[href], img[src], source[srcset], img[srcset], script[src], link[href]')) {
    const sources = element.getAttribute('srcset')?.split(',').map(part => part.trim().split(/\s+/)[0]) ?? []
    const direct = element.getAttribute('href') ?? element.getAttribute('src')
    if (direct !== null && direct === '') failures.push(path+' contains an empty destination')
    if (direct) sources.push(direct)
    for (const raw of sources) {
      const url = new URL(raw, base)
      if (url.origin !== base.origin) continue
      if (url.hash) {
        const target = parsed.get(url.pathname)
        if (!target?.getElementById(decodeURIComponent(url.hash.slice(1)))) failures.push(path+' broken anchor '+raw)
      }
      requests.add(url.pathname+url.search)
      links.push(url.pathname+url.search+url.hash)
    }
  }
  console.log(path+' · '+new Set(links).size+' unique internal destinations/assets')
}

for (const path of requests) {
  const url = new URL(path, origin)
  const response = await fetch(url,{method:'HEAD'})
  if (!(response.ok || (path==='/404.html' && response.status===404))) failures.push(path+' returned HTTP '+response.status)
}
await stat('out/404.html')
const missing = await fetch(new URL('/skillchain-unknown-route/',origin))
if (missing.status !== 404 || !(await missing.text()).includes('Page not found')) failures.push('Unknown route did not serve the labelled 404.')
await window.close()
console.log(`Checked ${requests.size} unique HTTP paths, including approved queries, and the 404 response.`)
failures.forEach(issue=>console.error(issue))
process.exitCode=failures.length ? 1 : 0
