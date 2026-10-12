/**
 * DỮ LIỆU TRUNG TÂM — sửa file này là đổi nội dung toàn trang, không cần đụng vào UI.
 *
 * ⚠ Các mục ghi [CẦN XÁC NHẬN] là nội dung mẫu vì hồ sơ yêu cầu chưa cung cấp
 *   (giá phòng, tên/loại phòng, đánh giá khách, link fanpage, domain). Thay bằng số liệu thật trước khi bàn giao.
 */
const enc = encodeURIComponent;

export const siteConfig = {
  brand: 'The Moon',
  name: 'The Moon Homestay',
  fullName: 'The Moon Mũi Né Homestay',
  tagline: 'Chill vài hôm, để thấy lòng nhẹ hơn ♡',
  description:
    'The Moon Homestay có 2 cơ sở tại Mũi Né và Phan Thiết: căn nhà trắng cửa vòm xanh cách biển 300 m và villa hồ bơi riêng, BBQ sân vườn. Cho thuê phòng theo giờ, theo ngày và qua đêm cho cặp đôi, nhóm bạn, gia đình.',
  url: 'https://themoonhomestay.vn', // [CẦN XÁC NHẬN] domain thật khi deploy
  hotline: '0975 141 372',
  zalo: '0933 309 981', // SĐT / Zalo trong hồ sơ
  zaloUrl: 'https://zalo.me/0933309981',
  facebookUrl: 'https://www.facebook.com/search/top?q=the%20moon%20muine%20homestay', // [CẦN XÁC NHẬN] link fanpage thật
  messengerUrl: 'https://www.facebook.com/search/top?q=the%20moon%20muine%20homestay', // [CẦN XÁC NHẬN] https://m.me/<tên-fanpage>
  checkin: '14:00',
  checkout: '12:00',
  supportHours: '7:00 – 23:00 mỗi ngày',
};

export const navLinks = [
  { label: 'Trang chủ', href: '#trang-chu' },
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Phòng', href: '#phong' },
  { label: 'Bảng giá', href: '#bang-gia' },
  { label: 'Tiện nghi', href: '#tien-nghi' },
  { label: 'Hình ảnh', href: '#hinh-anh' },
  { label: 'Vị trí', href: '#vi-tri' },
  { label: 'Liên hệ', href: '#lien-he' },
];

