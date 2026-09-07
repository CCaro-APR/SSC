/* ═══════════════════════════════════════════════════════════════════
   RUNTIME — no need to edit below this line
   ═══════════════════════════════════════════════════════════════════ */

const SLIDE_THEMES = {
  sky:    "linear-gradient(115deg,#bae6fd 0%,#e0f2fe 55%,#f0f9ff 100%)",
  pink:   "linear-gradient(115deg,#fbcfe8 0%,#fce7f3 55%,#fdf2f8 100%)",
  amber:  "linear-gradient(115deg,#fde68a 0%,#fef3c7 55%,#fffbeb 100%)",
  mint:   "linear-gradient(115deg,#a7f3d0 0%,#d1fae5 55%,#f0fdf4 100%)",
  violet: "linear-gradient(115deg,#ddd6fe 0%,#ede9fe 55%,#f5f3ff 100%)"
};

const h = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
}

let slideState = { current: 0, paused: false, hovering: false };
let slideTimer = null;

function goTo(i) {
  const n = SLIDESHOW.length;
  if (!n) return;
  slideState.current = ((i % n) + n) % n;
  renderSlides();
}

function startTimer() {
  slideTimer = setInterval(() => {
    if (!slideState.paused && !slideState.hovering && !document.hidden && !document.getElementById("carousel-wrap").contains(document.activeElement) && SLIDESHOW.length > 1) {
      goTo(slideState.current + 1);
    }
  }, 7000);
}

