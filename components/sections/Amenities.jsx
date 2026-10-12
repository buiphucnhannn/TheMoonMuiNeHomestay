import Image from 'next/image';
import BookingButton from '@/components/booking/BookingButton';
import Icon from '@/components/ui/Icon';
import { DecorRow, Leaf, Sparkles, Sun } from '@/components/ui/Organic';
import { amenities, experiences } from '@/data/site';

const BADGE_COLORS = ['#0E93B3', '#D06A43', '#D9488F', '#B88A3E'];

export default function Amenities() {
  return (
    <section id="tien-nghi" className="relative w-full pt-12 pb-14 lg:pt-16 lg:pb-28 overflow-hidden">
      <Leaf className="hidden lg:block absolute -left-4 top-2 w-20 opacity-80 animate-sway" />
      <Sun className="hidden xl:block absolute right-[4%] top-[6%] w-12 opacity-80 animate-float" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Trải nghiệm */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-10 lg:gap-12 items-center">
          <div data-reveal="left" className="relative">
            <p className="eyebrow mb-3">Tiện nghi</p>
            <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-ink tracking-tight">
              Ở The Moon,
              <br />
              <span className="font-script font-medium text-moon-deep text-[46px] sm:text-[54px] leading-[1.05]">bạn chỉ việc chill</span>
            </h2>
            <p className="mt-4 mb-7 text-[15px] text-muted max-w-[270px] leading-relaxed text-justify">Những điều nhỏ được chăm chút để kỳ nghỉ của bạn thật nhẹ đầu.</p>
            <BookingButton>Đặt phòng ngay</BookingButton>
            <p className="hidden lg:block absolute right-0 -top-9 font-script text-[22px] leading-none text-muted rotate-[-10deg]">
              Good vibes
              <br />
              only ☾
            </p>
          </div>

          <div className="relative">
            <div
              data-reveal="band"
              data-reveal-delay="100"
              aria-hidden
              className="absolute -inset-x-4 -inset-y-5 lg:-inset-x-6 bg-gradient-to-r from-[#D9EEF5] via-[#F6E9DC] to-[#E5F0DC] opacity-85"
              style={{ borderRadius: '56px 72px 56px 72px / 64px 48px 64px 48px' }}
            />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5 py-2">
              {experiences.map((item, i) => (
                <div
                  data-reveal="bounce-up"
                  data-reveal-delay={250 + i * 130}
                  key={item.title}
                  className="group rounded-[32px] bg-white/70 backdrop-blur-sm p-2.5 pb-5 ring-1 ring-white/80 shadow-[0_18px_36px_-24px_rgba(23,34,44,0.6)] transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative">
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: i % 2 ? '42% 58% 46% 54% / 52% 48% 52% 48%' : '58% 42% 54% 46% / 48% 52% 48% 52%' }}>
                      <Image src={item.photo} alt={item.title} fill sizes="(min-width:768px) 22vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <span
                      className="absolute -bottom-6 left-3 w-14 h-14 rounded-full bg-white ring-4 ring-[#F2F8FA] shadow-[0_8px_18px_-8px_rgba(23,34,44,0.5)] flex items-center justify-center"
                      style={{ color: BADGE_COLORS[i % BADGE_COLORS.length] }}
                    >
                      <Icon name={item.icon} className="w-7 h-7" strokeWidth={1.6} />
                    </span>
                  </div>
                  <div className="px-2 pt-9">
                    <h3 className="text-[15px] font-semibold text-ink leading-snug">{item.title}</h3>
                    <p className="text-[12.5px] text-muted mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danh sách tiện nghi */}
        <div className="mt-16 lg:mt-20">
          <div data-reveal="up" className="flex items-end justify-between gap-4 mb-6">
            <h3 className="font-serif text-[26px] sm:text-[30px] text-ink text-balance">Đầy đủ như ở nhà, chill hơn ở nhà</h3>
            <Sparkles className="hidden sm:block w-16 opacity-80" />
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
            {amenities.map((a, i) => (
              <li
                data-reveal="chip"
                data-reveal-delay={(i % 4) * 90}
                key={a.title}
                className="group flex max-sm:flex-col items-start gap-2.5 sm:gap-3.5 rounded-[20px] sm:rounded-[22px] bg-white/80 p-3.5 sm:p-4 ring-1 ring-white shadow-[0_12px_28px_-22px_rgba(23,34,44,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <span className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-sky text-moon-deep flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-moon group-hover:text-white">
                  <Icon name={a.icon} className="w-5.5 h-5.5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-semibold text-[14.5px] text-ink leading-snug">{a.title}</p>
                  <p className="text-[11.5px] sm:text-[12.5px] text-muted mt-0.5 leading-snug">{a.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DecorRow variant="d" />
    </section>
  );
}
