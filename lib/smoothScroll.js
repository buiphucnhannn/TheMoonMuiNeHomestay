'use client';

/*
 * Cuộn mượt tới một section:
 * - đường cong easeInOutCubic, thời lượng co giãn theo quãng đường
 * - dừng ngay nếu người dùng tự lăn chuột / vuốt / bấm phím
 * - trừ chiều cao header cố định + khoảng thở riêng cho từng section
 * - xoá dấu # khỏi URL sau khi tới nơi
 */

// Khoảng cách từ mép dưới header tới mép trên section (px). Số âm = cuộn sâu hơn một chút.
const SECTION_GAP = {
  desktop: { 'gioi-thieu': -8, phong: -8, 'bang-gia': 0, 'tien-nghi': 0, 'hinh-anh': 0, 'vi-tri': 0, 'lien-he': 0 },
  mobile: { 'gioi-thieu': 0, phong: -6, 'bang-gia': -4, 'tien-nghi': -4, 'hinh-anh': -4, 'vi-tri': -4, 'lien-he': -4 },
};

let rafId = null;

function headerHeight() {
  const header = document.querySelector('header');
  return header ? Math.min(header.offsetHeight, 72) : 64;
}

function targetYFor(id) {
  if (!id || id === 'top' || id === 'trang-chu') return 0;
  const el = document.getElementById(id);
  if (!el) return null;
  const isMobile = window.innerWidth < 768;
  const gap = (isMobile ? SECTION_GAP.mobile : SECTION_GAP.desktop)[id] ?? 0;
  return el.getBoundingClientRect().top + window.scrollY - headerHeight() - gap;
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

  const duration = Math.min(1300, Math.max(700, Math.abs(distance) * 0.35));
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