function renderSlides() {
  const focusedControl = document.activeElement?.closest('.slide-btn, .dot-btn');
  const focusLabel = focusedControl?.getAttribute('aria-label');
  document.getElementById('announcements').hidden = SLIDESHOW.length === 0;
  document.getElementById('pause-carousel').hidden = SLIDESHOW.length < 2;
  const active = slideState.current;
  const container = document.getElementById('slides-container');
  const dotsEl = document.getElementById('dots-container');

  container.innerHTML = SLIDESHOW.map((s, i) => {
    const gradient = SLIDE_THEMES[s.theme] || SLIDE_THEMES.sky;
    const imageCss = s.image ? `url("${h(s.image)}")` : 'none';
    const placeholderPanel = !s.image ? `
      <div style="position:absolute;top:0;right:0;bottom:0;width:46%;display:grid;place-items:center;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px;text-align:center;">
          <span style="font-size:64px;line-height:1;">${s.emoji}</span>
          <span style="font-family:'Outfit',sans-serif;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(15,23,42,.45);">Photo goes here</span>
        </div>
      </div>` : '';
    return `
      <div aria-hidden="${i!==active}" ${i!==active?'inert':''} style="position:absolute;inset:0;opacity:${i===active?1:0};z-index:${i===active?10:1};transition:opacity .8s ease;">
        <div style="position:absolute;inset:0;background:${gradient};"></div>
        <div role="img" aria-label="${h(s.headline)}" style="position:absolute;inset:0;background-image:${imageCss};background-size:cover;background-position:center;"></div>
        ${placeholderPanel}
        <div style="position:absolute;inset:0;background:linear-gradient(100deg,rgba(15,23,42,.86) 0%,rgba(15,23,42,.62) 44%,rgba(15,23,42,.08) 78%,rgba(15,23,42,0) 100%);"></div>
        <div class="slide-copy" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:clamp(28px,4vw,52px);max-width:min(660px,72%);">
          <span style="display:inline-block;width:max-content;font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:7px 13px;border-radius:10px;background:#ffffff;color:#0f172a;box-shadow:0 10px 22px -10px rgba(0,0,0,.6);transform:rotate(-2deg);">${h(s.tag)}</span>
          <h2 style="margin:0;font-family:'Outfit',sans-serif;font-size:clamp(30px,3.6vw,50px);line-height:1.02;letter-spacing:-.035em;font-weight:900;color:#ffffff;text-wrap:balance;">${h(s.headline)}</h2>
          <p style="margin:0;font-size:clamp(15px,1.3vw,18px);line-height:1.5;color:#e2e8f0;max-width:52ch;text-wrap:pretty;">${h(s.sub)}</p>
          <a href="${h(s.url)}" target="_blank" rel="noopener" class="btn-lift" style="display:flex;align-items:center;gap:9px;width:max-content;margin-top:4px;padding:14px 24px;border-radius:999px;background:#ffffff;color:#0f172a;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;letter-spacing:-.01em;box-shadow:0 16px 32px -14px rgba(0,0,0,.7);">${h(s.cta)}<span style="font-size:15px;">→</span></a>
        </div>
      </div>`;
  }).join('');

  // Prev / Next buttons (inserted once; reuse if already there)
  if (SLIDESHOW.length > 1 && !container.querySelector('.slide-nav-prev')) {
    const prev = document.createElement('button');
    prev.className = 'slide-btn slide-nav-prev';
    prev.setAttribute('aria-label','Previous announcement');
    prev.style.cssText = 'position:absolute;left:16px;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:999px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.22);backdrop-filter:blur(10px);color:#ffffff;font-size:19px;font-family:Outfit,sans-serif;cursor:pointer;display:grid;place-items:center;z-index:20;';
    prev.innerHTML = '‹';
    prev.onclick = () => goTo(slideState.current - 1);
    container.appendChild(prev);

    const next = document.createElement('button');
    next.className = 'slide-btn slide-nav-next';
    next.setAttribute('aria-label','Next announcement');
    next.style.cssText = 'position:absolute;right:16px;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:999px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.22);backdrop-filter:blur(10px);color:#ffffff;font-size:19px;font-family:Outfit,sans-serif;cursor:pointer;display:grid;place-items:center;z-index:20;';
    next.innerHTML = '›';
    next.onclick = () => goTo(slideState.current + 1);
    container.appendChild(next);
  }

  // Dots
  dotsEl.innerHTML = SLIDESHOW.map((s, i) => `
    <button class="dot-btn" aria-label="Show announcement ${i+1}" aria-current="${i===active ? 'true' : 'false'}" data-i="${i}"><span style="width:${i===active?'30px':'9px'};background:${i===active?'#ffffff':'rgba(255,255,255,.5)'};"></span></button>
  `).join('');
  dotsEl.querySelectorAll('.dot-btn').forEach(btn => {
    btn.addEventListener('click', () => goTo(+btn.dataset.i));
  });
  if (focusLabel) {
    [...container.querySelectorAll('.slide-btn'), ...dotsEl.querySelectorAll('.dot-btn')]
      .find(button => button.getAttribute('aria-label') === focusLabel)?.focus({preventScroll:true});
  }
}

/* ── Filtering ── */
function prep(rows, q) {
  return rows.filter(r => !q || (r.label+' '+r.sub+' '+(r.tag||'')).toLowerCase().includes(q));
}
function filterPeople(rows, q) {
  return rows.filter(r => !q || Object.values(r).join(' ').toLowerCase().includes(q));
}

/* ── HTML builders ── */
function cardApply(l) {
  return `<a href="${h(l.url)}" target="_blank" rel="noopener" class="card-lift card-sky"
    style="flex:1 1 235px;min-width:0;display:flex;flex-direction:column;gap:9px;padding:20px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#38bdf8 0%,#a5f3fc 55%,#e0f2fe 100%) border-box;
      backdrop-filter:blur(12px);color:#0f172a;">
    <span style="font-size:30px;line-height:1;">${l.emoji}</span>
    <span style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.02em;">${h(l.label)}</span>
    <span style="font-size:13.5px;line-height:1.45;color:#475569;">${h(l.sub)}</span>
    ${l.tag ? `<span class="sticker" style="display:inline-block;white-space:nowrap;margin-top:3px;width:max-content;font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:6px 12px;border-radius:10px;background:#0ea5e9;color:#ffffff;box-shadow:0 8px 18px -8px rgba(14,165,233,.9);">${h(l.tag)}</span>` : ''}
  </a>`;
}

