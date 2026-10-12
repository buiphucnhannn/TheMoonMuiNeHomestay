'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import Icon from '@/components/ui/Icon';
import { DecorRow, Sparkles, Wavelet } from '@/components/ui/Organic';
import { branches, mapDirectionsUrl, mapEmbedUrl, siteConfig } from '@/data/site';
import { telHref } from '@/lib/utils';

export default function Locations() {
  const [sel, setSel] = useState(branches[0].id);
  const branch = branches.find((b) => b.id === sel) || branches[0];

  return (
    <section id="vi-tri" className="relative w-full pt-16 pb-28 lg:pt-20 lg:pb-36 overflow-hidden bg-white">
      <Wavelet className="hidden lg:block absolute right-[5%] top-[8%] w-24 opacity-80" />
      <Sparkles className="hidden lg:block absolute left-[3%] top-[12%] w-16 opacity-70" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Vị trí & bản đồ"
          title="2 cơ sở,"
          script="Mũi Né & Phan Thiết"
          desc="Một bên là biển Hàm Tiến cách vài bước chân, một bên là villa hồ bơi riêng giữa lòng Phan Thiết. Chọn cơ sở để xem bản đồ và chỉ đường."
          className="max-w-2xl"
        />

        <div className="mt-10 grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 items-start">
          <div className="grid gap-4">
            {branches.map((b, i) => {
              const active = sel === b.id;
              return (
                <button
                  data-reveal="left"
                  data-reveal-delay={120 + i * 130}
                  key={b.id}
                  type="button"
                  onClick={() => setSel(b.id)}
                  aria-pressed={active}
                  className={`group text-left rounded-[26px] p-3 sm:p-3.5 flex gap-4 items-center transition-all duration-300 ring-1 cursor-pointer ${
                    active ? 'bg-sky ring-moon/40 shadow-[0_18px_36px_-24px_rgba(20,181,217,0.6)]' : 'bg-cream ring-line hover:ring-moon/40 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative w-[108px] h-[124px] sm:w-[140px] sm:h-[136px] shrink-0 rounded-[20px] overflow-hidden">
                    <Image src={b.image} alt={b.name} fill sizes="140px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    {active && (
                      <span className="absolute top-2 left-2 rounded-full bg-moon text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Đang xem</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-moon-deep">{b.short}</p>
                    <h3 className="font-serif text-[20px] sm:text-[23px] text-ink leading-tight">{b.name}</h3>
                    <p className="text-[12.5px] text-muted mt-0.5">{b.style}</p>
                    <p className="mt-1.5 text-[13px] text-ink/85 inline-flex items-start gap-1.5">
                      <Icon name="map-pin" className="w-4 h-4 mt-0.5 shrink-0 text-coral" />
                      {b.address}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {b.highlights.map((h) => (
                        <li key={h} className="rounded-full bg-white/85 ring-1 ring-line px-2.5 py-1 text-[11px] font-medium text-ink/75">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}

            <div data-reveal="up" data-reveal-delay="380" className="rounded-[26px] card-soft p-5">
              <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-moon-deep mb-3">Quanh {branch.name}</p>
              <ul key={branch.id} className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 animate-fade-in">
                {branch.nearby.map(([t, d]) => (
                  <li key={t} className="flex items-baseline justify-between gap-3 border-b border-dashed border-line pb-2 text-[13.5px]">
                    <span className="font-medium text-ink">{t}</span>
                    <span className="text-muted text-right whitespace-nowrap">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-reveal="map" data-reveal-delay="200" className="lg:sticky lg:top-24">
            <div className="relative rounded-[30px] overflow-hidden ring-4 ring-white shadow-[0_24px_50px_-30px_rgba(23,34,44,0.6)] bg-sand">
              <iframe
                key={branch.id}
                title={`Bản đồ ${branch.name}`}
                src={mapEmbedUrl(branch.mapQuery)}
                className="block w-full h-[360px] sm:h-[440px] lg:h-[560px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <span className="absolute top-4 left-4 rounded-full bg-white/92 backdrop-blur px-3.5 py-1.5 text-[12.5px] font-semibold text-ink shadow inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="w-4 h-4 text-coral" /> {branch.name}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href={mapDirectionsUrl(branch.mapQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Icon name="directions" className="w-4 h-4" /> Chỉ đường
              </a>
              <a href={telHref(siteConfig.hotline)} className="btn btn-outline">
                <Icon name="phone" className="w-4 h-4" /> {siteConfig.hotline}
              </a>
            </div>
          </div>
        </div>
      </div>

      <DecorRow variant="c" />
    </section>
  );
}
