import { siteConfig } from '@/data/site';

// Ngày tĩnh để trang prerender ổn định (Cache Components không cho dùng new Date() khi build)
const LAST_MODIFIED = '2026-10-12';

export default function sitemap() {
  return [{ url: siteConfig.url, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 }];
}
