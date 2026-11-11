// Merge independently paginated legacy/D2 histories with one shared server cursor.
export function mergeDuelHistory(legacy,modern){
 const micros=stamp=>{const fraction=String(stamp).match(/\.(\d+)/)?.[1]||'';return Date.parse(stamp)*1000+Number(fraction.slice(3,6).padEnd(3,'0'));};
 const unique=new Map([...(legacy.duels||[]),...(modern.duels||[])].map(d=>[d.id,d]));
 const rows=[...unique.values()].sort((a,b)=>micros(b.createdAt)-micros(a.createdAt)||b.id.localeCompare(a.id)),page=rows.slice(0,20),last=page.at(-1);
 const more=rows.length>20||legacy.next||modern.next;
 const summary=Object.fromEntries(['played','wins','losses','draws'].map(key=>[key,Number(legacy.summary?.[key]||0)+Number(modern.summary?.[key]||0)]));
 return{...legacy,duels:page,summary,next:more&&last?{createdAt:last.createdAt,id:last.id}:null};
}
