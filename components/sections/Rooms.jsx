'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { rooms, branches, branchById } from '@/data/site';
import { useBooking } from '@/components/booking/BookingProvider';
import Icon from '@/components/ui/Icon';
import { Arrow, Blossom, DecorRow, Leaf, Sparkles } from '@/components/ui/Organic';
import RoomDetailModal from './RoomDetailModal';

/*
 * Ảnh chuyển mượt: ảnh mới đặt chồng lên ảnh cũ, chỉ hiện dần khi đã tải xong
 * (không nháy trắng), sau đó lớp ảnh cũ mới được gỡ.
 */
function CrossfadeImage({ src, alt, sizes }) {
  const [layers, setLayers] = useState([{ src, ready: true }]);
  const [lastSrc, setLastSrc] = useState(src);

  if (src !== lastSrc) {
    setLastSrc(src);
    setLayers((ls) => [...ls.filter((l) => l.src !== src).slice(-1), { src, ready: false }]);
  }

  const handleLoad = (loadedSrc) => {
    setLayers((ls) => (ls.some((l) => l.src === loadedSrc && !l.ready) ? ls.map((l) => (l.src === loadedSrc ? { ...l, ready: true } : l)) : ls));
    setTimeout(() => {
      setLayers((ls) => {
        const lastReady = ls.findLastIndex((l) => l.ready);
        return lastReady > 0 ? ls.slice(lastReady) : ls;
      });
    }, 750);
  };

  const pending = layers.find((l) => !l.ready)?.src;
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => handleLoad(pending), 1200);
    return () => clearTimeout(t);
  }, [pending]);

  return layers.map((l) => (
    <Image
      key={l.src}
      src={l.src}
      alt={alt}
      fill
      sizes={sizes}
      ref={(el) => {
        if (!el || l.ready) return;
        if (el.complete && el.naturalWidth > 0) handleLoad(l.src);
        else el.addEventListener('load', () => handleLoad(l.src), { once: true });
      }}
      className={`object-cover transition-[opacity,transform] duration-700 ease-out ${l.ready ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'}`}
    />
  ));
}

const FILTERS = [{ id: 'all', label: 'Tất cả' }, ...branches.map((b) => ({ id: b.id, label: b.short }))];

