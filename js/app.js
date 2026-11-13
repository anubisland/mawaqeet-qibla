(function () {
  'use strict';

  const STORAGE_KEY = 'anubisland_mawaqeet_v1';
  const defaultCity = window.WORLD_CITIES[0]; // Cairo

  const state = {
    lang: 'ar',
    theme: 'light',
    font: "'Cairo', sans-serif",
    fontSize: '16px',
    city: defaultCity,
    favorites: ['makkah', 'cairo', 'london'],
    method: defaultCity.method,
    asrSchool: 'STANDARD',
    highLat: 'ANGLE',
    use24h: false,
    preAlert: 0,
    soundAlert: true,
    tracker: {},
    scheduleYear: new Date().getFullYear(),
    scheduleMonth: new Date().getMonth(),
    deviceHeading: 0,
    compassActive: false,
    notifiedKeys: {}
  };

  let deferredInstallPrompt = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(state, parsed);
      }
    } catch (e) {
      console.warn('Could not load saved state', e);
    }
  }

  function saveState() {
    try {
      const toSave = {
        lang: state.lang,
        theme: state.theme,
        font: state.font,
        fontSize: state.fontSize,
        city: state.city,
        favorites: state.favorites,
        method: state.method,
        asrSchool: state.asrSchool,
        highLat: state.highLat,
        use24h: state.use24h,
        preAlert: state.preAlert,
        soundAlert: state.soundAlert,
        tracker: state.tracker
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  function t(key) {
    const dict = window.MAWAQEET_I18N[state.lang] || window.MAWAQEET_I18N.ar;
    return dict[key] !== undefined ? dict[key] : key;
  }

  function getCityDisplayName(city) {
    if (state.lang === 'ar') {
      return city.countryAr ? `${city.nameAr}، ${city.countryAr}` : city.nameAr;
    }
    return city.countryEn ? `${city.nameEn}, ${city.countryEn}` : city.nameEn;
  }

  function applyThemeAndLocale() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.style.setProperty('--app-font', state.font);
    document.documentElement.style.setProperty('--base-font-size', state.fontSize);

    document.getElementById('btnLang').textContent = state.lang === 'ar' ? '🌐 EN' : '🌐 عربي';
    document.getElementById('btnTheme').textContent = state.theme === 'light' ? '🌙' : '☀️';
    document.getElementById('fontSelect').value = state.font;
    document.getElementById('fontSizeSelect').value = state.fontSize;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    populateMethodSelect();
    document.getElementById('asrSchoolSelect').value = state.asrSchool;
    document.getElementById('highLatSelect').value = state.highLat;
    document.getElementById('timeFormatSelect').value = state.use24h ? '24' : '12';
    document.getElementById('preAlertSelect').value = String(state.preAlert);
    document.getElementById('soundAlertCheck').checked = state.soundAlert;
  }

  function populateMethodSelect() {
    const sel = document.getElementById('calcMethodSelect');
    const current = state.method;
    sel.innerHTML = '';
    Object.values(window.PrayerEngine.METHODS).forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = state.lang === 'ar' ? m.nameAr : m.nameEn;
      sel.appendChild(opt);
    });
    sel.value = current;
  }

  function renderFavorites() {
    const strip = document.getElementById('favoritesStrip');
    const saveBtn = document.getElementById('btnSaveFav');
    const isFav = state.favorites.some((f) => f === state.city.id);
    saveBtn.textContent = isFav ? t('savedCityBtn') : t('saveCityBtn');

    let html = `<span class="fav-label">⭐ ${t('favoritesTitle')}:</span>`;
    state.favorites.forEach((favId) => {
      const city = window.WORLD_CITIES.find((c) => c.id === favId);
      if (!city) return;
      const active = city.id === state.city.id ? 'active' : '';
      const label = state.lang === 'ar' ? city.nameAr : city.nameEn;
      html += `
        <span class="fav-chip ${active}" data-fav-id="${city.id}">
          <span>${label}</span>
          <span class="remove-fav" data-remove-fav="${city.id}" title="Remove">×</span>
        </span>
      `;
    });
    strip.innerHTML = html;

    strip.querySelectorAll('.fav-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-remove-fav')) {
          const id = e.target.getAttribute('data-remove-fav');
          state.favorites = state.favorites.filter((x) => x !== id);
          saveState();
          renderFavorites();
          return;
        }
        const id = chip.getAttribute('data-fav-id');
        const found = window.WORLD_CITIES.find((c) => c.id === id);
        if (found) selectCity(found);
      });
    });
  }

  function selectCity(city) {
    state.city = city;
    if (city.method && window.PrayerEngine.METHODS[city.method]) {
      state.method = city.method;
      document.getElementById('calcMethodSelect').value = state.method;
    }
    saveState();
    renderAll();
  }

  function renderAll() {
    renderFavorites();
    renderPrayerDashboard();
    renderQiblaView();
    renderMonthlySchedule();
    renderTracker();
  }

  function renderPrayerDashboard() {
    const cityNow = window.PrayerEngine.getCityLocalNow(state.city.tz);
    const times = window.PrayerEngine.calculatePrayerTimes(cityNow, state.city, {
      method: state.method,
      asrSchool: state.asrSchool,
      highLat: state.highLat
    });

    document.getElementById('heroCityName').textContent = getCityDisplayName(state.city);
    const gregStr = cityNow.toLocaleDateString(state.lang === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const hijriStr = window.PrayerEngine.getHijriDate(cityNow, state.lang);
    document.getElementById('heroDates').textContent = hijriStr ? `${hijriStr}  •  ${gregStr}` : gregStr;

    const methodObj = window.PrayerEngine.METHODS[state.method] || window.PrayerEngine.METHODS.EGYPT;
    document.getElementById('heroMethodName').textContent = state.lang === 'ar' ? methodObj.nameAr : methodObj.nameEn;
    document.getElementById('heroCoords').textContent = `${Number(state.city.lat).toFixed(2)}°, ${Number(state.city.lng).toFixed(2)}°`;

    const currentHours = cityNow.getHours() + cityNow.getMinutes() / 60 + cityNow.getSeconds() / 3600;
    const cardSpecs = [
      { key: 'fajr', icon: '🌌', cls: 'card-fajr', sub: 'fajrSub' },
      { key: 'sunrise', icon: '🌅', cls: 'card-sunrise', sub: 'sunriseSub' },
      { key: 'dhuhr', icon: '☀️', cls: 'card-dhuhr', sub: 'dhuhrSub' },
      { key: 'asr', icon: '🌤️', cls: 'card-asr', sub: 'asrSub' },
      { key: 'maghrib', icon: '🌇', cls: 'card-maghrib', sub: 'maghribSub' },
      { key: 'isha', icon: '🌙', cls: 'card-isha', sub: 'ishaSub' }
    ];

    let nextSpec = cardSpecs.find((s) => times[s.key] > currentHours);
    if (!nextSpec) nextSpec = cardSpecs[0];

    const grid = document.getElementById('prayerCardsGrid');
    grid.innerHTML = cardSpecs.map((s) => {
      const val = times[s.key];
      const isNext = s.key === nextSpec.key;
      const isPassed = !isNext && val <= currentHours;
      const badgeText = isNext ? t('activeNow') : (isPassed ? t('passedLabel') : '');
      return `
        <article class="prayer-card ${s.cls} ${isNext ? 'is-next' : ''} ${isPassed ? 'is-passed' : ''}">
          <div class="prayer-card-top">
            <span class="prayer-icon">${s.icon}</span>
            ${badgeText ? `<span class="prayer-badge">${badgeText}</span>` : ''}
          </div>
          <div>
            <div class="prayer-name">${t(s.key)}</div>
            <div class="prayer-time">${window.PrayerEngine.formatTime(val, state.use24h, state.lang)}</div>
            <div class="prayer-sub">${t(s.sub)}</div>
          </div>
        </article>
      `;
    }).join('');

    document.getElementById('midnightVal').textContent = window.PrayerEngine.formatTime(times.midnight, state.use24h, state.lang);
    document.getElementById('lastThirdVal').textContent = window.PrayerEngine.formatTime(times.lastThird, state.use24h, state.lang);

    const bearing = window.QiblaEngine.getQiblaBearing(state.city.lat, state.city.lng);
    const dist = window.QiblaEngine.getDistanceToKaaba(state.city.lat, state.city.lng);
    const cardIdx = window.QiblaEngine.getCardinalIndex(bearing);
    const cardName = t('cardinals')[cardIdx];
    document.getElementById('quickQiblaBearing').textContent = `${bearing.toFixed(1)}° (${cardName})`;
    document.getElementById('quickQiblaDistance').textContent = `${t('distanceToKaaba')}: ${dist.toLocaleString(state.lang === 'ar' ? 'ar-EG' : 'en-US')} ${t('kmUnit')}`;
  }

  function tickClock() {
    const cityNow = window.PrayerEngine.getCityLocalNow(state.city.tz);
    document.getElementById('cityLocalClock').textContent = cityNow.toLocaleTimeString(
      state.lang === 'ar' ? 'ar-EG' : 'en-US',
      { hour12: !state.use24h, hour: '2-digit', minute: '2-digit', second: '2-digit' }
    );

    const times = window.PrayerEngine.calculatePrayerTimes(cityNow, state.city, {
      method: state.method,
      asrSchool: state.asrSchool,
      highLat: state.highLat
    });

    const currentSec = cityNow.getHours() * 3600 + cityNow.getMinutes() * 60 + cityNow.getSeconds();
    const order = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let nextKey = null;
    let prevSec = 0;
    let nextSec = 0;

    for (let i = 0; i < order.length; i++) {
      const k = order[i];
      const sec = Math.round(times[k] * 3600);
      if (sec > currentSec) {
        nextKey = k;
        nextSec = sec;
        prevSec = i > 0 ? Math.round(times[order[i - 1]] * 3600) : Math.round(times.isha * 3600) - 86400;
        break;
      }
    }

    if (!nextKey) {
      nextKey = 'fajr';
      prevSec = Math.round(times.isha * 3600);
      nextSec = Math.round(times.fajr * 3600) + 86400;
    }

    const diffSec = Math.max(0, nextSec - currentSec);
    const hh = String(Math.floor(diffSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
    const ss = String(diffSec % 60).padStart(2, '0');

    document.getElementById('nextPrayerName').textContent = t(nextKey);
    document.getElementById('nextPrayerCountdown').textContent = `${hh}:${mm}:${ss}`;

    const totalSpan = Math.max(1, nextSec - prevSec);
    const pct = Math.min(100, Math.max(0, ((currentSec - prevSec) / totalSpan) * 100));
    document.getElementById('prayerProgressBar').style.width = `${pct.toFixed(1)}%`;

    // Check alerts for obligatory prayers
    if (nextKey !== 'sunrise') {
      const alertThresholdSec = state.preAlert * 60;
      const todayKey = `${cityNow.getFullYear()}-${cityNow.getMonth() + 1}-${cityNow.getDate()}-${nextKey}-${state.preAlert}`;
      if (diffSec <= alertThresholdSec && diffSec >= alertThresholdSec - 2 && !state.notifiedKeys[todayKey]) {
        state.notifiedKeys[todayKey] = true;
        triggerPrayerAlert(nextKey);
      }
    }
  }

  function playGentleChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = ctx.currentTime + idx * 0.22;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.75);
      });
    } catch (e) {
      console.warn('Audio chime unavailable', e);
    }
  }

  function triggerPrayerAlert(prayerKey) {
    if (state.soundAlert) playGentleChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `${t('appTitle')} — ${t(prayerKey)}`;
      const body = state.preAlert > 0
        ? (state.lang === 'ar' ? `متبقي ${state.preAlert} دقيقة على صلاة ${t(prayerKey)}` : `${state.preAlert} min until ${t(prayerKey)}`)
        : (state.lang === 'ar' ? `حان الآن موعد صلاة ${t(prayerKey)}` : `It is now time for ${t(prayerKey)}`);
      new Notification(title, { body, icon: 'icons/icon-192.png' });
    }
  }

  function renderQiblaView() {
    const bearing = window.QiblaEngine.getQiblaBearing(state.city.lat, state.city.lng);
    const dist = window.QiblaEngine.getDistanceToKaaba(state.city.lat, state.city.lng);
    const cardName = t('cardinals')[window.QiblaEngine.getCardinalIndex(bearing)];

    document.getElementById('qiblaBearingBig').textContent = `${bearing.toFixed(1)}° (${cardName})`;
    document.getElementById('qiblaDistanceBig').textContent = `${dist.toLocaleString(state.lang === 'ar' ? 'ar-EG' : 'en-US')} ${t('kmUnit')}`;

    const sun = window.PrayerEngine.getSunAzimuth(new Date(), state.city.lat, state.city.lng);
    document.getElementById('sunAzimuthVal').textContent = `${sun.azimuth.toFixed(1)}°`;

    const sunDiff = Math.abs(window.QiblaEngine.shortestAngleDiff(bearing, sun.azimuth));
    const sunAdviceEl = document.getElementById('sunQiblaAdvice');
    if (sun.altitude <= 0) {
      sunAdviceEl.textContent = state.lang === 'ar'
        ? 'الشمس حالياً تحت الأفق (ليل). ستظهر إرشادات المطابقة الشمسية بعد الشروق.'
        : 'The sun is currently below the horizon (nighttime). Sun-alignment guidance appears after sunrise.';
    } else if (sunDiff <= 5) {
      sunAdviceEl.textContent = t('sunTipAligned');
    } else {
      sunAdviceEl.textContent = `${t('sunTipGeneral')} (${t('sunDiffLabel')}: ${sunDiff.toFixed(1)}°)`;
    }

    updateCompassVisuals(bearing);

    const makkahLabel = state.lang === 'ar' ? 'مكة المكرمة' : 'Makkah';
    const userLabel = state.lang === 'ar' ? state.city.nameAr : state.city.nameEn;
    window.QiblaEngine.renderWorldArcSvg(
      document.getElementById('worldArcSvg'),
      state.city.lat,
      state.city.lng,
      userLabel,
      makkahLabel
    );
  }

  function updateCompassVisuals(bearing) {
    const qBearing = bearing !== undefined
      ? bearing
      : window.QiblaEngine.getQiblaBearing(state.city.lat, state.city.lng);
    const heading = state.deviceHeading;

    document.getElementById('deviceHeadingVal').textContent = `${Math.round(heading)}°`;
    document.getElementById('compassDialGroup').setAttribute('transform', `rotate(${-heading} 160 160)`);
    document.getElementById('qiblaNeedleGroup').setAttribute('transform', `rotate(${qBearing} 160 160)`);

    const diff = window.QiblaEngine.shortestAngleDiff(qBearing, heading);
    const banner = document.getElementById('compassStatusBanner');
    if (Math.abs(diff) <= 4) {
      banner.classList.add('aligned');
      banner.textContent = t('compassAligned');
    } else {
      banner.classList.remove('aligned');
      const dirTxt = diff > 0 ? t('compassTurnRight') : t('compassTurnLeft');
      banner.textContent = `${dirTxt} ${Math.abs(Math.round(diff))}°`;
    }
  }

  function enableLiveCompass() {
    const btn = document.getElementById('btnEnableCompass');
    const handler = (e) => {
      let heading = null;
      if (typeof e.webkitCompassHeading === 'number') {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = 360 - e.alpha;
      }
      if (heading !== null) {
        state.deviceHeading = ((heading % 360) + 360) % 360;
        document.getElementById('simHeadingSlider').value = Math.round(state.deviceHeading);
        updateCompassVisuals();
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((res) => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handler, true);
            state.compassActive = true;
            btn.textContent = t('compassActive');
          }
        })
        .catch(() => {
          document.getElementById('compassStatusBanner').textContent = t('compassUnsupported');
        });
    } else if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handler, true);
      state.compassActive = true;
      btn.textContent = t('compassActive');
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handler, true);
      state.compassActive = true;
      btn.textContent = t('compassActive');
    } else {
      document.getElementById('compassStatusBanner').textContent = t('compassUnsupported');
    }
  }

  function renderMonthlySchedule() {
    const year = state.scheduleYear;
    const month = state.scheduleMonth;
    const d0 = new Date(year, month, 1);
    document.getElementById('scheduleMonthLabel').textContent = d0.toLocaleDateString(
      state.lang === 'ar' ? 'ar-EG' : 'en-US',
      { month: 'long', year: 'numeric' }
    );

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = window.PrayerEngine.getCityLocalNow(state.city.tz);
    const tbody = document.getElementById('scheduleTableBody');
    let rows = '';

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const times = window.PrayerEngine.calculatePrayerTimes(dt, state.city, {
        method: state.method,
        asrSchool: state.asrSchool,
        highLat: state.highLat
      });
      const isToday = dt.getFullYear() === today.getFullYear() &&
        dt.getMonth() === today.getMonth() &&
        dt.getDate() === today.getDate();
      const dayName = t('daysShort')[dt.getDay()];
      const hijri = window.PrayerEngine.getHijriDate(dt, state.lang);

      rows += `
        <tr class="${isToday ? 'is-today' : ''}">
          <td>${dayName} ${d}/${month + 1}</td>
          <td>${hijri}</td>
          <td>${window.PrayerEngine.formatTime(times.fajr, state.use24h, state.lang)}</td>
          <td>${window.PrayerEngine.formatTime(times.sunrise, state.use24h, state.lang)}</td>
          <td>${window.PrayerEngine.formatTime(times.dhuhr, state.use24h, state.lang)}</td>
          <td>${window.PrayerEngine.formatTime(times.asr, state.use24h, state.lang)}</td>
          <td>${window.PrayerEngine.formatTime(times.maghrib, state.use24h, state.lang)}</td>
          <td>${window.PrayerEngine.formatTime(times.isha, state.use24h, state.lang)}</td>
        </tr>
      `;
    }
    tbody.innerHTML = rows;
  }

  function renderTracker() {
    const today = window.PrayerEngine.getCityLocalNow(state.city.tz);
    const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    if (!state.tracker[dayKey]) state.tracker[dayKey] = {};
    const dayData = state.tracker[dayKey];

    const fardKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const sunnahKeys = [
      'sunnahFajr',
      'sunnahDhuhrBefore',
      'sunnahDhuhrAfter',
      'sunnahMaghrib',
      'sunnahIsha',
      'sunnahDuha',
      'sunnahWitr'
    ];

    const renderGroup = (containerId, keys) => {
      const container = document.getElementById(containerId);
      container.innerHTML = keys.map((k) => {
        const checked = !!dayData[k];
        return `
          <label class="checklist-item ${checked ? 'done' : ''}">
            <span>${t(k)}</span>
            <input type="checkbox" data-track-key="${k}" ${checked ? 'checked' : ''} />
          </label>
        `;
      }).join('');

      container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener('change', () => {
          const k = cb.getAttribute('data-track-key');
          dayData[k] = cb.checked;
          saveState();
          renderTracker();
        });
      });
    };

    renderGroup('obligatoryChecklist', fardKeys);
    renderGroup('sunnahChecklist', sunnahKeys);

    const total = fardKeys.length + sunnahKeys.length;
    const doneCount = [...fardKeys, ...sunnahKeys].filter((k) => dayData[k]).length;
    document.getElementById('trackerProgressBadge').textContent = `${doneCount}/${total}`;
  }

  function setupCitySearch() {
    const input = document.getElementById('citySearchInput');
    const dropdown = document.getElementById('searchDropdown');

    const showMatches = (items) => {
      if (!items.length) {
        dropdown.innerHTML = `<div class="search-item" style="color:var(--text-muted);">${t('noResults')}</div>`;
      } else {
        dropdown.innerHTML = items.slice(0, 12).map((c, idx) => `
          <div class="search-item" data-idx="${idx}">
            <strong>${state.lang === 'ar' ? c.nameAr : c.nameEn}</strong>
            <span style="color:var(--text-muted); font-size:0.84rem;">${state.lang === 'ar' ? c.countryAr : c.countryEn}</span>
          </div>
        `).join('');
        dropdown.querySelectorAll('.search-item[data-idx]').forEach((el) => {
          el.addEventListener('click', () => {
            const idx = Number(el.getAttribute('data-idx'));
            selectCity(items[idx]);
            dropdown.classList.add('hidden');
            input.value = '';
          });
        });
      }
      dropdown.classList.remove('hidden');
    };

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }
      const matches = window.WORLD_CITIES.filter((c) =>
        c.nameAr.includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.countryAr.includes(q) ||
        c.countryEn.toLowerCase().includes(q)
      );
      showMatches(matches);
    });

    document.getElementById('btnSearchOnline').addEventListener('click', async () => {
      const q = input.value.trim();
      if (!q) return;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`);
        const data = await res.json();
        const mapped = data.map((item) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const parts = item.display_name.split(',');
          return {
            id: `osm_${item.place_id}`,
            nameAr: parts[0].trim(),
            nameEn: parts[0].trim(),
            countryAr: parts[parts.length - 1]?.trim() || '',
            countryEn: parts[parts.length - 1]?.trim() || '',
            lat,
            lng,
            tz: Math.round(lng / 15),
            method: 'MWL'
          };
        });
        showMatches(mapped);
      } catch {
        alert(t('noResults'));
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrap') && e.target.id !== 'btnSearchOnline') {
        dropdown.classList.add('hidden');
      }
    });
  }

  function setupEvents() {
    // Navigation pills
    document.querySelectorAll('.nav-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        document.querySelectorAll('.nav-pill').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.app-view').forEach((v) => v.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`view-${view}`).classList.add('active');
        if (view === 'qibla') renderQiblaView();
      });
    });

    document.getElementById('btnGoQibla').addEventListener('click', () => {
      document.querySelector('.nav-pill[data-view="qibla"]').click();
    });

    // Header controls
    document.getElementById('btnLang').addEventListener('click', () => {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      saveState();
      applyThemeAndLocale();
      renderAll();
    });

    document.getElementById('btnTheme').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveState();
      applyThemeAndLocale();
    });

    document.getElementById('fontSelect').addEventListener('change', (e) => {
      state.font = e.target.value;
      saveState();
      applyThemeAndLocale();
    });

    document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
      state.fontSize = e.target.value;
      saveState();
      applyThemeAndLocale();
    });

    // GPS
    document.getElementById('btnDetectGps').addEventListener('click', () => {
      const btn = document.getElementById('btnDetectGps');
      if (!navigator.geolocation) {
        alert(t('gpsError'));
        return;
      }
      btn.textContent = t('detectingGps');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || Math.round(lng / 15);
          let cityObj = {
            id: `gps_${lat.toFixed(2)}_${lng.toFixed(2)}`,
            nameAr: 'موقعي الحالي (GPS)',
            nameEn: 'My GPS Location',
            countryAr: '',
            countryEn: '',
            lat,
            lng,
            tz,
            method: state.method
          };
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.address) {
              const name = data.address.city || data.address.town || data.address.state || cityObj.nameEn;
              const country = data.address.country || '';
              cityObj.nameAr = name;
              cityObj.nameEn = name;
              cityObj.countryAr = country;
              cityObj.countryEn = country;
            }
          } catch { /* offline fallback uses GPS label */ }
          btn.textContent = t('detectGpsBtn');
          selectCity(cityObj);
        },
        () => {
          btn.textContent = t('detectGpsBtn');
          alert(t('gpsError'));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    // Favorites
    document.getElementById('btnSaveFav').addEventListener('click', () => {
      const exists = state.favorites.includes(state.city.id);
      if (exists) {
        state.favorites = state.favorites.filter((id) => id !== state.city.id);
      } else {
        if (!window.WORLD_CITIES.some((c) => c.id === state.city.id)) {
          window.WORLD_CITIES.push(state.city);
        }
        state.favorites.push(state.city.id);
      }
      saveState();
      renderFavorites();
    });

    // Custom coords modal
    const modal = document.getElementById('coordsModal');
    document.getElementById('btnCustomCoords').addEventListener('click', () => {
      document.getElementById('inputLat').value = state.city.lat;
      document.getElementById('inputLng').value = state.city.lng;
      modal.classList.remove('hidden');
    });
    document.getElementById('btnCancelCoords').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btnApplyCoords').addEventListener('click', () => {
      const lat = parseFloat(document.getElementById('inputLat').value);
      const lng = parseFloat(document.getElementById('inputLng').value);
      const tz = parseFloat(document.getElementById('inputTz').value) || 0;
      if (!isNaN(lat) && !isNaN(lng)) {
        selectCity({
          id: `custom_${lat}_${lng}`,
          nameAr: `موقع مخصص (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
          nameEn: `Custom (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
          countryAr: '',
          countryEn: '',
          lat,
          lng,
          tz
        });
        modal.classList.add('hidden');
      }
    });

    // Qibla Compass
    document.getElementById('btnEnableCompass').addEventListener('click', enableLiveCompass);
    document.getElementById('simHeadingSlider').addEventListener('input', (e) => {
      state.deviceHeading = Number(e.target.value);
      updateCompassVisuals();
    });

    // Schedule controls
    document.getElementById('btnPrevMonth').addEventListener('click', () => {
      state.scheduleMonth -= 1;
      if (state.scheduleMonth < 0) {
        state.scheduleMonth = 11;
        state.scheduleYear -= 1;
      }
      renderMonthlySchedule();
    });
    document.getElementById('btnNextMonth').addEventListener('click', () => {
      state.scheduleMonth += 1;
      if (state.scheduleMonth > 11) {
        state.scheduleMonth = 0;
        state.scheduleYear += 1;
      }
      renderMonthlySchedule();
    });
    document.getElementById('btnPrintSchedule').addEventListener('click', () => window.print());
    document.getElementById('btnExportIcs').addEventListener('click', () => {
      const ics = window.PrayerEngine.generateIcs(
        state.city.nameEn,
        state.scheduleYear,
        state.scheduleMonth,
        state.city,
        { method: state.method, asrSchool: state.asrSchool, highLat: state.highLat }
      );
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `prayer-times-${state.city.nameEn}-${state.scheduleYear}-${state.scheduleMonth + 1}.ics`;
      a.click();
    });

    // Settings
    document.getElementById('calcMethodSelect').addEventListener('change', (e) => {
      state.method = e.target.value;
      saveState();
      renderAll();
    });
    document.getElementById('asrSchoolSelect').addEventListener('change', (e) => {
      state.asrSchool = e.target.value;
      saveState();
      renderAll();
    });
    document.getElementById('highLatSelect').addEventListener('change', (e) => {
      state.highLat = e.target.value;
      saveState();
      renderAll();
    });
    document.getElementById('timeFormatSelect').addEventListener('change', (e) => {
      state.use24h = e.target.value === '24';
      saveState();
      renderAll();
    });
    document.getElementById('preAlertSelect').addEventListener('change', (e) => {
      state.preAlert = Number(e.target.value);
      saveState();
    });
    document.getElementById('soundAlertCheck').addEventListener('change', (e) => {
      state.soundAlert = e.target.checked;
      saveState();
    });
    document.getElementById('btnTestSound').addEventListener('click', playGentleChime);
    document.getElementById('btnEnableNotif').addEventListener('click', () => {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            document.getElementById('btnEnableNotif').textContent = t('notifEnabled');
          }
        });
      }
    });

    // PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      document.getElementById('btnInstallPWA').classList.remove('hidden');
    });
    document.getElementById('btnInstallPWA').addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      document.getElementById('btnInstallPWA').classList.add('hidden');
    });
  }

  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('SW registration failed', err);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    applyThemeAndLocale();
    setupCitySearch();
    setupEvents();
    renderAll();
    tickClock();
    setInterval(tickClock, 1000);
    registerSW();
  });
})();
