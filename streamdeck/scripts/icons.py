from pathlib import Path
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent/'org.positron-deck.shortcuts.sdPlugin/imgs'
root.mkdir(parents=True,exist_ok=True)
shapes={
'code':'<path d="M28 22 16 34 28 46M44 22 56 34 44 46M40 18 32 49"/>',
'git':'<path d="M24 23V43Q24 50 34 50H43M24 32H37Q46 32 46 23"/><circle cx="24" cy="18" r="5"/><circle cx="46" cy="18" r="5"/><circle cx="48" cy="50" r="5"/>',
'r':'<path d="M25 50V18H38Q53 18 53 29T38 39H25M37 39 51 50"/>',
'app':'<rect x="15" y="18" width="43" height="33" rx="5"/><path d="M16 28H57M23 23H25M32 23H34M35 34 44 40 35 46Z"/>',
'deploy':'<path d="M36 46V18M25 29 36 18 47 29M18 42V52H54V42"/>'}
colors={'code':'#13526a','git':'#424778','r':'#305c46','app':'#655027','deploy':'#683744'}
for name,shape in shapes.items():
 for kind,size in [('list',20),('key',72)]:
  for scale,suffix in [(1,''),(2,'@2x')]:
   background=f'<rect x="1" y="1" width="70" height="70" rx="12" fill="{colors[name]}"/>' if kind=='key' else ''
   svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{size*scale}" height="{size*scale}" viewBox="0 0 72 72">{background}<g fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{shape}</g></svg>'
   (root/f'{name}-{kind}{suffix}.svg').write_text(svg)
for scale,suffix in [(1,''),(2,'@2x')]:
 (root/f'category{suffix}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{28*scale}" height="{28*scale}" viewBox="0 0 72 72"><g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round">{shapes["code"]}</g></svg>')
 size=256*scale;im=Image.new('RGBA',(size,size),'#102332');d=ImageDraw.Draw(im)
 def box(v):return tuple(int(x*scale) for x in v)
 d.rounded_rectangle(box((25,45,231,211)),radius=20*scale,fill='#1e586f',outline='#8ae3ff',width=4*scale)
 for row in range(2):
  for col in range(4):
   x=47+col*44;y=77+row*49;d.rounded_rectangle(box((x,y,x+30,y+30)),radius=5*scale,fill='#e4f8ff')
 d.rounded_rectangle(box((69,178,186,186)),radius=4*scale,fill='#8ae3ff')
 im.save(root/f'plugin{suffix}.png')
