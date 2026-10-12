import Image from 'next/image';
import BookingButton from '@/components/booking/BookingButton';
import Icon from '@/components/ui/Icon';
import { Blossom, Crescent, Leaf, OrganicFrame, Sparkles } from '@/components/ui/Organic';
import { heroData } from '@/data/site';

/*
 * Mặt nạ cạnh trái lượn sóng + mép mờ → ảnh tan dần vào nền kem (PNG dựng sẵn bởi scripts/prepare-assets.mjs).
 */
const HERO_MASK = 'url(/masks/hero-feather.png)';
const MASK_STYLE = {
  maskImage: HERO_MASK,
  WebkitMaskImage: HERO_MASK,
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
};

export default function Hero() {
  const [badgeBrand, badgePlace] = heroData.badge.split(' • ');
  return (
    <section id="trang-chu" className="relative w-full overflow-hidden bg-cream lg:h-[100svh] lg:min-h-[660px]">
      {/* Quầng sáng xanh nhạt phía sau chữ */}
      <div aria-hidden className="absolute -left-40 top-16 w-[460px] h-[460px] rounded-full bg-sky-deep/60 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute left-[25%] bottom-12 w-[340px] h-[340px] rounded-full bg-peach/40 blur-3xl pointer-events-none" />

      {/* Ảnh — desktop phủ kín chiều cao màn hình, cạnh trái tan mờ vào nền */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[52%] xl:w-[55%] overflow-hidden" style={MASK_STYLE}>
        <div data-reveal="hero-image" data-reveal-delay="150" className="absolute inset-0">
          <Image
            src="/images/hero/arches-pool.jpg"
            alt="Cửa vòm nhìn ra hồ bơi xanh ngọc tại The Moon Phan Thiết"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width:1024px) 55vw, 1px"
            className="object-cover object-[58%_center]"
          />

          {/* Dòng chữ viết tay hòa tự nhiên với nền ảnh, nổi bật nhờ drop-shadow nghệ thuật */}
          <div className="absolute right-[14%] xl:right-[17%] bottom-[14%] xl:bottom-[16%] text-right -rotate-3 pointer-events-none select-none">
            {heroData.photoNote.split('\n').map((line) => (
              <p
                key={line}
                className="font-script text-[clamp(26px,3.8vh,38px)] leading-[1.15] text-white tracking-wide drop-shadow-[0_2px_8px_rgba(10,22,32,0.95)] drop-shadow-[0_4px_18px_rgba(10,22,32,0.7)]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Hoạ tiết */}
      <Crescent className="hidden lg:block absolute left-[40%] xl:left-[41.5%] top-[13%] w-24 opacity-90 animate-float" />
      <Sparkles className="hidden lg:block absolute left-[2.5%] top-[20%] w-20 opacity-80" />
      <Leaf className="hidden 2xl:block absolute -left-5 bottom-[4%] w-28 opacity-90 animate-sway" />

      {/* Nội dung chữ */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center pt-28 pb-8 lg:pt-[88px] lg:pb-[40px]">
        <div className="w-full lg:w-[48%] xl:w-[45%]">
          <p data-reveal="hero-text" data-reveal-delay="100" className="eyebrow mb-[clamp(14px,2.4vh,24px)]">
            {/* Mobile: ngắt đúng chỗ dấu "•" thành 2 dòng gọn thay vì rớt 1 chữ */}
            <span>
              {badgeBrand}
              {badgePlace && (
                <>
                  <span className="max-sm:hidden"> • </span>
                  <span className="max-sm:block">{badgePlace}</span>
                </>
              )}
            </span>
          </p>

          <h1
            data-reveal="hero-text"
            data-reveal-delay="220"
            className="font-serif text-[40px] sm:text-[56px] lg:text-[clamp(44px,min(7.4vh,4.8vw),72px)] leading-[1.08] text-ink tracking-tight"
          >
            {heroData.titleLine1}
            <span className="block font-script font-medium text-moon-deep text-[clamp(34px,10.6vw,44px)] sm:text-[66px] lg:text-[clamp(50px,min(8.4vh,5.4vw),84px)] leading-[1.05] mt-1 whitespace-nowrap">
              {heroData.scriptLine}
            </span>
          </h1>

          <p
            data-reveal="hero-text"
            data-reveal-delay="380"
            className="mt-[clamp(14px,2.4vh,22px)] text-[16px] sm:text-[17px] lg:text-[clamp(16px,2.3vh,19px)] text-muted leading-relaxed max-w-[560px] text-justify"
          >
            {heroData.desc}
          </p>

          <div data-reveal="hero-text" data-reveal-delay="520" className="mt-[clamp(20px,3.6vh,34px)] flex items-center">
            <BookingButton className="lg:!text-[15.5px] lg:!px-8 lg:!py-[15px]">Đặt phòng ngay</BookingButton>
          </div>

          <p data-reveal="hero-text" data-reveal-delay="660" className="mt-[clamp(16px,2.5vh,24px)] text-[13px] text-muted inline-flex items-center gap-2">
            <Icon name="heart-solid" className="w-3.5 h-3.5 text-blossom" />
            {heroData.socialProof}
          </p>
        </div>
      </div>

      {/* Ảnh — mobile/tablet */}
      <div data-reveal="hero-image" data-reveal-delay="300" className="lg:hidden relative z-10 px-4 sm:px-6 pb-16">
        <OrganicFrame
          edges={{ top: { amp: 0.025, periods: 1.5, inset: 0.03 }, bottom: { amp: 0.025, periods: 1.5, phase: Math.PI, inset: 0.03 } }}
          className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden shadow-md"
        >
          <Image
            src="/images/hero/arches-pool.jpg"
            alt="Cửa vòm nhìn ra hồ bơi tại The Moon Phan Thiết"
            fill
            loading="eager"
            sizes="(min-width:1024px) 1px, (min-width:640px) calc(100vw - 48px), calc(100vw - 32px)"
            className="object-cover"
          />
        </OrganicFrame>
        <Blossom className="absolute right-8 -top-3 w-10" />
        <Crescent className="absolute left-6 -bottom-1 w-16 opacity-80" />
      </div>

    </section>
  );
}
