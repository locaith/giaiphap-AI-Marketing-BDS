import { chromium } from 'playwright-core'
import fs from 'fs'
const OUT='C:/Users/PC_WORK/AppData/Local/Temp/claude/c--locaith-Landing-Pages-bds-giai-phap-locaith-locaith-remi-landing/f49f1ff0-d1e6-44ee-88db-34ad789a81ed/scratchpad/shots7'
fs.mkdirSync(OUT,{recursive:true})
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const errs=[]
for (const [w,h,name] of [[1440,900,'desktop'],[390,844,'mobile']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w<500?2:1 })
  p.on('pageerror',e=>errs.push(name+': '+e.message))
  await p.goto('http://localhost:4204/', { waitUntil: 'networkidle' })
  await p.evaluate(()=>document.querySelector('.model-grid')?.scrollIntoView({block:'center'}))
  await p.waitForTimeout(2200)
  await p.screenshot({ path: `${OUT}/${name}.png` })
  const loaded = await p.evaluate(()=>{
    const imgs=[...document.querySelectorAll('.model-logo-img')]
    return imgs.map(i=>`${i.alt.replace('Logo ','')}:${i.classList.contains('is-loaded')?'ok':'chưa'}:${i.naturalWidth}x${i.naturalHeight}`).join(' ')
  })
  console.log(name, '->', loaded)
  await p.close()
}
console.log('errors:', errs.length?errs:'none')
await b.close()