function rowLink(l, border, hoverBg, tagBg) {
  return `<a href="${h(l.url)}" target="_blank" rel="noopener" class="card-lift ${border}"
    style="display:flex;align-items:center;gap:15px;padding:17px 19px;border-radius:22px;border:2px solid transparent;
      background:${hoverBg};backdrop-filter:blur(12px);color:#0f172a;">
    <span style="font-size:27px;line-height:1;flex:none;">${l.emoji}</span>
    <span style="display:flex;flex-direction:column;gap:3px;min-width:0;">
      <span style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;">
        <span style="font-family:'Outfit',sans-serif;font-size:17px;font-weight:800;letter-spacing:-.02em;">${h(l.label)}</span>
        ${l.tag ? `<span style="display:inline-block;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:5px 11px;border-radius:9px;background:${tagBg};color:#ffffff;white-space:nowrap;box-shadow:0 8px 16px -8px rgba(0,0,0,.4);transform:rotate(-3deg);">${h(l.tag)}</span>` : ''}
      </span>
      <span style="font-size:13.5px;line-height:1.45;color:#475569;">${h(l.sub)}</span>
    </span>
  </a>`;
}

function cardGuide(l) {
  return `<a href="${h(l.url)}" target="_blank" rel="noopener" class="card-lift card-violet"
    style="flex:1 1 235px;min-width:0;display:flex;align-items:center;gap:14px;padding:18px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#a78bfa 0%,#ddd6fe 55%,#f5f3ff 100%) border-box;
      backdrop-filter:blur(12px);color:#0f172a;">
    <span style="font-size:27px;line-height:1;flex:none;">${l.emoji}</span>
    <span style="display:flex;flex-direction:column;gap:3px;min-width:0;">
      <span style="font-family:'Outfit',sans-serif;font-size:16.5px;font-weight:800;letter-spacing:-.02em;">${h(l.label)}</span>
      <span style="font-size:13px;line-height:1.4;color:#475569;">${h(l.sub)}</span>
    </span>
    <span style="display:inline-block;margin-left:auto;font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 11px;border-radius:9px;background:#7c3aed;color:#ffffff;white-space:nowrap;flex:none;transform:rotate(-3deg);box-shadow:0 8px 16px -8px rgba(124,58,237,.9);">${h(l.tag)}</span>
  </a>`;
}

function rowSocial(l) {
  const tag = l.tag ? `<span style="display:inline-block;margin-left:auto;font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 11px;border-radius:9px;background:#db2777;color:#ffffff;white-space:nowrap;flex:none;transform:rotate(-3deg);box-shadow:0 8px 16px -8px rgba(219,39,119,.9);">${h(l.tag)}</span>` : '';
  return `<a href="${h(l.url)}" target="_blank" rel="noopener" class="card-lift card-pink"
    style="display:flex;align-items:center;gap:15px;padding:17px 19px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#f472b6 0%,#fbcfe8 55%,#fdf2f8 100%) border-box;
      backdrop-filter:blur(12px);color:#0f172a;">
    <span style="font-size:27px;line-height:1;flex:none;">${l.emoji}</span>
    <span style="display:flex;flex-direction:column;gap:3px;min-width:0;">
      <span style="font-family:'Outfit',sans-serif;font-size:17px;font-weight:800;letter-spacing:-.02em;">${h(l.label)}</span>
      <span style="font-size:13.5px;line-height:1.45;color:#475569;">${h(l.sub)}</span>
    </span>
    ${tag}
  </a>`;
}

