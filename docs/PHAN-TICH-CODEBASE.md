# Phân tích codebase — The Moon Homestay Landing Page

> Ngày phân tích: 12/10/2026 · Cơ sở: working tree chưa commit, trên nền commit `516b82d` (Create Next App).
> Phạm vi: đọc toàn bộ 41 file nguồn/cấu hình (≈ 4.000 dòng mã, không tính `package-lock.json`), chạy kiểm tra tĩnh bằng script, `eslint`, `next build`, đo kích thước build và đối chiếu ảnh chụp màn hình desktop/mobile.

---

## 1. Tóm tắt nhanh

| Hạng mục | Kết quả |
| --- | --- |
| Build production (`next build`) | ✅ Thành công, 7 route đều prerender tĩnh (○ Static) |
| ESLint (`eslint-config-next/core-web-vitals`) | ✅ 0 lỗi, 0 cảnh báo |
| Console trình duyệt (dev, sau khi sửa hydration) | ✅ Không còn lỗi hydration; chỉ còn 1 cảnh báo LCP dương tính giả |
| Đường dẫn ảnh tham chiếu trong code/data | ✅ 20/20 tồn tại trong `public/` |
| Tên icon, kiểu reveal, token màu, anchor `#id`, id gói/phòng | ✅ Tất cả tham chiếu đều có định nghĩa |
| Hook React trong file không phải client | ✅ Không có |
| Yêu cầu trong hồ sơ `docs/demo.docx` | ✅ 11/11 mục đã có section hoặc tính năng tương ứng |
| Trọng lượng trang (gzip) | HTML 45 KB · JS 206 KB · CSS 15 KB · font tải theo nhu cầu |

**Kết luận:** codebase ổn định, kiến trúc rõ ràng, chạy đúng. Không có lỗi chặn bàn giao. Có **4 vấn đề nên sửa trước khi giao khách** (mục 13, nhóm P1) và một số điểm làm sạch/tối ưu không khẩn cấp.

---

## 2. Stack & cấu hình

| Thành phần | Phiên bản cài | Khai báo trong `package.json` | Ghi chú |
| --- | --- | --- | --- |
| Next.js | 16.4.0 | `16.4.0` | App Router, Turbopack, **Cache Components bật** |
| React / React DOM | 19.3.0 | `19.3.0` | |
| Tailwind CSS | 4.3.3 | `^4` | Theme khai báo bằng `@theme` trong CSS, không có `tailwind.config` |
| @tailwindcss/turbopack | 4.3.3 | `^4` | Loader CSS cho Turbopack (không dùng PostCSS) |
| ESLint | 9.39.5 | `^9` | Flat config, `next lint` đã bị bỏ ở Next 16 nên script là `eslint` |
| sharp | 0.35.5 | **không khai báo** | Chỉ là dependency gián tiếp của `next` → rủi ro cho `npm run assets` (xem 13.1) |
| Node | 24.19.0 | — | |

**`next.config.mjs`**
- `cacheComponents: true` + `partialPrefetching: true`: trang được prerender thành shell tĩnh. Hệ quả thiết kế: không được gọi `new Date()`/`Math.random()` trong lúc render phía server (vì vậy năm trong Footer và `lastModified` trong sitemap là hằng số; ngày hôm nay lấy qua `useSyncExternalStore`).
- `turbopack.rules["*.css"]` → `@tailwindcss/turbopack`: mọi file `.css` đi qua trình biên dịch Tailwind v4.

**`jsconfig.json`**: alias `@/*` → gốc project (không dùng thư mục `src/`, khác với 4ChanHomestay).

**`package.json` scripts**: `dev`, `build`, `start`, `lint`, `assets` (= `node scripts/prepare-assets.mjs`).

---

## 3. Cấu trúc thư mục & vai trò từng file

Ký hiệu: **[C]** = Client Component (`'use client'`), **[S]** = Server Component / module thuần.

### `app/`
| File | Loại | Dòng | Vai trò |
| --- | --- | --- | --- |
| `layout.js` | S | 90 | Nạp 3 font Google (Playfair Display, Dancing Script, Be Vietnam Pro, subset `vietnamese`), `metadata` + `viewport`, JSON-LD 2 cơ sở `LodgingBusiness`, bọc trang trong `BookingProvider`, đặt Navbar / Footer / FloatingActions |
| `page.js` | S | 38 | Ráp 10 section theo thứ tự kể chuyện, kết thúc bằng `ScrollEffects` |
| `globals.css` | — | 460 | `@theme` (21 màu, 3 font, 2 shadow), class dùng chung (`.btn*`, `.chip`, `.eyebrow`, `.card-soft`, `.link-arrow`), 6 keyframes, hệ reveal `[data-reveal]` với 23 kiểu |
| `robots.js`, `sitemap.js` | S | 9 + 9 | Sinh `robots.txt` và `sitemap.xml` từ `siteConfig.url` |
| `favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.jpg` | — | — | File convention của Next → tự chèn thẻ `<link>`/`og:image`; sinh bởi script asset |

