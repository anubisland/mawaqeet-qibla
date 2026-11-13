(function (global) {
  'use strict';

  const DTR = Math.PI / 180;
  const RTD = 180 / Math.PI;

  const METHODS = {
    EGYPT: {
      id: 'EGYPT',
      nameAr: 'الهيئة المصرية العامة للمساحة',
      nameEn: 'Egyptian General Authority of Survey',
      fajr: 19.5,
      isha: 17.5,
      maghribMin: 0
    },
    MAKKAH: {
      id: 'MAKKAH',
      nameAr: 'جامعة أم القرى — مكة المكرمة',
      nameEn: 'Umm al-Qura University, Makkah',
      fajr: 18.5,
      ishaMin: 90
    },
    MWL: {
      id: 'MWL',
      nameAr: 'رابطة العالم الإسلامي',
      nameEn: 'Muslim World League (MWL)',
      fajr: 18,
      isha: 17
    },
    ISNA: {
      id: 'ISNA',
      nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
      nameEn: 'Islamic Society of North America (ISNA)',
      fajr: 15,
      isha: 15
    },
    KARACHI: {
      id: 'KARACHI',
      nameAr: 'جامعة العلوم الإسلامية — كراتشي',
      nameEn: 'University of Islamic Sciences, Karachi',
      fajr: 18,
      isha: 18
    },
    DUBAI: {
      id: 'DUBAI',
      nameAr: 'دائرة الشؤون الإسلامية — دبي / الإمارات',
      nameEn: 'Dubai / UAE Islamic Affairs',
      fajr: 18.2,
      isha: 18.2
    },
    KUWAIT: {
      id: 'KUWAIT',
      nameAr: 'وزارة الأوقاف — الكويت',
      nameEn: 'Kuwait Ministry of Awqaf',
      fajr: 18,
      isha: 17.5
    },
    QATAR: {
      id: 'QATAR',
      nameAr: 'التقويم القطري',
      nameEn: 'Qatar Calendar House',
      fajr: 18,
      ishaMin: 90
    },
    SINGAPORE: {
      id: 'SINGAPORE',
      nameAr: 'المجلس الإسلامي — سنغافورة وماليزيا',
      nameEn: 'MUIS Singapore / JAKIM Malaysia',
      fajr: 20,
      isha: 18
    },
    TURKEY: {
      id: 'TURKEY',
      nameAr: 'رئاسة الشؤون الدينية — تركيا (ديانت)',
      nameEn: 'Diyanet İşleri Başkanlığı, Turkey',
      fajr: 18,
      isha: 17
    }
  };

  function fixAngle(a) {
    a = a - 360 * Math.floor(a / 360);
    return a < 0 ? a + 360 : a;
  }

  function fixHour(h) {
    h = h - 24 * Math.floor(h / 24);
    return h < 0 ? h + 24 : h;
  }

  function dsin(d) { return Math.sin(d * DTR); }
  function dcos(d) { return Math.cos(d * DTR); }
  function dtan(d) { return Math.tan(d * DTR); }
  function darcsin(x) { return RTD * Math.asin(Math.max(-1, Math.min(1, x))); }
  function darccos(x) { return RTD * Math.acos(Math.max(-1, Math.min(1, x))); }
  function darctan2(y, x) { return RTD * Math.atan2(y, x); }
  function darccot(x) { return RTD * Math.atan(1 / x); }

  function julianDate(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fixAngle(357.529 + 0.98560028 * D);
    const q = fixAngle(280.459 + 0.98564736 * D);
    const L = fixAngle(q + 1.915 * dsin(g) + 0.020 * dsin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
    const eqTime = q / 15 - fixHour(RA);
    const decl = darcsin(dsin(e) * dsin(L));
    return { decl, eqTime };
  }

  function sunAngleTime(jd, lat, angle, ccw) {
    const { decl, eqTime } = sunPosition(jd);
    const noon = fixHour(12 - eqTime);
    const cosT = (-dsin(angle) - dsin(lat) * dsin(decl)) / (dcos(lat) * dcos(decl));
    if (cosT < -1 || cosT > 1) return NaN;
    const t = darccos(cosT) / 15;
    return noon + (ccw ? -t : t);
  }

  function midDay(jd) {
    const { eqTime } = sunPosition(jd);
    return fixHour(12 - eqTime);
  }

  function asrTime(jd, lat, factor) {
    const { decl, eqTime } = sunPosition(jd);
    const noon = fixHour(12 - eqTime);
    const angle = -darccot(factor + dtan(Math.abs(lat - decl)));
    const cosT = (-dsin(angle) - dsin(lat) * dsin(decl)) / (dcos(lat) * dcos(decl));
    if (cosT < -1 || cosT > 1) return NaN;
    return noon + darccos(cosT) / 15;
  }

  function timeDiff(t1, t2) {
    return fixHour(t2 - t1);
  }

  function getTzOffsetHours(date, tz) {
    if (typeof tz === 'number') return tz;
    try {
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
      return (tzDate.getTime() - utcDate.getTime()) / 3600000;
    } catch {
      return -date.getTimezoneOffset() / 60;
    }
  }

  function calculatePrayerTimes(date, coords, options) {
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);
    const method = METHODS[options.method] || METHODS.EGYPT;
    const asrFactor = options.asrSchool === 'HANAFI' ? 2 : 1;
    const highLatMode = options.highLat || 'ANGLE';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const tzOffset = getTzOffsetHours(date, coords.tz);

    const jdBase = julianDate(year, month, day) - lng / (15 * 24);

    // Default initial hours
    let fajr = sunAngleTime(jdBase + 5 / 24, lat, method.fajr, true);
    let sunrise = sunAngleTime(jdBase + 6 / 24, lat, 0.833, true);
    let dhuhr = midDay(jdBase + 12 / 24);
    let asr = asrTime(jdBase + 13 / 24, lat, asrFactor);
    let maghrib = sunAngleTime(jdBase + 18 / 24, lat, 0.833, false);
    let isha = method.ishaMin
      ? maghrib + method.ishaMin / 60
      : sunAngleTime(jdBase + 19 / 24, lat, method.isha, false);

    // Convert from solar time to local standard time
    const adj = tzOffset - lng / 15;
    fajr += adj;
    sunrise += adj;
    dhuhr += adj;
    asr += adj;
    maghrib += adj;
    isha += adj;

    // High-latitude adjustment if Fajr/Isha are NaN or abnormal
    if (!isNaN(sunrise) && !isNaN(maghrib) && highLatMode !== 'NONE') {
      const nightTime = timeDiff(maghrib, sunrise);
      const portion = (angle) => {
        if (highLatMode === 'MIDNIGHT') return 0.5 * nightTime;
        if (highLatMode === 'SEVENTH') return (1 / 7) * nightTime;
        return (angle / 60) * nightTime; // ANGLE
      };

      const fajrDiff = portion(method.fajr);
      if (isNaN(fajr) || timeDiff(fajr, sunrise) > fajrDiff) {
        fajr = sunrise - fajrDiff;
      }

      if (!method.ishaMin) {
        const ishaDiff = portion(method.isha);
        if (isNaN(isha) || timeDiff(maghrib, isha) > ishaDiff) {
          isha = maghrib + ishaDiff;
        }
      }
    }

    fajr = fixHour(fajr);
    sunrise = fixHour(sunrise);
    dhuhr = fixHour(dhuhr);
    asr = fixHour(asr);
    maghrib = fixHour(maghrib);
    isha = fixHour(isha);

    // Night calculations (Maghrib -> Fajr)
    const nightDuration = timeDiff(maghrib, fajr);
    const midnight = fixHour(maghrib + nightDuration / 2);
    const lastThird = fixHour(maghrib + (nightDuration * 2) / 3);

    return {
      fajr,
      sunrise,
      dhuhr,
      asr,
      maghrib,
      isha,
      midnight,
      lastThird,
      tzOffset,
      method
    };
  }

  function formatTime(hours, use24h, lang) {
    if (isNaN(hours)) return '--:--';
    const totalMinutes = Math.round(fixHour(hours) * 60) % (24 * 60);
    const h24 = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const mStr = String(m).padStart(2, '0');
    if (use24h) {
      return `${String(h24).padStart(2, '0')}:${mStr}`;
    }
    const isPm = h24 >= 12;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const suffix = lang === 'ar' ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
    return `${h12}:${mStr} ${suffix}`;
  }

  function getSunAzimuth(date, lat, lng) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const { decl, eqTime } = sunPosition(jd);
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const solarTime = utcHours + lng / 15 + eqTime;
    const hourAngle = (solarTime - 12) * 15;

    const altitude = darcsin(dsin(lat) * dsin(decl) + dcos(lat) * dcos(decl) * dcos(hourAngle));
    const y = -dcos(decl) * dsin(hourAngle);
    const x = dsin(decl) * dcos(lat) - dcos(decl) * dsin(lat) * dcos(hourAngle);
    const azimuth = fixAngle(darctan2(y, x));
    return { azimuth, altitude };
  }

  function getHijriDate(date, lang) {
    try {
      const locale = lang === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return '';
    }
  }

  function getCityLocalNow(tz) {
    const now = new Date();
    if (typeof tz === 'number') {
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      return new Date(utcMs + tz * 3600000);
    }
    try {
      const str = now.toLocaleString('en-US', { timeZone: tz });
      return new Date(str);
    } catch {
      return now;
    }
  }

  function generateIcs(cityName, year, monthZeroIndexed, coords, options) {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AnubisLand//Mawaqeet Qibla PWA//EN',
      'CALSCALE:GREGORIAN'
    ];
    const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
    const keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const names = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, monthZeroIndexed, d);
      const times = calculatePrayerTimes(date, coords, options);
      for (const k of keys) {
        const hrs = times[k];
        const hh = Math.floor(hrs);
        const mm = Math.round((hrs - hh) * 60) % 60;
        const pad = (n) => String(n).padStart(2, '0');
        const stamp = `${year}${pad(monthZeroIndexed + 1)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${stamp}-${k}-${cityName.replace(/\s+/g, '')}@anubisland.github.io`);
        lines.push(`DTSTART:${stamp}`);
        lines.push(`SUMMARY:${names[k]} - ${cityName}`);
        lines.push('DESCRIPTION:Calculated by Mawaqeet & Qibla (AnubisLand)');
        lines.push('END:VEVENT');
      }
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  global.PrayerEngine = {
    METHODS,
    calculatePrayerTimes,
    formatTime,
    getSunAzimuth,
    getHijriDate,
    getCityLocalNow,
    generateIcs
  };
})(window);
