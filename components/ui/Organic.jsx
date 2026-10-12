'use client';

import { useId } from 'react';

/*
 * Bộ hoạ tiết "The Moon": sóng biển, trăng khuyết, tia lấp lánh, lá chuối, hoa giấy,
 * phao bơi... Mọi đường cong sinh từ hàm sin / bezier nên luôn đều và mềm.
 */

const round = (n) => Math.round(n * 1000) / 1000;

function sineY(t, base, amp, periods, phase) {
  return base + amp * Math.sin(2 * Math.PI * periods * t + phase);
}

/** Path SVG cho dải sóng ngang (divider giữa các section) */
export function waveBandPath({ width = 1440, height = 120, base = 60, amp = 18, periods = 1.5, phase = 0, steps = 96, overshoot = 0 }) {
  const x0 = -overshoot;
  const x1 = width + overshoot;
  const bottom = height + overshoot;
  let d = `M${x0},${bottom} L${x0},${round(sineY(0, base, amp, periods, phase))}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    d += ` L${round(t * width)},${round(sineY(t, base, amp, periods, phase))}`;
  }
  return `${d} L${x1},${round(sineY(1, base, amp, periods, phase))} L${x1},${bottom} Z`;
}

/**
 * Divider sóng nhiều lớp. layers: [{ color, base, amp, phase, periods, opacity, blur }]
 */
export function WaveDivider({ layers, height = 110, periods = 1.5, flip = false, className = '' }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div aria-hidden className={`pointer-events-none absolute left-0 right-0 w-full leading-none ${className}`}>
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        className={`block w-full ${flip ? 'rotate-180' : ''}`}
        style={{ height: `clamp(${Math.round(height * 0.45)}px, ${(height / 1440) * 100}vw, ${height}px)` }}
      >
        <defs>
          {layers.map((l, i) =>
            l.blur ? (
              <filter key={i} id={`wave-${uid}-${i}`} x="-5%" y="-50%" width="110%" height="200%">
                <feGaussianBlur stdDeviation={l.blur} />
              </filter>
            ) : null
          )}
        </defs>
        {layers.map((l, i) => (
          <path
            key={i}
            fill={l.color}
            opacity={l.opacity ?? 1}
            filter={l.blur ? `url(#wave-${uid}-${i})` : undefined}
            d={waveBandPath({ height, base: l.base, amp: l.amp, periods: l.periods ?? periods, phase: l.phase ?? 0, overshoot: l.blur ? 40 : 0 })}
          />
        ))}
      </svg>
    </div>
  );
}

/* ---------- Khung ảnh có cạnh lượn sóng (clipPath objectBoundingBox 0..1) ---------- */
function edgePoints(edge, cfg, steps = 48) {
  const { amp = 0.03, periods = 1, phase = 0, inset = amp } = cfg;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const off = inset + amp * Math.sin(2 * Math.PI * periods * t + phase);
    if (edge === 'top') pts.push([t, off]);
    if (edge === 'right') pts.push([1 - off, t]);
    if (edge === 'bottom') pts.push([1 - t, 1 - off]);
    if (edge === 'left') pts.push([off, 1 - t]);
  }
  return pts;
}

const ORDER = ['top', 'right', 'bottom', 'left'];
const isVertical = (edge) => edge === 'left' || edge === 'right';

function quad(p0, p1, p2, t) {
  const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}
function quadTangent(p0, p1, p2, t) {
  return [2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])];
}

export function organicClipPath(edges = {}, cornerSteps = 7) {
  const straight = {
    top: [[0, 0], [1, 0]],
    right: [[1, 0], [1, 1]],
    bottom: [[1, 1], [0, 1]],
    left: [[0, 1], [0, 0]],
  };
  const segs = ORDER.map((e) => (edges[e] ? edgePoints(e, edges[e]) : straight[e]));
  ORDER.forEach((e, i) => {
    const nextIdx = (i + 1) % 4;
    const next = ORDER[nextIdx];
    if (!edges[e] || !edges[next]) return;
    const a = segs[i], b = segs[nextIdx];
    const aEnd = a[a.length - 1], bStart = b[0];
    const corner = isVertical(e) ? [aEnd[0], bStart[1]] : [bStart[0], aEnd[1]];
    const p0 = a[a.length - 1 - cornerSteps];
    const p2 = b[cornerSteps];
    segs[i] = a.slice(0, a.length - cornerSteps);
    const arc = [];
    for (let s = 1; s < 12; s++) arc.push(quad(p0, corner, p2, s / 12));
    segs[i].push(...arc);
    segs[nextIdx] = b.slice(cornerSteps);
  });
  const pts = segs.flat();
  return 'M' + pts.map(([x, y]) => `${round(x)},${round(y)}`).join(' L') + ' Z';
}

