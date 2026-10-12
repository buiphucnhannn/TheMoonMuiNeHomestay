import Image from 'next/image';
import { branches, mapSearchUrl, navLinks, siteConfig } from '@/data/site';
import Icon from '@/components/ui/Icon';
import { Crescent } from '@/components/ui/Organic';
import { telHref } from '@/lib/utils';

// Năm tĩnh để tương thích Cache Components (không dùng new Date() khi prerender)
const YEAR = 2026;

// Mô tả ngắn riêng cho footer (siteConfig.description dài hơn, dùng cho SEO/meta)
const FOOTER_BLURB = 'Homestay nhỏ xinh ở Mũi Né & Phan Thiết — ở theo giờ, theo ngày hay qua đêm đều được.';

export default function Footer() {
  return (
    <footer className="relative w-full bg-night text-[#DCE6EC] pt-16 pb-24 sm:pb-0 overflow-hidden">
      <Crescent className="absolute right-[4%] top-8 w-28 opacity-30 hidden md:block" color="#C9A063" />
      <div className="absolute -left-20 bottom-10 w-72 h-72 rounded-full bg-moon/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr] pt-4">
          <div data-reveal="footer-col" data-reveal-delay="0">
            <a href="#trang-chu" className="inline-flex items-center rounded-2xl bg-cream px-4 py-3 ring-1 ring-white/10">
              <Image src="/images/brand/wordmark-640.png" alt="The Moon Muine Homestay" width={640} height={365} className="h-11 w-auto" />
            </a>
            <p className="mt-3 font-script text-[24px] text-moon-soft leading-tight">{siteConfig.tagline}</p>
            <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[#A9B8C2]">{FOOTER_BLURB}</p>
          </div>

          <div data-reveal="footer-col" data-reveal-delay="120">
            <p className="mb-4 text-[12px] font-bold tracking-[0.22em] uppercase text-moon-soft">Khám phá</p>
            <ul className="space-y-2.5 text-[14.5px]">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-moon-soft transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="footer-col" data-reveal-delay="240">
            <p className="mb-4 text-[12px] font-bold tracking-[0.22em] uppercase text-moon-soft">2 cơ sở</p>
            <ul className="space-y-4 text-[14px]">
              {branches.map((b) => (
                <li key={b.id}>
                  <p className="font-semibold text-white">{b.name}</p>
                  <a href={mapSearchUrl(b.mapQuery)} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-start gap-1.5 text-[#A9B8C2] hover:text-moon-soft transition-colors">
                    <Icon name="map-pin" className="w-4 h-4 mt-0.5 shrink-0" />
                    {b.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="footer-col" data-reveal-delay="360">
            <p className="mb-4 text-[12px] font-bold tracking-[0.22em] uppercase text-moon-soft">Liên hệ</p>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <a href={telHref(siteConfig.hotline)} className="hover:text-moon-soft transition-colors">
                  Hotline: <span className="font-semibold text-white">{siteConfig.hotline}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="hover:text-moon-soft transition-colors">
                  Zalo: <span className="font-semibold text-white">{siteConfig.zalo}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-moon-soft transition-colors">
                  Fanpage The Moon Homestay
                </a>
              </li>
              <li className="text-[#A9B8C2]">
                Nhận phòng {siteConfig.checkin} · Trả phòng {siteConfig.checkout}
              </li>
            </ul>
          </div>
        </div>

        {/* ScrollEffects tự hiện phần tử khi đã cuộn chạm đáy trang → dòng sát đáy vẫn reveal được */}
        <div data-reveal="footer-line" data-reveal-delay="200" className="mt-9 border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#8FA0AC]">
          <p>© {YEAR} The Moon Homestay · Mũi Né & Phan Thiết.</p>
          {/* [CẦN XÁC NHẬN] chưa có trang điều khoản / chính sách — thay href khi có */}
          <nav aria-label="Chính sách" className="flex items-center gap-4">
            <a href="#" className="hover:text-moon-soft transition-colors">
              Điều khoản dịch vụ
            </a>
            <span aria-hidden className="w-px h-3.5 bg-white/25" />
            <a href="#" className="hover:text-moon-soft transition-colors">
              Chính sách bảo mật
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
