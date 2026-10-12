'use client';

import { useSyncExternalStore } from 'react';
import { todayISO } from './utils';

const noopSubscribe = () => () => {};
const serverSnapshot = () => '';

/**
 * Ngày hôm nay (YYYY-MM-DD) theo giờ máy khách, an toàn khi hydrate:
 * server render chuỗi rỗng, trình duyệt điền ngày thật sau khi gắn kết — không cần setState trong effect.
 */
export function useToday() {
  return useSyncExternalStore(noopSubscribe, todayISO, serverSnapshot);
}
