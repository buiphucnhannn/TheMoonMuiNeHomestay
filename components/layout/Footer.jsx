import Image from 'next/image';
import { branches, mapSearchUrl, navLinks, siteConfig } from '@/data/site';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { Crescent, WaveDivider } from '@/components/ui/Organic';
import { telHref } from '@/lib/utils';

// Năm tĩnh để tương thích Cache Components (không dùng new Date() khi prerender)
const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="relative w-full bg-night text-[#DCE6EC] pt-24 pb-28 sm:pb-8 overflow-hidden">
      <WaveDivider className="top-0 z-10" height={90} periods={1} layers={[{ color: '#fbf8f3', base: 40, amp: 20, phase: Math.PI / 2 }]} />
      <Crescent className="absolute right-[4%] top-20 w-28 opacity-30 hidden md:block" color="#C9A063" />
      <div className="absolute -left-20 bottom-10 w-72 h-72 rounded-full bg-moon/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div data-reveal="up" className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr] pt-8">
          <div>
            <a href="#trang-chu" className="inline-flex items-center rounded-2xl bg-cream px-4 py-3 ring-1 ring-white/10">
              <Image src="/images/brand/wordmark-640.png" alt="The Moon Muine Homestay" width={640} height={365} className="h-11 w-auto" />
            </a>
            <p className="mt-4 font-script text-[24px] text-moon-soft leading-tight">{siteConfig.tagline}</p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#A9B8C2]">{siteConfig.description}</p>
          </div>

          <div>
            <p className="mb-4 text-[12px] font-bold tracking-[0.22em] uppercase text-moon-soft">Khám phá</p>
            <ul className="space-y-2.5 text-[14.5px]">
              {navLinks.slice(1).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-moon-soft transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
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

          <div>
            <p className="mb-4 text-[12px] font-bold tracking-[0.22em] uppercase text-moon-soft">Liên hệ</p>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a href={telHref(siteConfig.hotline)} className="inline-flex items-center gap-2.5 hover:text-moon-soft transition-colors">
                  <Icon name="phone" className="w-4 h-4" /> Hotline: <span className="font-semibold text-white">{siteConfig.hotline}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-moon-soft transition-colors">
                  <ZaloMark className="w-4 text-[10px]" /> Zalo: <span className="font-semibold text-white">{siteConfig.zalo}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-moon-soft transition-colors">
                  <Icon name="facebook" className="w-4 h-4" /> Fanpage The Moon Homestay
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-[#A9B8C2]">
                <Icon name="clock" className="w-4 h-4" /> Nhận phòng {siteConfig.checkin} · Trả phòng {siteConfig.checkout}
              </li>
            </ul>
          </div>
        </div>

        <div data-reveal="up" data-reveal-delay="120" className="mt-12 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-[#8FA0AC]">
          <p>© {YEAR} The Moon Homestay · Mũi Né & Phan Thiết.</p>
          <p className="inline-flex items-center gap-1.5">
            Ngủ ngon dưới trăng <Icon name="moon" className="w-3.5 h-3.5 text-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
}
