'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { navLinks, siteConfig } from '@/data/site';
import { useBooking } from '@/components/booking/BookingProvider';
import { Arrow } from '@/components/ui/Organic';
import Icon from '@/components/ui/Icon';
import { telHref } from '@/lib/utils';

const SECTION_IDS = navLinks.map((l) => l.href.slice(1));

export default function Navbar() {
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(SECTION_IDS[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Đổi nền khi cuộn + đánh dấu mục đang xem
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 20);
      const line = window.innerHeight * 0.38;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = SECTION_IDS[SECTION_IDS.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menu mobile: đóng bằng Esc hoặc khi màn hình chuyển sang desktop
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const mq = window.matchMedia('(min-width: 1280px)');
    const onMq = () => mq.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <div
        aria-hidden
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpen(false);
        }}
        onPointerDown={(e) => e.preventDefault()}
        className={`xl:hidden fixed inset-0 z-40 bg-night/30 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid ? 'bg-cream/92 backdrop-blur-md shadow-[0_6px_24px_-16px_rgba(23,34,44,0.45)] py-2' : 'bg-transparent py-3.5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6">
          <a href="#trang-chu" className="flex items-center shrink-0 group" aria-label="The Moon Homestay — về đầu trang">
            <Image
              src="/images/brand/wordmark-640.png"
              alt="The Moon Muine Homestay"
              width={640}
              height={365}
              loading="eager"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] ${solid ? 'h-9 sm:h-10' : 'h-10 sm:h-12'}`}
            />
          </a>

          <nav className="hidden xl:flex items-center gap-7 rounded-full px-6 py-2.5 bg-white/70 backdrop-blur-sm ring-1 ring-white/80 shadow-[0_8px_24px_-18px_rgba(23,34,44,0.5)]" aria-label="Điều hướng chính">
            {navLinks.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-[13.5px] font-medium transition-colors relative py-1 after:absolute after:-bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-full after:bg-moon after:transition-all after:duration-300 hover:text-moon-deep hover:after:w-4 ${
                    isActive ? 'text-moon-deep after:w-4' : 'text-ink/80 after:w-0'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={telHref(siteConfig.hotline)}
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm ring-1 ring-white/80 pl-1 pr-4 py-1 text-[13.5px] font-semibold text-ink/85 hover:text-moon-deep transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-sky text-moon-deep flex items-center justify-center">
                <Icon name="phone" className="w-4 h-4" />
              </span>
              {siteConfig.hotline}
            </a>
            <button type="button" onClick={() => open()} className="btn btn-primary !py-2.5 !px-5 !text-[13px]">
              Đặt phòng <Arrow />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden w-10 h-10 rounded-full bg-white/80 text-ink flex items-center justify-center ring-1 ring-line cursor-pointer"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <button type="button" onClick={() => open()} className="btn btn-primary !py-2 !px-3.5 !text-xs">
              Đặt phòng
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-white/80 text-ink flex items-center justify-center ring-1 ring-line cursor-pointer"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="xl:hidden px-4 sm:px-6 pt-3 pb-5">
            <div className="rounded-[26px] card-soft p-3 space-y-0.5">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-2.5 text-[15px] font-medium transition-colors ${
                    active === item.href.slice(1) ? 'bg-sky text-moon-deep' : 'text-ink/85 hover:bg-warm hover:text-moon-deep'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a href={telHref(siteConfig.hotline)} className="btn btn-outline !py-2.5 !text-[13px]">
                  <Icon name="phone" className="w-4 h-4" /> Gọi ngay
                </a>
                <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="btn !bg-[#0068FF] !text-white !py-2.5 !text-[13px]">
                  Chat Zalo
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
