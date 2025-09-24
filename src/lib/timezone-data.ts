export interface TradeTimezone {
  id: number
  region: string
  name: string
  city: string
  flag: string
  timezone: string // IANA Time Zone Database name
  utcOffset: string // Note: This is the standard offset, the library will handle DST.
  businessHours: { start: number; end: number }
}

export const REGION_LABELS = {
  asia: '亚洲',
  europe: '欧洲',
  north_america: '北美洲',
  south_america: '南美洲',
  africa: '非洲',
  oceania: '大洋洲',
}

export const TRADE_TIMEZONES: TradeTimezone[] = [
  // --- 亚洲 (Asia) ---
  { id: 1, region: 'asia', name: '中国', city: '北京/上海', flag: '🇨🇳', timezone: 'Asia/Shanghai', utcOffset: '+08:00', businessHours: { start: 9, end: 18 } },
  { id: 2, region: 'asia', name: '日本', city: '东京', flag: '🇯🇵', timezone: 'Asia/Tokyo', utcOffset: '+09:00', businessHours: { start: 9, end: 18 } },
  { id: 3, region: 'asia', name: '韩国', city: '首尔', flag: '🇰🇷', timezone: 'Asia/Seoul', utcOffset: '+09:00', businessHours: { start: 9, end: 18 } },
  { id: 4, region: 'asia', name: '印度', city: '新德里', flag: '🇮🇳', timezone: 'Asia/Kolkata', utcOffset: '+05:30', businessHours: { start: 10, end: 19 } },
  { id: 5, region: 'asia', name: '新加坡', city: '新加坡', flag: '🇸🇬', timezone: 'Asia/Singapore', utcOffset: '+08:00', businessHours: { start: 9, end: 18 } },
  { id: 6, region: 'asia', name: '越南', city: '胡志明市', flag: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', utcOffset: '+07:00', businessHours: { start: 8, end: 17 } },
  { id: 7, region: 'asia', name: '泰国', city: '曼谷', flag: '🇹🇭', timezone: 'Asia/Bangkok', utcOffset: '+07:00', businessHours: { start: 9, end: 18 } },
  { id: 8, region: 'asia', name: '马来西亚', city: '吉隆坡', flag: '🇲🇾', timezone: 'Asia/Kuala_Lumpur', utcOffset: '+08:00', businessHours: { start: 9, end: 18 } },
  { id: 9, region: 'asia', name: '印度尼西亚', city: '雅加达', flag: '🇮🇩', timezone: 'Asia/Jakarta', utcOffset: '+07:00', businessHours: { start: 9, end: 17 } },
  { id: 10, region: 'asia', name: '菲律宾', city: '马尼拉', flag: '🇵🇭', timezone: 'Asia/Manila', utcOffset: '+08:00', businessHours: { start: 9, end: 18 } },
  { id: 11, region: 'asia', name: '阿联酋', city: '迪拜', flag: '🇦🇪', timezone: 'Asia/Dubai', utcOffset: '+04:00', businessHours: { start: 9, end: 18 } },
  { id: 12, region: 'asia', name: '沙特阿拉伯', city: '利雅得', flag: '🇸🇦', timezone: 'Asia/Riyadh', utcOffset: '+03:00', businessHours: { start: 9, end: 17 } },
  { id: 13, region: 'asia', name: '土耳其', city: '伊斯坦布尔', flag: '🇹🇷', timezone: 'Europe/Istanbul', utcOffset: '+03:00', businessHours: { start: 9, end: 18 } },
  { id: 14, region: 'asia', name: '以色列', city: '特拉维夫', flag: '🇮🇱', timezone: 'Asia/Tel_Aviv', utcOffset: '+03:00', businessHours: { start: 9, end: 18 } },

  // --- 欧洲 (Europe) ---
  { id: 15, region: 'europe', name: '英国', city: '伦敦', flag: '🇬🇧', timezone: 'Europe/London', utcOffset: '+01:00', businessHours: { start: 9, end: 17 } },
  { id: 16, region: 'europe', name: '德国', city: '柏林', flag: '🇩🇪', timezone: 'Europe/Berlin', utcOffset: '+02:00', businessHours: { start: 8, end: 17 } },
  { id: 17, region: 'europe', name: '法国', city: '巴黎', flag: '🇫🇷', timezone: 'Europe/Paris', utcOffset: '+02:00', businessHours: { start: 9, end: 18 } },
  { id: 18, region: 'europe', name: '俄罗斯', city: '莫斯科', flag: '🇷🇺', timezone: 'Europe/Moscow', utcOffset: '+03:00', businessHours: { start: 9, end: 18 } },
  { id: 19, region: 'europe', name: '意大利', city: '罗马', flag: '🇮🇹', timezone: 'Europe/Rome', utcOffset: '+02:00', businessHours: { start: 9, end: 18 } },
  { id: 20, region: 'europe', name: '西班牙', city: '马德里', flag: '🇪🇸', timezone: 'Europe/Madrid', utcOffset: '+02:00', businessHours: { start: 9, end: 18 } },
  { id: 21, region: 'europe', name: '荷兰', city: '阿姆斯特丹', flag: '🇳🇱', timezone: 'Europe/Amsterdam', utcOffset: '+02:00', businessHours: { start: 9, end: 17 } },
  { id: 22, region: 'europe', name: '瑞士', city: '苏黎世', flag: '🇨🇭', timezone: 'Europe/Zurich', utcOffset: '+02:00', businessHours: { start: 8, end: 17 } },
  { id: 23, region: 'europe', name: '瑞典', city: '斯德哥尔摩', flag: '🇸🇪', timezone: 'Europe/Stockholm', utcOffset: '+02:00', businessHours: { start: 8, end: 17 } },
  { id: 24, region: 'europe', name: '波兰', city: '华沙', flag: '🇵🇱', timezone: 'Europe/Warsaw', utcOffset: '+02:00', businessHours: { start: 8, end: 16 } },

  // --- 北美洲 (North America) ---
  { id: 25, region: 'north_america', name: '美国 (东部)', city: '纽约', flag: '🇺🇸', timezone: 'America/New_York', utcOffset: '-04:00', businessHours: { start: 9, end: 17 } },
  { id: 26, region: 'north_america', name: '美国 (中部)', city: '芝加哥', flag: '🇺🇸', timezone: 'America/Chicago', utcOffset: '-05:00', businessHours: { start: 9, end: 17 } },
  { id: 27, region: 'north_america', name: '美国 (西部)', city: '洛杉矶', flag: '🇺🇸', timezone: 'America/Los_Angeles', utcOffset: '-07:00', businessHours: { start: 9, end: 17 } },
  { id: 28, region: 'north_america', name: '加拿大 (东部)', city: '多伦多', flag: '🇨🇦', timezone: 'America/Toronto', utcOffset: '-04:00', businessHours: { start: 9, end: 17 } },
  { id: 29, region: 'north_america', name: '加拿大 (西部)', city: '温哥华', flag: '🇨🇦', timezone: 'America/Vancouver', utcOffset: '-07:00', businessHours: { start: 9, end: 17 } },
  { id: 30, region: 'north_america', name: '墨西哥', city: '墨西哥城', flag: '🇲🇽', timezone: 'America/Mexico_City', utcOffset: '-06:00', businessHours: { start: 9, end: 18 } },

  // --- 南美洲 (South America) ---
  { id: 31, region: 'south_america', name: '巴西', city: '圣保罗', flag: '🇧🇷', timezone: 'America/Sao_Paulo', utcOffset: '-03:00', businessHours: { start: 9, end: 18 } },
  { id: 32, region: 'south_america', name: '阿根廷', city: '布宜诺斯艾利斯', flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires', utcOffset: '-03:00', businessHours: { start: 9, end: 18 } },
  { id: 33, region: 'south_america', name: '哥伦比亚', city: '波哥大', flag: '🇨🇴', timezone: 'America/Bogota', utcOffset: '-05:00', businessHours: { start: 8, end: 17 } },
  { id: 34, region: 'south_america', name: '智利', city: '圣地亚哥', flag: '🇨🇱', timezone: 'America/Santiago', utcOffset: '-03:00', businessHours: { start: 9, end: 18 } },
  { id: 35, region: 'south_america', name: '秘鲁', city: '利马', flag: '🇵🇪', timezone: 'America/Lima', utcOffset: '-05:00', businessHours: { start: 9, end: 18 } },

  // --- 非洲 (Africa) ---
  { id: 36, region: 'africa', name: '南非', city: '约翰内斯堡', flag: '🇿🇦', timezone: 'Africa/Johannesburg', utcOffset: '+02:00', businessHours: { start: 8, end: 17 } },
  { id: 37, region: 'africa', name: '尼日利亚', city: '拉各斯', flag: '🇳🇬', timezone: 'Africa/Lagos', utcOffset: '+01:00', businessHours: { start: 8, end: 17 } },
  { id: 38, region: 'africa', name: '埃及', city: '开罗', flag: '🇪🇬', timezone: 'Africa/Cairo', utcOffset: '+02:00', businessHours: { start: 9, end: 17 } },
  { id: 39, region: 'africa', name: '肯尼亚', city: '内罗毕', flag: '🇰🇪', timezone: 'Africa/Nairobi', utcOffset: '+03:00', businessHours: { start: 8, end: 17 } },

  // --- 大洋洲 (Oceania) ---
  { id: 40, region: 'oceania', name: '澳大利亚 (东部)', city: '悉尼', flag: '🇦🇺', timezone: 'Australia/Sydney', utcOffset: '+11:00', businessHours: { start: 9, end: 17 } },
  { id: 41, region: 'oceania', name: '澳大利亚 (西部)', city: '珀斯', flag: '🇦🇺', timezone: 'Australia/Perth', utcOffset: '+08:00', businessHours: { start: 9, end: 17 } },
  { id: 42, region: 'oceania', name: '新西兰', city: '奥克兰', flag: '🇳🇿', timezone: 'Pacific/Auckland', utcOffset: '+13:00', businessHours: { start: 9, end: 17 } },
];

export const getAllRegions = () => Object.keys(REGION_LABELS);