export default function Rooms() {
  const { open } = useBooking();
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(rooms[0].id);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  const list = filter === 'all' ? rooms : rooms.filter((r) => r.branch === filter);
  const room = rooms.find((r) => r.id === activeId) || list[0];
  const branch = branchById(room.branch);
  const gallery = room.photos;

  const selectRoom = (id) => {
    setActiveId(id);
    setPhotoIdx(0);
  };
  const selectFilter = (id) => {
    setFilter(id);
    const next = id === 'all' ? rooms : rooms.filter((r) => r.branch === id);
    if (!next.some((r) => r.id === activeId)) selectRoom(next[0].id);
  };
  const step = (dir) => setPhotoIdx((i) => (i + dir + gallery.length) % gallery.length);

  const prices = [
    ['3 giờ', room.priceShort],
    ['12 giờ', room.priceDay],
    ['Qua đêm', room.priceNight],
  ];

  return (
    <section id="phong" className="relative w-full pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-white">
      <Leaf className="hidden lg:block absolute -left-5 top-4 w-20 opacity-80 animate-sway" />
      <Sparkles className="hidden 2xl:block absolute right-[2%] top-[10%] w-16 opacity-70" />
      <Blossom className="hidden 2xl:block absolute right-[1.6%] top-[46%] w-6 opacity-70" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Tiêu đề + bộ lọc cơ sở */}
        <div data-reveal="drop" className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7 lg:mb-9">
          <div>
            <p className="eyebrow mb-3">Danh sách phòng</p>
            <h2 className="font-serif text-[36px] sm:text-[44px] leading-[1.05] text-ink tracking-tight">
              Khám phá
              <span className="font-script font-medium text-moon-deep text-[46px] sm:text-[56px] ml-3">các phòng</span>
            </h2>
            <p className="mt-2 text-[14.5px] text-muted">Mỗi căn phòng một tâm trạng — bạn thích biển Mũi Né hay hồ bơi Phan Thiết?</p>
          </div>
          <div className="inline-flex self-start lg:self-auto rounded-full card-soft p-1.5 gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => selectFilter(f.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${filter === f.id ? 'bg-moon text-white shadow-md shadow-moon/30' : 'text-ink/75 hover:bg-sky hover:text-moon-deep'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_350px] xl:grid-cols-[220px_minmax(0,1fr)_370px] gap-5 lg:gap-6">
          {/* Danh sách phòng */}
          <div data-reveal="left" data-reveal-delay="120" className="card-soft rounded-[22px] p-1.5 flex lg:flex-col gap-1 overflow-x-auto scrollbar-none">
            {list.map((r) => {
              const active = r.id === room.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRoom(r.id)}
                  className={`shrink-0 lg:shrink text-left px-3.5 py-2.5 rounded-[16px] transition-all duration-300 cursor-pointer ${active ? 'bg-moon text-white shadow-md shadow-moon/30' : 'text-ink hover:bg-sky'}`}
                >
                  <span className="block text-[13.5px] font-semibold whitespace-nowrap">{r.name}</span>
                  <span className={`block text-[11px] mt-0.5 whitespace-nowrap ${active ? 'text-white/80' : 'text-muted'}`}>
                    {branchById(r.branch).short} · {r.guests} khách
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ảnh chính + thumbnail */}
          <div className="flex flex-col gap-3 min-w-0">
            <div
              data-reveal="photo"
              data-reveal-delay="200"
              className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-[clamp(300px,min(29vw,calc(100svh_-_340px)),440px)] rounded-[26px] overflow-hidden ring-4 ring-white shadow-[0_20px_40px_-24px_rgba(23,34,44,0.6)] bg-sand"
            >
              <CrossfadeImage src={gallery[photoIdx]} alt={room.name} sizes="(min-width:1024px) 56vw, 100vw" />
              <span className="absolute z-10 left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11.5px] font-semibold text-ink">{room.type}</span>
              <span className="absolute z-10 right-4 top-4 rounded-full bg-night/55 backdrop-blur px-3 py-1 text-[11.5px] font-semibold text-white inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="w-3.5 h-3.5" /> {branch.short}
              </span>
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="absolute z-10 right-4 bottom-4 w-10 h-10 rounded-full bg-white/90 text-ink flex items-center justify-center shadow hover:text-moon-deep cursor-pointer"
                aria-label="Xem chi tiết phòng"
              >
                <Icon name="expand" className="w-4.5 h-4.5" />
              </button>
            </div>
            <div data-reveal="left" data-reveal-delay="380" className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Ảnh trước" className="shrink-0 w-9 h-9 rounded-full bg-white ring-1 ring-line shadow-sm flex items-center justify-center text-ink hover:text-moon-deep cursor-pointer">
                <Arrow className="w-4 h-4 rotate-180" />
              </button>
              <div key={room.id} className="flex-1 grid grid-cols-4 gap-2.5 animate-fade-in">
                {gallery.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setPhotoIdx(idx)}
                    aria-label={`Ảnh ${idx + 1}`}
                    className={`relative h-[54px] xl:h-[60px] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 ${photoIdx === idx ? 'ring-2 ring-moon ring-offset-2 ring-offset-white' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => step(1)} aria-label="Ảnh sau" className="shrink-0 w-9 h-9 rounded-full bg-white ring-1 ring-line shadow-sm flex items-center justify-center text-ink hover:text-moon-deep cursor-pointer">
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thông tin phòng */}
          <div data-reveal="right" data-reveal-delay="300" className="flex">
            <div key={room.id} className="w-full flex flex-col justify-end animate-fade-in">
              <div className="hidden lg:flex items-end justify-end gap-2 mb-auto pr-2 pt-1">
                <div className="relative w-[84px] h-[96px] bg-white p-1.5 pb-4 rotate-[7deg] shadow-[0_14px_30px_-14px_rgba(23,34,44,0.5)]">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image src={room.photos[2]} alt={`Góc nhỏ ${room.name}`} fill sizes="84px" className="object-cover" />
                  </div>
                </div>
                <p className="font-script text-[20px] leading-none text-muted -rotate-6 mb-1">
                  Cozy
                  <br />
                  stay ☾
                </p>
              </div>

              <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-peach/70 px-3 py-1 text-[11px] font-bold text-coral-deep uppercase tracking-wider mb-2.5">
                <Icon name="star-solid" className="w-3 h-3" /> {room.badge}
              </span>
              <h3 className="font-serif text-[28px] font-semibold text-ink tracking-tight leading-tight mb-2">{room.name}</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-muted mb-3">
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="users" className="w-4 h-4 text-moon-deep" /> {room.guests} khách
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="bed" className="w-4 h-4 text-moon-deep" /> {room.bed}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="ruler" className="w-4 h-4 text-moon-deep" /> {room.area}
                </li>
              </ul>
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {room.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-[11.5px] font-medium bg-sand text-ink/75">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[14px] text-muted leading-relaxed mb-4">{room.desc}</p>

              <div className="card-soft grid grid-cols-3 rounded-[20px] divide-x divide-line mb-4">
                {prices.map(([label, price]) => (
                  <div key={label} className="py-2.5 text-center">
                    <p className="text-[11.5px] text-muted mb-0.5">{label}</p>
                    <p className="font-serif text-[20px] font-semibold text-moon-deep leading-tight">{price}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setDetailOpen(true)} className="btn btn-outline !px-4">
                  Chi tiết phòng <Icon name="expand" className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => open({ roomId: room.id, pkg: room.id === 'villa' ? 'villa' : 'night' })} className="btn btn-primary !px-4">
                  Đặt phòng <Arrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DecorRow variant="b" />

      {detailOpen && (
        <RoomDetailModal
          key={room.id}
          room={room}
          onClose={() => setDetailOpen(false)}
          onBook={() => {
            setDetailOpen(false);
            open({ roomId: room.id, pkg: room.id === 'villa' ? 'villa' : 'night' });
          }}
        />
      )}
    </section>
  );
}
