'use client';

import { useEffect } from 'react';
import { smoothScrollTo, cleanUrlHash } from '@/lib/smoothScroll';

/*
 * Gắn một lần trong layout → áp dụng cho mọi trang.
 * 1) Reveal 2 chiều: phần tử [data-reveal] hiện ra khi vào màn hình, ẩn lại khi đã ra hẳn khỏi
 *    màn hình → cuộn lên hay xuống đều thấy hiệu ứng. Độ trễ đặt bằng data-reveal-delay (ms);
 *    kiểu hiệu ứng đặt bằng data-reveal="<kiểu>" (xem globals.css).
 * 2) Mọi link nội trang (href="#...") cuộn mượt tới đúng vị trí và không để lại # trên URL.
 */
export default function ScrollEffects() {
  useEffect(() => {
    // Reveal theo vị trí thực (giống BanMuongXanh): kiểm tra mỗi lần cuộn/resize thay vì IntersectionObserver.
    // - Hiện khi phần tử đã vào màn hình một khoảng (TRIGGER), ẩn lại khi đã ra hẳn ngoài → lướt lên hay xuống đều có hiệu ứng.
    // - Cuộn chạm đáy trang: hiện mọi phần tử đang nằm trong màn hình (dòng cuối footer không bao giờ "vào sâu" được).
    // - Không đụng phần tử đang ẩn (display:none theo breakpoint).
    const check = () => {
      const vh = window.innerHeight;
      const trigger = Math.min(80, vh * 0.08);
      const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) return;
        const inView = (r.top < vh - trigger && r.bottom > trigger) || (atBottom && r.top < vh && r.bottom > 0);
        if (inView) {
          if (!el.classList.contains('is-revealed')) {
            const delay = el.getAttribute('data-reveal-delay');
            if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
            el.classList.add('is-revealed');
          }
        } else if ((r.top > vh || r.bottom < 0) && el.classList.contains('is-revealed')) {
          // Chỉ gỡ khi đang có: classList.remove() luôn ghi lại thuộc tính class (kể cả khi không có token)
          // → sinh mutation → MutationObserver gọi check() lại → vòng lặp vô hạn.
          el.classList.remove('is-revealed');
        }
      });
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };

    // Ngay khi tải + vài nhịp sau (font/ảnh làm layout xê dịch) → mới mở hay đã mở lâu đều đúng trạng thái
    check();
    const timers = [80, 300, 800, 1600].map((ms) => setTimeout(check, ms));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', schedule);

    // Phần tử render sau (đổi phòng, mở popup...) → kiểm tra lại.
    // React ghi đè className khi re-render (vd. chọn cơ sở) sẽ xoá mất "is-revealed" → check() gắn lại ngay
    // (MutationObserver chạy trước khi vẽ nên không nháy).
    const mo = new MutationObserver((records) => {
      const needCheck = records.some(
        (r) =>
          (r.type === 'attributes' && r.target.hasAttribute?.('data-reveal') && !r.target.classList.contains('is-revealed')) ||
          (r.type === 'childList' && r.addedNodes.length)
      );
      if (needCheck) check();
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

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
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      mo.disconnect();
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