### `components/booking/`
| File | Loại | Dòng | Vai trò |
| --- | --- | --- | --- |
| `BookingProvider.jsx` | C | 33 | Context `{ open, close }`; giữ state `{ isOpen, roomId, pkg, branch, seq }`; render `BookingModal` với `key={seq}` để mỗi lần mở là một form mới |
| `BookingButton.jsx` | C | 20 | Nút `.btn btn-{variant}` gọi `open({ roomId, pkg, branch })`; dùng được trong Server Component |
| `BookingModal.jsx` | C | 286 | Form đặt phòng (cơ sở → phòng → gói → ngày/đêm/khách → tên/SĐT/ghi chú), khoá cuộn, Esc, màn hình thành công với link Zalo soạn sẵn; export `buildBookingMessage` |

### `components/layout/`
| File | Loại | Dòng | Vai trò |
| --- | --- | --- | --- |
| `Navbar.jsx` | C | 179 | Header cố định: trong suốt → kem khi cuộn, đánh dấu mục đang xem (tính theo `getBoundingClientRect`), hotline, CTA, menu mobile dạng drawer + backdrop |
| `Footer.jsx` | S | 90 | Nền `night`, divider sóng, wordmark trên nền kem, 4 cột (thương hiệu, khám phá, 2 cơ sở, liên hệ), năm tĩnh 2026 |
| `FloatingActions.jsx` | C | 70 | 4 nút nổi góc phải: lên đầu trang (hiện sau 600 px), Messenger, Zalo, Gọi (có `animate-ping`) |
| `ScrollEffects.jsx` | C | 73 | 2 `IntersectionObserver` (hiện/ẩn 2 chiều), `MutationObserver` cho phần tử render sau, bắt click `a[href^="#"]` → cuộn mượt, xử lý hash khi mở link |

### `components/sections/` (thứ tự trên trang)
| File | Loại | Dòng | Section / id | Dữ liệu dùng |
| --- | --- | --- | --- | --- |
| `Hero.jsx` | S | 136 | Trang chủ `#trang-chu` | `heroData` |
| `Intro.jsx` | S | 104 | Giới thiệu `#gioi-thieu` | `introData` |
| `Rooms.jsx` | C | 264 | Danh sách phòng `#phong` | `rooms`, `branches` |
| `RoomDetailModal.jsx` | C | 156 | Popup chi tiết phòng | `roomPolicies`, `siteConfig` |
| `Pricing.jsx` | S | 112 | Bảng giá `#bang-gia` | `pricingPackages`, `priceGroups`, `priceNotes` |
| `Amenities.jsx` | S | 102 | Tiện nghi `#tien-nghi` | `experiences`, `amenities` |
| `Gallery.jsx` | C | 113 | Hình ảnh `#hinh-anh` + lightbox | `galleryImages` |
| `Locations.jsx` | C | 115 | Vị trí `#vi-tri` + Google Maps | `branches` |
| `Testimonials.jsx` | S | 59 | Đánh giá `#danh-gia` | `testimonials` |
| `EveningBanner.jsx` | S | 39 | Banner tối (không có id) | `bannerData` |
| `Contact.jsx` | S | 84 | Liên hệ `#lien-he` | `contactData`, `branches`, `siteConfig` |
| `ContactForm.jsx` | C | 180 | Form gửi yêu cầu đặt phòng trong trang | `rooms`, `pricingPackages` |

### `components/ui/`
| File | Loại | Dòng | Vai trò |
| --- | --- | --- | --- |
| `Organic.jsx` | C | 353 | 14 export: `waveBandPath`, `WaveDivider`, `organicClipPath`, `OrganicFrame`, `Sparkles`, `Crescent`, `Leaf`, `Blossom`, `BlossomBranch`, `Sun`, `PoolRing`, `Wavelet`, `DecorRow` (3 biến thể a/b/c), `Arrow`. Đường cong sinh từ sin/bezier |
| `Icon.jsx` | S | 169 | 48 icon (43 nét + 5 tô), fallback `sparkles` khi sai tên; `ZaloMark` dạng chữ |
| `SectionHeading.jsx` | S | 27 | Eyebrow + tiêu đề serif + dòng script + mô tả; căn trái/giữa; có `data-reveal` |

