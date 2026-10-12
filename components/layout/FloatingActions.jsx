'use client';

import { useEffect, useState } from 'react';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { siteConfig } from '@/data/site';
import { smoothScrollTo } from '@/lib/smoothScroll';
import { telHref } from '@/lib/utils';

/** Nút nổi: lên đầu trang + Messenger + Zalo + Gọi (yêu cầu: nút gọi / Zalo / Messenger) */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const circle = 'relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer';

  return (
    <div className="fixed right-3 sm:right-4 bottom-4 sm:bottom-5 z-40 flex flex-col items-center gap-2 sm:gap-2.5">
      <button
        type="button"
        onClick={() => smoothScrollTo(0)}
        aria-label="Lên đầu trang"
        className={`${circle} bg-white text-ink shadow-[0_8px_20px_-6px_rgba(23,34,44,0.35)] hover:text-moon-deep ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <Icon name="arrow-up" className="w-4 h-4" strokeWidth={2} />
      </button>

      <a
        href={siteConfig.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn tin Messenger"
        title="Messenger"
        className={`${circle} text-white shadow-[0_8px_20px_-6px_rgba(0,132,255,0.6)]`}
        style={{ background: 'linear-gradient(135deg,#00B2FF 0%,#006AFF 60%,#A033FF 120%)' }}
      >
        <Icon name="messenger" className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
      </a>

      <a
        href={siteConfig.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat Zalo ${siteConfig.zalo}`}
        title="Zalo"
        className={`${circle} bg-[#0068FF] text-white shadow-[0_8px_20px_-6px_rgba(0,104,255,0.6)]`}
      >
        <ZaloMark className="text-[11px] sm:text-[12px]" />
      </a>

      <a
        href={telHref(siteConfig.hotline)}
        aria-label={`Gọi ${siteConfig.hotline}`}
        title={`Gọi ${siteConfig.hotline}`}
        className={`${circle} bg-moon text-white shadow-[0_8px_20px_-6px_rgba(20,181,217,0.7)] hover:bg-moon-deep`}
      >
        <span className="absolute inset-0 rounded-full bg-moon/40 animate-ping" />
        <Icon name="phone" className="relative w-5 h-5" />
      </a>
    </div>
  );
}
