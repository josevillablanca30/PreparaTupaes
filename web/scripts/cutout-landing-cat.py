"""Remove only the edge-connected pale background from the existing rank art.
No synthesis, resampling, or RGB edits. The original crop path is retained.
"""
from pathlib import Path
from collections import deque
import base64,io,json,hashlib,xml.etree.ElementTree as ET
from PIL import Image,ImageDraw
source=Path('assets/competition-cat-rank.svg');root=ET.parse(source).getroot()
embedded=root.find('{http://www.w3.org/2000/svg}image').get('href')
raw=base64.b64decode(embedded.split(',',1)[1]);original=Image.open(io.BytesIO(raw)).convert('RGB');w,h=original.size
# Same polygon as the source SVG's clipPath; it excludes the original speech text.
clip=Image.new('L',(w,h));ImageDraw.Draw(clip).polygon([(153,0),(408,0),(408,278),(0,278),(0,181),(9,166),(26,160),(34,151),(45,151),(53,160),(60,182),(82,193),(110,201),(111,175),(101,161),(97,133),(103,113),(117,99),(128,86),(135,55),(146,9)],fill=255)
pixels=original.load();seen=set();queue=deque()
def background(x,y):
    rgb=pixels[x,y]
    return min(rgb)>=224 and max(rgb)-min(rgb)<=36
for y in range(h):
    for x in (0,w-1):
        if background(x,y):queue.append((x,y));seen.add((x,y))
for x in range(w):
    for y in (0,h-1):
        if background(x,y) and (x,y) not in seen:queue.append((x,y));seen.add((x,y))
while queue:
    x,y=queue.popleft()
    for a,b in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if 0<=a<w and 0<=b<h and (a,b) not in seen and background(a,b):seen.add((a,b));queue.append((a,b))
alpha=clip.load()
for x,y in seen:alpha[x,y]=0
# Keep the connected character; detached speech-bubble fragments and rays belong
# to the source screenshot, not the mascot silhouette.
remaining={(x,y) for y in range(h) for x in range(w) if alpha[x,y]}
components=[]
while remaining:
    first=remaining.pop();part={first};queue=deque([first])
    while queue:
        x,y=queue.popleft()
        for a,b in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if (a,b) in remaining:remaining.remove((a,b));part.add((a,b));queue.append((a,b))
    components.append(part)
character=max(components,key=len)
for part in components:
    if part is not character:
        for x,y in part:alpha[x,y]=0
result=original.copy().convert('RGBA');result.putalpha(clip)
out=Path('web/public/assets/landing-cat-rank-cutout.png');out.parent.mkdir(parents=True,exist_ok=True);result.save(out,optimize=True)
assert result.convert('RGB').tobytes()==original.tobytes(),'Original RGB must remain bit-for-bit identical'
proof={'source':str(source),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':str(out),'size':[w,h],'rgbPreserved':True,'method':'original SVG crop and edge-connected pale-background mask; no generation','transparentPixels':sum(a==0 for a in clip.getdata()),'detachedBackgroundFragmentsRemoved':len(components)-1}
Path('web/reports/work3-20261110/art-verification.json').write_text(json.dumps(proof,indent=2)+'\n')

print(json.dumps(proof))