### Khác
| File | Dòng | Vai trò |
| --- | --- | --- |
| `data/site.js` | 337 | **Nguồn nội dung duy nhất**: `siteConfig`, `navLinks`, `branches` (+3 hàm URL Google Maps), `heroData`, `introData`, `rooms` (6), `priceGroups`, `pricingPackages` (4), `priceNotes`, `experiences` (4), `amenities` (12), `galleryImages` (12), `testimonials` (3), `bannerData`, `contactData`, `roomPolicies`. 8 chỗ đánh dấu `[CẦN XÁC NHẬN]` |
| `lib/utils.js` | 30 | `cn`, `telHref`, `zaloHref`, `todayISO`, `formatDateVN` |
| `lib/hooks.js` | 16 | `useToday()` qua `useSyncExternalStore` (server trả `''`, client trả ngày thật) |
| `lib/smoothScroll.js` | 81 | Cuộn mượt easeInOutCubic 700–1300 ms, trừ chiều cao header, dừng khi người dùng tự cuộn, xoá `#` khỏi URL |
| `scripts/prepare-assets.mjs` | 157 | Pipeline ảnh (mục 9) |
| `public/brand/icon.svg` | 11 | Icon thương hiệu vector (trăng xanh + 3 tia vàng trên nền kem) → nguồn favicon |
| `assets/source/` | 7 file | Ảnh gốc (6 ảnh + logo), **không được serve** |
| `public/images/` | 27 file, 2,7 MB | Ảnh đã tối ưu (hero, about, rooms, gallery, branches, banner, brand) |
| `README.md`, `public/images/README.md` | | Hướng dẫn chạy, cấu trúc, quy trình thay ảnh, danh sách placeholder |
| `docs/demo.docx` | | Hồ sơ yêu cầu của khách (bảng 25 trường) |

---

## 4. Kiến trúc & luồng dữ liệu

### 4.1 Cây render
```
RootLayout (S)
└─ BookingProvider (C)                ← context đặt phòng + BookingModal (ẩn cho tới khi open())
   ├─ Navbar (C)
   ├─ <main>
   │  └─ HomePage (S)
   │     ├─ Hero (S)          ├─ Pricing (S)       ├─ Locations (C)
   │     ├─ Intro (S)         ├─ Amenities (S)     ├─ Testimonials (S)
   │     ├─ Rooms (C) ──► RoomDetailModal (C, mount khi mở)
   │     ├─ Gallery (C) ──► Lightbox (nội bộ)      ├─ EveningBanner (S)
   │     └─ Contact (S) ──► ContactForm (C)
   │     └─ ScrollEffects (C)  ← cố ý đặt cuối page, không đặt ở layout
   ├─ Footer (S)
   └─ FloatingActions (C)
<script type="application/ld+json">  ← JSON-LD 2 cơ sở
```

### 4.2 Ranh giới client / server
- 12 module client: `BookingProvider`, `BookingButton`, `BookingModal`, `Navbar`, `FloatingActions`, `ScrollEffects`, `Rooms`, `RoomDetailModal`, `Gallery`, `Locations`, `ContactForm`, `Organic`, cùng `lib/hooks.js`, `lib/smoothScroll.js`.
- Section tĩnh (Hero, Intro, Pricing, Amenities, Testimonials, EveningBanner, Contact, Footer) là Server Component và chỉ nhúng các nút client (`BookingButton`) khi cần tương tác → HTML đầy đủ ngay từ server, tốt cho SEO.
- `data/site.js` được 8 module client import → toàn bộ dữ liệu (~19 KB) nằm trong bundle client. Chấp nhận được với quy mô này.
- `Organic.jsx` khai báo `'use client'` dù chỉ dùng `useId` (hook này chạy được ở Server Component). Hệ quả: mọi hoạ tiết SVG đều là client component, được hydrate và chiếm chỗ trong JS bundle (xem 13.9).

### 4.3 Đồ thị import (rút gọn)
- Mọi section → `@/data/site`; phần lớn → `@/components/ui/Icon` và `@/components/ui/Organic`.
- `Hero`, `Pricing`, `Amenities`, `EveningBanner` → `BookingButton`; `Navbar`, `Rooms` → `useBooking()` trực tiếp.
- `ContactForm` → `buildBookingMessage` từ `BookingModal` (tái dùng logic soạn tin).
- `Contact`, `Gallery`, `Locations`, `Testimonials` → `SectionHeading`; các section còn lại tự dựng tiêu đề (không đồng nhất, xem 13.3).
- Không có vòng import; `lib/*` không phụ thuộc component.

### 4.4 Luồng đặt phòng (không backend)
1. Người dùng bấm bất kỳ nút "Đặt phòng" → `open({ roomId?, pkg?, branch? })`.
2. Provider tăng `seq` → `BookingModal` remount với state mặc định suy ra từ `roomId` (cơ sở, phòng, gói `villa` nếu là nguyên căn, số khách).
3. Người dùng chỉnh form; đổi cơ sở sẽ tự chọn phòng đầu tiên của cơ sở và bỏ gói `villa` nếu chuyển sang Mũi Né.
4. Submit → `buildBookingMessage()` tạo chuỗi "Chào The Moon, mình muốn đặt … – gói … – nhận phòng dd/mm/yyyy · n đêm – k khách. Tên… SĐT… Ghi chú…".
5. Màn hình thành công hiển thị tin nhắn + 3 nút: Zalo (`https://zalo.me/0933309981?text=…`), Gọi hotline, Messenger.
6. `ContactForm` trong section Liên hệ làm cùng việc này ngay trên trang (không popup).