function cardNewsletter(n) {
  return `<a href="${h(n.url)}" target="_blank" rel="noopener" class="card-lift card-orange"
    style="flex:1 1 210px;min-width:0;display:flex;flex-direction:column;gap:8px;padding:19px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#fb923c 0%,#fed7aa 55%,#fff7ed 100%) border-box;
      backdrop-filter:blur(12px);color:#0f172a;">
    <span style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <span style="font-size:26px;line-height:1;">${n.emoji}</span>
      <span style="display:inline-block;font-family:'Outfit',sans-serif;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:5px 10px;border-radius:9px;background:#ea580c;color:#ffffff;white-space:nowrap;box-shadow:0 8px 16px -8px rgba(234,88,12,.9);">${h(n.tag)}</span>
    </span>
    <span style="font-family:'Outfit',sans-serif;font-size:17px;font-weight:800;letter-spacing:-.02em;">${h(n.label)}</span>
    <span style="font-size:13px;line-height:1.4;color:#475569;">${h(n.sub)}</span>
  </a>`;
}

function cardYouthLeader(p) {
  const ini = initials(p.name);
  return `<div class="card-lift card-indigo"
    style="flex:1 1 250px;min-width:0;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,.85)) padding-box,linear-gradient(135deg,#818cf8 0%,#c7d2fe 55%,#eef2ff 100%) border-box;
      backdrop-filter:blur(12px);">
    <div style="display:flex;align-items:center;gap:13px;">
      <span style="width:52px;height:52px;border-radius:17px;display:grid;place-items:center;font-family:'Outfit',sans-serif;font-size:19px;font-weight:900;letter-spacing:-.02em;color:#3730a3;background:linear-gradient(140deg,#e0e7ff,#f5f3ff);border:1px solid rgba(165,180,252,.95);flex:none;">${ini}</span>
      <span style="display:flex;flex-direction:column;gap:2px;min-width:0;">
        <span style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.02em;color:#0f172a;">${h(p.name)}</span>
        <span style="font-size:12.5px;font-weight:700;color:#4f46e5;letter-spacing:.05em;text-transform:uppercase;">${h(p.role)}</span>
      </span>
    </div>
    <div style="display:flex;flex-direction:column;gap:7px;">
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">🧑‍🎓</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Assigned to</strong> ${h(p.assigned)}</span></span>
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">🕐</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Free periods</strong> ${h(p.free)}</span></span>
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">📍</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Working</strong> ${h(p.work)}</span></span>
    </div>
    <a href="mailto:${h(p.email)}" class="btn-lift-sm btn-indigo" style="display:flex;align-items:center;gap:9px;padding:12px 15px;border-radius:15px;color:#ffffff;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:800;letter-spacing:-.01em;box-shadow:0 12px 24px -12px rgba(79,70,229,.9);overflow:hidden;">
      <span style="font-size:14px;flex:none;">✉️</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${h(p.email)}</span>
    </a>
  </div>`;
}

function cardStaff(p) {
  const ini = initials(p.name);
  return `<div class="card-lift card-blue"
    style="flex:1 1 300px;min-width:0;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:22px;border:2px solid transparent;
      background:linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,.85)) padding-box,linear-gradient(135deg,#60a5fa 0%,#bfdbfe 55%,#eff6ff 100%) border-box;
      backdrop-filter:blur(12px);">
    <div style="display:flex;align-items:center;gap:13px;">
      <span style="width:52px;height:52px;border-radius:17px;display:grid;place-items:center;font-family:'Outfit',sans-serif;font-size:19px;font-weight:900;letter-spacing:-.02em;color:#1d4ed8;background:linear-gradient(140deg,#dbeafe,#eff6ff);border:1px solid rgba(147,197,253,.95);flex:none;">${ini}</span>
      <span style="display:flex;flex-direction:column;gap:2px;min-width:0;">
        <span style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:800;letter-spacing:-.02em;color:#0f172a;">${h(p.name)}</span>
        <span style="font-size:12.5px;font-weight:700;color:#2563eb;letter-spacing:.05em;text-transform:uppercase;">${h(p.role)}</span>
      </span>
    </div>
    <div style="display:flex;flex-direction:column;gap:7px;">
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">📍</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Where</strong> ${h(p.room)}</span></span>
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">🕐</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Hours</strong> ${h(p.hours)}</span></span>
      <span style="display:flex;gap:8px;font-size:13.5px;line-height:1.4;color:#475569;"><span style="flex:none;">🧑‍🎓</span><span style="min-width:0;"><strong style="font-weight:700;color:#0f172a;">Ask about</strong> ${h(p.about)}</span></span>
    </div>
    <a href="mailto:${h(p.email)}" class="btn-lift-sm btn-blue" style="display:flex;align-items:center;gap:9px;padding:12px 15px;border-radius:15px;color:#ffffff;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:800;letter-spacing:-.01em;box-shadow:0 12px 24px -12px rgba(37,99,235,.9);overflow:hidden;">
      <span style="font-size:14px;flex:none;">✉️</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${h(p.email)}</span>
    </a>
  </div>`;
}

