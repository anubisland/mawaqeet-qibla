(function (global) {
  'use strict';

  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;
  const DTR = Math.PI / 180;
  const RTD = 180 / Math.PI;
  const EARTH_RADIUS_KM = 6371;

  function getQiblaBearing(lat, lng) {
    const phi1 = lat * DTR;
    const phi2 = KAABA_LAT * DTR;
    const dLambda = (KAABA_LNG - lng) * DTR;

    const y = Math.sin(dLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
    let bearing = Math.atan2(y, x) * RTD;
    return ((bearing % 360) + 360) % 360;
  }

  function getDistanceToKaaba(lat, lng) {
    const phi1 = lat * DTR;
    const phi2 = KAABA_LAT * DTR;
    const dPhi = (KAABA_LAT - lat) * DTR;
    const dLambda = (KAABA_LNG - lng) * DTR;

    const a = Math.sin(dPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(EARTH_RADIUS_KM * c);
  }

  function getCardinalIndex(bearing) {
    return Math.round((((bearing % 360) + 360) % 360) / 45) % 8;
  }

  function shortestAngleDiff(target, current) {
    let diff = ((target - current + 540) % 360) - 180;
    return diff;
  }

  // Generate Great-Circle points for the world map arc
  function getGreatCirclePoints(lat1, lng1, lat2, lng2, steps = 40) {
    const p1 = lat1 * DTR;
    const l1 = lng1 * DTR;
    const p2 = lat2 * DTR;
    const l2 = lng2 * DTR;

    const d = 2 * Math.asin(Math.sqrt(
      Math.sin((p2 - p1) / 2) ** 2 +
      Math.cos(p1) * Math.cos(p2) * Math.sin((l2 - l1) / 2) ** 2
    ));

    if (d < 0.0001) return [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }];

    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2);
      const y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2);
      const z = A * Math.sin(p1) + B * Math.sin(p2);
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * RTD;
      const lng = Math.atan2(y, x) * RTD;
      pts.push({ lat, lng });
    }
    return pts;
  }

  function renderWorldArcSvg(svgEl, userLat, userLng, userLabel, makkahLabel) {
    if (!svgEl) return;
    const width = 720;
    const height = 340;
    const proj = (lat, lng) => ({
      x: ((lng + 180) / 360) * width,
      y: ((90 - lat) / 180) * height
    });

    const pts = getGreatCirclePoints(userLat, userLng, KAABA_LAT, KAABA_LNG, 48);
    let pathD = '';
    let prev = null;
    pts.forEach((pt, idx) => {
      const p = proj(pt.lat, pt.lng);
      if (idx === 0 || (prev && Math.abs(p.x - prev.x) > width * 0.5)) {
        pathD += `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      } else {
        pathD += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      }
      prev = p;
    });

    const uPos = proj(userLat, userLng);
    const kPos = proj(KAABA_LAT, KAABA_LNG);

    // Subtle equirectangular grid lines
    let grid = '';
    for (let lng = -150; lng <= 150; lng += 30) {
      const x = ((lng + 180) / 360) * width;
      grid += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3 4"/>`;
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      grid += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="3 4"/>`;
    }
    // Equator & Prime Meridian
    grid += `<line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="currentColor" stroke-opacity="0.22"/>`;
    grid += `<line x1="${width / 2}" y1="0" x2="${width / 2}" y2="${height}" stroke="currentColor" stroke-opacity="0.22"/>`;

    // Stylized continent silhouettes (simplified aesthetic polygons)
    const continents = `
      <g fill="currentColor" fill-opacity="0.11" stroke="currentColor" stroke-opacity="0.18" stroke-width="1">
        <!-- North America -->
        <path d="M70,55 L180,45 L220,85 L185,135 L145,148 L110,120 L80,95 Z"/>
        <!-- South America -->
        <path d="M195,175 L250,185 L270,235 L235,305 L205,290 L190,220 Z"/>
        <!-- Europe -->
        <path d="M335,55 L415,48 L430,88 L385,105 L340,95 Z"/>
        <!-- Africa -->
        <path d="M335,112 L420,115 L445,170 L410,255 L368,258 L348,185 L322,145 Z"/>
        <!-- Asia -->
        <path d="M425,52 L610,48 L645,105 L595,155 L525,165 L455,140 L432,102 Z"/>
        <!-- Australia -->
        <path d="M565,215 L645,212 L655,265 L585,272 Z"/>
      </g>
    `;

    svgEl.innerHTML = `
      <rect width="${width}" height="${height}" rx="16" fill="none"/>
      ${grid}
      ${continents}
      <path d="${pathD}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 5"/>
      <circle cx="${kPos.x}" cy="${kPos.y}" r="11" fill="#fbbf24" fill-opacity="0.28"/>
      <circle cx="${kPos.x}" cy="${kPos.y}" r="5.5" fill="#d97706" stroke="#fff" stroke-width="2"/>
      <text x="${kPos.x}" y="${kPos.y - 14}" text-anchor="middle" font-size="12" font-weight="700" fill="#d97706">🕋 ${makkahLabel}</text>
      <circle cx="${uPos.x}" cy="${uPos.y}" r="10" fill="#10b981" fill-opacity="0.28"/>
      <circle cx="${uPos.x}" cy="${uPos.y}" r="5" fill="#059669" stroke="#fff" stroke-width="2"/>
      <text x="${uPos.x}" y="${uPos.y + 20}" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">📍 ${userLabel}</text>
    `;
  }

  global.QiblaEngine = {
    KAABA_LAT,
    KAABA_LNG,
    getQiblaBearing,
    getDistanceToKaaba,
    getCardinalIndex,
    shortestAngleDiff,
    renderWorldArcSvg
  };
})(window);
