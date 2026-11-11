(function(g){'use strict';const wrap=(body,label)=>'<svg viewBox="0 0 320 150" role="img" aria-label="'+label+'" class="learning-picture">'+body+'</svg>';
 function visual(v){if(!v)return'';
 if(v.type==='concept-bridge'){
  // Illustrated relationship diagram, readable to screen readers without relying on colors.
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parts=Array.isArray(v.items)?v.items.slice(0,4):[];
  if(parts.length<2)return'';
  return '<figure class="concept-bridge" aria-label="'+esc(v.title||'Relación de ideas')+'"><figcaption>'+esc(v.title||'Conecta las ideas')+'</figcaption><ol>'+parts.map((item,i)=>'<li><span class="concept-bridge-index" aria-hidden="true">'+(i+1)+'</span><span>'+esc(item)+'</span></li>').join('')+'</ol></figure>';
 }
const circle=(x,y,c='#7951c8')=>'<circle cx="'+x+'" cy="'+y+'" r="10" fill="'+c+'"/>',text=(x,y,t)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="system-ui" font-size="17" fill="#43315e">'+t+'</text>';let b='';
 if(['dots','groups'].includes(v.type)){for(let r=0;r<v.rows;r++){if(v.type==='groups')b+='<rect x="34" y="'+(15+r*40)+'" width="252" height="34" rx="15" fill="#f1e8fe"/>';for(let c=0;c<v.cols;c++)b+=circle(160+(c-(v.cols-1)/2)*31,32+r*40);}return wrap(b,v.rows+' grupos de '+v.cols+' puntos');}
 if(v.type==='addition'){for(let c=0;c<v.a;c++)b+=circle(32+c*27,45);for(let c=0;c<v.b;c++)b+=circle(32+c*27,110,'#d58b3d');return wrap(b,'Un grupo de '+v.a+' y otro de '+v.b);}
 if(v.type==='compare'){for(let c=0;c<v.a;c++)b+=circle(30+c*30,40);for(let c=0;c<v.b;c++)b+=circle(30+c*30,100,'#b390dc');return wrap(b,'Arriba '+v.a+' puntos, abajo '+v.b+' puntos');}
 if(v.type==='line'){const x=n=>25+(n-v.from)/(v.to-v.from)*270;b='<line x1="25" y1="82" x2="295" y2="82" stroke="#b09acb" stroke-width="3"/>';for(let n=v.from;n<=v.to;n++)b+='<line x1="'+x(n)+'" y1="75" x2="'+x(n)+'" y2="89" stroke="#72539b"/>'+text(x(n),112,n);b+=circle(x(v.start),82);if(v.end!==undefined){b+='<path d="M'+x(v.start)+' 60 Q'+((x(v.start)+x(v.end))/2)+' 4 '+x(v.end)+' 60" stroke="#d58b3d" stroke-width="4" fill="none"/>';b+=circle(x(v.end),82,'#d58b3d');}return wrap(b,'Recta de '+v.from+' a '+v.to+', marca inicial '+v.start+(v.end!==undefined?', final '+v.end:''));}
 if(v.type==='fraction'||v.type==='equivalent'){const bars=(n,f,y)=>{let out='';for(let i=0;i<n;i++)out+='<rect x="'+(25+i*270/n)+'" y="'+y+'" width="'+(270/n-3)+'" height="38" rx="5" fill="'+(i<f?'#855acb':'#ede6f5')+'" stroke="#c7b5de"/>';return out;};b=bars(v.parts,v.filled,25);if(v.type==='equivalent')b+=bars(2,1,90);return wrap(b,v.filled+' de '+v.parts+' partes iguales'+(v.type==='equivalent'?', equivalentes a una mitad':''));}
 return'';}
 g.CachasteFoundationVisual=visual;
})(typeof window==='undefined'?globalThis:window);
