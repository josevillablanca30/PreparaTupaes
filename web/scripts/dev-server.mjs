import{createServer}from'node:http';
import{readFile,stat}from'node:fs/promises';
import path from'node:path';
import{fileURLToPath}from'node:url';
import{createGateway}from'../server/gateway.mjs';
const root=fileURLToPath(new URL('../dist',import.meta.url));
export async function startServer({port=Number(process.env.PORT||5173),hostname='0.0.0.0',fetcher=fetch,bindings={},builtRoot=root}={}){
 const manifest=JSON.parse(await readFile(new URL('../artifacts/build-manifest.json',import.meta.url),'utf8'));
 const gateway=createGateway({...manifest,fetcher});
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.txt':'text/plain'};
 const env={...bindings,ASSETS:{async fetch(request){let pathname;try{pathname=decodeURIComponent(new URL(request.url).pathname);}catch{return new Response('Bad path',{status:400});}if(pathname==='/')pathname='/index.html';const absolute=path.resolve(builtRoot,'.'+pathname);if(!absolute.startsWith(builtRoot+path.sep))return new Response('Forbidden',{status:403});try{if(!(await stat(absolute)).isFile())throw Error();return new Response(await readFile(absolute),{headers:{'content-type':mime[path.extname(absolute)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}}};
 const server=createServer(async(req,res)=>{try{const bytes=[];for await(const chunk of req)bytes.push(chunk);const body=Buffer.concat(bytes),request=new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,...(body.length?{body}:{}),duplex:'half'});const response=await gateway.fetch(request,env,{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500,{'content-type':'text/plain'}).end('Preview unavailable');}});
 await new Promise(resolve=>server.listen(port,hostname,resolve));console.log('Cachaste web preview listening on '+port);return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await startServer();
