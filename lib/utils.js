/** Gộp class Tailwind — dùng chung cho Button, Card... */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** "0975 141 372" -> "tel:0975141372" */
export function telHref(phone) {
  return `tel:${String(phone).replace(/\D/g, '')}`;
}

/** Link mở Zalo chat kèm tin nhắn soạn sẵn */
export function zaloHref(phone, text) {
  const base = `https://zalo.me/${String(phone).replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Ngày hôm nay dạng YYYY-MM-DD theo giờ máy khách (chỉ gọi trong effect/handler) */
export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "2026-10-12" -> "12/10/2026" */
export function formatDateVN(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
