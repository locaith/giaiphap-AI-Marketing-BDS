/**
 * Tải ảnh nền cho landing page: ảnh thật của các dự án, khu đô thị và khu nghỉ
 * dưỡng bất động sản Việt Nam, lấy từ Wikimedia Commons.
 *
 *   npm i -D sharp
 *   node tools/fetch-project-photos.mjs
 *
 * Danh sách file dưới đây được chọn tay và đã xem tận mắt từng ảnh — tìm kiếm
 * tự động trên Commons trả về quá nhiều ảnh lạc đề (biển hiệu, nội thất, thậm
 * chí ảnh chụp ở nước khác), nên không dùng.
 *
 * Mọi file đều có giấy phép cho phép dùng lại; tác giả và giấy phép được ghi ra
 * src/credits.ts và CREDITS.md rồi hiện ở cuối trang.
 *
 * Muốn dùng ảnh dự án của chính doanh nghiệp: bỏ file vào public/projects/ theo
 * tên tile-01.webp … tile-NN.webp (tỷ lệ 4:5) và sửa src/credits.ts cho khớp.
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'public/projects'
const UA = 'LocaithLandingBot/1.0 (https://ai-bds.locaith.com; locaithsolution@locaith.com)'
const TILE_W = 520
const TILE_H = 650

/** [tên file trên Commons, nhãn hiển thị trong phần ghi nguồn] */
const FILES = [
  ['Ho Chi Minh City - DJI 0124-HDR.jpg', 'TP.HCM nhìn từ trên cao'],
  ['Landmark 81 viewed from Thu Thiem.png', 'Landmark 81 · Vinhomes Central Park, TP.HCM'],
  ['Bitexco Financial Tower under-construction.JPG', 'Bitexco Financial Tower, TP.HCM'],
  ['Ho Chi Minh City skyline (49399217481).jpg', 'Trung tâm TP.HCM'],
  ['Thu Thiem urban area, Saigon (20230705 1511).jpg', 'Khu đô thị Thủ Thiêm, TP.HCM'],
  ['Đô thị Phú mỹ hưng, q7, tphcm Việtnam - panoramio.jpg', 'Đô thị Phú Mỹ Hưng, TP.HCM'],
  ['Landmark72swimmingpool.JPG', 'Keangnam Landmark 72, Hà Nội'],
  ['An aerial view of Ecopark, Van Giang, Xuan Quan, Hung Yen.jpg', 'Ecopark, Hưng Yên'],
  ['Private Beach of InterContinental Danang Sun Peninsula.jpg', 'InterContinental Đà Nẵng Sun Peninsula'],
  ['Vĩnh Nguyên, NHA Trang, Khanh Hoa Province, Vietnam - panoramio (30).jpg', 'Vĩnh Nguyên, Nha Trang'],
  ['Bờ biển ở Nha Trang.jpg', 'Vịnh Nha Trang'],
  ['Phu Quoc beach Saigon Phu Quoc Resort and Spa (2).jpg', 'Khu nghỉ dưỡng biển Phú Quốc'],
  ['Palm trees beach Da Nang.jpg', 'Biển Mỹ Khê, Đà Nẵng'],
]

const strip = (value) => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

async function imageInfo(titles) {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      format: 'json',
      action: 'query',
      titles: titles.map((title) => `File:${title}`).join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '1400',
    })
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()

  const found = new Map()
  for (const page of Object.values(data?.query?.pages || {})) {
    const info = page.imageinfo?.[0]
    if (!info) continue
    const meta = info.extmetadata || {}
    found.set(page.title.replace(/^File:/, '').replace(/_/g, ' '), {
      thumb: info.thumburl,
      page: info.descriptionurl,
      license: strip(meta.LicenseShortName?.value),
      author: strip(meta.Artist?.value),
    })
  }
  return found
}

/** Đưa mọi ảnh về cùng một tông: đủ sáng để chữ đè lên vẫn đọc, vẫn giữ màu và chi tiết. */
async function toTile(buffer, outPath) {
  const base = sharp(buffer)
    .resize({ width: TILE_W, height: TILE_H, fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.88 })

  const { channels } = await base.clone().stats()
  const mean = channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3
  const gain = Math.min(2.1, Math.max(1, 150 / Math.max(mean, 1)))

  await base
    .linear(gain, 10)
    .sharpen({ sigma: 0.7 })
    .toColourspace('srgb')
    .webp({ quality: 76, effort: 6 })
    .toFile(outPath)
}

fs.mkdirSync(OUT, { recursive: true })
for (const file of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, file))

const info = await imageInfo(FILES.map(([name]) => name))
const credits = []
let index = 0

for (const [name, label] of FILES) {
  const meta = info.get(name)
  if (!meta?.thumb) {
    console.log('- không tìm thấy trên Commons:', name)
    continue
  }

  const response = await fetch(meta.thumb, { headers: { 'User-Agent': UA } })
  if (!response.ok) {
    console.log('- tải lỗi:', name, response.status)
    continue
  }

  index += 1
  const file = `tile-${String(index).padStart(2, '0')}.webp`
  await toTile(Buffer.from(await response.arrayBuffer()), path.join(OUT, file))

  credits.push({ file, project: label, author: meta.author, license: meta.license, source: meta.page })
  console.log('+', file, '←', label, `(${meta.license})`)
}

fs.writeFileSync(
  'src/credits.ts',
  `// Sinh tự động bởi tools/fetch-project-photos.mjs — đừng sửa tay.\n` +
    `export type PhotoCredit = {\n  file: string\n  project: string\n  author: string\n  license: string\n  source: string\n}\n\n` +
    `export const photoCredits: PhotoCredit[] = ${JSON.stringify(credits, null, 2)}\n`,
)

fs.writeFileSync(
  'CREDITS.md',
  `# Nguồn ảnh nền\n\nẢnh các dự án, khu đô thị và khu nghỉ dưỡng bất động sản Việt Nam dùng làm nền trang, lấy từ Wikimedia Commons theo giấy phép cho phép dùng lại.\n\n` +
    credits
      .map((c) => `- **${c.project}** — ${c.author || 'Không rõ tác giả'} · ${c.license} · [nguồn](${c.source})`)
      .join('\n') +
    `\n`,
)

console.log(`\nXong: ${credits.length} ảnh trong ${OUT}`)
