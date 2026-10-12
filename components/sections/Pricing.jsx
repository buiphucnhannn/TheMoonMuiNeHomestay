import BookingButton from '@/components/booking/BookingButton';
import Icon from '@/components/ui/Icon';
import { Blossom, DecorRow, Leaf, PoolRing, Sparkles } from '@/components/ui/Organic';
import { priceGroups, priceNotes, pricingPackages, siteConfig } from '@/data/site';
import { cn } from '@/lib/utils';

const ICON_BG = {
  short: 'bg-peach/70 text-coral-deep',
  day: 'bg-[#FFF1C9] text-[#C98A12]',
  night: 'bg-sky-deep text-moon-ink',
  villa: 'bg-[#E6F1DD] text-[#4F7840]',
};

export default function Pricing() {
  return (
    <section id="bang-gia" className="relative w-full pt-12 pb-14 lg:pt-16 lg:pb-28 overflow-hidden">
      <Leaf className="hidden 2xl:block absolute -right-4 top-10 w-20 opacity-80 animate-sway" flip />
      <PoolRing className="hidden lg:block absolute left-[3%] top-[5%] w-12 animate-drift" color="#7ED8E6" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-center">
          <div data-reveal="left" className="relative">
            <p className="eyebrow mb-3">Bảng giá</p>
            <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.1] text-ink tracking-tight">
              Ở bao lâu
              <br />
              <span className="font-script font-medium text-moon-deep text-[46px] sm:text-[54px] leading-[1.05]">tuỳ bạn chọn</span>
            </h2>
            <p className="mt-4 text-[15px] text-muted max-w-[280px] leading-relaxed text-justify">Nghỉ ngắn vài giờ, ở trọn ngày hay qua đêm — giá rõ ràng, không phí ẩn.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookingButton pkg="night">Đặt phòng</BookingButton>
              <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Hỏi giá nhóm
              </a>
            </div>
            <Sparkles className="hidden lg:block absolute -right-2 -top-10 w-16 opacity-80" />
          </div>

          {/* Subgrid: icon / tiêu đề / bảng giá / nút của các thẻ luôn nằm cùng hàng với nhau.
              Mobile: dải thẻ vuốt ngang (snap), ló một phần thẻ kế bên để gợi ý vuốt */}
          <div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pt-4 pb-6 scrollbar-none sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:gap-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:pt-0 sm:pb-0">
            {pricingPackages.map((pkg, i) => (
              <div
                data-reveal="flip"
                data-reveal-delay={120 + i * 100}
                key={pkg.id}
                className={cn(
                  'group relative card-soft rounded-[28px] px-5 pt-6 pb-5 grid grid-rows-subgrid row-span-4 gap-0 transition-all duration-300 hover:-translate-y-1.5',
                  'max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-center max-sm:grid-rows-[auto_auto_1fr_auto]',
                  pkg.featured && 'ring-2 ring-moon/50 bg-white'
                )}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-moon px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-md shadow-moon/40">
                    Phổ biến nhất
                  </span>
                )}
                <span className={cn('justify-self-center w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110', ICON_BG[pkg.id])}>
                  <Icon name={pkg.icon} className="w-6 h-6" strokeWidth={1.6} />
                </span>
                <div className="text-center mb-4">
                  <h3 className="text-[17px] font-semibold text-ink leading-tight text-balance">{pkg.name}</h3>
                  <p className="text-[12px] text-muted mt-1">{pkg.timeframe}</p>
                </div>

                {pkg.villa ? (
                  <div className="pt-3.5 border-t border-dashed border-line">
                    <p className="font-serif text-[26px] font-semibold text-moon-deep leading-tight">
                      từ 3.500k <span className="font-sans text-[12px] font-normal text-muted">/ đêm</span>
                    </p>
                    <ul className="mt-2 space-y-1 text-[12px] text-muted">
                      <li className="flex items-center gap-1.5">
                        <Icon name="check" className="w-3.5 h-3.5 text-moon" strokeWidth={2.2} /> Hồ bơi + sân BBQ riêng
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Icon name="check" className="w-3.5 h-3.5 text-moon" strokeWidth={2.2} /> 4 phòng ngủ · 4 WC
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Icon name="check" className="w-3.5 h-3.5 text-moon" strokeWidth={2.2} /> Bếp đầy đủ, bàn tiệc 12 người
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="w-full pt-3.5 border-t border-dashed border-line flex flex-col justify-center gap-1.5">
                    {priceGroups.map((g) => (
                      <div key={g.id} className="flex items-baseline justify-between gap-2">
                        <span className="text-[12px] text-muted">{g.label}</span>
                        <span className="font-serif text-[20px] font-semibold text-moon-deep">{pkg.prices[g.id]}</span>
                      </div>
                    ))}
                  </div>
                )}

                <BookingButton pkg={pkg.id} roomId={pkg.villa ? 'villa' : undefined} variant={pkg.featured ? 'primary' : 'outline'} arrow={false} className="mt-4 w-full !py-2.5 !text-[13px]">
                  {pkg.villa ? 'Nhận báo giá' : 'Chọn gói này'}
                </BookingButton>
              </div>
            ))}
          </div>
          <p className="sm:hidden -mt-2 text-center text-[12px] text-muted">Vuốt ngang để xem các gói khác →</p>
          </div>
        </div>

        <div data-reveal="grow-x" data-reveal-delay="500" className="mt-7 lg:ml-[348px] xl:ml-[388px] rounded-[22px] sm:rounded-full bg-warm border border-line px-6 py-3 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[12.5px] text-muted text-balance">
          {priceNotes.map((n, i) => (
            <span key={n} className="inline-flex items-center gap-5">
              {i > 0 && <span className="hidden sm:block w-1 h-1 rounded-full bg-gold" />}
              {n}
            </span>
          ))}
        </div>
      </div>

      <Blossom className="hidden lg:block absolute left-[46%] bottom-[18%] w-5 opacity-70" />
      <DecorRow variant="c" />
    </section>
  );
}
