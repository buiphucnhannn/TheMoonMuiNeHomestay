/*
 * Bộ icon nét mảnh dùng toàn trang. Dùng: <Icon name="pool" className="w-5 h-5" />
 * Icon dạng nét (stroke) lấy màu từ currentColor; icon dạng tô (fill) ghi rõ trong map.
 */
const STROKE = {
  moon: <path d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z" strokeLinejoin="round" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2m0 14.6v2.2M4.6 4.6l1.6 1.6m11.6 11.6 1.6 1.6M2.5 12h2.2m14.6 0h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </>
  ),
  'sun-high': (
    <>
      <circle cx="12" cy="13" r="4" />
      <path d="M12 4v2m-6.4.6 1.4 1.4m11.4-1.4L17 8M3 13h2m14 0h2M6 20h12" />
    </>
  ),
  home: <path d="M3.5 11.5 12 4l8.5 7.5M5.5 10v10h13V10M10 20v-5h4v5" strokeLinejoin="round" />,
  pool: (
    <>
      <path d="M8 18V5.5A2.5 2.5 0 0110.5 3h0M16 18V5.5A2.5 2.5 0 0118.5 3h0M8 9h8M8 13h8" />
      <path d="M2.5 19c1.6 0 1.6-1.2 3.2-1.2S7.3 19 8.9 19s1.6-1.2 3.2-1.2S13.7 19 15.3 19s1.6-1.2 3.2-1.2S20.1 19 21.5 19" />
    </>
  ),
  beach: (
    <>
      <path d="M3 20c2 0 2-1.3 4-1.3S9 20 11 20s2-1.3 4-1.3 2 1.3 4 1.3 2-1.3 3-1.3" />
      <path d="M12.5 16 8 7.5M4.5 9A8 8 0 0117 5.6M4.5 9l12.5-3.4M4.5 9c1.5-2.4 4.5-3.7 8.1-3.3M9.2 6.1C10 4 12 2.8 14.6 3.4" />
    </>
  ),
  bbq: (
    <>
      <path d="M4 10h16l-1.3 3.5A6.5 6.5 0 0112.6 18h-1.2a6.5 6.5 0 01-6.1-4.5L4 10z" strokeLinejoin="round" />
      <path d="M9 18l-2.5 4M15 18l2.5 4M12 18v4M8.5 3.5c0 1.2 1.2 1.3 1.2 2.5S8.5 7.3 8.5 8.5M12 3.5c0 1.2 1.2 1.3 1.2 2.5S12 7.3 12 8.5M15.5 3.5c0 1.2 1.2 1.3 1.2 2.5s-1.2 1.3-1.2 2.5" />
    </>
  ),
  wifi: <path d="M2 9a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16a5 5 0 016 0M12 19.5h.01" />,
  ac: (
    <>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M7 9h10M8 17c0 1.5-1.5 1.5-1.5 3M12 17c0 1.5-1.5 1.5-1.5 3M16 17c0 1.5-1.5 1.5-1.5 3" />
    </>
  ),
  kitchen: (
    <>
      <path d="M4 12h16M5 12v8h14v-8M7 12V4h3v8M14 12V4h3v8" strokeLinejoin="round" />
      <path d="M9 16h2M14 16h2" />
    </>
  ),
  garden: (
    <>
      <path d="M12 21v-9M12 12c-4 0-6.5-3-6.5-7 4 0 6.5 3 6.5 7zm0 0c4 0 6.5-3 6.5-7-4 0-6.5 3-6.5 7z" strokeLinejoin="round" />
      <path d="M5 21h14" />
    </>
  ),
  parking: (
    <>
      <path d="M4 16v-5l2-5h12l2 5v5M4 16h16M4 16v2m16-2v2M7.5 13h.01M16.5 13h.01" strokeLinejoin="round" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3.5" />
      <circle cx="18" cy="17" r="3.5" />
      <path d="M6 17l4-7h5l3 7M10 10l2-4h3" />
    </>
  ),
  key: <path d="M14.5 4a5.5 5.5 0 00-5.2 7.3L3.5 17v3.5H7V18h2.5v-2.5H12l1.2-1.2A5.5 5.5 0 1014.5 4zm1.5 4.2h.01" strokeLinejoin="round" />,
  laundry: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="13" r="4.5" />
      <path d="M7 6h.01M10 6h4M9 13c1 .8 2 .8 3 0s2-.8 3 0" />
    </>
  ),
  clean: <path d="M11 3.5l1.8 5.2 5.2 1.8-5.2 1.8L11 17.5l-1.8-5.2L4 10.5l5.2-1.8L11 3.5zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" strokeLinejoin="round" />,
  sparkles: <path d="M11 3.5l1.8 5.2 5.2 1.8-5.2 1.8L11 17.5l-1.8-5.2L4 10.5l5.2-1.8L11 3.5zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" strokeLinejoin="round" />,
  lock: <path d="M4 18.5V12a2 2 0 012-2h12a2 2 0 012 2v6.5M3 18.5h18M3 18.5V20m18-1.5V20M7 10V8a1.5 1.5 0 011.5-1.5h7A1.5 1.5 0 0117 8v2M8.5 10V9h7v1" strokeLinejoin="round" />,
  camera: (
    <>
      <path d="M4 8.5h3l1.5-2.5h7L17 8.5h3v10H4z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s6.5-5.6 6.5-11A6.5 6.5 0 005.5 10c0 5.4 6.5 11 6.5 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  directions: <path d="M12 3l9 9-9 9-9-9 9-9zm-1 12v-3h3.5l-1.5-1.5M14.5 12l-1.5 1.5" strokeLinejoin="round" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2M15.5 5.3a3 3 0 010 5.6M17.5 14.2c2.2.6 3.5 2.2 3.5 4.3" />
    </>
  ),
  bed: <path d="M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 15h18M3 18v1m18-1v1M6 9V6.5A1.5 1.5 0 017.5 5h9A1.5 1.5 0 0118 6.5V9M8 9v-1.5h3V9m2 0v-1.5h3V9" strokeLinejoin="round" />,
  ruler: <path d="M3 16.5 16.5 3 21 7.5 7.5 21 3 16.5zm4.5-1.5 1.5 1.5M10 12.5l1.5 1.5M12.5 10l1.5 1.5M15 7.5 16.5 9" strokeLinejoin="round" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4m8-4v4M3.5 10h17M9 14.5l2 2 4-4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  'chevron-left': <path d="M15 5l-7 7 7 7" strokeLinejoin="round" />,
  'chevron-right': <path d="M9 5l7 7-7 7" strokeLinejoin="round" />,
  'chevron-down': <path d="M5 9l7 7 7-7" strokeLinejoin="round" />,
  'arrow-up': <path d="M12 19V5m-6 6l6-6 6 6" strokeLinejoin="round" />,
  expand: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M4 4l6 6M20 4l-6 6M20 20l-6-6M4 20l6-6" strokeLinejoin="round" />,
  external: <path d="M14 4h6v6M20 4l-9 9M19 13.5V19a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5.5" strokeLinejoin="round" />,
  chat: <path d="M12 3.5c-5 0-9 3.4-9 7.6 0 2.4 1.3 4.5 3.4 5.9L5.5 21l4.2-2.1c.7.1 1.5.2 2.3.2 5 0 9-3.4 9-7.6s-4-7.6-9-7.6z" strokeLinejoin="round" />,
  mail: <path d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6" strokeLinejoin="round" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" strokeLinejoin="round" />,
  quote: <path d="M7.5 15.5A3.5 3.5 0 014 12V7.5h5V12a3.5 3.5 0 01-1.5 3.5zm9 0A3.5 3.5 0 0113 12V7.5h5V12a3.5 3.5 0 01-1.5 3.5z" strokeLinejoin="round" />,
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.8z" strokeLinejoin="round" />,
  gift: <path d="M4 10h16v10H4zM12 10v10M3 7h18v3H3zM12 7c-1.5 0-4-.5-4-2.5S10.5 2.5 12 7zm0 0c1.5 0 4-.5 4-2.5S13.5 2.5 12 7z" strokeLinejoin="round" />,
  food: <path d="M4 15h16a8 8 0 00-16 0zM3 18h18M12 5v2M8.5 6.5 9.3 8M15.5 6.5 14.7 8" strokeLinejoin="round" />,
  shield: <path d="M12 3l7 3v5.5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3zm-3 9l2 2 4-4" strokeLinejoin="round" />,
};

const FILL = {
  phone: (
    <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
  ),
  messenger: (
    <path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2zm1 12.5l-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 5-2.7-5.5 5.8z" />
  ),
  facebook: (
    <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.3H7.4V14h2.8v8h3.3z" />
  ),
  'star-solid': <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.8z" />,
  'heart-solid': <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />,
};

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.7, ...rest }) {
  if (FILL[name]) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} {...rest}>
        {FILL[name]}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden className={className} {...rest}>
      {STROKE[name] ?? STROKE.sparkles}
    </svg>
  );
}

/** Nhãn Zalo dạng chữ (logo Zalo là wordmark) */
export function ZaloMark({ className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center font-black tracking-tight leading-none select-none ${className}`} aria-hidden>
      Zalo
    </span>
  );
}