### 4.5 Luồng hiệu ứng cuộn
- CSS: `[data-reveal]` mặc định `opacity: 0` + transform theo kiểu; `.is-revealed` đưa về trạng thái bình thường với `transition-delay = --reveal-delay`.
- JS (`ScrollEffects`): `showIO` (rootMargin -8 % đáy) thêm class, `hideIO` gỡ class khi ra khỏi màn hình → hiệu ứng lặp lại cả khi cuộn ngược. `MutationObserver` theo dõi phần tử mới (popup, đổi phòng).
- Lý do đặt ở `page.js`: với Cache Components, segment page hydrate **sau** layout; nếu effect chạy từ layout sẽ sửa DOM trước khi React hydrate page → lỗi "attributes didn't match" (đã gặp và đã sửa).
- `prefers-reduced-motion`: tắt toàn bộ reveal và hoạt ảnh trang trí.

---

## 5. Hệ thống thiết kế

### 5.1 Token màu (`@theme`)
| Token | Hex | Dùng cho |
| --- | --- | --- |
| `cream` / `warm` / `sand` | `#fbf8f3` / `#f6efe5` / `#efe4d3` | Nền trang, nền section xen kẽ, chip |
| `sky` / `sky-deep` | `#e6f5f9` / `#cdebf3` | Nền section Tiện nghi, badge, khung ảnh Intro |
| `moon` / `moon-deep` / `moon-ink` / `moon-soft` | `#14b5d9` / `#0e93b3` / `#0b5f75` / `#a7e0ee` | Màu thương hiệu (từ logo): CTA, chữ script, eyebrow, link |
| `gold` / `gold-deep` | `#c9a063` / `#a8824b` | Trăng, tia lấp lánh, sao đánh giá, gạch eyebrow |
| `coral` / `coral-deep` / `peach` | `#e8865f` / `#d06a43` / `#f6d8c4` | Điểm nhấn ấm từ ảnh (ghế cam, tường be) |
| `blossom` / `leaf` | `#e85ba3` / `#7fa66b` | Hoa giấy, lá chuối (`leaf` chưa dùng dạng utility) |
| `ink` / `muted` / `line` | `#17222c` / `#5f6c76` / `#e7dfd3` | Chữ chính, chữ phụ, viền |
| `night` / `night-soft` | `#0f1c26` / `#16283a` | Footer, banner tối, overlay popup |

Nền section xen kẽ: Hero kem → Intro kem → Rooms trắng → Pricing kem → Amenities `sky/55` → Gallery kem → Locations trắng → Testimonials warm → Banner night → Contact kem → Footer night. Divider sóng của Banner và Footer **mã hoá cứng màu của section kề bên** (`#f6efe5`, `#fbf8f3`), nên đổi thứ tự section phải đổi màu sóng.

### 5.2 Font
Playfair Display (tiêu đề, `lining-nums`), Dancing Script (chữ viết tay, thay Caveat vì Caveat không có subset `vietnamese`), Be Vietnam Pro 300–700 (nội dung). Cả ba tự host qua `next/font` (22 file woff2, 472 KB, trình duyệt chỉ tải subset cần dùng).

### 5.3 Class tiện ích toàn cục
`.btn` + `.btn-primary` (xanh moon), `.btn-outline`, `.btn-dark`, `.btn-coral`, `.btn-ghost-light` (3 class cuối chưa dùng); `.link-arrow`; `.card-soft`; `.chip`; `.eyebrow` (có gạch vàng `::before`, cỡ chữ/tracking nhỏ hơn dưới 640 px); `.scrollbar-none`.

### 5.4 Hoạt ảnh
`animate-float` (nổi), `animate-sway` (lá lắc), `animate-twinkle` (tia nhấp nháy, `transform-box: fill-box`), `animate-drift` (phao trôi), `animate-fade-in` (popup, đổi phòng), `text-shimmer` (chưa dùng). Tất cả tắt khi `prefers-reduced-motion`.

### 5.5 Kiểu reveal
23 kiểu định nghĩa, 22 kiểu được dùng (`zoom` chưa dùng); 44 chỗ gắn `data-reveal` trong mã, nở thành 87 phần tử trong HTML.

---

## 6. Phân tích từng section

