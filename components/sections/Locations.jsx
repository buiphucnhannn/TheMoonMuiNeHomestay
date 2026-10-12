'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import Icon from '@/components/ui/Icon';
import { Blossom, DecorRow, PoolRing, Sparkles, Wavelet } from '@/components/ui/Organic';
import { branches, mapEmbedUrl } from '@/data/site';

export default function Locations() {
  const [sel, setSel] = useState(branches[0].id);
  const branch = branches.find((b) => b.id === sel) || branches[0];

  return (
    <section id="vi-tri" className="relative w-full pt-12 pb-14 lg:pt-16 lg:pb-28 overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Góc phải tiêu đề: ghi chú viết tay + phao bơi, sóng biển */}
        <div data-reveal="note" data-reveal-delay="250" aria-hidden className="hidden lg:block absolute right-14 xl:right-24 top-0 w-[340px] h-[190px] pointer-events-none">
          <Sparkles className="absolute left-0 top-2 w-16 opacity-80" />
          <p className="absolute left-14 top-10 font-script text-[28px] leading-[1.15] text-ink/65 -rotate-[5deg] text-center">
            Biển gọi tên,
            <br />
            The Moon đón ☾
          </p>
          <PoolRing className="absolute right-4 top-0 w-14 animate-drift" color="#7ED8E6" />
          <Wavelet className="absolute right-0 bottom-6 w-28 opacity-80" />
          <Blossom className="absolute left-10 bottom-4 w-6 opacity-85" />
        </div>

        <SectionHeading
          reveal="sweep"
          eyebrow="Vị trí & bản đồ"
          title="2 cơ sở,"
          script="Mũi Né & Phan Thiết"
          desc="Một bên là biển Hàm Tiến cách vài bước chân, một bên là villa hồ bơi riêng giữa lòng Phan Thiết. Chọn cơ sở để xem bản đồ và chỉ đường."
          className="max-w-2xl"
        />

        <div className="mt-10 grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 items-stretch">
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
                    active ? 'bg-sky ring-moon/40 shadow-[0_18px_36px_-24px_rgba(20,181,217,0.6)]' : 'bg-white/80 ring-line hover:ring-moon/40 hover:-translate-y-0.5'
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

          <div data-reveal="map" data-reveal-delay="200" className="lg:flex lg:flex-col">
            {/* Desktop: bản đồ cao đúng bằng cột thông tin bên trái */}
            <div className="relative lg:flex-1 rounded-[30px] overflow-hidden ring-4 ring-white shadow-[0_24px_50px_-30px_rgba(23,34,44,0.6)] bg-sand">
              <iframe
                key={branch.id}
                title={`Bản đồ ${branch.name}`}
                src={mapEmbedUrl(branch.mapQuery)}
                className="block w-full h-[360px] sm:h-[440px] lg:absolute lg:inset-0 lg:h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <DecorRow variant="a" />
    </section>
  );
}
