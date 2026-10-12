# public/images — ảnh đã tối ưu, sinh tự động

**Đừng sửa tay ở đây.** Ảnh gốc nằm trong `assets/source/`; chạy `npm run assets` để tạo lại toàn bộ.

```
assets/source/            ← ảnh gốc (tải từ Drive của khách)
  logo.jpg                ← logo vuông nền kem
  arches-pool.jpg         ← cửa vòm nhìn ra hồ bơi (Phan Thiết) — dùng làm hero
  pool-courtyard.jpg      ← sân hồ bơi, dãy cửa vòm (Phan Thiết)
  bbq-night.jpg           ← tiệc BBQ buổi tối (Phan Thiết) — banner tối
  twin-room.jpg           ← phòng 2 giường, decor mây tre
  muine-exterior.jpg      ← mặt tiền trắng, hoa giấy (Mũi Né)
  poster-chill.jpg        ← poster "Chill vài hôm, để thấy lòng nhẹ hơn"

public/images/
  brand/     wordmark.png (logo tách nền), wordmark-640.png (navbar/footer), logo-square.jpg
  hero/      arches-pool.jpg
  about/     poster-chill.jpg
  rooms/     twin-1..3.jpg, pool-view-2..3.jpg, arched-doors.jpg   (góc cắt từ ảnh gốc)
  gallery/   pool-courtyard, bbq-table, neon-pool, pool-chair, pool-detail, rattan-decor, floaties, bougainvillea
  branches/  muine.jpg
  banner/    bbq-night.jpg
```

Muốn thêm ảnh phòng thật: bỏ file vào `assets/source/`, thêm dòng vào `PHOTOS` / `CROPS`
trong `scripts/prepare-assets.mjs`, chạy `npm run assets`, rồi trỏ đường dẫn trong `data/site.js`.

Quy tắc: `.jpg` cho ảnh chụp, tên viết thường không dấu, script tự nén về ≤1600px / chất lượng 82.