function section(icon, iconBg, iconBorder, title, subtitle, subtitleColor, sectionBorder, sectionShadow, flex, content) {
  const id = title === "What We\'ve Been Up To" ? "newsletters" : title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `<section id="${id}" style="flex:${flex};min-width:300px;border-radius:34px;padding:28px 26px 30px;background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1.5px solid ${sectionBorder};box-shadow:${sectionShadow};">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:22px;">
      <span style="width:52px;height:52px;border-radius:18px;display:grid;place-items:center;font-size:25px;background:${iconBg};border:1px solid ${iconBorder};flex:none;">${icon}</span>
      <div style="min-width:0;">
        <h2 style="margin:0;font-family:'Outfit',sans-serif;font-size:27px;font-weight:900;letter-spacing:-.025em;color:#0f172a;">${title}</h2>
        <p style="margin:1px 0 0;font-size:12.5px;font-weight:700;color:${subtitleColor};letter-spacing:.09em;text-transform:uppercase;">${subtitle}</p>
      </div>
    </div>
    ${content}
  </section>`;
}

/* ── Main render ── */
function render() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const apply  = prep(HUB_LINKS.applying, q);
  const path   = prep(HUB_LINKS.pathways, q);
  const aid    = prep(HUB_LINKS.financialAid, q);
  const money  = prep(HUB_LINKS.scholarships, q);
  const guides = prep(HUB_LINKS.guides, q);
  const social = prep(HUB_LINKS.social, q);
  const sortedNews = [...NEWSLETTERS].sort((a,b) => (b.date || '').localeCompare(a.date || ''))
    .map((n,i) => ({...n, tag:i===0 ? 'Newest' : (n.tag === 'Newest' ? 'PDF' : n.tag)}));
  const news   = prep(sortedNews, q);
  const yls    = filterPeople(YOUTH_LEADERS, q);
  const staff  = filterPeople(SSC_STAFF, q);
  const total  = apply.length+path.length+aid.length+money.length+guides.length+social.length+news.length+yls.length+staff.length;

  let html = '';

  if (apply.length) html += section(
    '🎓','linear-gradient(140deg,#e0f2fe,#f0f9ff)','rgba(125,211,252,.8)',
    'Applying to College','CUNY · SUNY · Common App','#0284c7',
    'rgba(125,211,252,.75)','0 34px 70px -46px rgba(2,132,199,.95)',
    '1 1 560px',
    `<div style="display:flex;flex-wrap:wrap;gap:14px;">${apply.map(cardApply).join('')}</div>`
  );

  if (path.length) html += section(
    '🛠️','linear-gradient(140deg,#ccfbf1,#f0fdfa)','rgba(94,234,212,.9)',
    'Trade &amp; Armed Forces','Other post-secondary paths','#0d9488',
    'rgba(94,234,212,.85)','0 34px 70px -46px rgba(13,148,136,.9)',
    '1 1 360px',
    `<div style="display:flex;flex-direction:column;gap:14px;">${path.map(l=>rowLink(l,'card-teal','linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#2dd4bf 0%,#99f6e4 55%,#f0fdfa 100%) border-box','#0d9488')).join('')}</div>`
  );

  if (aid.length) html += section(
    '💵','linear-gradient(140deg,#d1fae5,#f0fdf4)','rgba(110,231,183,.85)',
    'Financial Aid','FAFSA first, always','#059669',
    'rgba(110,231,183,.8)','0 34px 70px -46px rgba(5,150,105,.9)',
    '1 1 360px',
    `<div style="display:flex;flex-direction:column;gap:14px;">${aid.map(l=>rowLink(l,'card-green','linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#34d399 0%,#a7f3d0 55%,#ecfdf5 100%) border-box','#059669')).join('')}</div>`
  );

  if (money.length) html += section(
    '🏅','linear-gradient(140deg,#fef3c7,#fffbeb)','rgba(252,211,77,.9)',
    'Scholarships','Money you never repay','#d97706',
    'rgba(252,211,77,.85)','0 34px 70px -46px rgba(217,119,6,.85)',
    '1 1 360px',
    `<div style="display:flex;flex-direction:column;gap:14px;">${money.map(l=>rowLink(l,'card-amber','linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,#fbbf24 0%,#fde68a 55%,#fffbeb 100%) border-box','#f59e0b')).join('')}</div>`
  );

  if (guides.length) html += section(
    '📎','linear-gradient(140deg,#ede9fe,#f5f3ff)','rgba(196,181,253,.9)',
    'Guides &amp; Downloads','Grab and go','#7c3aed',
    'rgba(196,181,253,.85)','0 34px 70px -46px rgba(124,58,237,.85)',
    '1 1 560px',
    `<div style="display:flex;flex-wrap:wrap;gap:14px;">${guides.map(cardGuide).join('')}</div>`
  );

  if (social.length) html += section(
    '📣','linear-gradient(140deg,#fce7f3,#fdf2f8)','rgba(249,168,212,.95)',
    'Hear From Us','Announcements live here','#db2777',
    'rgba(249,168,212,.9)','0 34px 70px -46px rgba(219,39,119,.85)',
    '1 1 360px',
    `<div style="display:flex;flex-direction:column;gap:14px;">${social.map(rowSocial).join('')}</div>`
  );

  if (news.length) html += section(
    '🗓️','linear-gradient(140deg,#ffedd5,#fff7ed)','rgba(253,186,116,.95)',
    'What We\'ve Been Up To','Monthly newsletters','#ea580c',
    'rgba(253,186,116,.9)','0 34px 70px -46px rgba(234,88,12,.85)',
    '1 1 100%',
    `<div style="display:flex;flex-wrap:wrap;gap:14px;">${news.map(cardNewsletter).join('')}</div>`
  );

  if (yls.length) {
    html += `<section style="flex:1 1 100%;border-radius:34px;padding:28px 26px 30px;background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1.5px solid rgba(165,180,252,.9);box-shadow:0 34px 70px -46px rgba(79,70,229,.85);">
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:8px;flex-wrap:wrap;">
        <span style="width:52px;height:52px;border-radius:18px;display:grid;place-items:center;font-size:25px;background:linear-gradient(140deg,#e0e7ff,#eef2ff);border:1px solid rgba(165,180,252,.95);flex:none;">🫂</span>
        <div style="min-width:0;flex:1 1 260px;">
          <h2 style="margin:0;font-family:'Outfit',sans-serif;font-size:27px;font-weight:900;letter-spacing:-.025em;color:#0f172a;">Meet Your Youth Leaders</h2>
          <p style="margin:1px 0 0;font-size:12.5px;font-weight:700;color:#4f46e5;letter-spacing:.09em;text-transform:uppercase;">${YOUTH_LEADERS.length} youth leaders · here to help</p>
        </div>
      </div>
      <p style="margin:0 0 20px;font-size:14.5px;line-height:1.5;color:#475569;max-width:70ch;">Not sure who yours is? Find your last name in the <strong style="font-weight:700;color:#0f172a;">Assigned to</strong> row below, or stop by the office and we'll match you.</p>
      <div style="display:flex;flex-wrap:wrap;gap:14px;">${yls.map(cardYouthLeader).join('')}</div>
    </section>`;
  }

  if (staff.length) {
    html += `<section style="flex:1 1 100%;border-radius:34px;padding:28px 26px 30px;background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1.5px solid rgba(147,197,253,.95);box-shadow:0 34px 70px -46px rgba(37,99,235,.85);">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:22px;flex-wrap:wrap;">
        <span style="width:52px;height:52px;border-radius:18px;display:grid;place-items:center;font-size:25px;background:linear-gradient(140deg,#dbeafe,#eff6ff);border:1px solid rgba(147,197,253,.95);flex:none;">🏫</span>
        <div style="min-width:0;">
          <h2 style="margin:0;font-family:'Outfit',sans-serif;font-size:27px;font-weight:900;letter-spacing:-.025em;color:#0f172a;">Meet Your SSC Staff</h2>
          <p style="margin:1px 0 0;font-size:12.5px;font-weight:700;color:#2563eb;letter-spacing:.09em;text-transform:uppercase;">${SSC_STAFF.length} adult staff · ${h(SITE.staffLocation)}</p>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:14px;">${staff.map(cardStaff).join('')}</div>
    </section>`;
  }

  if (total === 0) {
    html = `<div style="flex:1 1 100%;padding:60px 30px;border-radius:34px;border:2px dashed rgba(148,163,184,.6);background:rgba(255,255,255,.65);backdrop-filter:blur(12px);text-align:center;">
      <div style="font-size:38px;">🌤️</div>
      <p style="margin:14px 0 0;font-family:'Outfit',sans-serif;font-size:23px;font-weight:900;letter-spacing:-.02em;color:#0f172a;">Nothing matched "${h(document.getElementById('search').value)}"</p>
      <p style="margin:7px 0 0;font-size:15.5px;color:#475569;">${h(SITE.searchHelp)}</p>
    </div>`;
  }

  document.getElementById('bento').innerHTML = html;
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  document.title = SITE.pageTitle;
  for (const [id, key] of Object.entries({
    'headline-start':'headlineStart', 'headline-middle':'headlineMiddle',
    'headline-highlight':'headlineHighlight', 'contact-heading':'contactHeading',
    'contact-button':'contactButton'
  })) document.getElementById(id).textContent = SITE[key];
  document.getElementById('logo').src = SITE.logo;
  document.getElementById('logo').alt = SITE.schoolName;
  document.getElementById('update-label').textContent = SITE.updateLabel;
  document.getElementById('intro').textContent = SITE.intro;
  const office = document.getElementById('office-details');
  office.replaceChildren(document.createTextNode(SITE.officeDetails), document.createElement('br'), document.createTextNode(SITE.walkInHours));
  document.getElementById('office-email').href = 'mailto:' + SITE.email;

  // Carousel
  renderSlides();
  const wrap = document.getElementById('carousel-wrap');
  wrap.addEventListener('mouseenter', () => { slideState.hovering = true; });
  wrap.addEventListener('mouseleave', () => { slideState.hovering = false; });
  const pause = document.getElementById('pause-carousel');
  slideState.paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updatePause() {
    pause.textContent = slideState.paused ? 'Play announcements' : 'Pause announcements';
    pause.setAttribute('aria-pressed', String(slideState.paused));
  }
  pause.addEventListener('click', () => { slideState.paused = !slideState.paused; updatePause(); });
  updatePause();
  startTimer();

  // Search
  document.getElementById('search').addEventListener('input', render);

  document.querySelectorAll('.quick-nav a').forEach(link => link.addEventListener('click', () => {
    document.getElementById('search').value = '';
    render();
  }));

  // Initial bento render
  render();
});
