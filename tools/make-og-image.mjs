/**
 * Dựng ảnh chia sẻ mạng xã hội public/og-cover.png (1200×630).
 *
 *   npm i -D playwright-core
 *   node tools/make-og-image.mjs
 *
 * Chạy lại mỗi khi đổi tiêu đề hoặc hệ màu của trang. Zalo và Facebook lưu ảnh
 * theo đường dẫn, nên sau khi dựng lại PHẢI đổi luôn tên file rồi sửa thẻ
 * og:image trong index.html — giữ nguyên tên thì bên kia vẫn hiện ảnh cũ.
 */
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const asDataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`

const logo = asDataUri('public/logo-locaith.png', 'image/png')
const shot = asDataUri('public/exhibits/leads.webp', 'image/webp')
const tile = asDataUri('public/projects/tile-01.webp', 'image/webp')

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0 }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative;
         font-family: 'Be Vietnam Pro', sans-serif; background: #fcfbf8 }
  .photo { position: absolute; inset: 0; background: url('${tile}') center/cover; opacity: .3 }
  .wash { position: absolute; inset: 0; background:
    radial-gradient(58% 60% at 30% 46%, rgba(252,251,248,.94), rgba(252,251,248,.5) 70%, rgba(252,251,248,.2) 100%),
    radial-gradient(50% 46% at 10% 4%, rgba(15,85,104,.14), transparent 68%),
    radial-gradient(46% 44% at 94% 8%, rgba(163,118,47,.14), transparent 66%) }
  .wrap { position: relative; padding: 60px 64px; height: 100%; display: flex; flex-direction: column }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 17px; font-weight: 600;
           letter-spacing: .17em; color: #0d2438 }
  .brand img { width: 38px; height: 38px; border-radius: 10px }
  .brand small { font-size: 12px; letter-spacing: .2em; color: #0f5568; background: rgba(15,85,104,.1);
                 padding: 5px 9px; border-radius: 7px; font-weight: 600 }
  h1 { font-family: 'Lora', serif; font-weight: 400; font-size: 58px; line-height: 1.26;
       letter-spacing: -.012em; color: #0d2438; margin-top: 44px; max-width: 15ch }
  h1 i { font-style: italic; background: linear-gradient(100deg, #0f5568, #1a7d90 48%, #a3762f);
         -webkit-background-clip: text; color: transparent }
  p { margin-top: 22px; font-size: 21px; line-height: 1.55; color: #485c6e; max-width: 30ch }
  .shot { position: absolute; right: -120px; bottom: -76px; width: 620px; border-radius: 18px;
          border: 1px solid rgba(13,36,56,.1); box-shadow: 0 40px 90px rgba(13,36,56,.2);
          transform: rotate(-4deg); overflow: hidden }
  .shot img { display: block; width: 100% }
  .foot { margin-top: auto; font-size: 16px; color: #7b8d9b; letter-spacing: .04em }
</style></head><body>
  <div class="photo"></div>
  <div class="wash"></div>
  <div class="shot"><img src="${shot}"></div>
  <div class="wrap">
    <div class="brand"><img src="${logo}">LOCAITH <small>AI BĐS</small></div>
    <h1>Biết chính xác khoản chi nào <i>tạo doanh thu.</i></h1>
    <p>Giải pháp AI Marketing cho Bất động sản.</p>
    <div class="foot">ai-bds.locaith.com</div>
  </div>
</body></html>`

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)
await page.screenshot({ path: 'public/og-cover.png' })
await browser.close()

console.log('public/og-cover.png', (fs.statSync('public/og-cover.png').size / 1024).toFixed(0) + 'KB')
