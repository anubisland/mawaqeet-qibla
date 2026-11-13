window.WORLD_CITIES = [
  // Egypt
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', countryAr: 'مصر', countryEn: 'Egypt', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria', countryAr: 'مصر', countryEn: 'Egypt', lat: 31.2001, lng: 29.9187, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza', countryAr: 'مصر', countryEn: 'Egypt', lat: 30.0131, lng: 31.2089, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor', countryAr: 'مصر', countryEn: 'Egypt', lat: 25.6872, lng: 32.6396, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan', countryAr: 'مصر', countryEn: 'Egypt', lat: 24.0889, lng: 32.8998, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'mansoura', nameAr: 'المنصورة', nameEn: 'Mansoura', countryAr: 'مصر', countryEn: 'Egypt', lat: 31.0409, lng: 31.3785, tz: 'Africa/Cairo', method: 'EGYPT' },
  { id: 'sharm', nameAr: 'شرم الشيخ', nameEn: 'Sharm El Sheikh', countryAr: 'مصر', countryEn: 'Egypt', lat: 27.9158, lng: 34.3300, tz: 'Africa/Cairo', method: 'EGYPT' },

  // Saudi Arabia
  { id: 'makkah', nameAr: 'مكة المكرمة', nameEn: 'Makkah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, tz: 'Asia/Riyadh', method: 'MAKKAH' },
  { id: 'madinah', nameAr: 'المدينة المنورة', nameEn: 'Madinah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', lat: 24.4672, lng: 39.6111, tz: 'Asia/Riyadh', method: 'MAKKAH' },
  { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', countryAr: 'السعودية', countryEn: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, tz: 'Asia/Riyadh', method: 'MAKKAH' },
  { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', countryAr: 'السعودية', countryEn: 'Saudi Arabia', lat: 21.4858, lng: 39.1925, tz: 'Asia/Riyadh', method: 'MAKKAH' },
  { id: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam', countryAr: 'السعودية', countryEn: 'Saudi Arabia', lat: 26.4207, lng: 50.0888, tz: 'Asia/Riyadh', method: 'MAKKAH' },

  // Gulf & Levant & Iraq
  { id: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', countryAr: 'الإمارات', countryEn: 'UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai', method: 'DUBAI' },
  { id: 'abudhabi', nameAr: 'أبو ظبي', nameEn: 'Abu Dhabi', countryAr: 'الإمارات', countryEn: 'UAE', lat: 24.4539, lng: 54.3773, tz: 'Asia/Dubai', method: 'DUBAI' },
  { id: 'doha', nameAr: 'الدوحة', nameEn: 'Doha', countryAr: 'قطر', countryEn: 'Qatar', lat: 25.2854, lng: 51.5310, tz: 'Asia/Qatar', method: 'QATAR' },
  { id: 'kuwait', nameAr: 'الكويت', nameEn: 'Kuwait City', countryAr: 'الكويت', countryEn: 'Kuwait', lat: 29.3759, lng: 47.9774, tz: 'Asia/Kuwait', method: 'KUWAIT' },
  { id: 'manama', nameAr: 'المنامة', nameEn: 'Manama', countryAr: 'البحرين', countryEn: 'Bahrain', lat: 26.2285, lng: 50.5860, tz: 'Asia/Bahrain', method: 'MAKKAH' },
  { id: 'muscat', nameAr: 'مسقط', nameEn: 'Muscat', countryAr: 'عُمان', countryEn: 'Oman', lat: 23.5880, lng: 58.3829, tz: 'Asia/Muscat', method: 'MAKKAH' },
  { id: 'amman', nameAr: 'عمّان', nameEn: 'Amman', countryAr: 'الأردن', countryEn: 'Jordan', lat: 31.9454, lng: 35.9284, tz: 'Asia/Amman', method: 'MWL' },
  { id: 'jerusalem', nameAr: 'القدس', nameEn: 'Jerusalem', countryAr: 'فلسطين', countryEn: 'Palestine', lat: 31.7683, lng: 35.2137, tz: 'Asia/Jerusalem', method: 'MWL' },
  { id: 'beirut', nameAr: 'بيروت', nameEn: 'Beirut', countryAr: 'لبنان', countryEn: 'Lebanon', lat: 33.8938, lng: 35.5018, tz: 'Asia/Beirut', method: 'EGYPT' },
  { id: 'damascus', nameAr: 'دمشق', nameEn: 'Damascus', countryAr: 'سوريا', countryEn: 'Syria', lat: 33.5138, lng: 36.2765, tz: 'Asia/Damascus', method: 'EGYPT' },
  { id: 'baghdad', nameAr: 'بغداد', nameEn: 'Baghdad', countryAr: 'العراق', countryEn: 'Iraq', lat: 33.3152, lng: 44.3661, tz: 'Asia/Baghdad', method: 'EGYPT' },
  { id: 'sanaa', nameAr: 'صنعاء', nameEn: 'Sanaa', countryAr: 'اليمن', countryEn: 'Yemen', lat: 15.3694, lng: 44.1910, tz: 'Asia/Aden', method: 'MAKKAH' },

  // North Africa & Sudan
  { id: 'casablanca', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', countryAr: 'المغرب', countryEn: 'Morocco', lat: 33.5731, lng: -7.5898, tz: 'Africa/Casablanca', method: 'MWL' },
  { id: 'rabat', nameAr: 'الرباط', nameEn: 'Rabat', countryAr: 'المغرب', countryEn: 'Morocco', lat: 34.0209, lng: -6.8416, tz: 'Africa/Casablanca', method: 'MWL' },
  { id: 'algiers', nameAr: 'الجزائر', nameEn: 'Algiers', countryAr: 'الجزائر', countryEn: 'Algeria', lat: 36.7538, lng: 3.0588, tz: 'Africa/Algiers', method: 'MWL' },
  { id: 'tunis', nameAr: 'تونس', nameEn: 'Tunis', countryAr: 'تونس', countryEn: 'Tunisia', lat: 36.8065, lng: 10.1815, tz: 'Africa/Tunis', method: 'MWL' },
  { id: 'tripoli', nameAr: 'طرابلس', nameEn: 'Tripoli', countryAr: 'ليبيا', countryEn: 'Libya', lat: 32.8872, lng: 13.1913, tz: 'Africa/Tripoli', method: 'EGYPT' },
  { id: 'khartoum', nameAr: 'الخرطوم', nameEn: 'Khartoum', countryAr: 'السودان', countryEn: 'Sudan', lat: 15.5007, lng: 32.5599, tz: 'Africa/Khartoum', method: 'EGYPT' },

  // Turkey & Asia
  { id: 'istanbul', nameAr: 'إسطنبول', nameEn: 'Istanbul', countryAr: 'تركيا', countryEn: 'Turkey', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul', method: 'TURKEY' },
  { id: 'ankara', nameAr: 'أنقرة', nameEn: 'Ankara', countryAr: 'تركيا', countryEn: 'Turkey', lat: 39.9334, lng: 32.8597, tz: 'Europe/Istanbul', method: 'TURKEY' },
  { id: 'kualalumpur', nameAr: 'كوالالمبور', nameEn: 'Kuala Lumpur', countryAr: 'ماليزيا', countryEn: 'Malaysia', lat: 3.1390, lng: 101.6869, tz: 'Asia/Kuala_Lumpur', method: 'SINGAPORE' },
  { id: 'jakarta', nameAr: 'جاكرتا', nameEn: 'Jakarta', countryAr: 'إندونيسيا', countryEn: 'Indonesia', lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta', method: 'SINGAPORE' },
  { id: 'singapore', nameAr: 'سنغافورة', nameEn: 'Singapore', countryAr: 'سنغافورة', countryEn: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore', method: 'SINGAPORE' },
  { id: 'karachi', nameAr: 'كراتشي', nameEn: 'Karachi', countryAr: 'باكستان', countryEn: 'Pakistan', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi', method: 'KARACHI' },
  { id: 'lahore', nameAr: 'لاهور', nameEn: 'Lahore', countryAr: 'باكستان', countryEn: 'Pakistan', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi', method: 'KARACHI' },
  { id: 'islamabad', nameAr: 'إسلام آباد', nameEn: 'Islamabad', countryAr: 'باكستان', countryEn: 'Pakistan', lat: 33.6844, lng: 73.0479, tz: 'Asia/Karachi', method: 'KARACHI' },
  { id: 'delhi', nameAr: 'نيودلهي', nameEn: 'New Delhi', countryAr: 'الهند', countryEn: 'India', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata', method: 'KARACHI' },
  { id: 'mumbai', nameAr: 'مومباي', nameEn: 'Mumbai', countryAr: 'الهند', countryEn: 'India', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata', method: 'KARACHI' },
  { id: 'dhaka', nameAr: 'دكا', nameEn: 'Dhaka', countryAr: 'بنغلاديش', countryEn: 'Bangladesh', lat: 23.8103, lng: 90.4125, tz: 'Asia/Dhaka', method: 'KARACHI' },
  { id: 'tokyo', nameAr: 'طوكيو', nameEn: 'Tokyo', countryAr: 'اليابان', countryEn: 'Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo', method: 'MWL' },
  { id: 'seoul', nameAr: 'سول', nameEn: 'Seoul', countryAr: 'كوريا الجنوبية', countryEn: 'South Korea', lat: 37.5665, lng: 126.9780, tz: 'Asia/Seoul', method: 'MWL' },
  { id: 'beijing', nameAr: 'بكين', nameEn: 'Beijing', countryAr: 'الصين', countryEn: 'China', lat: 39.9042, lng: 116.4074, tz: 'Asia/Shanghai', method: 'MWL' },
  { id: 'bangkok', nameAr: 'بانكوك', nameEn: 'Bangkok', countryAr: 'تايلاند', countryEn: 'Thailand', lat: 13.7563, lng: 100.5018, tz: 'Asia/Bangkok', method: 'SINGAPORE' },

  // Europe
  { id: 'london', nameAr: 'لندن', nameEn: 'London', countryAr: 'المملكة المتحدة', countryEn: 'UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London', method: 'MWL' },
  { id: 'paris', nameAr: 'باريس', nameEn: 'Paris', countryAr: 'فرنسا', countryEn: 'France', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris', method: 'MWL' },
  { id: 'berlin', nameAr: 'برلين', nameEn: 'Berlin', countryAr: 'ألمانيا', countryEn: 'Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin', method: 'MWL' },
  { id: 'frankfurt', nameAr: 'فرانكفورت', nameEn: 'Frankfurt', countryAr: 'ألمانيا', countryEn: 'Germany', lat: 50.1109, lng: 8.6821, tz: 'Europe/Berlin', method: 'MWL' },
  { id: 'amsterdam', nameAr: 'أمستردام', nameEn: 'Amsterdam', countryAr: 'هولندا', countryEn: 'Netherlands', lat: 52.3676, lng: 4.9041, tz: 'Europe/Amsterdam', method: 'MWL' },
  { id: 'brussels', nameAr: 'بروكسل', nameEn: 'Brussels', countryAr: 'بلجيكا', countryEn: 'Belgium', lat: 50.8503, lng: 4.3517, tz: 'Europe/Brussels', method: 'MWL' },
  { id: 'madrid', nameAr: 'مدريد', nameEn: 'Madrid', countryAr: 'إسبانيا', countryEn: 'Spain', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid', method: 'MWL' },
  { id: 'rome', nameAr: 'روما', nameEn: 'Rome', countryAr: 'إيطاليا', countryEn: 'Italy', lat: 41.9028, lng: 12.4964, tz: 'Europe/Rome', method: 'MWL' },
  { id: 'vienna', nameAr: 'فيينا', nameEn: 'Vienna', countryAr: 'النمسا', countryEn: 'Austria', lat: 48.2082, lng: 16.3738, tz: 'Europe/Vienna', method: 'MWL' },
  { id: 'zurich', nameAr: 'زيورخ', nameEn: 'Zurich', countryAr: 'سويسرا', countryEn: 'Switzerland', lat: 47.3769, lng: 8.5417, tz: 'Europe/Zurich', method: 'MWL' },
  { id: 'stockholm', nameAr: 'ستوكهولم', nameEn: 'Stockholm', countryAr: 'السويد', countryEn: 'Sweden', lat: 59.3293, lng: 18.0686, tz: 'Europe/Stockholm', method: 'MWL' },
  { id: 'oslo', nameAr: 'أوسلو', nameEn: 'Oslo', countryAr: 'النرويج', countryEn: 'Norway', lat: 59.9139, lng: 10.7522, tz: 'Europe/Oslo', method: 'MWL' },
  { id: 'moscow', nameAr: 'موسكو', nameEn: 'Moscow', countryAr: 'روسيا', countryEn: 'Russia', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow', method: 'MWL' },

  // Americas
  { id: 'santaclara', nameAr: 'سانتا كلارا، كاليفورنيا', nameEn: 'Santa Clara, CA', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 37.3541, lng: -121.9552, tz: 'America/Los_Angeles', method: 'ISNA' },
  { id: 'newyork', nameAr: 'نيويورك', nameEn: 'New York', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York', method: 'ISNA' },
  { id: 'losangeles', nameAr: 'لوس أنجلوس', nameEn: 'Los Angeles', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles', method: 'ISNA' },
  { id: 'chicago', nameAr: 'شيكاغو', nameEn: 'Chicago', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 41.8781, lng: -87.6298, tz: 'America/Chicago', method: 'ISNA' },
  { id: 'houston', nameAr: 'هيوستن', nameEn: 'Houston', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 29.7604, lng: -95.3698, tz: 'America/Chicago', method: 'ISNA' },
  { id: 'washington', nameAr: 'واشنطن', nameEn: 'Washington DC', countryAr: 'الولايات المتحدة', countryEn: 'USA', lat: 38.9072, lng: -77.0369, tz: 'America/New_York', method: 'ISNA' },
  { id: 'toronto', nameAr: 'تورونتو', nameEn: 'Toronto', countryAr: 'كندا', countryEn: 'Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto', method: 'ISNA' },
  { id: 'montreal', nameAr: 'مونتريال', nameEn: 'Montreal', countryAr: 'كندا', countryEn: 'Canada', lat: 45.5017, lng: -73.5673, tz: 'America/Toronto', method: 'ISNA' },
  { id: 'vancouver', nameAr: 'فانكوفر', nameEn: 'Vancouver', countryAr: 'كندا', countryEn: 'Canada', lat: 49.2827, lng: -123.1207, tz: 'America/Vancouver', method: 'ISNA' },
  { id: 'saopaulo', nameAr: 'ساو باولو', nameEn: 'São Paulo', countryAr: 'البرازيل', countryEn: 'Brazil', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo', method: 'MWL' },
  { id: 'buenosaires', nameAr: 'بوينس آيرس', nameEn: 'Buenos Aires', countryAr: 'الأرجنتين', countryEn: 'Argentina', lat: -34.6037, lng: -58.3816, tz: 'America/Argentina/Buenos_Aires', method: 'MWL' },

  // Africa & Oceania
  { id: 'lagos', nameAr: 'لاغوس', nameEn: 'Lagos', countryAr: 'نيجيريا', countryEn: 'Nigeria', lat: 6.5244, lng: 3.3792, tz: 'Africa/Lagos', method: 'EGYPT' },
  { id: 'nairobi', nameAr: 'نيروبي', nameEn: 'Nairobi', countryAr: 'كينيا', countryEn: 'Kenya', lat: -1.2921, lng: 36.8219, tz: 'Africa/Nairobi', method: 'EGYPT' },
  { id: 'johannesburg', nameAr: 'جوهانسبرغ', nameEn: 'Johannesburg', countryAr: 'جنوب أفريقيا', countryEn: 'South Africa', lat: -26.2041, lng: 28.0473, tz: 'Africa/Johannesburg', method: 'MWL' },
  { id: 'sydney', nameAr: 'سيدني', nameEn: 'Sydney', countryAr: 'أستراليا', countryEn: 'Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney', method: 'MWL' },
  { id: 'melbourne', nameAr: 'ملبورن', nameEn: 'Melbourne', countryAr: 'أستراليا', countryEn: 'Australia', lat: -37.8136, lng: 144.9631, tz: 'Australia/Melbourne', method: 'MWL' },
  { id: 'auckland', nameAr: 'أوكلاند', nameEn: 'Auckland', countryAr: 'نيوزيلندا', countryEn: 'New Zealand', lat: -36.8485, lng: 174.7633, tz: 'Pacific/Auckland', method: 'MWL' }
];
