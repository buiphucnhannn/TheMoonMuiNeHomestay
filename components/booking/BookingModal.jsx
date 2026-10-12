'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { branches, rooms, pricingPackages, siteConfig } from '@/data/site';
import { formatDateVN, telHref, zaloHref } from '@/lib/utils';
import { useToday } from '@/lib/hooks';

const inputCls =
  'w-full py-2.5 px-3.5 rounded-xl bg-white border border-line text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-moon focus:ring-2 focus:ring-moon/20 transition';
const labelCls = 'block text-[12px] font-semibold text-ink/80 mb-1.5';

/** Soạn tin nhắn gửi chủ nhà từ thông tin đã chọn */
export function buildBookingMessage({ branch, room, pkg, date, nights, guests, name, phone, note }) {
  const parts = [`Chào The Moon, mình muốn đặt ${room?.name ?? 'phòng'} (cơ sở ${branch?.short ?? ''})`];
  if (pkg) parts.push(`gói ${pkg.name}`);
  if (date) parts.push(`nhận phòng ${formatDateVN(date)}${pkg?.id === 'night' || pkg?.id === 'villa' ? ` · ${nights} đêm` : ''}`);
  if (guests) parts.push(`${guests} khách`);
  let msg = parts.join(' – ') + '.';
  if (name) msg += ` Tên: ${name}.`;
  if (phone) msg += ` SĐT: ${phone}.`;
  if (note) msg += ` Ghi chú: ${note}`;
  return msg;
}