| Section | Điểm chính | Trạng thái / tương tác | Lưu ý |
| --- | --- | --- | --- |
| **Hero** | Slogan thật của khách "Chill vài hôm, để thấy lòng nhẹ hơn ♡"; ảnh cửa vòm với mặt nạ PNG tan vào nền ở desktop, khung lượn sóng ở mobile; 4 chip USP; nút cuộn | `BookingButton`, link `#phong` | Ảnh desktop `loading="eager" fetchPriority="high"`, `sizes` 55vw; ảnh mobile tách riêng với `sizes` 1px ở desktop để không tải 2 lần |
| **Intro** | Poster "Chill vài hôm" làm ảnh rèm (`object-[0%_center]` để giữ chữ), 3 viên sỏi Riêng tư/Sạch sẽ/Gần biển, ghi chú viết tay | Tĩnh | Lưới `xl:grid-cols-[1fr_auto]`, script `whitespace-nowrap` để không rớt chữ |
| **Rooms** | Lọc theo cơ sở, danh sách 6 phòng, ảnh chính crossfade (`CrossfadeImage` chồng lớp ảnh, chỉ hiện khi tải xong), 4 thumbnail, thẻ thông tin + 3 mức giá, polaroid | `filter`, `activeId`, `photoIdx`, `detailOpen`; `RoomDetailModal` mount theo `key={room.id}` | Dùng `findLastIndex` (ES2023) — OK với trình duyệt hiện đại |
| **RoomDetailModal** | Ảnh lớn + thumbnail, meta (khách/giường/diện tích/địa chỉ), 8 tiện nghi, 3 giá, 4 chính sách, nút đặt + Zalo | Phím ← → Esc, khoá cuộn có bù thanh cuộn | Không reset `idx` trong effect (đã sửa lint) vì remount theo key |
| **Pricing** | 4 thẻ gói; thẻ "Qua đêm" nổi bật; thẻ "Nguyên căn" render nhánh riêng; dải ghi chú | `BookingButton pkg=…` | Dữ liệu `prices` của gói villa không dùng (13.2) |
| **Amenities** | 4 thẻ trải nghiệm (ảnh dạng sỏi + badge icon) trên dải gradient, 12 tiện nghi dạng ô | Tĩnh | Màu badge xoay vòng 4 màu |
| **Gallery** | Lưới `grid-flow-dense` 2/4 cột, ô `wide` (2 cột) và `tall` (2 hàng từ md), hover hiện caption, lightbox | `index` (-1 = đóng); phím ← → Esc | Lightbox không bù `paddingRight` (13.6) |
| **Locations** | 2 thẻ cơ sở (ảnh, phong cách, địa chỉ, 3 điểm nổi bật), danh sách lân cận theo cơ sở, iframe Google Maps `?q=…&output=embed` (đã kiểm tra trả 200), nút Chỉ đường | `sel` | Iframe không render trong Chrome headless nhưng hoạt động ở trình duyệt thật |
| **Testimonials** | 3 thẻ, sao vàng, chữ cái đầu của tên cuối | Tĩnh | Nội dung mẫu, cần thay bằng review thật |
| **EveningBanner** | Ảnh BBQ tối, gradient tối trái→phải, divider sóng 2 đầu, chữ script vàng | `BookingButton` | Không có `id` (không nằm trong menu) |
| **Contact + ContactForm** | 3 lời hứa, 4 thẻ liên hệ (Hotline, Zalo, Messenger, Fanpage), 2 địa chỉ + giờ, form đặt phòng inline | `form`, `sent`; ngày mặc định qua `useToday` | Dùng chung `buildBookingMessage` |
| **Footer** | Wordmark trên pill kem, slogan script, 3 cột link | Tĩnh | `pb-28` ở mobile để không bị nút nổi che |

---

## 7. Hệ thống đặt phòng — chi tiết trạng thái

**BookingModal**
- State: `branchId`, `roomId`, `pkgId`, `pickedDate`, `nights`, `guests`, `name`, `phone`, `note`, `submitted`; `minDate = useToday()`; `date = pickedDate || minDate`.
- Khởi tạo: `initialRoom = rooms.find(id)`; `pkgId = defaultPkg || (villa ? 'villa' : 'night')`; `guests = min(initialRoom.guests, 2)`.
- Quy tắc: gói `villa` chỉ hiện khi cơ sở Phan Thiết; `isNight` (night/villa) mới hiện ô "Số đêm"; tóm tắt giá ẩn với gói villa.
- Khoá cuộn: đặt `overflow: hidden` cho `html` và `body`, bù `paddingRight` bằng bề rộng thanh cuộn, khôi phục khi đóng.
- Hydration: luôn được mount (ẩn) trong provider, nhưng `useState` chỉ dùng dữ liệu tĩnh, ngày lấy qua `useSyncExternalStore` → an toàn khi prerender.

**buildBookingMessage** — hàm thuần, nhận `{ branch, room, pkg, date, nights, guests, name, phone, note }`, trả chuỗi tiếng Việt; dùng ở cả modal và form liên hệ.

**ContactForm** — một object `form` duy nhất, `set(k)` tạo handler; `changeBranch` reset phòng và gói; sau khi gửi hiện khối thành công và nút "Gửi yêu cầu khác".

---

## 8. SEO & metadata

