'use client';

/*
 * Cuộn mượt tới một section:
 * - đường cong easeInOutCubic, thời lượng co giãn theo quãng đường
 * - dừng ngay nếu người dùng tự lăn chuột / vuốt / bấm phím
 * - điểm dừng "đẹp nhất" (vùng nhìn = màn hình trừ header):
 *   1) phần nội dung (bỏ padding trên/dưới — chỗ của dải hoạ tiết) vừa vùng nhìn → đặt nội dung nằm giữa
 *   2) nội dung dài hơn → mép trên nội dung ngay dưới header, chừa BREATH px
 *      (nội dung chỉ vừa sát vùng nhìn → bớt khoảng thở để hiện trọn)
 * - xoá dấu # khỏi URL sau khi tới nơi
 */

// Khoảng thở giữa header và nội dung khi section dài hơn màn hình (px)
const BREATH = { desktop: 28, mobile: 20 };

let rafId = null;

// Hệ số phóng trang (app/layout.js đặt --z khi khung nhìn rộng hơn bản thiết kế).
// getBoundingClientRect/scrollY/innerHeight đã tính zoom; offsetHeight và padding từ CSS thì chưa → nhân --z.
function pageZoom() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1;
}

// Chiều cao header khi ĐÃ cuộn (thu gọn: py-2 = 8px mỗi đầu) — đúng trạng thái lúc tới nơi,
// kể cả khi bấm từ đầu trang (lúc đó header còn cao hơn 12px).
function headerHeight(z) {
  const inner = document.querySelector('header')?.firstElementChild;
  return (inner ? inner.getBoundingClientRect().height : 48) + 16 * z;
}

function targetYFor(id) {
  if (!id || id === 'top' || id === 'trang-chu') return 0;
  const el = document.getElementById(id);
  if (!el) return null;
  const isMobile = window.innerWidth < 768;
  const z = pageZoom();
  const header = headerHeight(z);
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const avail = window.innerHeight - header;
  const cs = getComputedStyle(el);
  const padTop = (parseFloat(cs.paddingTop) || 0) * z;
  const content = rect.height - padTop - (parseFloat(cs.paddingBottom) || 0) * z;
  const contentTop = top + padTop;
  if (content <= avail - 24) return contentTop - header - (avail - content) / 2;
  // Nội dung vừa sát vùng nhìn → bớt khoảng thở (tối thiểu 8px) để hiện trọn, không cắt đáy
  const breath = Math.max(8 * z, Math.min((isMobile ? BREATH.mobile : BREATH.desktop) * z, avail - content));
  return contentTop - header - breath;
}

export function cleanUrlHash() {
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export function smoothScrollTo(target) {
  if (typeof window === 'undefined') return;
  if (rafId) cancelAnimationFrame(rafId);

  const id = typeof target === 'string' ? target.replace(/^#/, '') : '';
  let targetY = typeof target === 'number' ? target : targetYFor(id);
  if (targetY === null) return;

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  targetY = Math.max(0, Math.min(targetY, maxScroll));

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return cleanUrlHash();

  // Chậm rãi, êm: 850ms cho quãng ngắn → tối đa 1.4s cho quãng dài
  const duration = Math.min(1400, Math.max(850, Math.abs(distance) * 0.4));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let start = null;

  const stop = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchmove', stop);
    window.removeEventListener('keydown', stop);
  };
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchmove', stop, { passive: true });
  window.addEventListener('keydown', stop, { passive: true });

  const step = (now) => {
    if (start === null) start = now;
    const p = Math.min((now - start) / duration, 1);
    window.scrollTo({ top: startY + distance * ease(p), behavior: 'instant' });
    if (p < 1) rafId = requestAnimationFrame(step);
    else {
      stop();
      cleanUrlHash();
    }
  };
  rafId = requestAnimationFrame(step);
}
