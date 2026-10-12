'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/ui/SectionHeading';
import Icon from '@/components/ui/Icon';
import { Blossom, BlossomBranch, Crescent, DecorRow, Leaf, PoolRing, Sparkles } from '@/components/ui/Organic';
import { galleryImages } from '@/data/site';

// Số ảnh hiện sẵn trên mobile (2 cột): 8 ảnh đầu xếp vừa 5 hàng kín
const MOBILE_LIMIT = 8;

function Lightbox({ index, onClose, onStep }) {
  const img = galleryImages[index];
  return (
    <div className="fixed inset-0 z-[80] bg-night/92 backdrop-blur-sm flex flex-col animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-label={img.alt}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-white/85 text-[13px]">
        <span>
          {index + 1} / {galleryImages.length}
        </span>
        <button type="button" onClick={onClose} aria-label="Đóng" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">
          <Icon name="close" className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
      <div className="relative flex-1 min-h-0 px-2 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full">
          <Image key={img.src} src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain animate-fade-in" />
        </div>
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Ảnh trước"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
        >
          <Icon name="chevron-left" className="w-5 h-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Ảnh sau"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
        >
          <Icon name="chevron-right" className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
      <p className="px-4 sm:px-6 py-4 text-center text-[13.5px] text-white/85">{img.alt}</p>
    </div>
  );
}

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const step = useCallback((d) => setIndex((i) => (i + d + galleryImages.length) % galleryImages.length), []);
  const close = useCallback(() => setIndex(-1), []);

  useEffect(() => {
    if (index < 0) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, step, close]);

  return (
    <section id="hinh-anh" className="relative w-full pt-12 pb-14 lg:pt-16 lg:pb-28 overflow-hidden">
      <Leaf className="hidden 2xl:block absolute -right-5 top-[30%] w-20 opacity-80 animate-sway" flip />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Hai bên tiêu đề */}
        <div data-reveal="decor" aria-hidden className="hidden lg:block absolute left-10 xl:left-20 top-0 w-[260px] h-[170px] pointer-events-none">
          <Crescent className="absolute left-0 top-0 w-20 opacity-75 animate-float" />
          <PoolRing className="absolute left-[120px] top-[92px] w-12 animate-drift" />
          <Sparkles className="absolute left-[170px] top-6 w-14 opacity-80" />
        </div>
        <div data-reveal="note" data-reveal-delay="250" aria-hidden className="hidden lg:block absolute right-10 xl:right-20 top-0 w-[260px] h-[170px] pointer-events-none">
          <p className="absolute left-2 top-8 font-script text-[28px] leading-[1.1] text-ink/65 rotate-[6deg] text-center">
            Say cheese!
            <br />
            <span className="text-[22px]">tách ☾</span>
          </p>
          <BlossomBranch className="absolute right-0 top-0 w-28" flip />
          <Blossom className="absolute right-16 bottom-6 w-6 opacity-85" />
        </div>

        <SectionHeading
          reveal="focus"
          align="center"
          eyebrow="Hình ảnh"
          title="Góc nào cũng"
          script="muốn chụp một tấm"
          desc="Ảnh thật 100% tại The Moon — không filter quá đà. Bấm vào ảnh để xem lớn."
        />

        <div className="mt-10 grid grid-flow-dense grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[230px] gap-3 sm:gap-4">
          {galleryImages.map((img, i) => (
            <button
              data-reveal="tile"
              data-reveal-delay={(i % 4) * 90}
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Xem ảnh: ${img.alt}`}
              className={`group relative overflow-hidden rounded-[22px] ring-1 ring-white shadow-[0_14px_30px_-22px_rgba(23,34,44,0.55)] cursor-pointer bg-sand ${img.span === 'wide' ? 'col-span-2' : ''} ${img.span === 'tall' ? 'md:row-span-2' : ''} ${!showAll && i >= MOBILE_LIMIT ? 'max-md:hidden' : ''}`}
            >
              <Image src={img.src} alt={img.alt} fill sizes={img.span === 'wide' ? '(min-width:768px) 50vw, 100vw' : '(min-width:768px) 25vw, 50vw'} className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-3 left-3.5 right-3.5 text-left text-[12.5px] font-medium text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {img.alt}
              </span>
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-ink flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                <Icon name="expand" className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: 8 ảnh đầu vừa 5 hàng kín, phần còn lại mở bằng nút */}
        {!showAll && galleryImages.length > MOBILE_LIMIT && (
          <div className="md:hidden mt-6 text-center">
            <button type="button" onClick={() => setShowAll(true)} className="btn btn-outline">
              Xem thêm {galleryImages.length - MOBILE_LIMIT} ảnh <Icon name="chevron-right" className="w-4 h-4 rotate-90" />
            </button>
          </div>
        )}
      </div>

      <DecorRow variant="e" />

      {index >= 0 && <Lightbox index={index} onClose={close} onStep={step} />}
    </section>
  );
}
