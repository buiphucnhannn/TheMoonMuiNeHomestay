# 🌙 The Moon Homestay — Mũi Né & Phan Thiết · Landing Page

Landing page một trang cho **The Moon Muine Homestay** (2 cơ sở: Mũi Né & Phan Thiết), làm bằng
**Next.js 16 (App Router, Cache Components) + TailwindCSS v4 + JavaScript thuần**.

## Chạy project

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm start        # chạy bản build
npm run assets   # tạo lại ảnh/icon từ assets/source/ (khi thay ảnh gốc)
npm run lint
```

## Các mục theo hồ sơ yêu cầu (docs/demo.docx)

| Yêu cầu | Ở đâu |
| --- | --- |
| Trang chủ | `components/sections/Hero.jsx` |
| Giới thiệu homestay | `Intro.jsx` |
| Danh sách phòng + **Chi tiết phòng** | `Rooms.jsx` (bộ lọc theo cơ sở, ảnh chuyển mượt) + `RoomDetailModal.jsx` (popup chi tiết) |
| Bảng giá | `Pricing.jsx` |
| Tiện nghi | `Amenities.jsx` (4 trải nghiệm + 12 tiện nghi) |
| Hình ảnh | `Gallery.jsx` (lưới ảnh + lightbox, phím ← → Esc) |
| Vị trí / bản đồ | `Locations.jsx` (chọn cơ sở → Google Maps, chỉ đường, điểm lân cận) |
| Liên hệ | `Contact.jsx` + `ContactForm.jsx` |
| Nút gọi / Zalo / Messenger | `components/layout/FloatingActions.jsx` (nổi góc phải) + Navbar + Contact |
| Đặt phòng / gửi yêu cầu | `components/booking/*` — popup đặt phòng mở từ mọi nút "Đặt phòng"; form soạn sẵn tin nhắn Zalo/Messenger, không cần backend |

## Cấu trúc thư mục

```
app/
├── layout.js          ← font, metadata/SEO, JSON-LD, Navbar + Footer + nút nổi + popup đặt phòng
├── page.js            ← ráp các section theo thứ tự
├── globals.css        ← theme màu/fonts, nút, hiệu ứng reveal khi cuộn
├── favicon.ico / icon.png / apple-icon.png / opengraph-image.jpg  ← sinh tự động bởi npm run assets
└── robots.js / sitemap.js

components/
├── layout/   Navbar, Footer, FloatingActions, ScrollEffects (reveal 2 chiều + cuộn mượt)
├── sections/ Hero, Intro, Rooms, RoomDetailModal, Pricing, Amenities, Gallery, Locations,
│             Testimonials, EveningBanner, Contact, ContactForm
├── booking/  BookingProvider (context), BookingButton, BookingModal
└── ui/       Organic (hoạ tiết SVG: sóng, trăng, lá chuối, hoa giấy, phao bơi...), Icon, SectionHeading

data/site.js   ← SỬA 1 FILE NÀY để đổi toàn bộ nội dung: SĐT, địa chỉ, phòng, giá, tiện nghi, ảnh, đánh giá
lib/           ← utils (cn, tel, zalo link), hooks (useToday), smoothScroll
scripts/prepare-assets.mjs ← cắt ảnh, tách nền logo, tạo favicon/OG/mask
assets/source/ ← ẢNH GỐC (không được serve). Thay ảnh ở đây rồi chạy npm run assets
public/images/ ← ảnh đã tối ưu (hero, rooms, gallery, branches, banner, about, brand)
public/brand/icon.svg ← icon thương hiệu (trăng khuyết + tia lấp lánh) → favicon
```

## Phong cách

- Bảng màu lấy từ logo: xanh biển `--color-moon`, vàng trăng `--color-gold`, nền kem `--color-cream`;
  thêm cam đất / hồng hoa giấy / xanh lá từ ảnh thật. Đổi màu ở `@theme` trong `app/globals.css`.
- Font: Playfair Display (tiêu đề), Dancing Script (chữ viết tay), Be Vietnam Pro (nội dung) — đều có tiếng Việt.
- Hiệu ứng: reveal 2 chiều khi cuộn (`data-reveal="..."`), cuộn mượt, ảnh crossfade, hoạ tiết nổi/lắc nhẹ.
  Tôn trọng `prefers-reduced-motion`.

## ⚠ Nội dung mẫu cần khách xác nhận trước khi bàn giao

Hồ sơ yêu cầu chỉ có tên, địa chỉ 2 cơ sở, SĐT và ảnh. Các mục sau trong `data/site.js` đang là **số liệu mẫu** (ghi `[CẦN XÁC NHẬN]`):

1. Tên/loại phòng, sức chứa, diện tích, **giá** (3 giờ / 12 giờ / qua đêm / nguyên căn) và phụ thu.
2. Link **fanpage Facebook** & **Messenger** (`facebookUrl`, `messengerUrl`) — hiện trỏ tới trang tìm kiếm Facebook.
3. **Domain** (`siteConfig.url`) dùng cho SEO / ảnh chia sẻ.
4. Đánh giá khách (`testimonials`) — thay bằng review thật từ Google Maps / fanpage.
5. Khoảng cách tới các điểm lân cận (`branches[].nearby`), giờ hỗ trợ, chính sách hủy/thêm người.

## Deploy

Vercel: import repo → Deploy (không cần cấu hình). Sau khi có domain thật, cập nhật `siteConfig.url`.

## Tài liệu

- `docs/demo.docx` — hồ sơ yêu cầu của khách.
- `docs/PHAN-TICH-CODEBASE.md` — phân tích kiến trúc, luồng dữ liệu, kết quả kiểm tra, danh sách vấn đề & lộ trình cải tiến.