export default function BookingModal({ isOpen, onClose, defaultRoomId, defaultPkg, defaultBranch }) {
  const initialRoom = rooms.find((r) => r.id === defaultRoomId) || null;
  const [branchId, setBranchId] = useState(initialRoom?.branch || defaultBranch || branches[0].id);
  const [roomId, setRoomId] = useState(initialRoom?.id || rooms.find((r) => r.branch === (defaultBranch || branches[0].id))?.id || rooms[0].id);
  const [pkgId, setPkgId] = useState(defaultPkg || (initialRoom?.id === 'villa' ? 'villa' : 'night'));
  const [pickedDate, setPickedDate] = useState('');
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(initialRoom?.guests ? Math.min(initialRoom.guests, 2) : 2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const minDate = useToday();
  const date = pickedDate || minDate;

  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Khoá cuộn trang phía sau + đóng bằng Esc
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, bodyOverflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.paddingRight = prev.paddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const branch = branches.find((b) => b.id === branchId) || branches[0];
  const branchRooms = rooms.filter((r) => r.branch === branchId);
  const room = rooms.find((r) => r.id === roomId) || branchRooms[0];
  const pkg = pricingPackages.find((p) => p.id === pkgId) || pricingPackages[0];
  const isNight = pkg.id === 'night' || pkg.id === 'villa';

  const selectBranch = (id) => {
    setBranchId(id);
    const first = rooms.find((r) => r.branch === id);
    if (first && !rooms.some((r) => r.id === roomId && r.branch === id)) setRoomId(first.id);
    if (id === 'muine' && pkgId === 'villa') setPkgId('night');
  };

  const message = buildBookingMessage({ branch, room, pkg, date, nights, guests, name, phone, note });
  const priceOf = () => {
    if (!room) return '';
    if (pkg.id === 'short') return room.priceShort;
    if (pkg.id === 'day') return room.priceDay;
    return room.priceNight;
  };

  // Tạm tính: tên phòng một dòng riêng (không cắt "…"), gói + giá ở hàng dưới
  const summary = room && (
    <div>
      <span className="block text-[11px] uppercase tracking-wider opacity-75">Tạm tính</span>
      <span className="block mt-0.5 text-[14px] font-semibold leading-snug">{room.name}</span>
      <div className="mt-2 pt-2 border-t border-current/20 flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] opacity-80">{pkg.name}</span>
        {pkg.id !== 'villa' ? (
          <span className="shrink-0 font-serif text-[22px] font-semibold leading-none whitespace-nowrap">
            {priceOf()}
            <span className="ml-1 font-sans text-[11px] font-normal opacity-75">{isNight ? '/ đêm' : ''}</span>
          </span>
        ) : (
          <span className="shrink-0 font-serif text-[18px] font-semibold leading-none whitespace-nowrap">từ 3.500k</span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-night/60 backdrop-blur-[3px] animate-fade-in overscroll-contain"
      onClick={onClose}
      role="presentation"
    >
      {/* Vừa 1 màn hình; ẩn thanh cuộn nhưng vẫn lăn/vuốt được nếu ô ghi chú bị kéo giãn */}
      <div
        className="relative w-full max-w-xl md:max-w-[880px] max-h-[calc(100svh-1.5rem)] sm:max-h-[calc(100svh-3rem)] overflow-y-auto overscroll-contain scrollbar-none bg-cream rounded-[28px] shadow-2xl border border-line md:grid md:grid-cols-[300px_minmax(0,1fr)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center border border-line transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <Icon name="close" className="w-4 h-4" />
        </button>

        {/* Cột trái (desktop): ảnh nét nhất của cơ sở đang chọn + liên hệ nhanh + tạm tính */}
        <aside className="relative hidden md:flex flex-col justify-between p-5 text-white overflow-hidden">
          <Image key={branch.image} src={branch.image} alt={branch.name} fill sizes="300px" className="object-cover animate-fade-in" style={{ objectPosition: branch.imageFocus }} />
          <div className="absolute inset-0 bg-gradient-to-b from-night/35 via-night/10 to-night/85" />
          <div className="relative flex justify-center">
            <span className="inline-flex rounded-2xl bg-cream/95 px-3 py-2 shadow">
              <Image src="/images/brand/wordmark-640.png" alt="The Moon Homestay" width={640} height={365} className="h-9 w-auto" />
            </span>
          </div>
          <div className="relative space-y-3">
            <p className="font-script text-[30px] leading-[1.05] text-[#F8D9A6] -rotate-3 drop-shadow">Chill vài hôm ☾</p>
            <div className="space-y-1.5 text-[13px]">
              <a href={telHref(siteConfig.hotline)} className="flex items-center gap-2 hover:text-moon-soft">
                <Icon name="phone" className="w-4 h-4" /> {siteConfig.hotline}
              </a>
              <a href={zaloHref(siteConfig.zalo)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-moon-soft">
                <ZaloMark className="w-4 text-[9px]" /> Zalo {siteConfig.zalo}
              </a>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3.5 py-3">{summary}</div>
          </div>
        </aside>

        {!submitted ? (
          <div className="p-5 sm:p-7">
            <div className="text-center mb-4 px-8 md:px-10">
              <Image src="/images/brand/wordmark-640.png" alt="The Moon Homestay" width={640} height={365} className="md:hidden mx-auto mb-2 h-10 w-auto" />
              <span className="eyebrow justify-center mb-1 before:hidden">Đặt phòng nhanh</span>
              <h3 id="booking-title" className="font-serif text-2xl sm:text-[28px] text-ink leading-tight">
                Giữ phòng trong 30 giây
              </h3>
              <p className="md:hidden text-[13px] text-muted mt-1">
                Hoặc gọi/Zalo: <strong className="text-moon-deep font-semibold">{siteConfig.hotline}</strong> · <strong className="text-moon-deep font-semibold">{siteConfig.zalo}</strong>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-3"
            >
              <div>
                <span className={labelCls}>Chọn cơ sở</span>
                <div className="grid grid-cols-2 gap-2">
                  {branches.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => selectBranch(b.id)}
                      className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold border text-center transition-all cursor-pointer ${
                        branchId === b.id ? 'bg-moon text-white border-moon shadow-md shadow-moon/30' : 'bg-white text-ink border-line hover:border-moon'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="bk-room">
                    Phòng
                  </label>
                  <select id="bk-room" value={room?.id} onChange={(e) => setRoomId(e.target.value)} className={inputCls}>
                    {branchRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} · {r.guests} khách
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="bk-pkg">
                    Thời gian ở
                  </label>
                  <select id="bk-pkg" value={pkg.id} onChange={(e) => setPkgId(e.target.value)} className={inputCls}>
                    {pricingPackages
                      .filter((p) => p.id !== 'villa' || branchId === 'phanthiet')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className={`grid gap-3 ${isNight ? 'grid-cols-[1.35fr_1fr_1fr] sm:grid-cols-3' : 'grid-cols-2'}`}>
                <div className={isNight ? '' : 'col-span-1'}>
                  <label className={labelCls} htmlFor="bk-date">
                    Ngày nhận phòng
                  </label>
                  <input id="bk-date" type="date" required min={minDate} value={date} onChange={(e) => setPickedDate(e.target.value)} className={`${inputCls} max-sm:px-2.5 max-sm:text-[13px]`} />
                </div>
                {isNight && (
                  <div>
                    <label className={labelCls} htmlFor="bk-nights">
                      Số đêm
                    </label>
                    <input id="bk-nights" type="number" min={1} max={30} value={nights} onChange={(e) => setNights(Math.max(1, Number(e.target.value) || 1))} className={inputCls} />
                  </div>
                )}
                <div>
                  <label className={labelCls} htmlFor="bk-guests">
                    Số khách
                  </label>
                  <input id="bk-guests" type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="bk-name">
                    Tên của bạn
                  </label>
                  <input id="bk-name" type="text" placeholder="Ví dụ: Minh Anh" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="bk-phone">
                    Số điện thoại / Zalo
                  </label>
                  <input id="bk-phone" type="tel" required placeholder="09xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="bk-note">
                  Ghi chú (tuỳ chọn)
                </label>
                <textarea
                  id="bk-note"
                  rows={2}
                  placeholder="Ví dụ: cần nhận phòng sớm, chuẩn bị BBQ, có trẻ nhỏ..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${inputCls} resize-none leading-relaxed`}
                />
              </div>

              {room && <div className="md:hidden rounded-2xl bg-sky px-4 py-3 text-moon-ink">{summary}</div>}

              <button type="submit" className="btn btn-primary w-full !py-3.5 !text-[15px]">
                Gửi yêu cầu giữ phòng
                <Icon name="chevron-right" className="w-4 h-4" />
              </button>
              <p className="text-center text-[11.5px] text-muted leading-relaxed">
                Bấm gửi là đồng ý để The Moon gọi/nhắn xác nhận.
                <br />
                Không spam, không cọc trước khi xác nhận.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center self-center">
            <div className="w-16 h-16 rounded-full bg-sky text-moon-deep flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="w-8 h-8" strokeWidth={2} />
            </div>
            <h3 className="font-serif text-2xl sm:text-[28px] text-ink mb-2">Đã nhận yêu cầu!</h3>
            <p className="text-[14px] text-muted max-w-sm mx-auto mb-5">
              The Moon sẽ gọi hoặc nhắn Zalo tới số <strong className="text-ink">{phone}</strong> trong vài phút để xác nhận phòng. Muốn nhanh hơn, gửi luôn tin nhắn bên dưới nhé.
            </p>
            <div className="rounded-2xl bg-white border border-line p-4 text-left text-[13px] text-ink/80 leading-relaxed mb-5">{message}</div>
            <div className="grid sm:grid-cols-3 gap-2.5 [&>a]:!px-3">
              <a href={zaloHref(siteConfig.zalo, message)} target="_blank" rel="noopener noreferrer" className="btn !bg-[#0068FF] !text-white hover:!bg-[#0052cc]">
                <ZaloMark className="text-[13px]" /> Nhắn Zalo ngay
              </a>
              <a href={telHref(siteConfig.hotline)} className="btn btn-primary">
                <Icon name="phone" className="w-4 h-4" /> Gọi {siteConfig.hotline}
              </a>
              <a href={siteConfig.messengerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Icon name="messenger" className="w-4 h-4 text-[#0084FF]" /> Messenger
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 text-[13px] font-semibold text-muted hover:text-moon-deep cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
