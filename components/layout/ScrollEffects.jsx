'use client';

import { useEffect } from 'react';
import { smoothScrollTo, cleanUrlHash } from '@/lib/smoothScroll';

/*
 * Gắn một lần trong layout → áp dụng cho mọi trang.
 * 1) Reveal 2 chiều: phần tử [data-reveal] hiện ra khi vào màn hình, ẩn lại khi đã ra khỏi
 *    màn hình → cuộn lên hay xuống đều thấy hiệu ứng. Độ trễ đặt bằng data-reveal-delay (ms).
 * 2) Mọi link nội trang (href="#...") cuộn mượt tới đúng vị trí và không để lại # trên URL.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const showIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-revealed')),
      { rootMargin: '0px 0px -8% 0px' }
    );
    const hideIO = new IntersectionObserver((entries) =>
      entries.forEach((e) => !e.isIntersecting && e.target.classList.remove('is-revealed'))
    );

    const watch = (el) => {
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
      showIO.observe(el);
      hideIO.observe(el);
    };
    document.querySelectorAll('[data-reveal]').forEach(watch);

    // Phần tử render sau (đổi phòng, mở popup...) cũng được theo dõi
    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches('[data-reveal]')) watch(n);
          n.querySelectorAll?.('[data-reveal]').forEach(watch);
        })
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) {
        e.preventDefault();
        return;
      }
      if (id !== 'top' && !document.getElementById(id)) return;
      e.preventDefault();
      requestAnimationFrame(() => smoothScrollTo(id));
    };
    document.addEventListener('click', onClick);

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => (document.getElementById(id) ? smoothScrollTo(id) : cleanUrlHash()), 400);
    }

    return () => {
      showIO.disconnect();
      hideIO.disconnect();
      mo.disconnect();
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
