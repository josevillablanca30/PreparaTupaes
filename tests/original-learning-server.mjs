import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+name);if(!file.startsWith(root+'/'))throw Error();const bytes=await readFile(file);const type={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'content-type':type});res.end(bytes);}catch{res.writeHead(404);res.end();}}).listen(4187,'127.0.0.1');
