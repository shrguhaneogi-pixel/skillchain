import {spawn} from 'node:child_process'
import {existsSync,createReadStream,statSync} from 'node:fs'
import {createServer} from 'node:http'
import {resolve,extname,sep} from 'node:path'
const args=process.argv.slice(2)
if(args.includes('--strictPort')){
 const root=resolve('out'),port=Number(args[args.indexOf('--port')+1])
 const mimes={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.mp4':'video/mp4','.vtt':'text/vtt','.txt':'text/plain'}
 createServer((req,res)=>{
  let path;try{path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname))}catch{res.writeHead(400).end();return}
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return}
  if(existsSync(path)&&statSync(path).isDirectory())path=resolve(path,'index.html')
  let status=200
  if(!existsSync(path)){status=404;path=resolve(root,'404.html')}
  if(!existsSync(path)){res.writeHead(404).end();return}
  const size=statSync(path).size,range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range??'')
  let lo=0,hi=size-1
  if(range){lo=Number(range[1]);hi=range[2]?Math.min(size-1,Number(range[2])):size-1;if(lo>hi){res.writeHead(416).end();return}status=206;res.setHeader('Content-Range','bytes '+lo+'-'+hi+'/'+size)}
  res.writeHead(status,{'Content-Type':mimes[extname(path)]??'application/octet-stream','Content-Length':hi-lo+1,'Accept-Ranges':'bytes'})
  if(req.method==='HEAD'){res.end();return}createReadStream(path,{start:lo,end:hi}).pipe(res)
 }).listen(port,args[args.indexOf('--host')+1])
}else{
 const p=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack',...args],{stdio:'inherit'});p.on('exit',code=>process.exit(code??0))
}
