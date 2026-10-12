import Image from 'next/image';
import BookingButton from '@/components/booking/BookingButton';
import { Crescent, Sparkles, WaveDivider } from '@/components/ui/Organic';
import { bannerData } from '@/data/site';

export default function EveningBanner() {
  return (
    <section className="relative w-full bg-night overflow-hidden">
      <div className="absolute inset-0">
        <Image src={bannerData.image} alt="Tiệc BBQ cạnh hồ bơi buổi tối tại The Moon Phan Thiết" fill sizes="100vw" className="object-cover object-[60%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1620]/92 via-[#0a1620]/55 to-[#0a1620]/30" />
      </div>
      <div className="absolute -left-16 bottom-8 w-64 h-64 rounded-full bg-moon/25 blur-3xl pointer-events-none" />

      <WaveDivider className="-top-[2px] z-10" flip height={80} periods={1} layers={[{ color: '#f6efe5', base: 46, amp: 18, phase: -Math.PI / 2 }]} />
      <WaveDivider className="-bottom-[2px] z-10" height={80} periods={1} layers={[{ color: '#fbf8f3', base: 46, amp: 18, phase: -Math.PI / 2 }]} />

      <Crescent className="absolute right-[6%] top-[14%] w-24 opacity-80 hidden md:block animate-float" color="#F2D08A" />
      <Sparkles className="absolute left-[46%] top-[16%] w-20 opacity-70 hidden lg:block" color="#F2D08A" />

      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 min-h-[420px] lg:min-h-[480px] py-28 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div data-reveal="banner-left" className="text-[#F6F1E8] max-w-2xl">
          <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.15] drop-shadow-sm sm:whitespace-pre-line text-balance">{bannerData.title}</h2>
          <div className="mt-4 space-y-1.5 text-[15px] sm:text-[16px] text-[#E4EEF3]/95 font-light leading-relaxed">
            {bannerData.bullets.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </div>

        <div data-reveal="banner-right" data-reveal-delay="200" className="flex flex-col items-start sm:items-end gap-5">
          <p className="font-script text-[40px] sm:text-[50px] leading-[1.05] text-[#F8D9A6] -rotate-6 sm:text-right drop-shadow-md whitespace-pre-line">{bannerData.script}</p>
          <BookingButton className="shadow-lg hover:shadow-xl lg:!text-[15.5px] lg:!px-8 lg:!py-[15px]">{bannerData.ctaText}</BookingButton>
        </div>
      </div>
    </section>
  );
}
