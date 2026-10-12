'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import BookingModal from './BookingModal';

const BookingContext = createContext({ open: () => {}, close: () => {} });

/**
 * Bọc toàn trang trong layout. Mọi nút "Đặt phòng" gọi useBooking().open({ roomId, pkg, branch })
 * → mở popup đặt phòng với lựa chọn điền sẵn.
 */
export default function BookingProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, roomId: null, pkg: null, branch: null, seq: 0 });

  const open = useCallback((opts = {}) => {
    setState((s) => ({ isOpen: true, roomId: opts.roomId ?? null, pkg: opts.pkg ?? null, branch: opts.branch ?? null, seq: s.seq + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, isOpen: false })), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal key={state.seq} isOpen={state.isOpen} onClose={close} defaultRoomId={state.roomId} defaultPkg={state.pkg} defaultBranch={state.branch} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
