import SectionHeading from '@/components/ui/SectionHeading';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { Blossom, Leaf, Sparkles } from '@/components/ui/Organic';
import { branches, contactData, mapSearchUrl, siteConfig } from '@/data/site';
import { telHref } from '@/lib/utils';
import ContactForm from './ContactForm';

export default function Contact() {
  const cards = [
    { icon: 'phone', label: 'Hotline', value: siteConfig.hotline, href: telHref(siteConfig.hotline), color: 'bg-sky text-moon-deep' },
    { icon: 'zalo', label: 'Zalo', value: siteConfig.zalo, href: siteConfig.zaloUrl, color: 'bg-[#E6F0FF] text-[#0068FF]', external: true },
    { icon: 'messenger', label: 'Messenger', value: 'Chat với The Moon', href: siteConfig.messengerUrl, color: 'bg-[#E9F3FF] text-[#0084FF]', external: true },
    { icon: 'facebook', label: 'Fanpage', value: 'The Moon Homestay', href: siteConfig.facebookUrl, color: 'bg-[#E8EEFF] text-[#1877F2]', external: true },
  ];

  return (
    <section id="lien-he" className="relative w-full pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
      <Leaf className="hidden 2xl:block absolute -right-5 top-[12%] w-24 opacity-80 animate-sway" flip />
      <Sparkles className="hidden lg:block absolute left-[2%] top-[8%] w-16 opacity-70" />
      <Blossom className="hidden lg:block absolute left-[44%] top-[10%] w-6 opacity-70" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div>
          <SectionHeading eyebrow={contactData.eyebrow} title="Nhắn một tin," script="có ngay phòng" desc={contactData.desc} />

          <ul data-reveal="up" data-reveal-delay="150" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-ink/85">
            {contactData.promises.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5">
                <Icon name="check" className="w-4 h-4 text-moon" strokeWidth={2.2} /> {p}
              </li>
            ))}
          </ul>

          <div className="mt-7 grid sm:grid-cols-2 gap-3.5">
            {cards.map((c, i) => (
              <a
                data-reveal="up"
                data-reveal-delay={200 + i * 90}
                key={c.label}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-3.5 rounded-[22px] bg-white p-4 ring-1 ring-line shadow-[0_12px_28px_-22px_rgba(23,34,44,0.5)] transition-all duration-300 hover:-translate-y-1 hover:ring-moon/40"
              >
                <span className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${c.color}`}>
                  {c.icon === 'zalo' ? <ZaloMark className="text-[13px]" /> : <Icon name={c.icon} className="w-6 h-6" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-bold uppercase tracking-wider text-muted">{c.label}</span>
                  <span className="block text-[15px] font-semibold text-ink truncate">{c.value}</span>
                </span>
                <Icon name="chevron-right" className="ml-auto w-4 h-4 text-muted/60 group-hover:text-moon-deep transition-colors" />
              </a>
            ))}
          </div>

          <div data-reveal="up" data-reveal-delay="420" className="mt-5 rounded-[26px] card-soft p-5 grid sm:grid-cols-2 gap-4">
            {branches.map((b) => (
              <div key={b.id}>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-moon-deep">{b.short}</p>
                <p className="font-semibold text-[14.5px] text-ink mt-0.5">{b.name}</p>
                <a href={mapSearchUrl(b.mapQuery)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-start gap-1.5 text-[13px] text-muted hover:text-moon-deep transition-colors">
                  <Icon name="map-pin" className="w-4 h-4 mt-0.5 shrink-0 text-coral" />
                  {b.address}
                </a>
              </div>
            ))}
            <p className="sm:col-span-2 border-t border-dashed border-line pt-3 text-[12.5px] text-muted inline-flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" className="w-4 h-4" /> Hỗ trợ {siteConfig.supportHours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="key" className="w-4 h-4" /> Nhận phòng {siteConfig.checkin} · Trả phòng {siteConfig.checkout}
              </span>
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
