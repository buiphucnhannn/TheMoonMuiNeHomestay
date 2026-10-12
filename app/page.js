import Hero from '@/components/sections/Hero';
import Intro from '@/components/sections/Intro';
import Rooms from '@/components/sections/Rooms';
import Pricing from '@/components/sections/Pricing';
import Amenities from '@/components/sections/Amenities';
import Gallery from '@/components/sections/Gallery';
import Locations from '@/components/sections/Locations';
import Testimonials from '@/components/sections/Testimonials';
import EveningBanner from '@/components/sections/EveningBanner';
import Contact from '@/components/sections/Contact';
import ScrollEffects from '@/components/layout/ScrollEffects';

/**
 * Landing page: ráp các section theo thứ tự kể chuyện
 * Hero → Giới thiệu → Phòng (danh sách + chi tiết) → Bảng giá → Tiện nghi → Hình ảnh
 * → Vị trí / bản đồ → Đánh giá → Banner → Liên hệ & gửi yêu cầu đặt phòng
 *
 * ScrollEffects đặt cuối page (không phải layout) để hiệu ứng reveal chỉ chạm vào DOM
 * sau khi toàn bộ nội dung trang đã hydrate — tránh cảnh báo hydration mismatch.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Rooms />
      <Pricing />
      <Amenities />
      <Gallery />
      <Locations />
      <Testimonials />
      <EveningBanner />
      <Contact />
      <ScrollEffects />
    </>
  );
}
