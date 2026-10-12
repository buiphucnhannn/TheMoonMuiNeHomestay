import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { Arrow, Blossom, BlossomBranch, Crescent, DecorRow, Leaf, OrganicFrame, Sparkles } from '@/components/ui/Organic';
import { introData } from '@/data/site';

// Mỗi thẻ "viên sỏi": nền + màu icon
const CARD_STYLES = [
  { bg: 'linear-gradient(160deg,#EAF6FA 0%,#D3EAF2 100%)', icon: '#0E93B3' },
  { bg: 'linear-gradient(160deg,#FBF1E6 0%,#F2DFCB 100%)', icon: '#B88A3E' },
  { bg: 'linear-gradient(160deg,#FCE8F1 0%,#F7D2E3 100%)', icon: '#D9488F' },
];

const FADE_MASK = 'lg:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_86%,transparent_100%)]';

export default function Intro() {
  return (
    <section id="gioi-thieu" className="relative w-full pt-10 pb-2 lg:pt-16 lg:pb-28 overflow-hidden">
      <div className="relative lg:grid lg:grid-cols-[minmax(0,min(34vw,560px))_1fr] items-center gap-4">
        {/* Ảnh: tràn mép trái, có lớp xanh nhạt làm khung phía sau */}
        <div data-reveal="curtain" className="relative px-4 sm:px-6 lg:px-0">
          <OrganicFrame
            edges={{ right: { amp: 0.03, periods: 1, phase: Math.PI / 2, inset: 0.035 } }}
            className={`hidden lg:block absolute inset-y-0 left-0 right-[-22px] bg-sky-deep ${FADE_MASK}`}
          >
            <span />
          </OrganicFrame>
          <OrganicFrame
            edges={{ right: { amp: 0.03, periods: 1, phase: Math.PI / 2, inset: 0.06 } }}
            className={`relative h-[320px] sm:h-[400px] lg:h-[520px] w-full rounded-[28px] lg:rounded-none overflow-hidden ${FADE_MASK}`}
          >
            <Image
              src="/images/about/poster-chill.jpg"
              alt="Chill vài hôm, để thấy lòng nhẹ hơn — góc hồ bơi The Moon Phan Thiết"
              fill
              sizes="(min-width:1024px) 34vw, 100vw"
              className="object-cover object-[0%_center]"
            />
          </OrganicFrame>
          <BlossomBranch className="hidden lg:block absolute right-[-64px] bottom-[-6px] w-36" flip />
        </div>

        {/* Nội dung */}
        <div className="relative px-4 sm:px-6 lg:px-12 mt-12 lg:mt-0">
          <div className="mx-auto w-full max-w-[1000px] grid xl:grid-cols-[minmax(0,1fr)_auto] gap-12 xl:gap-12 items-center">
            <div>
              <p data-reveal="left" className="eyebrow mb-4">
                {introData.eyebrow}
              </p>
              <h2 data-reveal="left" data-reveal-delay="120" className="font-serif text-[36px] sm:text-[44px] xl:text-[40px] 2xl:text-[44px] leading-[1.1] text-ink mb-5 tracking-tight">
                {introData.titleSerif}
                <br />
                <span className="font-script font-medium text-moon-deep text-[clamp(34px,10.6vw,44px)] sm:text-[54px] xl:text-[44px] 2xl:text-[52px] leading-[1.05] sm:whitespace-nowrap">{introData.titleScript}</span>
              </h2>
              <div data-reveal="left" data-reveal-delay="240" className="space-y-3 text-[15.5px] text-muted leading-relaxed mb-7 text-pretty text-justify">
                {introData.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div data-reveal="left" data-reveal-delay="360" className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <a href="#phong" className="link-arrow">
                  {introData.ctaText} <Arrow className="w-3.5 h-3.5" />
                </a>
                <a href="#vi-tri" className="link-arrow !text-gold-deep">
                  Xem 2 cơ sở <Arrow className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center xl:items-end">
              <div data-reveal="note" data-reveal-delay="300" className="relative hidden md:block mb-7 self-center">
                <p className="font-script text-[26px] leading-[1.2] text-ink/70 -rotate-[4deg] text-center whitespace-pre-line">{introData.note}</p>
                <Sparkles className="absolute -right-16 -top-7 w-14" />
              </div>

              <div className="relative grid grid-cols-3 gap-3 sm:gap-4 2xl:gap-5 pb-8 lg:pb-12">
                {introData.features.map((f, i) => (
                  <div
                    data-reveal="pebble"
                    data-reveal-delay={350 + i * 130}
                    key={f.title}
                    className="group relative flex flex-col items-center justify-center text-center w-full sm:w-[140px] xl:w-[130px] 2xl:w-[150px] aspect-[3/4] sm:aspect-[5/6] px-2 sm:px-3 ring-1 ring-white/80 shadow-[0_18px_36px_-22px_rgba(23,34,44,0.45)] transition-transform duration-300 hover:-translate-y-2"
                    style={{ background: CARD_STYLES[i].bg, borderRadius: '46% 46% 42% 42% / 40% 40% 44% 44%' }}
                  >
                    <span className="mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110" style={{ color: CARD_STYLES[i].icon }}>
                      <Icon name={f.icon} className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-semibold text-[13px] sm:text-[15px] text-ink whitespace-nowrap">{f.title}</h3>
                    <p className="text-[10.5px] sm:text-[11.5px] text-muted leading-snug mt-1 max-w-[110px]">{f.desc}</p>
                  </div>
                ))}
                <Leaf className="absolute -bottom-3 left-[34%] w-11 animate-sway" />
                <Blossom className="absolute bottom-3 left-[60%] w-5 opacity-85" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Crescent className="hidden lg:block absolute right-[3%] top-[8%] w-20 opacity-60" />
      <DecorRow variant="a" />
    </section>
  );
}
