'use client';

import { useBooking } from './BookingProvider';
import { Arrow } from '@/components/ui/Organic';
import { cn } from '@/lib/utils';

/**
 * Nút mở popup đặt phòng — dùng được trong cả Server Component.
 * <BookingButton roomId="pool-view" pkg="night" variant="primary">Đặt phòng</BookingButton>
 */
export default function BookingButton({ children = 'Đặt phòng ngay', roomId, pkg, branch, variant = 'primary', arrow = true, className = '', ...rest }) {
  const { open } = useBooking();
  return (
    <button type="button" onClick={() => open({ roomId, pkg, branch })} className={cn('btn', `btn-${variant}`, className)} {...rest}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
