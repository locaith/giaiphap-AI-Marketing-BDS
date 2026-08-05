/**
 * Tải logo các nhà cung cấp mô hình từ Wikimedia Commons về public/logos/.
 *
 *   node tools/fetch-model-logos.mjs
 *
 * Chỉ lấy file SVG có giấy phép cho phép dùng lại. Logo là nhãn hiệu của các
 * công ty tương ứng, dùng ở đây để nêu khả năng tích hợp — giữ nguyên hình dạng
 * và màu, không chỉnh sửa.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'public/logos'
const UA = 'LocaithLandingBot/1.0 (https://ai-bds.locaith.com; locaithsolution@locaith.com)'

/** [tên file trên Commons, tên file lưu về] */
const FILES = [
  ['Claude AI symbol.svg', 'claude.svg'],
  ['OpenAI logo 2025 (symbol).svg', 'openai.svg'],
  ['Google Gemini icon 2025.svg', 'gemini.svg'],
  ['ByteDance logo English.svg', 'bytedance.svg'],
]

const strip = (value) => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const url =
  'https://commons.wikimedia.org/w/api.php?' +
  new URLSearchParams({
    format: 'json',
    action: 'query',
    titles: FILES.map(([name]) => `File:${name}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
  })

const res = await fetch(url, { headers: { 'User-Agent': UA } })
if (!res.ok) throw new Error(`API ${res.status}`)
const data = await res.json()

const info = new Map()
for (const page of Object.values(data?.query?.pages || {})) {
  const item = page.imageinfo?.[0]
  if (!item) continue
  const meta = item.extmetadata || {}
  info.set(page.title.replace(/^File:/, '').replace(/_/g, ' '), {
    url: item.url,
    page: item.descriptionurl,
    license: strip(meta.LicenseShortName?.value),
  })
}

fs.mkdirSync(OUT, { recursive: true })
const credits = []

for (const [name, file] of FILES) {
  const meta = info.get(name)
  if (!meta?.url) {
    console.log('- không tìm thấy:', name)
    continue
  }
  const svg = await fetch(meta.url, { headers: { 'User-Agent': UA } })
  if (!svg.ok) {
    console.log('- tải lỗi:', name, svg.status)
    continue
  }
  const body = await svg.text()
  fs.writeFileSync(path.join(OUT, file), body)
  credits.push({ file, source: meta.page, license: meta.license })
  console.log('+', file, `(${(body.length / 1024).toFixed(1)}KB, ${meta.license})`)
}

console.log('\n' + credits.map((c) => `${c.file} — ${c.license} — ${c.source}`).join('\n'))