export function OrganicFrame({ edges, className = '', children, style }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={className} style={{ ...style, clipPath: `url(#clip-${id})` }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={`clip-${id}`} clipPathUnits="objectBoundingBox">
            <path d={organicClipPath(edges)} />
          </clipPath>
        </defs>
      </svg>
      {children}
    </div>
  );
}

/* ---------- Tia lấp lánh 4 cánh (như trên logo) ---------- */
const SPARK = 'M0-8C.6-2.4 2.4-.6 8 0 2.4.6.6 2.4 0 8-.6 2.4-2.4.6-8 0-2.4-.6-.6-2.4 0-8Z';

export function Sparkles({ className = '', color = '#C9A063', animate = true }) {
  const pts = [
    [22, 14, 1],
    [50, 6, 0.75],
    [74, 24, 0.9],
    [38, 40, 0.55],
    [64, 52, 0.7],
  ];
  return (
    <svg viewBox="0 0 90 64" aria-hidden className={`pointer-events-none ${className}`}>
      {pts.map(([x, y, s], i) => (
        <path
          key={i}
          d={SPARK}
          fill={color}
          transform={`translate(${x} ${y}) scale(${s})`}
          className={animate ? 'animate-twinkle' : ''}
          style={animate ? { animationDelay: `${i * 0.45}s` } : undefined}
        />
      ))}
    </svg>
  );
}

/* ---------- Trăng khuyết: viền mảnh màu vàng như logo, kèm tia lấp lánh ---------- */
export function Crescent({ className = '', color = '#C9A063', filled = false, sparkles = true, style }) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden className={`pointer-events-none ${className}`} style={style}>
      <path
        d="M70 14 A40 40 0 1 0 70 86 A36.2 36.2 0 0 1 70 14 Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 2.6}
        strokeLinejoin="round"
      />
      {sparkles && (
        <g fill={color}>
          <path d={SPARK} transform="translate(92 22) scale(0.9)" className="animate-twinkle" />
          <path d={SPARK} transform="translate(108 44) scale(0.6)" className="animate-twinkle" style={{ animationDelay: '0.7s' }} />
          <path d={SPARK} transform="translate(96 66) scale(0.45)" className="animate-twinkle" style={{ animationDelay: '1.3s' }} />
          <path d={SPARK} transform="translate(48 50) scale(0.5)" className="animate-twinkle" style={{ animationDelay: '1.9s' }} />
        </g>
      )}
    </svg>
  );
}

/* ---------- Lá chuối vẽ tay (từ ảnh poster) ---------- */
export function Leaf({ className = '', color = '#7FA66B', color2 = '#A3C48E', flip = false, style }) {
  const p0 = [60, 100], p1 = [52, 60], p2 = [40, 6];
  const veins = [];
  for (let i = 1; i <= 7; i++) {
    const t = 0.12 + (i / 8) * 0.78;
    const [x, y] = quad(p0, p1, p2, t);
    const [tx, ty] = quadTangent(p0, p1, p2, t);
    const len = 22 * (1 - Math.abs(t - 0.5) * 1.2);
    const nx = -ty, ny = tx;
    const n = Math.hypot(nx, ny) || 1;
    veins.push(
      <path
        key={i}
        d={`M${round(x)} ${round(y)} L${round(x + (nx / n) * len)} ${round(y + (ny / n) * len * 0.75 + 4)} M${round(x)} ${round(y)} L${round(x - (nx / n) * len)} ${round(y - (ny / n) * len * 0.75 + 4)}`}
        stroke="#5F8A4F"
        strokeWidth="0.9"
        opacity="0.55"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ ...style, transform: `${flip ? 'scaleX(-1)' : ''} ${style?.transform ?? ''}` }}
    >
      <path d="M60 196 C62 160 62 130 60 100" stroke="#5F8A4F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M60 100 C 18 84, 4 34, 40 6 C 82 12, 104 62, 60 100 Z" fill={color} />
      <path d="M60 100 C 30 84, 20 40, 40 6 C 50 40, 56 70, 60 100 Z" fill={color2} opacity="0.75" />
      <path d="M60 100 Q52 60 40 6" stroke="#4F7840" strokeWidth="1.4" strokeLinecap="round" />
      {veins}
    </svg>
  );
}

