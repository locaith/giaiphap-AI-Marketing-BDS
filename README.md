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
| `src/components/KineticText.tsx` | Chữ chạy ở đầu trang: gõ máy + nổi lên dần |
| `src/components/ChatConsult.tsx` | Form thu thập thông tin + khung trò chuyện nhúng |
| `src/components/FloatingWidgets.tsx` | Nút Zalo OA và nút trợ lý nổi ở chân màn hình |
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

## Hiệu ứng cuộn dùng chung

Cả trang chỉ có **một** ngôn ngữ chuyển động: trồi lên + nét dần + ngả nhẹ theo trục X, cùng nhịp với phần cuộn khoá ở giữa trang.

- Gắn `data-reveal` cho một khối bất kỳ là nó hiện dần khi cuộn tới. Biến thể: `lift` (mặc định), `left`, `right`, `scale`, `line`.
- Gắn `data-stagger="<biến thể>"` cho một container thì mọi thẻ con tự nhận `data-reveal` và nối nhau xuất hiện, không cần khai báo từng thẻ.
- Toàn bộ tắt sạch khi người dùng bật "giảm chuyển động".

Ở đầu trang, câu dẫn chạy như đánh máy còn những cụm cần nhấn thì nổi lên dần từng từ — xem `src/components/KineticText.tsx`. Cụm nhấn không dùng `background-clip: text` được (chữ trong suốt thì không có gì để mờ dần), nên màu chuyển teal → đồng được tính cho từng từ trong JS.

Hai điều bắt buộc khi sửa phần này:

- **Mảng `segments` phải là hằng số đặt ngoài component.** Dựng mảng mới ở mỗi lần render thì dòng thời gian bị tính lại liên tục và chữ nhấp nháy không ngừng.
- **Mọi khối chữ dùng chung một `cycleMs`** (`HERO_CYCLE` trong `src/App.tsx`, đang là 13 giây: chạy hết khoảng 6 giây rồi đứng yên gần 7 giây). Mỗi khối lặp theo nhịp riêng sẽ lệch pha và nhìn rất rối. Hiệu ứng dừng hẳn khi khối chữ khuất khỏi màn hình.

## Kênh liên hệ

- Mọi nút kêu gọi đều mở **Zalo Official Account** `siteConfig.zaloUrl`. Đổi OA thì sửa `zaloOaId` và `zaloUrl` trong `src/config.ts`.
- **Khung chat Zalo** mở ngay trong trang bằng SDK chính thức, neo góc trái dưới; nút trợ lý Phê Nâu ở góc phải dưới — đặt hai bên để không đè nhau. Biểu tượng nút trợ lý được thay bằng logo Locaith sau khi script bên ngoài dựng xong nút (dùng `MutationObserver` vì script nạp không đồng bộ).
- Div `.zalo-chat-widget` **phải tạo bằng DOM thuần**, không render qua React: React gắn thuộc tính nội bộ lên node, SDK Zalo đọc node đó rồi `JSON.stringify` và văng lỗi vòng lặp liên tục. SDK chỉ chạy trên domain đã khai báo trong Zalo Official Account Manager — nếu không dựng được widget, một nút dự phòng sẽ hiện ra và mở trang OA.
- Hai trợ lý Phê Nâu khác nhau: `phenauWidgetAgentId` cho nút nổi, `phenauChatAgentId` cho khung trò chuyện thử trong phần Tư vấn.
- Phần **Tư vấn** hỏi tên, công ty, số điện thoại, email trước rồi mới mở khung trò chuyện. Thông tin lưu ở `localStorage` nên lần sau vào không phải điền lại.

> **Còn phụ thuộc phía Phê Nâu:** thông tin khách để lại được gửi sang khung chat theo hai đường — tham số trên địa chỉ khung (`name`, `company`, `phone`, `email`) và `postMessage` kiểu `phechat:context`. Bản `embed.js` hiện tại chỉ lắng nghe `closeChat`, chưa có API nhận ngữ cảnh, nên trợ lý **chưa chắc đọc được**. Cần phía Phê Nâu bổ sung một trong hai đường trên thì phần này mới chạy trọn vẹn.

## Ảnh nền dự án

Nền trang là lưới ảnh các dự án, khu đô thị và khu nghỉ dưỡng bất động sản Việt Nam, đặt chéo 13° và trôi dọc chậm bằng CSS transform (không dùng GIF: nhẹ hơn nhiều lần, không vỡ màu, co giãn theo mọi màn hình và tự dừng khi người dùng bật "giảm chuyển động").

Ảnh lấy từ Wikimedia Commons theo giấy phép cho phép dùng lại — tác giả và giấy phép ghi trong [CREDITS.md](CREDITS.md) và hiện ở cuối trang. Danh sách file trong `tools/fetch-project-photos.mjs` được **chọn tay và đã xem tận mắt từng ảnh**; tìm kiếm tự động trên Commons trả về quá nhiều ảnh lạc đề (biển hiệu, nội thất, thậm chí ảnh chụp ở nước khác) nên đã bỏ.

Tải lại bộ ảnh:

```bash
npm i -D sharp
node tools/fetch-project-photos.mjs
```

**Dùng ảnh dự án của chính doanh nghiệp:** bỏ file vào `public/projects/` theo tên `tile-01.webp` … `tile-NN.webp` (tỷ lệ 4:5, tông sáng), rồi cập nhật `src/credits.ts` cho khớp. Cách này chuẩn nhất vì hiện đúng dự án đang mở bán và không vướng bản quyền.

Chỉnh độ đậm nhạt của nền: `.backdrop-page` và `.backdrop-hero` trong `src/styles.css`.

## Font tiếng Việt

Dùng **Be Vietnam Pro** (chữ thường) và **Lora** (chữ tiêu đề). Cả hai đều dựng đủ các tổ hợp dấu tiếng Việt như `ồ`, `ỗ`, `ự`, `ặ`. Nếu đổi font khác, phải kiểm tra lại đúng những ký tự này — nhiều font Latin phổ biến (kể cả Playfair Display) bị tách rời dấu.

## Điểm cần lưu ý khi sửa

- `index.html`: canonical, `og:url`, `og:image` đang trỏ về `ai-bds.locaith.com`.
- Ảnh chia sẻ mạng xã hội: `public/og-image.png` (1200×630). Dựng lại bằng `npm i -D playwright-core && node tools/make-og-image.mjs`.
- Hệ màu nằm gọn trong khối `:root` của `src/styles.css` — đổi 3 biến `--accent*` là đổi tông cả trang.
- CTA đang dùng `mailto:` — thay bằng form hoặc webhook CRM khi cần.
