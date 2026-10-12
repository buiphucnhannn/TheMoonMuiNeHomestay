'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { Arrow } from '@/components/ui/Organic';
import { branchById, roomPolicies, siteConfig } from '@/data/site';
import { zaloHref } from '@/lib/utils';

/**
 * Popup "Chi tiết phòng": bộ ảnh, mô tả, tiện nghi trong phòng, giá & chính sách.
 * Chỉ được mount khi mở (Rooms.jsx) nên ảnh luôn bắt đầu từ tấm đầu tiên.
 */
export default function RoomDetailModal({ room, onClose, onBook }) {
  const [idx, setIdx] = useState(0);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, bodyOverflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % room.photos.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + room.photos.length) % room.photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.paddingRight = prev.paddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [room.photos.length]);

  const branch = branchById(room.branch);
  const zaloMsg = `Chào The Moon, mình muốn hỏi thêm về ${room.name} (${branch.short}).`;
  const prices = [
    ['Nghỉ ngắn 3 giờ', room.priceShort],
    ['Theo ngày 12 giờ', room.priceDay],
    ['Qua đêm 14h → 12h', room.priceNight],
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-night/65 backdrop-blur-[3px] animate-fade-in overscroll-contain" onClick={onClose} role="presentation">
      <div
        className="relative w-full max-w-5xl xl:max-w-6xl max-h-[calc(100svh-1.5rem)] sm:max-h-[calc(100svh-3rem)] overflow-y-auto overscroll-contain scrollbar-none bg-cream rounded-[28px] shadow-2xl border border-line"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center border border-line transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <Icon name="close" className="w-4 h-4" />
        </button>

        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Ảnh */}
          <div className="p-3 sm:p-4 lg:p-5 lg:pr-0 lg:flex lg:flex-col">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[320px] rounded-[22px] overflow-hidden bg-sand ring-4 ring-white">
              <Image key={room.photos[idx]} src={room.photos[idx]} alt={`${room.name} — ảnh ${idx + 1}`} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover animate-fade-in" />
              <button type="button" onClick={() => setIdx((i) => (i - 1 + room.photos.length) % room.photos.length)} aria-label="Ảnh trước" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center shadow hover:text-moon-deep cursor-pointer">
                <Icon name="chevron-left" className="w-4 h-4" strokeWidth={2} />
              </button>
              <button type="button" onClick={() => setIdx((i) => (i + 1) % room.photos.length)} aria-label="Ảnh sau" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center shadow hover:text-moon-deep cursor-pointer">
                <Icon name="chevron-right" className="w-4 h-4" strokeWidth={2} />
              </button>
              <span className="absolute left-3 bottom-3 rounded-full bg-night/55 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
                {idx + 1} / {room.photos.length}
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {room.photos.map((src, i) => (
                <button key={src} type="button" onClick={() => setIdx(i)} aria-label={`Ảnh ${i + 1}`} className={`relative h-14 sm:h-16 rounded-[12px] overflow-hidden cursor-pointer transition-all ${idx === i ? 'ring-2 ring-moon ring-offset-2 ring-offset-cream' : 'opacity-60 hover:opacity-100'}`}>
                  <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Thông tin */}
          <div className="p-5 sm:p-6 lg:py-6 lg:pl-6 lg:pr-7">
            <p className="eyebrow mb-2">
              {branch.name} · {room.type}
            </p>
            <h3 id="room-detail-title" className="font-serif text-[28px] sm:text-[32px] font-semibold text-ink leading-tight tracking-tight">
              {room.name}
            </h3>
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
              <li className="inline-flex items-center gap-1.5">
                <Icon name="users" className="w-4 h-4 text-moon-deep" /> {room.guests} khách
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="bed" className="w-4 h-4 text-moon-deep" /> {room.bed}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="ruler" className="w-4 h-4 text-moon-deep" /> {room.area}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="w-4 h-4 text-coral" /> {branch.addressShort}
              </li>
            </ul>
            <p className="mt-3 text-[14px] text-muted leading-relaxed text-justify">{room.desc}</p>

            <p className="mt-4 text-[12px] font-bold tracking-[0.2em] uppercase text-moon-deep">Tiện nghi trong phòng</p>
            <ul className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-ink/85">
              {room.amenities.map((a) => (
                <li key={a} className="inline-flex items-start gap-2">
                  <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0 text-moon" strokeWidth={2.2} /> {a}
                </li>
              ))}
            </ul>

            <div className="mt-4 card-soft rounded-[20px] grid grid-cols-3 divide-x divide-line">
              {prices.map(([label, price]) => (
                <div key={label} className="px-2 py-2.5 text-center">
                  <p className="text-[11.5px] text-muted leading-snug">{label}</p>
                  <p className="font-serif text-[20px] font-semibold text-moon-deep leading-tight mt-0.5">{price}</p>
                </div>
              ))}
            </div>

            <ul className="mt-3.5 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-[12px] leading-snug text-muted">
              {roomPolicies.map((p) => (
                <li key={p} className="inline-flex items-start gap-1.5">
                  <Icon name="shield" className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold" /> {p}
                </li>
              ))}
            </ul>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={onBook} className="btn btn-primary">
                Đặt phòng này <Arrow />
              </button>
              <a href={zaloHref(siteConfig.zalo, zaloMsg)} target="_blank" rel="noopener noreferrer" className="btn !bg-[#0068FF] !text-white hover:!bg-[#0052cc]">
                <ZaloMark className="text-[13px]" /> Hỏi nhanh qua Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