/* ---------------- 2 cơ sở ---------------- */
export const branches = [
  {
    id: 'muine',
    name: 'The Moon Mũi Né',
    short: 'Mũi Né',
    style: 'Nhà trắng Santorini · cửa vòm xanh · giàn hoa giấy',
    address: '195/8 Huỳnh Thúc Kháng, Mũi Né, TP. Phan Thiết',
    addressShort: '195/8 Huỳnh Thúc Kháng, Mũi Né',
    image: '/images/branches/muine.jpg',
    thumb: '/images/gallery/bougainvillea.jpg',
    highlights: ['Cách biển Hàm Tiến ~300 m', 'Sân vườn & phòng khách chung', 'Đậu xe miễn phí trong sân'],
    mapQuery: 'The Moon Muine Homestay, 195/8 Huỳnh Thúc Kháng, Mũi Né, Phan Thiết',
    // Khoảng cách ước lượng — [CẦN XÁC NHẬN]
    nearby: [
      ['Bãi biển Hàm Tiến', '~300 m · đi bộ 4 phút'],
      ['Làng chài Mũi Né', '~3 km · xe máy 7 phút'],
      ['Suối Tiên', '~3 km · xe máy 8 phút'],
      ['Đồi cát bay', '~5 km · xe máy 12 phút'],
    ],
  },
  {
    id: 'phanthiet',
    name: 'The Moon Phan Thiết',
    short: 'Phan Thiết',
    style: 'Villa 4 phòng ngủ · hồ bơi riêng · bếp nướng BBQ',
    address: '344 Thủ Khoa Huân, TP. Phan Thiết',
    addressShort: '344 Thủ Khoa Huân, Phan Thiết',
    image: '/images/gallery/pool-courtyard.jpg',
    thumb: '/images/gallery/neon-pool.jpg',
    highlights: ['Hồ bơi riêng giữa sân', '4 phòng ngủ · 4 WC · bếp đầy đủ', 'Cách biển Đồi Dương ~800 m'],
    mapQuery: 'The Moon Phan Thiet Homestay, 344 Thủ Khoa Huân, Phan Thiết',
    nearby: [
      ['Bãi biển Đồi Dương', '~800 m · xe máy 3 phút'],
      ['Chợ & trung tâm Phan Thiết', '~3 km · xe máy 8 phút'],
      ['Tháp Chăm Poshanư', '~5 km · xe máy 10 phút'],
      ['Mũi Né – Hàm Tiến', '~12 km · xe máy 20 phút'],
    ],
  },
];
export const branchById = (id) => branches.find((b) => b.id === id) || branches[0];
export const mapEmbedUrl = (q) => `https://www.google.com/maps?q=${enc(q)}&output=embed`;
export const mapDirectionsUrl = (q) => `https://www.google.com/maps/dir/?api=1&destination=${enc(q)}`;
export const mapSearchUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${enc(q)}`;

/* ---------------- Hero ---------------- */
export const heroData = {
  badge: 'The Moon Homestay • Mũi Né & Phan Thiết',
  titleLine1: 'Chill vài hôm,',
  scriptLine: 'để thấy lòng nhẹ hơn ♡',
  desc: 'Hai căn homestay nhỏ xinh giữa Mũi Né và Phan Thiết: cửa vòm đầy nắng, hồ bơi riêng giữa sân, tối BBQ dưới đèn vàng và biển chỉ cách vài bước chân.',
  chips: [
    { icon: 'moon', text: '2 cơ sở' },
    { icon: 'pool', text: 'Hồ bơi riêng' },
    { icon: 'beach', text: '300 m tới biển' },
    { icon: 'bbq', text: 'BBQ sân vườn' },
  ],
  photoNote: 'Nắng, hồ bơi\n& người thương ♡',
  socialProof: 'Được cặp đôi, nhóm bạn và gia đình chọn khi về Phan Thiết – Mũi Né',
};

/* ---------------- Giới thiệu ---------------- */
export const introData = {
  eyebrow: 'Giới thiệu homestay',
  titleSerif: 'Hai căn nhà nhỏ,',
  titleScript: 'một tâm trạng nhẹ tênh',
  paragraphs: [
    'The Moon Mũi Né là căn nhà trắng kiểu Santorini với cửa vòm xanh và giàn hoa giấy rực hồng, đi bộ vài phút là tới biển Hàm Tiến.',
    'The Moon Phan Thiết là villa 4 phòng ngủ có hồ bơi riêng giữa sân, bếp nướng BBQ và những ô cửa vòm đón nắng chiều.',
    'Cả hai đều dành cho cặp đôi, nhóm bạn và gia đình muốn một kỳ nghỉ chậm, sạch và thật — ở theo giờ, theo ngày hay qua đêm đều được.',
  ],
  ctaText: 'Khám phá các phòng',
  note: 'Nơi nắng, hồ bơi\nvà biển ở cạnh nhau ♡',
  features: [
    { icon: 'lock', title: 'Riêng tư', desc: 'Kín đáo, thoải mái' },
    { icon: 'sparkles', title: 'Sạch sẽ', desc: 'Dọn phòng mỗi ngày' },
    { icon: 'beach', title: 'Gần biển', desc: 'Vài phút đi bộ' },
  ],
};

/* ---------------- Danh sách phòng ----------------
 * Ảnh là ảnh thật của homestay (một số góc được cắt từ ảnh gốc — xem scripts/prepare-assets.mjs).
 * Tên phòng, sức chứa, giá là số liệu mẫu [CẦN XÁC NHẬN].
 */
export const rooms = [
  {
    id: 'pool-view',
    branch: 'phanthiet',
    name: 'Moon Pool View',
    type: 'Phòng đôi',
    group: 'double',
    guests: 2,
    bed: '1 giường đôi 1m8',
    area: '~25 m²',
    badge: 'Được đặt nhiều nhất',
    tags: ['View hồ bơi', 'Cửa vòm', 'Máy lạnh', 'WC riêng'],
    desc: 'Mở cửa vòm là thấy hồ bơi xanh ngọc. Góc ngồi cạnh khung kính ngập nắng, giường đôi lớn và tông be dịu — hợp cho cặp đôi muốn một ngày không vội.',
    priceShort: '299k',
    priceDay: '499k',
    priceNight: '699k',
    photos: ['/images/hero/arches-pool.jpg', '/images/rooms/pool-view-3.jpg', '/images/rooms/pool-view-2.jpg', '/images/gallery/pool-detail.jpg'],
    amenities: ['Giường 1m8 nệm êm', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao', 'Rèm chắn sáng', 'Khăn, dầu gội, sữa tắm', 'Nước suối & trà, cà phê', 'Tủ đồ & bàn trang điểm', 'Dùng chung hồ bơi, bếp, BBQ'],
  },
  {
    id: 'twin',
    branch: 'phanthiet',
    name: 'Moon Twin',
    type: 'Phòng 2 giường',
    group: 'twin',
    guests: 4,
    bed: '2 giường đôi 1m6',
    area: '~30 m²',
    badge: 'Nhóm bạn',
    tags: ['2 giường đôi', 'Decor mây tre', 'Máy lạnh', 'Bàn làm việc'],
    desc: 'Hai giường đôi êm ái, mảng tường mây tre thủ công và sàn terrazzo mát chân. Đủ rộng cho 4 người bạn thân, đủ xinh để chụp ảnh cả buổi.',
    priceShort: '349k',
    priceDay: '549k',
    priceNight: '799k',
    photos: ['/images/rooms/twin-1.jpg', '/images/rooms/twin-2.jpg', '/images/rooms/twin-3.jpg', '/images/gallery/rattan-decor.jpg'],
    amenities: ['2 giường đôi 1m6', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao', 'Bàn làm việc & gương tròn', 'Khăn, dầu gội, sữa tắm', 'Nước suối & trà, cà phê', 'Kệ treo đồ rộng', 'Dùng chung hồ bơi, bếp, BBQ'],
  },
  {
    id: 'family',
    branch: 'phanthiet',
    name: 'Moon Family',
    type: 'Phòng gia đình',
    group: 'family',
    guests: 6,
    bed: '2 giường đôi + nệm phụ',
    area: '~38 m²',
    badge: 'Gia đình',
    tags: ['4–6 khách', 'Cửa vòm ra hồ', 'Nệm phụ', 'Máy lạnh'],
    desc: 'Phòng rộng nhất của The Moon Phan Thiết: cửa vòm mở thẳng ra hồ bơi, 2 giường lớn kèm nệm phụ cho bé — cả nhà cùng ở, cùng nướng BBQ buổi tối.',
    priceShort: '449k',
    priceDay: '699k',
    priceNight: '999k',
    photos: ['/images/rooms/twin-2.jpg', '/images/rooms/arched-doors.jpg', '/images/gallery/pool-courtyard.jpg', '/images/gallery/bbq-table.jpg'],
    amenities: ['2 giường đôi + nệm phụ', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao', 'Ghế ngồi hiên trước phòng', 'Khăn, dầu gội, sữa tắm', 'Nước suối & trà, cà phê', 'Phù hợp trẻ nhỏ', 'Dùng chung hồ bơi, bếp, BBQ'],
  },
  {
    id: 'villa',
    branch: 'phanthiet',
    name: 'Nguyên căn The Moon',
    type: 'Villa 4 phòng ngủ',
    group: 'villa',
    guests: 12,
    bed: '4 phòng ngủ · 4 WC',
    area: 'Hồ bơi + sân BBQ riêng',
    badge: 'Riêng tư tuyệt đối',
    tags: ['Tối đa 12 khách', 'Hồ bơi riêng', 'BBQ', 'Bếp đầy đủ'],
    desc: 'Thuê trọn villa: 4 phòng ngủ, hồ bơi giữa sân chỉ của riêng nhóm bạn, bàn gỗ dài, bếp nướng và đèn dây lung linh. Hoàn hảo cho sinh nhật, kỷ niệm hay chuyến đi công ty nhỏ.',
    priceShort: '—',
    priceDay: 'Liên hệ',
    priceNight: '3.500k',
    photos: ['/images/gallery/pool-courtyard.jpg', '/images/banner/bbq-night.jpg', '/images/gallery/neon-pool.jpg', '/images/gallery/pool-chair.jpg'],
    amenities: ['4 phòng ngủ máy lạnh', '4 phòng tắm nước nóng', 'Hồ bơi riêng', 'Bếp nướng BBQ + than', 'Bếp đầy đủ: tủ lạnh, bếp từ, nồi chảo', 'Bàn gỗ dài 10–12 người', 'Loa, đèn trang trí', 'Sân đậu 2 ô tô'],
  },
  {
    id: 'muine-double',
    branch: 'muine',
    name: 'Moon Double Mũi Né',
    type: 'Phòng đôi',
    group: 'double',
    guests: 2,
    bed: '1 giường đôi 1m6',
    area: '~22 m²',
    badge: 'Gần biển',
    tags: ['300 m tới biển', 'Cửa vòm xanh', 'Máy lạnh', 'WC riêng'],
    desc: 'Phòng đôi trong căn nhà trắng kiểu Santorini. Sáng mở cửa là giàn hoa giấy, đi bộ 4 phút là chân đã chạm cát biển Hàm Tiến.',
    priceShort: '249k',
    priceDay: '399k',
    priceNight: '599k',
    photos: ['/images/branches/muine.jpg', '/images/rooms/twin-3.jpg', '/images/gallery/bougainvillea.jpg', '/images/rooms/twin-1.jpg'],
    amenities: ['Giường 1m6 nệm êm', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao', 'Khăn, dầu gội, sữa tắm', 'Nước suối & trà, cà phê', 'Sân vườn & phòng khách chung', 'Đậu xe trong sân', 'Hỗ trợ thuê xe máy'],
  },
  {
    id: 'muine-twin',
    branch: 'muine',
    name: 'Moon Twin Mũi Né',
    type: 'Phòng 2 giường',
    group: 'twin',
    guests: 4,
    bed: '2 giường đôi 1m6',
    area: '~28 m²',
    badge: 'Bạn bè',
    tags: ['2 giường', 'Gần biển', 'Máy lạnh', 'Sân vườn'],
    desc: 'Hai giường đôi, tông gỗ sáng và mây tre ấm áp. Nhóm 4 người đi biển về có chỗ tắm nước nóng, ngồi hiên uống trà và ngắm hoa giấy.',
    priceShort: '299k',
    priceDay: '449k',
    priceNight: '649k',
    photos: ['/images/rooms/twin-1.jpg', '/images/branches/muine.jpg', '/images/rooms/twin-2.jpg', '/images/gallery/bougainvillea.jpg'],
    amenities: ['2 giường đôi 1m6', 'Máy lạnh & nước nóng', 'Wifi tốc độ cao', 'Khăn, dầu gội, sữa tắm', 'Nước suối & trà, cà phê', 'Sân vườn & phòng khách chung', 'Đậu xe trong sân', 'Hỗ trợ thuê xe máy'],
  },
];
export const roomById = (id) => rooms.find((r) => r.id === id) || rooms[0];

/* ---------------- Bảng giá ---------------- [CẦN XÁC NHẬN] */
export const priceGroups = [
  { id: 'double', label: 'Phòng đôi' },
  { id: 'twin', label: 'Phòng 2 giường' },
  { id: 'family', label: 'Gia đình' },
];
export const pricingPackages = [
  { id: 'short', icon: 'sun', name: 'Nghỉ ngắn 3 giờ', timeframe: 'Từ lúc nhận phòng', prices: { double: '249k', twin: '299k', family: '399k' } },
  { id: 'day', icon: 'sun-high', name: 'Theo ngày 12 giờ', timeframe: '08:00 – 20:00', prices: { double: '399k', twin: '499k', family: '649k' } },
  { id: 'night', icon: 'moon', name: 'Qua đêm', timeframe: '14:00 → 12:00 hôm sau', prices: { double: '549k', twin: '699k', family: '899k' }, featured: true },
  { id: 'villa', icon: 'home', name: 'Nguyên căn Phan Thiết', timeframe: 'Villa 4 phòng · tối đa 12 khách', prices: { double: 'từ 3.500k', twin: '/ đêm', family: 'Liên hệ' }, villa: true },
];
export const priceNotes = [
  'Thêm giờ: +50k/giờ ngoài gói',
  'Thứ 6, Thứ 7 & lễ: +100k/đêm',
  'Thêm người: +100k/người · trẻ dưới 6 tuổi miễn phí',
  'Đã gồm nước suối, trà, cà phê · đặt trực tiếp luôn có giá tốt hơn',
];

/* ---------------- Tiện nghi & trải nghiệm ---------------- */
export const experiences = [
  { icon: 'pool', title: 'Hồ bơi riêng giữa sân', desc: 'Ngâm mình cả ngày không ai làm phiền', photo: '/images/gallery/pool-courtyard.jpg' },
  { icon: 'bbq', title: 'Tối BBQ dưới đèn vàng', desc: 'Bếp nướng, bàn gỗ dài, đèn dây', photo: '/images/gallery/bbq-table.jpg' },
  { icon: 'camera', title: 'Góc nào cũng lên hình', desc: 'Cửa vòm, hoa giấy, tường trắng', photo: '/images/gallery/bougainvillea.jpg' },
  { icon: 'sparkles', title: 'Phòng sạch thơm mỗi ngày', desc: 'Chăm chút từng chiếc gối', photo: '/images/rooms/twin-2.jpg' },
];
export const amenities = [
  { icon: 'pool', title: 'Hồ bơi ngoài trời', desc: 'Cơ sở Phan Thiết, mở 6:00 – 22:00' },
  { icon: 'bbq', title: 'Bếp nướng BBQ', desc: 'Than, vỉ, bàn tiệc — cho mượn miễn phí' },
  { icon: 'wifi', title: 'Wifi tốc độ cao', desc: 'Từng phòng, làm việc remote thoải mái' },
  { icon: 'ac', title: 'Máy lạnh & nước nóng', desc: '100% phòng có máy lạnh, máy nước nóng' },
  { icon: 'kitchen', title: 'Bếp đầy đủ', desc: 'Tủ lạnh, bếp từ, nồi chảo, chén đũa' },
  { icon: 'garden', title: 'Sân vườn & hiên ngồi', desc: 'Ghế mây, đèn vàng, cây xanh' },
  { icon: 'parking', title: 'Đậu xe miễn phí', desc: 'Ô tô & xe máy ngay trong sân' },
  { icon: 'beach', title: 'Gần biển', desc: 'Hàm Tiến ~300 m · Đồi Dương ~800 m' },
  { icon: 'bike', title: 'Thuê xe & tour', desc: 'Xe máy, jeep Bàu Trắng, Đồi cát bay' },
  { icon: 'key', title: 'Nhận phòng linh hoạt', desc: 'Hỗ trợ check-in sớm / trả muộn khi còn phòng' },
  { icon: 'laundry', title: 'Giặt ủi', desc: 'Giặt nhanh trong ngày' },
  { icon: 'clean', title: 'Dọn phòng mỗi ngày', desc: 'Khăn mới, ga mới, sạch thơm' },
];

/* ---------------- Thư viện ảnh ---------------- */
export const galleryImages = [
  { src: '/images/hero/arches-pool.jpg', alt: 'Cửa vòm nhìn ra hồ bơi — The Moon Phan Thiết', w: 2048, h: 1366, span: 'wide' },
  { src: '/images/branches/muine.jpg', alt: 'Mặt tiền trắng và giàn hoa giấy — The Moon Mũi Né', w: 1290, h: 964 },
  { src: '/images/banner/bbq-night.jpg', alt: 'Tiệc BBQ cạnh hồ bơi buổi tối', w: 2048, h: 1366 },
  { src: '/images/rooms/twin-1.jpg', alt: 'Phòng Twin với decor mây tre', w: 2048, h: 1366 },
  { src: '/images/gallery/pool-courtyard.jpg', alt: 'Sân hồ bơi với dãy cửa vòm', w: 2048, h: 1366, span: 'wide' },
  { src: '/images/gallery/pool-chair.jpg', alt: 'Ghế mây cam dưới đèn tường', w: 676, h: 788, span: 'tall' },
  { src: '/images/gallery/neon-pool.jpg', alt: 'Bảng neon The Moon Phan Thiết bên hồ', w: 1126, h: 936 },
  { src: '/images/gallery/rattan-decor.jpg', alt: 'Mảng tường mây tre thủ công', w: 676, h: 440 },
  { src: '/images/rooms/pool-view-2.jpg', alt: 'Góc ngồi cạnh cửa sổ vòm', w: 532, h: 994, span: 'tall' },
  { src: '/images/gallery/floaties.jpg', alt: 'Phao bơi màu sắc trên hồ', w: 1072, h: 420 },
  { src: '/images/gallery/bbq-table.jpg', alt: 'Bàn tiệc hải sản, trái cây', w: 1188, h: 588 },
  { src: '/images/about/poster-chill.jpg', alt: 'Chill vài hôm, để thấy lòng nhẹ hơn', w: 1402, h: 1122 },
];

/* ---------------- Đánh giá ---------------- [CẦN XÁC NHẬN — thay bằng review thật từ Google Maps / fanpage] */
export const testimonials = [
  {
    name: 'Thảo Vy',
    from: 'TP.HCM · cặp đôi',
    rating: 5,
    text: 'Phòng cửa vòm nhìn ra hồ bơi xinh y như hình. Tối hai đứa nướng BBQ dưới đèn vàng, sáng dậy bơi — đúng nghĩa chill vài hôm.',
  },
  {
    name: 'Nhóm Quang Huy',
    from: 'Đồng Nai · 10 người',
    rating: 5,
    text: 'Thuê nguyên căn Phan Thiết cho sinh nhật bạn. Hồ bơi riêng, bếp đầy đủ, chủ nhà hỗ trợ mua hải sản tận nơi. Quá đáng tiền!',
  },
  {
    name: 'Gia đình chị Hạnh',
    from: 'Hà Nội · 2 người lớn, 2 bé',
    rating: 5,
    text: 'Cơ sở Mũi Né đi bộ ra biển 4–5 phút, phòng sạch thơm, có sân cho bé chơi. Chủ nhà dễ thương, check-in sớm cũng được hỗ trợ.',
  },
];

/* ---------------- Banner tối ---------------- */
export const bannerData = {
  title: 'Có những buổi tối\nchỉ cần hồ bơi, bếp nướng\nvà người thương.',
  bullets: ['Một bữa BBQ dưới đèn vàng.', 'Một hồ bơi chỉ của riêng mình.', 'Một đêm ngủ ngon dưới trăng.'],
  script: 'Stay\na little longer ☾',
  ctaText: 'Đặt phòng ngay',
  image: '/images/banner/bbq-night.jpg',
};

/* ---------------- Liên hệ ---------------- */
export const contactData = {
  eyebrow: 'Liên hệ & đặt phòng',
  title: 'Nhắn một tin, có ngay phòng',
  desc: 'Gọi, Zalo hoặc để lại yêu cầu — tụi mình xác nhận phòng trống trong vài phút. Không cần cọc với booking ngày thường dưới 2 đêm.',
  promises: ['Giữ phòng miễn phí 2 giờ', 'Hủy miễn phí trước 3 ngày', 'Hỗ trợ đưa đón, thuê xe máy'],
};

/* ---------------- Chính sách chung (hiện trong popup chi tiết phòng) ---------------- */
export const roomPolicies = [
  `Nhận phòng ${siteConfig.checkin} · trả phòng ${siteConfig.checkout}`,
  'Thêm người: +100k/người · trẻ dưới 6 tuổi miễn phí',
  'Hủy miễn phí trước 3 ngày nhận phòng',
  'Không hút thuốc trong phòng · thú cưng vui lòng báo trước',
];
