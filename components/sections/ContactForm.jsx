'use client';

import { useState } from 'react';
import Icon, { ZaloMark } from '@/components/ui/Icon';
import { Arrow } from '@/components/ui/Organic';
import { branches, pricingPackages, rooms, siteConfig } from '@/data/site';
import { telHref, zaloHref } from '@/lib/utils';
import { useToday } from '@/lib/hooks';
import { buildBookingMessage } from '@/components/booking/BookingModal';

const inputCls =
  'w-full py-2.5 px-3.5 rounded-xl bg-cream border border-line text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-moon focus:ring-2 focus:ring-moon/20 transition';
const labelCls = 'block text-[12px] font-semibold text-ink/80 mb-1.5';

/** Form "gửi yêu cầu đặt phòng" ngay trong trang — không cần backend: soạn sẵn tin nhắn Zalo/Messenger */
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', branch: branches[0].id, room: rooms.find((r) => r.branch === branches[0].id)?.id || rooms[0].id, pkg: 'night', date: '', nights: 1, guests: 2, note: '' });
  const [sent, setSent] = useState(false);
  const minDate = useToday();
  const date = form.date || minDate;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const branch = branches.find((b) => b.id === form.branch) || branches[0];
  const branchRooms = rooms.filter((r) => r.branch === form.branch);
  const room = rooms.find((r) => r.id === form.room) || branchRooms[0];
  const pkg = pricingPackages.find((p) => p.id === form.pkg) || pricingPackages[2];
  const isNight = pkg.id === 'night' || pkg.id === 'villa';
  const message = buildBookingMessage({ branch, room, pkg, date, nights: form.nights, guests: form.guests, name: form.name, phone: form.phone, note: form.note });

  const changeBranch = (e) => {
    const id = e.target.value;
    const first = rooms.find((r) => r.branch === id);
    setForm((f) => ({ ...f, branch: id, room: first?.id || f.room, pkg: id === 'muine' && f.pkg === 'villa' ? 'night' : f.pkg }));
  };

  return (
    <div data-reveal="right" data-reveal-delay="200" className="rounded-[30px] bg-white p-5 sm:p-7 ring-1 ring-line shadow-[0_28px_60px_-34px_rgba(23,34,44,0.55)]">
      {sent ? (
        <div className="py-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-sky text-moon-deep flex items-center justify-center mx-auto mb-4">
            <Icon name="check" className="w-8 h-8" strokeWidth={2} />
          </div>
          <h3 className="font-serif text-[26px] text-ink mb-2">Đã nhận yêu cầu!</h3>
          <p className="text-[14px] text-muted max-w-sm mx-auto mb-5">
            The Moon sẽ liên hệ số <strong className="text-ink">{form.phone}</strong> để xác nhận. Gửi luôn tin nhắn bên dưới để được giữ phòng nhanh nhất nhé.
          </p>
          <div className="rounded-2xl bg-cream border border-line p-4 text-left text-[13px] text-ink/80 leading-relaxed mb-5">{message}</div>
          <div className="grid sm:grid-cols-3 gap-2.5">
            <a href={zaloHref(siteConfig.zalo, message)} target="_blank" rel="noopener noreferrer" className="btn !bg-[#0068FF] !text-white hover:!bg-[#0052cc]">
              <ZaloMark className="text-[13px]" /> Nhắn Zalo
            </a>
            <a href={telHref(siteConfig.hotline)} className="btn btn-primary">
              <Icon name="phone" className="w-4 h-4" /> Gọi ngay
            </a>
            <a href={siteConfig.messengerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <Icon name="messenger" className="w-4 h-4 text-[#0084FF]" /> Messenger
            </a>
          </div>
          <button type="button" onClick={() => setSent(false)} className="mt-4 text-[13px] font-semibold text-muted hover:text-moon-deep cursor-pointer">
            Gửi yêu cầu khác
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <h3 className="font-serif text-[24px] sm:text-[26px] text-ink leading-tight">Gửi yêu cầu đặt phòng</h3>
            <p className="text-[13px] text-muted mt-1">Điền nhanh 30 giây — không cần cọc trước khi được xác nhận.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="ct-name">
                Tên của bạn
              </label>
              <input id="ct-name" type="text" placeholder="Ví dụ: Minh Anh" value={form.name} onChange={set('name')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ct-phone">
                Số điện thoại / Zalo <span className="text-coral">*</span>
              </label>
              <input id="ct-phone" type="tel" required placeholder="09xx xxx xxx" value={form.phone} onChange={set('phone')} className={inputCls} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="ct-branch">
                Cơ sở
              </label>
              <select id="ct-branch" value={form.branch} onChange={changeBranch} className={inputCls}>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="ct-room">
                Phòng
              </label>
              <select id="ct-room" value={room?.id} onChange={set('room')} className={inputCls}>
                {branchRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.guests} khách
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`grid gap-3 ${isNight ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
            <div className={isNight ? 'col-span-2 sm:col-span-1' : 'col-span-2 sm:col-span-1'}>
              <label className={labelCls} htmlFor="ct-pkg">
                Thời gian ở
              </label>
              <select id="ct-pkg" value={pkg.id} onChange={set('pkg')} className={inputCls}>
                {pricingPackages
                  .filter((p) => p.id !== 'villa' || form.branch === 'phanthiet')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="ct-date">
                Ngày đến
              </label>
              <input id="ct-date" type="date" required min={minDate} value={date} onChange={set('date')} className={inputCls} />
            </div>
            {isNight && (
              <div>
                <label className={labelCls} htmlFor="ct-nights">
                  Số đêm
                </label>
                <input id="ct-nights" type="number" min={1} max={30} value={form.nights} onChange={(e) => setForm((f) => ({ ...f, nights: Math.max(1, Number(e.target.value) || 1) }))} className={inputCls} />
              </div>
            )}
            <div>
              <label className={labelCls} htmlFor="ct-guests">
                Số khách
              </label>
              <input id="ct-guests" type="number" min={1} max={20} value={form.guests} onChange={(e) => setForm((f) => ({ ...f, guests: Math.max(1, Number(e.target.value) || 1) }))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="ct-note">
              Ghi chú (tuỳ chọn)
            </label>
            <textarea id="ct-note" rows={2} placeholder="Ví dụ: cần nhận phòng sớm, chuẩn bị BBQ, có trẻ nhỏ..." value={form.note} onChange={set('note')} className={`${inputCls} min-h-[46px] max-h-[160px] resize-y leading-relaxed`} />
          </div>

          <button type="submit" className="btn btn-primary w-full !py-3.5 !text-[15px]">
            Gửi yêu cầu đặt phòng <Arrow />
          </button>
          <p className="text-center text-[12px] text-muted">
            Hoặc gọi thẳng{' '}
            <a href={telHref(siteConfig.hotline)} className="font-semibold text-moon-deep">
              {siteConfig.hotline}
            </a>{' '}
            · Zalo{' '}
            <a href={siteConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-moon-deep">
              {siteConfig.zalo}
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