/* ---------- Hoa giấy (bougainvillea) hồng rực như mặt tiền Mũi Né ---------- */
function BlossomShape({ x = 0, y = 0, s = 1, color = '#E85BA3', color2 = '#F07CB8' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 120, 240].map((r, i) => (
        <path key={r} d="M20 20 C 11 14, 9 4, 20 2 C 31 4, 29 14, 20 20 Z" fill={i === 1 ? color2 : color} opacity="0.92" transform={`rotate(${r} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="2.2" fill="#FFF3D6" />
      <circle cx="17.5" cy="18" r="1" fill="#FFE7B3" />
      <circle cx="22.5" cy="18.5" r="1" fill="#FFE7B3" />
    </g>
  );
}

export function Blossom({ className = '', color = '#E85BA3', color2 = '#F07CB8', style }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={`pointer-events-none ${className}`} style={style}>
      <BlossomShape color={color} color2={color2} />
    </svg>
  );
}

/** Cành hoa giấy: 4 bông + lá nhỏ */
export function BlossomBranch({ className = '', flip = false, style }) {
  return (
    <svg
      viewBox="0 0 130 90"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ ...style, transform: `${flip ? 'scaleX(-1)' : ''} ${style?.transform ?? ''}` }}
    >
      <path d="M6 84 C 30 70, 60 50, 112 12" stroke="#7F6A4E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M44 60 c-10 -2 -16 -10 -12 -18 c8 2 14 10 12 18z M78 36 c-2 -10 4 -18 12 -16 c0 8 -6 14 -12 16z M24 74 c-8 -1 -12 -8 -9 -14 c6 1 10 8 9 14z" fill="#8FB07A" />
      <BlossomShape x={10} y={52} s={0.7} />
      <BlossomShape x={46} y={36} s={0.85} />
      <BlossomShape x={76} y={16} s={0.75} />
      <BlossomShape x={100} y={-4} s={0.9} />
    </svg>
  );
}

/* ---------- Mặt trời nhỏ ---------- */
export function Sun({ className = '', color = '#F2B35B', style }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={`pointer-events-none ${className}`} style={style}>
      <circle cx="30" cy="30" r="10" fill={color} />
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path key={r} d="M30 6 L30 13" transform={`rotate(${r} 30 30)`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Phao bơi nhìn từ trên (vàng / xanh ngọc) ---------- */
export function PoolRing({ className = '', color = '#F5D86B', style }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={`pointer-events-none ${className}`} style={style}>
      <path d="M30 4a26 26 0 1 0 0 52a26 26 0 1 0 0-52zm0 15a11 11 0 1 1 0 22a11 11 0 1 1 0-22z" fill={color} fillRule="evenodd" />
      <circle cx="30" cy="30" r="18.5" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="11 18" opacity="0.55" />
      <ellipse cx="22" cy="13" rx="6" ry="2.6" fill="#fff" opacity="0.5" transform="rotate(-30 22 13)" />
    </svg>
  );
}

/* ---------- Gợn sóng biển ---------- */
export function Wavelet({ className = '', color = '#9ADBEB', style }) {
  return (
    <svg viewBox="0 0 80 24" fill="none" aria-hidden className={`pointer-events-none ${className}`} style={style}>
      <path d="M2 12 C 10 4, 18 20, 26 12 S 42 4, 50 12 S 66 20, 74 12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 20 C 18 15, 24 25, 30 20 S 42 15, 48 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/* ---------- Dải hoạ tiết lấp khoảng trống đáy section (từ laptop trở lên) ---------- */
const DECOR_ROWS = {
  a: [
    ['leaf', 'left-[2.5%] bottom-0 w-14', {}],
    ['blossom', 'left-[9%] bottom-9 w-6', {}],
    ['wave', 'left-[22%] bottom-5 w-20', {}],
    ['ring', 'left-[46%] bottom-2 w-10 animate-drift', {}],
    ['sparkles', 'left-[62%] bottom-6 w-16', {}],
    ['blossomBranch', 'right-[14%] bottom-1 w-28', { flip: true }],
    ['leaf', 'right-[3%] bottom-0 w-12', { flip: true }],
  ],
  b: [
    ['blossomBranch', 'left-[4%] bottom-1 w-28', {}],
    ['wave', 'left-[30%] bottom-5 w-16', {}],
    ['sun', 'left-[44%] bottom-6 w-9', {}],
    ['ring', 'left-[57%] bottom-2 w-9 animate-drift', { color: '#7ED8E6' }],
    ['blossom', 'right-[26%] bottom-8 w-5', {}],
    ['leaf', 'right-[8%] bottom-0 w-14', { flip: true }],
    ['sparkles', 'right-[1%] bottom-8 w-14', {}],
  ],
  c: [
    ['sparkles', 'left-[3%] bottom-6 w-14', {}],
    ['leaf', 'left-[12%] bottom-0 w-12', {}],
    ['ring', 'left-[36%] bottom-2 w-9 animate-drift', { color: '#7ED8E6' }],
    ['wave', 'left-[50%] bottom-5 w-20', {}],
    ['blossom', 'left-[70%] bottom-9 w-5', {}],
    ['blossomBranch', 'right-[2%] bottom-1 w-24', { flip: true }],
  ],
  d: [
    ['sun', 'left-[4%] bottom-8 w-10', {}],
    ['leaf', 'left-[13%] bottom-0 w-12', {}],
    ['blossom', 'left-[29%] bottom-7 w-5', {}],
    ['sparkles', 'left-[50%] bottom-6 w-14', {}],
    ['wave', 'right-[25%] bottom-5 w-20', {}],
    ['ring', 'right-[11%] bottom-2 w-10 animate-drift', {}],
    ['leaf', 'right-[2.5%] bottom-0 w-14', { flip: true }],
  ],
  e: [
    ['blossomBranch', 'left-[2%] bottom-1 w-24', {}],
    ['sparkles', 'left-[23%] bottom-7 w-14', {}],
    ['wave', 'left-[39%] bottom-4 w-16', {}],
    ['ring', 'left-[55%] bottom-2 w-9 animate-drift', { color: '#7ED8E6' }],
    ['blossom', 'right-[30%] bottom-8 w-5', {}],
    ['sun', 'right-[17%] bottom-6 w-9', {}],
    ['leaf', 'right-[4%] bottom-0 w-14', { flip: true }],
  ],
};

export function DecorRow({ variant = 'a', className = '' }) {
  return (
    <div data-reveal="decor" data-reveal-delay="200" aria-hidden className={`hidden lg:block pointer-events-none absolute inset-x-0 bottom-0 h-28 ${className}`}>
      {DECOR_ROWS[variant].map(([kind, cls, opts = {}], i) => {
        const c = `absolute ${cls}`;
        if (kind === 'leaf') return <Leaf key={i} className={`${c} animate-sway`} {...opts} />;
        if (kind === 'blossom') return <Blossom key={i} className={`${c} opacity-85`} {...opts} />;
        if (kind === 'blossomBranch') return <BlossomBranch key={i} className={c} {...opts} />;
        if (kind === 'wave') return <Wavelet key={i} className={`${c} opacity-80`} {...opts} />;
        if (kind === 'ring') return <PoolRing key={i} className={c} {...opts} />;
        if (kind === 'sun') return <Sun key={i} className={`${c} opacity-90`} {...opts} />;
        return <Sparkles key={i} className={`${c} opacity-90`} {...opts} />;
      })}
    </div>
  );
}

/* ---------- Mũi tên dùng chung cho nút ---------- */
export function Arrow({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h11m-4-4.5L15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