- `metadataBase = https://themoonhomestay.vn` (**placeholder**), `title` 68 ký tự chứa thương hiệu + slogan, `description` từ `siteConfig`, 8 từ khoá, `canonical: /`, OpenGraph `vi_VN`, Twitter `summary_large_image`.
- Ảnh OG, favicon (16/32/48), `icon.png` 512, `apple-icon.png` 180 theo file convention → Next tự chèn thẻ (đã xác nhận trong HTML build).
- JSON-LD `@graph` 2 `LodgingBusiness` (tên, ảnh, điện thoại `+84975141372`, địa chỉ, giờ check-in/out, `priceRange`).
- `robots.txt` cho phép tất cả, `sitemap.xml` 1 URL với `lastModified` tĩnh `2026-10-12`.
- `lang="vi"`, mỗi section có đúng 1 `h2`, Hero có `h1`.

---

## 9. Pipeline asset (`scripts/prepare-assets.mjs`)

| Bước | Đầu vào | Đầu ra | Ghi chú |
| --- | --- | --- | --- |
| 1. Ảnh đầy đủ | 6 ảnh gốc | 6 file (hero, rooms/twin-1, banner, gallery/pool-courtyard, about/poster, branches/muine) | Resize ≤ 1600 px, JPEG q82 mozjpeg, `.rotate()` theo EXIF |
| 2. Góc cắt | 12 vùng `extract` cố định theo pixel ảnh gốc | 12 file rooms/gallery | Toạ độ gắn với kích thước ảnh gốc; thay ảnh khác kích thước phải chỉnh lại |
| 3. Logo | `logo.jpg` 2048² nền kem `#f8f3f0` | `wordmark.png` (trim + tách nền bằng khoảng cách màu), `wordmark-640.png`, `logo-square.jpg` | Mép chữ mờ dần tự nhiên (`alpha = (d-8)/40`) |
| 4. Icon web | `public/brand/icon.svg` | `app/icon.png`, `app/apple-icon.png`, `android-chrome-*.png`, `app/favicon.ico` (ICO tự đóng gói 16/32/48) | |
| 5. OG | ảnh hero + wordmark | `app/opengraph-image.jpg` 1200×630 | Gradient tối + thẻ kem bo góc |
| 6. Mặt nạ hero | tham số sin | `public/masks/hero-feather.png` 1000² | Cạnh trái lượn sóng + mờ, dựng sẵn PNG để tránh vỡ ô khi cuộn |

Lệnh: `npm run assets`. Thêm ảnh mới: bỏ vào `assets/source/`, thêm dòng vào `PHOTOS`/`CROPS`, chạy lại, trỏ đường dẫn trong `data/site.js`.

---

## 10. Ánh xạ hồ sơ yêu cầu (`docs/demo.docx`) → hiện thực

| Yêu cầu trong hồ sơ | Hiện thực | Trạng thái |
| --- | --- | --- |
| Trang chủ | `Hero` | ✅ |
| Giới thiệu homestay | `Intro` | ✅ |
| Danh sách phòng | `Rooms` (lọc 2 cơ sở, 6 phòng) | ✅ (tên/giá mẫu) |
| Chi tiết phòng | `RoomDetailModal` | ✅ |
| Hình ảnh | `Gallery` + lightbox | ✅ |
| Bảng giá | `Pricing` | ✅ (giá mẫu) |
| Tiện nghi | `Amenities` | ✅ |
| Vị trí / bản đồ | `Locations` + Google Maps embed + chỉ đường | ✅ |
| Liên hệ | `Contact` | ✅ |
| Nút gọi / Zalo / Messenger | `FloatingActions` + Navbar + Contact + Footer | ✅ (Messenger chờ link fanpage) |
| Đặt phòng hoặc gửi yêu cầu | `BookingModal` + `ContactForm` → Zalo/Messenger | ✅ |
| Phong cách "hiện đại tươi sáng" | Nền kem sáng, xanh biển từ logo, hoạ tiết nhẹ | ✅ |
| Logo & ảnh từ Drive | Đã dùng toàn bộ 6 ảnh + logo | ✅ |

---

## 11. Kết quả kiểm tra tự động

| Kiểm tra | Kết quả |
| --- | --- |
| `eslint .` | 0 vấn đề |
| `next build` | 7 route tĩnh, compile 0,5 s, prerender 0,6 s |
| Icon: 48 định nghĩa, 40 dùng (23 tĩnh + 19 từ data + `menu` động) | Không thiếu; 8 chưa dùng: `calendar`, `external`, `chat`, `mail`, `heart`, `star`, `gift`, `food` |
| Reveal: 23 kiểu | Không thiếu; `zoom` chưa dùng |
| Token màu | Mọi utility `bg-/text-/ring-…` dùng token có định nghĩa; `leaf` chưa dùng dạng utility |
| Anchor `#id` (8 mục menu + nút) | 8/8 trỏ tới section tồn tại |
| `pkg` / `roomId` truyền vào `open()` | Đều có trong `pricingPackages` / `rooms` |
| Ảnh tham chiếu | 20/20 tồn tại |
| Hook trong file không `'use client'` | 0 |
| Console (dev, Chrome headless qua CDP) | Không lỗi hydration; 1 cảnh báo LCP dương tính giả (Next lưu thuộc tính ảnh theo `src`, ảnh hero được dùng lại ở Gallery với `loading="lazy"`) |

