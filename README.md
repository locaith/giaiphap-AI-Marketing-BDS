# Giải pháp AI Marketing cho Bất động sản — Locaith

Landing page React + TypeScript + Vite cho giải pháp đo lường và tự động hoá Marketing bất động sản của Locaith.

Trang chạy tại **https://ai-bds.locaith.com**

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Deploy Vercel

1. Import repo này vào Vercel.
2. Framework preset: **Vite** · Build command `npm run build` · Output `dist`.
3. Thêm domain `ai-bds.locaith.com` trong Project Settings → Domains.

## Cấu trúc

| Đường dẫn | Vai trò |
| --- | --- |
| `src/App.tsx` | Toàn bộ các phần của trang |
| `src/components/Stage.tsx` | Phần cuộn khoá kể chuyện (scrollytelling) |
| `src/components/Backdrop.tsx` | Nền lưới ảnh dự án đặt chéo, trôi dọc |
| `src/lib/useStage.ts` | Hook đo tiến độ cuộn và tính chuyển động giả 3D |
| `src/content.ts` | Nội dung từng nhịp cuộn — sửa chữ ở đây |
| `src/config.ts` | Tên miền, email nhận demo, tên case study |
| `src/credits.ts` | Ghi nguồn ảnh nền (sinh tự động) |
| `public/exhibits/` | Ảnh màn hình sản phẩm |
| `public/projects/` | Ảnh nền dự án bất động sản |
| `tools/` | Script sinh ảnh |

## Phần cuộn khoá (scrollytelling)

Khối `Stage` cao `(số nhịp + 1) × 100vh`, bên trong có một khung `position: sticky` cao đúng một màn hình. Mỗi nhịp chiếm trọn một màn cuộn: **70% đầu giữ nguyên tại chỗ** để người đọc kịp đọc hết câu, 30% cuối mới chuyển sang nhịp kế. Các điểm neo vô hình đặt đúng chỗ chuyển nhịp nên cuộn luôn dừng ở một nhịp trọn vẹn chứ không kẹt giữa hai nhịp.

Sửa nội dung các nhịp trong `src/content.ts` — thêm hoặc bớt phần tử của mảng `beats` thì chiều cao và thanh tiến độ tự tính lại.

## Ảnh sản phẩm

5 ảnh trong `public/exhibits/` được bóc từ phụ lục bản kế hoạch triển khai (trang 3 trở đi). Các con số trong ảnh là dữ liệu minh hoạ — câu ghi chú dưới phần cuộn đã nói rõ điều này, đừng bỏ đi.

## Ảnh nền dự án

Nền trang là lưới ảnh các dự án / công trình bất động sản Việt Nam, đặt chéo 13° và trôi dọc chậm bằng CSS transform (không dùng GIF: nhẹ hơn nhiều lần, không vỡ màu, co giãn theo mọi màn hình và tự dừng khi người dùng bật "giảm chuyển động").

Ảnh lấy từ Wikimedia Commons theo giấy phép cho phép dùng lại — tác giả và giấy phép ghi trong [CREDITS.md](CREDITS.md) và hiện ở cuối trang.

Tải lại bộ ảnh:

```bash
npm i -D sharp
node tools/fetch-project-photos.mjs
```

**Dùng ảnh dự án của chính doanh nghiệp:** bỏ file vào `public/projects/` theo tên `tile-01.webp` … `tile-NN.webp` (tỷ lệ 4:5, tông sáng), rồi cập nhật `src/credits.ts` cho khớp. Cách này chuẩn nhất vì hiện đúng dự án đang bán và không vướng bản quyền.

Chỉnh độ đậm nhạt của nền: `.backdrop-page` và `.backdrop-hero` trong `src/styles.css`.

## Font tiếng Việt

Dùng **Be Vietnam Pro** (chữ thường) và **Lora** (chữ tiêu đề). Cả hai đều dựng đủ các tổ hợp dấu tiếng Việt như `ồ`, `ỗ`, `ự`, `ặ`. Nếu đổi font khác, phải kiểm tra lại đúng những ký tự này — nhiều font Latin phổ biến (kể cả Playfair Display) bị tách rời dấu.

## Điểm cần lưu ý khi sửa

- `index.html`: canonical, `og:url`, `og:image` đang trỏ về `ai-bds.locaith.com`.
- Ảnh chia sẻ mạng xã hội: `public/og-image.png` (1200×630). Dựng lại bằng `npm i -D playwright-core && node tools/make-og-image.mjs`.
- Hệ màu nằm gọn trong khối `:root` của `src/styles.css` — đổi 3 biến `--accent*` là đổi tông cả trang.
- CTA đang dùng `mailto:` — thay bằng form hoặc webhook CRM khi cần.
