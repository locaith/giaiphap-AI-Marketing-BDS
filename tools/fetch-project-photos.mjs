/**
 * Tải ảnh thật của các dự án / công trình bất động sản Việt Nam từ Wikimedia
 * Commons, cắt về tỷ lệ 4:5 và làm sáng lại để chạy nền landing page.
 *
 *   node tools/fetch-project-photos.mjs
 *
 * Chỉ lấy ảnh có giấy phép cho phép dùng lại (CC BY / CC BY-SA / Public domain).
 * Thông tin tác giả + giấy phép được ghi ra src/credits.ts và CREDITS.md.
 *
 * Muốn dùng ảnh dự án của chính doanh nghiệp: bỏ file vào public/projects/ theo
 * tên tile-01.webp … tile-NN.webp (tỷ lệ 4:5) là xong, không cần chạy script.
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'public/projects'
const UA = 'LocaithLandingBot/1.0 (https://ai-bds.locaith.com; locaithsolution@locaith.com)'
const TILE_W = 520
const TILE_H = 650

/** Từ khoá tra cứu → tên dự án hiển thị trong phần ghi nguồn. */
const TARGETS = [
  ['Landmark 81', 'Landmark 81 · Vinhomes Central Park'],
  ['Vinhomes Central Park', 'Vinhomes Central Park, TP.HCM'],
  ['Vinhomes Ocean Park', 'Vinhomes Ocean Park, Hà Nội'],
  ['Vinhomes Grand Park', 'Vinhomes Grand Park, TP.HCM'],
  ['Bitexco Financial Tower', 'Bitexco Financial Tower, TP.HCM'],
  ['Keangnam Hanoi Landmark Tower', 'Keangnam Landmark 72, Hà Nội'],
  ['Times City Hanoi', 'Times City, Hà Nội'],
  ['Ecopark Hung Yen Vietnam', 'Ecopark, Hưng Yên'],
  ['Phu My Hung Ho Chi Minh City', 'Phú Mỹ Hưng, TP.HCM'],
  ['Royal City Hanoi', 'Royal City, Hà Nội'],
  ['Masteri Thao Dien', 'Masteri Thảo Điền, TP.HCM'],
  ['Saigon Pearl', 'Saigon Pearl, TP.HCM'],
  ['Thu Thiem New Urban Area', 'Thủ Thiêm, TP.HCM'],
  ['Ciputra Hanoi International City', 'Ciputra, Hà Nội'],
  ['Ho Chi Minh City skyline', 'TP.HCM'],
  ['Hanoi skyline', 'Hà Nội'],
  ['Da Nang skyline Vietnam', 'Đà Nẵng'],
  ['Nha Trang skyline Vietnam', 'Nha Trang'],
]

/** Ảnh đêm hoặc ảnh quá tối bị loại — nền trang là tông sáng. */
const MIN_BRIGHTNESS = 96
const DARK_TITLE = /(night|đêm|evening|dusk|sunset|dark)/i

const OK_LICENSE = /^(cc by|cc by-sa|cc0|public domain|cc-by)/i

const strip = (value) => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

async function api(params) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params })
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

async function search(term) {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: `${term} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1100',
  })
  const pages = data?.query?.pages
  if (!pages) return []
  return Object.values(pages)
    .map((page) => {
      const info = page.imageinfo?.[0]
      if (!info) return null
      const meta = info.extmetadata || {}
      return {
        title: page.title,
        thumb: info.thumburl,
        width: info.width,
        height: info.height,
        page: info.descriptionurl,
        license: strip(meta.LicenseShortName?.value),
        author: strip(meta.Artist?.value),
      }
    })
    .filter(Boolean)
    .filter((item) => item.thumb && item.width >= 900 && OK_LICENSE.test(item.license))
    .filter((item) => !/\.svg$/i.test(item.title))
}

fs.mkdirSync(OUT, { recursive: true })
for (const file of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, file))

const credits = []
let index = 0

/** Kéo mức sáng trung bình của mọi ảnh về cùng một tông sáng, dịu. */
async function toTile(buffer, outPath) {
  const base = sharp(buffer)
    .resize({ width: TILE_W, height: TILE_H, fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.5 })

  const { channels } = await base.clone().stats()
  const mean = channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3
  const gain = Math.min(2.6, Math.max(1, 178 / Math.max(mean, 1)))

  const lifted = await base.linear(gain, 18).toColourspace('srgb').png().toBuffer()

  await sharp(lifted)
    // phủ thêm một lớp trắng mỏng để ảnh nào cũng đủ nhạt khi chạy nền
    .composite([{ input: { create: { width: TILE_W, height: TILE_H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0.16 } } } }])
    .webp({ quality: 76, effort: 6 })
    .toFile(outPath)

  return mean
}

for (const [term, label] of TARGETS) {
  let results = []
  try {
    results = await search(term)
  } catch (error) {
    console.log('!', term, error.message)
  }

  let done = false
  for (const candidate of results.slice(0, 6)) {
    if (DARK_TITLE.test(candidate.title)) continue

    const response = await fetch(candidate.thumb, { headers: { 'User-Agent': UA } })
    if (!response.ok) continue
    const buffer = Buffer.from(await response.arrayBuffer())

    const probe = await sharp(buffer).stats()
    const mean = probe.channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3
    if (mean < MIN_BRIGHTNESS) continue

    index += 1
    const name = `tile-${String(index).padStart(2, '0')}.webp`
    await toTile(buffer, path.join(OUT, name))

    credits.push({ file: name, project: label, author: candidate.author, license: candidate.license, source: candidate.page })
    console.log('+', name, '←', label, `(${candidate.license}, sáng ${mean.toFixed(0)})`)
    done = true
    break
  }

  if (!done) console.log('- bỏ qua (không có ảnh sáng hợp lệ):', term)
}

fs.writeFileSync(
  'src/credits.ts',
  `// Sinh tự động bởi tools/fetch-project-photos.mjs — đừng sửa tay.\n` +
    `export type PhotoCredit = {\n  file: string\n  project: string\n  author: string\n  license: string\n  source: string\n}\n\n` +
    `export const photoCredits: PhotoCredit[] = ${JSON.stringify(credits, null, 2)}\n`,
)

fs.writeFileSync(
  'CREDITS.md',
  `# Nguồn ảnh nền\n\nẢnh các dự án / công trình bất động sản Việt Nam dùng làm nền trang, lấy từ Wikimedia Commons theo giấy phép cho phép dùng lại.\n\n` +
    credits.map((c) => `- **${c.project}** — ${c.author || 'Không rõ tác giả'} · ${c.license} · [nguồn](${c.source})`).join('\n') +
    `\n`,
)

console.log(`\nXong: ${credits.length} ảnh trong ${OUT}`)
