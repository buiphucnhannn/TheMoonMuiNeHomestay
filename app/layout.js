import { Playfair_Display, Dancing_Script, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/layout/FloatingActions';
import BookingProvider from '@/components/booking/BookingProvider';
import { siteConfig, branches } from '@/data/site';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-script',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const TITLE = 'The Moon Homestay Mũi Né & Phan Thiết | Chill vài hôm, để thấy lòng nhẹ hơn';

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: TITLE,
  description: siteConfig.description,
  keywords: [
    'the moon homestay',
    'the moon muine homestay',
    'the moon phan thiet homestay',
    'homestay mũi né',
    'homestay phan thiết',
    'homestay có hồ bơi phan thiết',
    'villa hồ bơi riêng phan thiết',
    'thuê phòng theo giờ mũi né',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: siteConfig.name,
    title: TITLE,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: siteConfig.description },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  themeColor: '#fbf8f3',
};

/*
 * Giữ bố cục như ở 100% khi người xem thu nhỏ trình duyệt (67%, 50%...) hoặc dùng màn 2K/4K:
 * khung nhìn rộng hơn DESIGN_WIDTH thì phóng cả trang theo tỉ lệ bằng CSS zoom (≤ DESIGN_WIDTH: không đổi gì).
 * --z = hệ số zoom; các kích thước theo vh/vw chia cho --z vì zoom cũng nhân cả đơn vị viewport.
 * Chạy inline trong <head> để áp trước lần vẽ đầu tiên (không nháy).
 */
const DESIGN_WIDTH = 1920;
const PAGE_SCALE_SCRIPT = `(function(){var d=document.documentElement;function f(){var z=Math.max(1,Math.round(window.innerWidth/${DESIGN_WIDTH}*1000)/1000);d.style.zoom=z>1?String(z):'';d.style.setProperty('--z',String(z))}f();window.addEventListener('resize',f)})();`;

// Dữ liệu có cấu trúc cho Google (2 cơ sở lưu trú)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': branches.map((b) => ({
    '@type': 'LodgingBusiness',
    name: b.name,
    image: `${siteConfig.url}${b.image}`,
    telephone: '+84' + siteConfig.hotline.replace(/\D/g, '').slice(1),
    url: siteConfig.url,
    address: { '@type': 'PostalAddress', streetAddress: b.addressShort, addressLocality: 'Phan Thiết', addressCountry: 'VN' },
    checkinTime: siteConfig.checkin,
    checkoutTime: siteConfig.checkout,
    priceRange: '₫₫',
  })),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${dancing.variable} ${beVietnam.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PAGE_SCALE_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased text-ink bg-cream selection:bg-moon-soft selection:text-ink">
        <BookingProvider>
          <Navbar />
          <main className="w-full overflow-hidden">{children}</main>
          <Footer />
          <FloatingActions />
        </BookingProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
