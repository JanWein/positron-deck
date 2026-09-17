"""Generate marketplace artwork from the project's own vector icons."""
from pathlib import Path
import html
import cairosvg

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'marketplace'
BG, INK, GREEN, RUST = '#f6f4ee', '#24352e', '#173e34', '#b65d3c'

def text(x, y, value, size=34, fill=INK, weight='normal'):
    return f'<text x="{x}" y="{y}" font-family="DejaVu Sans" font-size="{size}" font-weight="{weight}" fill="{fill}">{html.escape(value)}</text>'

def rect(x,y,w,h,fill,rx=24):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'

def logo(x,y,size):
    s=(ROOT/'docs/assets/logo.svg').read_text().strip()
    return f'<g transform="translate({x} {y}) scale({size/64})">'+s[s.index('>')+1:s.rfind('</svg>')]+'</g>'

def action(x,y,id,label):
    s=(ROOT/f'docs/icons/{id}.svg').read_text()
    content=s[s.index('>')+1:s.rfind('</svg>')]
    return rect(x,y,370,150,'#ffffff')+f'<g transform="translate({x+24} {y+26}) scale(1.25)">{content}</g>'+text(x+135,y+87,label,25)

def save(name,body,w=1920,h=960):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'+body+'</svg>'
    path=OUT/f'{name}.svg';path.write_text(svg)
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/f'{name}.png'))

def base(section):
    return rect(0,0,1920,960,BG,0)+logo(92,64,64)+text(178,110,'positron deck',34,weight='bold')+text(1820,108,section,22,fill='#66746b')

save('app-icon',logo(0,0,288),288,288)
save('thumbnail',base('01')+text(92,285,'Positron on',92,weight='bold')+text(92,400,'Stream Deck',92,RUST,weight='bold')+text(96,500,'192 actions for code, data and layouts.',33)+text(96,830,'Windows · Positron Desktop and Workbench',28)+action(1030,215,'runSelection','Run selection')+action(1425,215,'runCell','Run cell')+action(1030,395,'openDataConnections','Connections')+action(1425,395,'gitShowDiff','Show diff')+action(1030,575,'layoutStacked','Stacked layout')+action(1425,575,'saveAndTest','Save and test'))

body=base('02')+text(92,242,'Choose the actions you use most',64,weight='bold')+text(96,310,'Drag an action onto a button in the Stream Deck app.',31)
for i,(id,label) in enumerate([('runSelection','Run selection'),('runFile','Run file'),('openExplorer','Explorer'),('openSearch','Search'),('openDataConnections','Connections'),('openVariables','Variables'),('gitStageAll','Stage all'),('gitCommit','Commit'),('layoutStacked','Stacked layout'),('openTerminal','Terminal'),('render','Render'),('preview','Preview')]):
    body+=action(96+(i%4)*430,375+(i//4)*177,id,label)
save('gallery-actions',body)

body=base('03')+text(92,242,'Put a workflow on a button',64,weight='bold')+text(96,310,'Six built-in workflows and eight slots for your own.',31)
for x,title,lines in [(96,'Save and run',['Save the active file','Run it in the matching runtime']),(683,'Review workspace',['Save your files','Open Source Control and Problems']),(1270,'Custom workflow',['Choose your steps','Wait for tasks to finish successfully'])]:
    body+=rect(x,400,548,290,'#ffffff')+text(x+32,468,title,33,weight='bold')
    for n,line in enumerate(lines): body+=text(x+32,550+n*58,line,25)
body+=text(96,814,'Custom workflows show their steps for confirmation before they run.',28)
save('gallery-workflows',body)

body=base('04')+text(92,242,'Use it with Desktop or Workbench',62,weight='bold')
for x,title,lines in [(96,'On your Windows PC',['Stream Deck 7.1 or later','Positron Deck Stream Deck plugin','Buttons send keyboard shortcuts']),(998,'In your Positron session',['Positron Deck IDE extension','Install remotely for Workbench','Keep the IDE window or browser tab focused'])]:
    body+=rect(x,355,825,335,'#ffffff')+text(x+38,428,title,38,weight='bold')
    for n,line in enumerate(lines):body+=text(x+38,507+n*57,line,27)
body+=text(96,817,'No direct network bridge to the IDE. Buttons do not display live IDE status.',28)
save('gallery-setup',body)
print('Generated app icon, thumbnail and three gallery images.')
