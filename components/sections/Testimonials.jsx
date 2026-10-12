import SectionHeading from '@/components/ui/SectionHeading';
import Icon from '@/components/ui/Icon';
import { Crescent, DecorRow, Sparkles } from '@/components/ui/Organic';
import { siteConfig, testimonials } from '@/data/site';

const REVEAL = ['fan-l', 'up', 'fan-r'];

export default function Testimonials() {
  return (
    <section id="danh-gia" className="relative w-full pt-12 pb-14 lg:pt-16 lg:pb-28 overflow-hidden">
      <Crescent className="hidden lg:block absolute right-[4%] top-[10%] w-20 opacity-70 animate-float" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeading reveal="rise-blur" align="center" eyebrow="Đánh giá" title="Khách ở xong" script="đều muốn quay lại" desc="Vài dòng khách để lại sau kỳ nghỉ ở The Moon." />

        {/* Mobile: dải thẻ vuốt ngang (snap) thay vì xếp chồng 3 thẻ dài */}
        <div className="mt-5 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pt-5 pb-6 scrollbar-none md:mt-10 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:mx-0 md:px-0 md:pt-0 md:pb-0">
          {testimonials.map((t, i) => (
            <figure
              data-reveal={REVEAL[i % 3]}
              data-reveal-delay={150 + i * 110}
              key={t.name}
              className="relative flex flex-col max-md:w-[85%] max-md:shrink-0 max-md:snap-center rounded-[28px] bg-white p-6 sm:p-7 ring-1 ring-line shadow-[0_16px_34px_-24px_rgba(23,34,44,0.5)] transition-transform duration-300 hover:-translate-y-1.5"
            >
              <span className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-moon text-white flex items-center justify-center shadow-md shadow-moon/40">
                <Icon name="quote" className="w-4.5 h-4.5" />
              </span>
              <div className="flex gap-0.5 text-gold mt-1">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Icon key={k} name="star-solid" className="w-4 h-4" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-justify text-ink/85">“{t.text}”</blockquote>
              <figcaption className="mt-5 border-t border-dashed border-line pt-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-sky text-moon-deep font-serif font-semibold text-[17px] flex items-center justify-center">{t.name.trim().split(' ').pop().charAt(0).toUpperCase()}</span>
                <span>
                  <p className="text-[14px] font-semibold text-ink leading-tight">{t.name}</p>
                  <p className="text-[12px] text-muted">{t.from}</p>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="md:hidden -mt-2 text-center text-[12px] text-muted">Vuốt ngang để đọc thêm →</p>

        <p data-reveal="up" data-reveal-delay="400" className="mt-6 md:mt-8 text-center text-[13px] text-muted">
          Xem thêm đánh giá trên{' '}
          <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-moon-deep hover:underline">
            fanpage
          </a>{' '}
          và Google Maps của The Moon.
        </p>
      </div>

      <Sparkles className="hidden lg:block absolute left-[6%] top-[14%] w-14 opacity-70" />
      <DecorRow variant="b" />
    </section>
  );
}