**Kích thước build**
| Thành phần | Thô | Gzip |
| --- | --- | --- |
| `index.html` (prerender) | 346 KB (≈ 102 KB là payload RSC inline, 186 SVG inline, 30 `<img>`) | 45,5 KB |
| JS client trang chủ (8 chunk) | ≈ 667 KB | ≈ 206 KB |
| CSS | 84 KB | 14,7 KB |
| Font | 22 woff2 = 472 KB (tải theo `unicode-range`) | — |
| `public/images` | 27 file = 2,7 MB (qua `next/image` tối ưu theo `sizes`) | — |

Đánh giá: trọng lượng JS chủ yếu là runtime React 19 + Next App Router (2 chunk lớn 72 KB + 48 KB gzip). Phần mã riêng của trang nhỏ. HTML 45 KB gzip là tốt cho một landing nhiều hoạ tiết.

---

## 12. Nội dung mẫu cần khách xác nhận (8 chỗ `[CẦN XÁC NHẬN]` trong `data/site.js`)

1. `siteConfig.url` — domain thật (ảnh hưởng canonical, OG, sitemap, JSON-LD).
2. `siteConfig.facebookUrl` / `messengerUrl` — hiện trỏ tới trang tìm kiếm Facebook; Messenger cần dạng `https://m.me/<fanpage>`.
3. `branches[].nearby` — khoảng cách/thời gian ước lượng.
4. `rooms` — tên, loại, sức chứa, giường, diện tích, giá 3 mức, tiện nghi trong phòng (6 phòng).
5. `pricingPackages` + `priceNotes` — giá gói và phụ thu.
6. `testimonials` — 3 đánh giá mẫu.
7. `roomPolicies` — chính sách hủy/thêm người/thú cưng.
8. `siteConfig.supportHours`, `checkin`, `checkout`.

Dữ kiện thật đã có: tên 2 cơ sở, 2 địa chỉ, hotline `0975 141 372`, Zalo `0933 309 981`, slogan trên poster, Mũi Né cách biển Hàm Tiến ~300 m, Phan Thiết là villa 4 phòng ngủ có hồ bơi/BBQ cách biển Đồi Dương ~800 m (từ listing công khai).

---

## 13. Vấn đề phát hiện & cách sửa gợi ý

**P1 — nên sửa trước khi bàn giao**

| # | Vị trí | Vấn đề | Cách sửa |
| --- | --- | --- | --- |
| 13.1 | `package.json` | `sharp` không được khai báo, chỉ có nhờ `next` kéo theo → `npm run assets` có thể gãy khi Next đổi cách đóng gói | Thêm `"sharp": "^0.35.5"` vào `devDependencies` |
| 13.2 | `data/site.js:244`, `Pricing.jsx:61-78` | Gói "Nguyên căn" có `prices: { double: 'từ 3.500k', twin: '/ đêm', family: 'Liên hệ' }` không được dùng; giá "từ 3.500k" và 3 dòng tiện ích viết cứng trong component | Đổi thành `priceFrom`, `perks: [...]` trong data và render từ đó |
| 13.3 | README + 7 section | README hứa "sửa 1 file đổi toàn trang" nhưng tiêu đề/mô tả của Rooms, Pricing, Amenities, Gallery, Locations, Testimonials, Contact, Footer viết cứng; `contactData.title` (`data/site.js:325`) có trong data nhưng `Contact.jsx:24` không dùng | Thêm `sectionHeadings` vào data hoặc sửa README cho đúng phạm vi |
| 13.4 | `BookingModal.jsx`, `ContactForm.jsx` | Chọn gói "Nguyên căn" không tự chuyển phòng sang `villa` → tin nhắn có thể thành "đặt Moon Pool View – gói Nguyên căn" | Khi `pkg === 'villa'` đặt `roomId = 'villa'` (và ngược lại khi chọn phòng villa thì gói mặc định `villa`) |

**P2 — chất lượng, a11y, hiệu năng**

| # | Vị trí | Vấn đề | Cách sửa |
| --- | --- | --- | --- |
| 13.5 | 3 popup | Không trap focus, không focus phần tử đầu khi mở; Tab vẫn đi ra sau popup. `aria-labelledby="booking-title"` trỏ tới phần tử không tồn tại ở màn hình thành công | Focus ô đầu tiên khi mở, trả focus về nút mở khi đóng; dùng `inert` cho phần còn lại hoặc thư viện nhỏ; đổi `aria-label` ở màn hình thành công |
| 13.6 | `Gallery.jsx` Lightbox | Khoá cuộn thiếu bù `paddingRight` → trang nhích ngang khi thanh cuộn biến mất | Tách helper `lockScroll()` dùng chung cho 3 popup |
| 13.7 | `globals.css` | Không có fallback khi tắt JS: `[data-reveal]` mặc định `opacity: 0` | Thêm `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>` trong layout |
| 13.8 | `Locations.jsx` thẻ cơ sở | `<button>` chứa `<h3>`, `<ul>` (nội dung khối trong button, không hợp chuẩn HTML dù trình duyệt vẫn hiển thị) | Dùng `<div role="button" tabIndex={0}>` + xử lý Enter/Space, hoặc đưa nội dung khối ra ngoài button |
| 13.9 | `Organic.jsx` | `'use client'` không cần thiết (`useId` chạy được ở server) → toàn bộ hoạ tiết SVG bị hydrate và nằm trong JS bundle | Bỏ `'use client'`; các component client vẫn import được. Đổi lại payload RSC sẽ lớn hơn một chút, cần đo lại |
| 13.10 | `Rooms.jsx` bộ lọc | Nút lọc không có `aria-pressed` | Thêm `aria-pressed={filter === f.id}` |
| 13.11 | `EveningBanner.jsx`, `Footer.jsx` | Màu divider sóng mã hoá cứng theo section kề bên | Truyền màu từ hằng số dùng chung hoặc lấy từ token CSS |
| 13.12 | `BookingModal`/`ContactForm` | Ô SĐT chỉ `type="tel" required`, không kiểm tra định dạng | Thêm `pattern="0[0-9]{9,10}"` + thông báo |

**P3 — làm sạch**

| # | Vị trí | Vấn đề |
| --- | --- | --- |
| 13.13 | `data/site.js` | Trường không dùng: `siteConfig.brand`, `siteConfig.fullName`, `roomById`, `branches[].thumb`, `galleryImages[].w/h`, `contactData.title` |
| 13.14 | `globals.css` | Class không dùng: `.btn-dark`, `.btn-coral`, `.btn-ghost-light`, `.text-shimmer`, `--shadow-soft`, kiểu reveal `zoom` |
| 13.15 | `Icon.jsx` | 8 icon chưa dùng (xem mục 11) |
| 13.16 | `ScrollEffects.jsx:7`, `globals.css:201` | Chú thích lệch: ghi "gắn trong layout" (đã chuyển sang page); chú thích ở `img {}` mô tả sai mục đích |
| 13.17 | Toàn bộ JSX | Dùng tiền tố `!` (`!py-2.5`) cho important; Tailwind v4 khuyến nghị hậu tố (`py-2.5!`). CSS build vẫn đúng, chỉ là chuẩn hoá |
| 13.18 | `README.md` | Ghi `npm run dev` ở cổng 3000; trên máy hiện tại cổng này đang được project khác dùng (không phải lỗi của code) |

---

## 14. Hướng dẫn bảo trì nhanh

| Việc | Làm ở đâu |
| --- | --- |
| Đổi SĐT, Zalo, giờ, domain, link fanpage | `siteConfig` trong `data/site.js` |
| Đổi menu | `navLinks` (href phải trùng `id` section) |
| Thêm/sửa phòng | Thêm object vào `rooms` (`branch` = `muine`/`phanthiet`, `group` = `double`/`twin`/`family`/`villa`, 4 ảnh) |
| Đổi giá gói | `pricingPackages`, `priceNotes` |
| Thêm ảnh thật | `assets/source/` → `scripts/prepare-assets.mjs` (`PHOTOS`/`CROPS`) → `npm run assets` → trỏ trong data |
| Đổi màu/font | `@theme` trong `app/globals.css`; font trong `app/layout.js` |
| Thêm section | Tạo file trong `components/sections/`, import vào `app/page.js` trước `ScrollEffects`, thêm `id` + `navLinks` + `SECTION_GAP` trong `lib/smoothScroll.js` |
| Thêm hiệu ứng reveal mới | Khai báo `[data-reveal="ten"]` trong `globals.css`, gắn `data-reveal="ten"` + `data-reveal-delay` |
| Kiểm tra trước khi giao | `npm run lint && npm run build`; mở `npx next dev -p 3200` xem thử |
| Deploy | Vercel import repo; sau khi có domain cập nhật `siteConfig.url` và chạy build lại |

---

## 15. Lộ trình cải tiến đề xuất

1. **Trước bàn giao (1–2 giờ):** 13.1 → 13.4, cập nhật nội dung thật từ khách vào `data/site.js`, thay review mẫu, đổi domain.
2. **Sau bàn giao v1:** 13.5 → 13.8 (a11y popup, scroll lock chung, noscript, semantic), thêm `pattern` SĐT.
3. **Tối ưu (tuỳ chọn):** 13.9 (bỏ `'use client'` ở Organic rồi đo lại HTML/JS), thêm `app/opengraph-image` động theo cơ sở, trang 404 theo thương hiệu, gửi form vào Google Sheets/Zalo OA nếu khách muốn lưu yêu cầu thay vì chỉ mở Zalo.
4. **Dọn dẹp:** 13.13 → 13.17.
