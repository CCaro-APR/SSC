const SLIDE_THEMES = {
  sky: "linear-gradient(115deg,#bae6fd 0%,#e0f2fe 55%,#f0f9ff 100%)",
  pink: "linear-gradient(115deg,#fbcfe8 0%,#fce7f3 55%,#fdf2f8 100%)",
  amber: "linear-gradient(115deg,#fde68a 0%,#fef3c7 55%,#fffbeb 100%)",
  mint: "linear-gradient(115deg,#a7f3d0 0%,#d1fae5 55%,#f0fdf4 100%)",
  violet: "linear-gradient(115deg,#ddd6fe 0%,#ede9fe 55%,#f5f3ff 100%)",
};

// Content access — the only source is data.js.

function getData(key) {
  // Match section keys to the named content collections.
  const map = {
    slideshow: typeof SLIDESHOW !== "undefined" ? SLIDESHOW : [],
    applying: typeof HUB_LINKS !== "undefined" ? HUB_LINKS.applying : [],
    pathways: typeof HUB_LINKS !== "undefined" ? HUB_LINKS.pathways : [],
    financialAid:
      typeof HUB_LINKS !== "undefined" ? HUB_LINKS.financialAid : [],
    scholarships:
      typeof HUB_LINKS !== "undefined" ? HUB_LINKS.scholarships : [],
    guides: typeof HUB_LINKS !== "undefined" ? HUB_LINKS.guides : [],
    social: typeof HUB_LINKS !== "undefined" ? HUB_LINKS.social : [],
    newsletters: typeof NEWSLETTERS !== "undefined" ? NEWSLETTERS : [],
    youthLeaders: typeof YOUTH_LEADERS !== "undefined" ? YOUTH_LEADERS : [],
    staff: typeof SSC_STAFF !== "undefined" ? SSC_STAFF : [],
  };
  return map[key] || [];
}

/* ═══════════════════════════════════════════════════════════════════
   RENDERING HELPERS
   ═══════════════════════════════════════════════════════════════════ */
const h = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const ini = (n) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
const BG = (a, b, c) =>
  `linear-gradient(rgba(255,255,255,.82),rgba(255,255,255,.82)) padding-box,linear-gradient(135deg,${a} 0%,${b} 55%,${c} 100%) border-box`;
const isPh = (item) => item.placeholder === true || item.placeholder === "true";
const phHref = (item) => (isPh(item) ? "javascript:void(0)" : h(item.url));
const phClass = (item, color) =>
  isPh(item) ? "is-placeholder" : `card-lift ${color}`;
const phBadge = () =>
  `<span class="placeholder-badge">${h(SITE.comingSoon)}</span>`;
const stickerEl = (tag, bg) =>
  `<span class="sticker" style="display:inline-block;white-space:nowrap;font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:5px 11px;border-radius:9px;background:${bg};color:#fff;transform:rotate(-3deg);box-shadow:0 8px 16px -8px rgba(0,0,0,.35);">${h(tag)}</span>`;

/* ── Slideshow ── */
let SS = { cur: 0, paused: false };
function goTo(i) {
  if (!getData("slideshow").length) return;
  SS.cur =
    ((i % getData("slideshow").length) + getData("slideshow").length) %
    getData("slideshow").length;
  renderSlides();
}
function startTimer() {
  setInterval(() => {
    if (!SS.paused && getData("slideshow").length > 1) goTo(SS.cur + 1);
  }, 7000);
}

function renderSlides() {
  const slides = getData("slideshow");
  document.getElementById("carousel-wrap").hidden = slides.length === 0;
  const active = SS.cur;
  const cont = document.getElementById("slides-container");
  const dots = document.getElementById("dots-container");
  cont.innerHTML = slides
    .map((s, i) => {
      const noImg = !s.image;
      const ctaOk = !isPh(s);
      return `<div style="position:absolute;inset:0;opacity:${i === active ? 1 : 0};z-index:${i === active ? 10 : 1};transition:opacity .8s ease;">
      <div style="position:absolute;inset:0;background:${SLIDE_THEMES[s.theme] || SLIDE_THEMES.sky};"></div>
      <div style="position:absolute;inset:0;background-image:${s.image ? `url("${h(s.image)}")` : "none"};background-size:cover;background-position:center;"></div>
      ${noImg ? `<div class="slide-fallback"><div class="slide-fallback-content"><span class="slide-emoji">${s.emoji}</span><span class="slide-photo-label">${h(SITE.photoPlaceholder)}</span></div></div>` : ""}
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <span class="slide-tag">${h(s.tag)}</span>
        <h2 class="slide-title">${h(s.headline)}</h2>
        <p class="slide-description">${h(s.sub)}</p>
        <a href="${ctaOk ? h(s.url) : "javascript:void(0)"}" ${ctaOk ? 'target="_blank" rel="noopener"' : ""} class="btn-lift" style="display:flex;align-items:center;gap:9px;width:max-content;margin-top:4px;padding:14px 24px;border-radius:999px;background:#fff;color:#0f172a;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;box-shadow:0 16px 32px -14px rgba(0,0,0,.7);${ctaOk ? "" : "opacity:.5;pointer-events:none;"}">${h(s.cta)} →</a>
      </div>
    </div>`;
    })
    .join("");
  if (!cont.querySelector(".slide-nav")) {
    [
      ["‹", "left", -1],
      ["›", "right", 1],
    ].forEach(([ch, side, dir]) => {
      const b = document.createElement("button");
      b.className = "slide-btn slide-nav";
      b.setAttribute("aria-label", dir < 0 ? "Previous" : "Next");
      b.style.cssText = `position:absolute;${side}:16px;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:999px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.22);backdrop-filter:blur(10px);color:#fff;font-size:19px;cursor:pointer;display:grid;place-items:center;z-index:20;`;
      b.textContent = ch;
      b.onclick = () => goTo(SS.cur + dir);
      cont.appendChild(b);
    });
  }
  dots.innerHTML = slides
    .map(
      (_, i) =>
        `<button class="dot-btn" data-i="${i}" aria-label="Slide ${i + 1}" style="width:${i === active ? "30px" : "9px"};height:9px;border-radius:999px;border:0;padding:0;cursor:pointer;background:${i === active ? "#fff" : "rgba(255,255,255,.5)"};"></button>`,
    )
    .join("");
  dots
    .querySelectorAll(".dot-btn")
    .forEach((b) => (b.onclick = () => goTo(+b.dataset.i)));
}

/* ── Filter ── */
const filt = (arr, q) =>
  arr.filter(
    (r) =>
      !q ||
      (r.label + " " + r.sub + " " + (r.tag || "")).toLowerCase().includes(q),
  );
const filtP = (arr, q) =>
  arr.filter((r) => !q || Object.values(r).join(" ").toLowerCase().includes(q));

/* ── Section wrapper ── */
function section(icon, iBg, iBdr, title, sub, subC, bdr, shadow, flex, inner) {
  return `<section style="flex:${flex};min-width:300px;border-radius:34px;padding:28px 26px 30px;background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1.5px solid ${bdr};box-shadow:${shadow};">
    <div class="section-header">
      <span style="width:52px;height:52px;border-radius:18px;display:grid;place-items:center;font-size:25px;background:${iBg};border:1px solid ${iBdr};flex:none;">${icon}</span>
      <div class="section-heading-group"><h2 class="section-title">${title}</h2>
      <p style="margin:1px 0 0;font-size:12.5px;font-weight:700;color:${subC};letter-spacing:.09em;text-transform:uppercase;">${sub}</p></div>
    </div>${inner}</section>`;
}

function cardApply(l) {
  const p = isPh(l);
  return `<a href="${phHref(l)}" ${p ? "" : 'target="_blank" rel="noopener"'} class="${phClass(l, "card-sky")}" style="flex:1 1 235px;min-width:0;display:flex;flex-direction:column;gap:9px;padding:20px;border-radius:22px;border:2px solid transparent;background:${BG("#38bdf8", "#a5f3fc", "#e0f2fe")};backdrop-filter:blur(12px);color:#0f172a;"><span class="application-icon">${l.emoji}</span><span class="application-title">${h(l.label)}</span><span class="application-description">${h(l.sub)}</span>${p ? phBadge() : l.tag ? `<span class="application-tag sticker">${h(l.tag)}</span>` : ""}</a>`;
}
function rowLink(l, color, bg, tagBg) {
  const p = isPh(l);
  return `<a href="${phHref(l)}" ${p ? "" : 'target="_blank" rel="noopener"'} class="${phClass(l, color)}" style="display:flex;align-items:center;gap:15px;padding:17px 19px;border-radius:22px;border:2px solid transparent;background:${bg};backdrop-filter:blur(12px);color:#0f172a;"><span class="resource-icon">${l.emoji}</span><span class="resource-copy"><span class="resource-title-row"><span class="resource-title">${h(l.label)}</span>${p ? phBadge() : l.tag ? stickerEl(l.tag, tagBg) : ""}</span><span class="resource-description">${h(l.sub)}</span></span></a>`;
}
function cardGuide(l) {
  const p = isPh(l);
  return `<a href="${phHref(l)}" ${p ? "" : 'target="_blank" rel="noopener"'} class="${phClass(l, "card-violet")}" style="flex:1 1 235px;min-width:0;display:flex;align-items:center;gap:14px;padding:18px;border-radius:22px;border:2px solid transparent;background:${BG("#a78bfa", "#ddd6fe", "#f5f3ff")};backdrop-filter:blur(12px);color:#0f172a;"><span class="guide-icon">${l.emoji}</span><span class="guide-copy"><span class="guide-title">${h(l.label)}</span><span class="guide-description">${h(l.sub)}</span></span>${p ? `<span class="guide-placeholder placeholder-badge">${h(SITE.comingSoon)}</span>` : `<span class="guide-tag">${h(l.tag)}</span>`}</a>`;
}
function rowSocial(l) {
  const p = isPh(l);
  return `<a href="${phHref(l)}" ${p ? "" : 'target="_blank" rel="noopener"'} class="${phClass(l, "card-pink")}" style="display:flex;align-items:center;gap:15px;padding:17px 19px;border-radius:22px;border:2px solid transparent;background:${BG("#f472b6", "#fbcfe8", "#fdf2f8")};backdrop-filter:blur(12px);color:#0f172a;"><span class="social-icon">${l.emoji}</span><span class="social-copy"><span class="social-title">${h(l.label)}</span><span class="social-description">${h(l.sub)}</span></span>${p ? `<span class="social-placeholder placeholder-badge">${h(SITE.comingSoon)}</span>` : l.tag ? `<span class="social-tag">${h(l.tag)}</span>` : ""}</a>`;
}
function cardNewsletter(n) {
  const p = isPh(n);
  return `<a href="${phHref(n)}" ${p ? "" : 'target="_blank" rel="noopener"'} class="${phClass(n, "card-orange")}" style="flex:1 1 210px;min-width:0;display:flex;flex-direction:column;gap:8px;padding:19px;border-radius:22px;border:2px solid transparent;background:${BG("#fb923c", "#fed7aa", "#fff7ed")};backdrop-filter:blur(12px);color:#0f172a;"><span class="newsletter-header"><span class="newsletter-icon">${n.emoji}</span>${p ? phBadge() : `<span class="newsletter-tag">${h(n.tag)}</span>`}</span><span class="newsletter-title">${h(n.label)}</span><span class="newsletter-description">${h(n.sub)}</span></a>`;
}
function cardYL(p) {
  return `<div class="card-lift card-indigo" style="flex:1 1 250px;min-width:0;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:22px;border:2px solid transparent;background:${BG("#818cf8", "#c7d2fe", "#eef2ff")};backdrop-filter:blur(12px);"><div class="youth-card-header"><span class="youth-initials">${ini(p.name)}</span><span class="youth-identity"><span class="youth-name">${h(p.name)}</span><span class="youth-role">${h(p.role)}</span></span></div><div class="youth-details"><span class="youth-assignment-row"><span class="youth-assignment-icon">🧑‍🎓</span><span><strong class="youth-assignment-label">${h(SITE.assignedLabel)}</strong> ${h(p.assigned)}</span></span><span class="youth-free-row"><span class="youth-free-icon">🕐</span><span><strong class="youth-free-label">${h(SITE.freeLabel)}</strong> ${h(p.free)}</span></span><span class="youth-work-row"><span class="youth-work-icon">📍</span><span><strong class="youth-work-label">${h(SITE.workingLabel)}</strong> ${h(p.work)}</span></span></div><a href="mailto:${h(p.email)}" class="youth-email-button btn-lift-sm btn-indigo"><span class="youth-email-icon">✉️</span><span class="youth-email-address">${h(p.email)}</span></a></div>`;
}
function cardStaff(p) {
  return `<div class="card-lift card-blue" style="flex:1 1 300px;min-width:0;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:22px;border:2px solid transparent;background:${BG("#60a5fa", "#bfdbfe", "#eff6ff")};backdrop-filter:blur(12px);"><div class="staff-card-header"><span class="staff-initials">${ini(p.name)}</span><span class="staff-identity"><span class="staff-name">${h(p.name)}</span><span class="staff-role">${h(p.role)}</span></span></div><div class="staff-details"><span class="staff-room-row"><span class="staff-room-icon">📍</span><span><strong class="staff-room-label">${h(SITE.whereLabel)}</strong> ${h(p.room)}</span></span><span class="staff-hours-row"><span class="staff-hours-icon">🕐</span><span><strong class="staff-hours-label">${h(SITE.hoursLabel)}</strong> ${h(p.hours)}</span></span><span class="staff-about-row"><span class="staff-about-icon">🧑‍🎓</span><span><strong class="staff-about-label">${h(SITE.aboutLabel)}</strong> ${h(p.about)}</span></span></div><a href="mailto:${h(p.email)}" class="staff-email-button btn-lift-sm btn-blue"><span class="staff-email-icon">✉️</span><span class="staff-email-address">${h(p.email)}</span></a></div>`;
}

/* ── Main render ── */
function render() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  const apply = filt(getData("applying"), q);
  const path = filt(getData("pathways"), q);
  const aid = filt(getData("financialAid"), q);
  const money = filt(getData("scholarships"), q);
  const guide = filt(getData("guides"), q);
  const soc = filt(getData("social"), q);
  const news = filt(getData("newsletters"), q);
  const yls = filtP(getData("youthLeaders"), q);
  const staff = filtP(getData("staff"), q);
  const total = [apply, path, aid, money, guide, soc, news, yls, staff].reduce(
    (s, a) => s + a.length,
    0,
  );
  let html = "";
  if (apply.length)
    html += section(
      "🎓",
      "linear-gradient(140deg,#e0f2fe,#f0f9ff)",
      "rgba(125,211,252,.8)",
      h(SECTION_COPY.applying.title),
      h(SECTION_COPY.applying.subtitle),
      "#0284c7",
      "rgba(125,211,252,.75)",
      "0 34px 70px -46px rgba(2,132,199,.95)",
      "1 1 560px",
      `<div class="applications-grid">${apply.map(cardApply).join("")}</div>`,
    );
  if (path.length)
    html += section(
      "🛠️",
      "linear-gradient(140deg,#ccfbf1,#f0fdfa)",
      "rgba(94,234,212,.9)",
      h(SECTION_COPY.pathways.title),
      h(SECTION_COPY.pathways.subtitle),
      "#0d9488",
      "rgba(94,234,212,.85)",
      "0 34px 70px -46px rgba(13,148,136,.9)",
      "1 1 360px",
      `<div class="pathways-list">${path.map((l) => rowLink(l, "card-teal", BG("#2dd4bf", "#99f6e4", "#f0fdfa"), "#0d9488")).join("")}</div>`,
    );
  if (aid.length)
    html += section(
      "💵",
      "linear-gradient(140deg,#d1fae5,#f0fdf4)",
      "rgba(110,231,183,.85)",
      h(SECTION_COPY.financialAid.title),
      h(SECTION_COPY.financialAid.subtitle),
      "#059669",
      "rgba(110,231,183,.8)",
      "0 34px 70px -46px rgba(5,150,105,.9)",
      "1 1 360px",
      `<div class="aid-list">${aid.map((l) => rowLink(l, "card-green", BG("#34d399", "#a7f3d0", "#ecfdf5"), "#059669")).join("")}</div>`,
    );
  if (money.length)
    html += section(
      "🏅",
      "linear-gradient(140deg,#fef3c7,#fffbeb)",
      "rgba(252,211,77,.9)",
      h(SECTION_COPY.scholarships.title),
      h(SECTION_COPY.scholarships.subtitle),
      "#d97706",
      "rgba(252,211,77,.85)",
      "0 34px 70px -46px rgba(217,119,6,.85)",
      "1 1 360px",
      `<div class="scholarships-list">${money.map((l) => rowLink(l, "card-amber", BG("#fbbf24", "#fde68a", "#fffbeb"), "#f59e0b")).join("")}</div>`,
    );
  if (guide.length)
    html += section(
      "📎",
      "linear-gradient(140deg,#ede9fe,#f5f3ff)",
      "rgba(196,181,253,.9)",
      h(SECTION_COPY.guides.title),
      h(SECTION_COPY.guides.subtitle),
      "#7c3aed",
      "rgba(196,181,253,.85)",
      "0 34px 70px -46px rgba(124,58,237,.85)",
      "1 1 560px",
      `<div class="guides-grid">${guide.map(cardGuide).join("")}</div>`,
    );
  if (soc.length)
    html += section(
      "📣",
      "linear-gradient(140deg,#fce7f3,#fdf2f8)",
      "rgba(249,168,212,.95)",
      h(SECTION_COPY.social.title),
      h(SECTION_COPY.social.subtitle),
      "#db2777",
      "rgba(249,168,212,.9)",
      "0 34px 70px -46px rgba(219,39,119,.85)",
      "1 1 360px",
      `<div class="social-list">${soc.map(rowSocial).join("")}</div>`,
    );
  if (news.length)
    html += section(
      "🗓️",
      "linear-gradient(140deg,#ffedd5,#fff7ed)",
      "rgba(253,186,116,.95)",
      h(SECTION_COPY.newsletters.title),
      h(SECTION_COPY.newsletters.subtitle),
      "#ea580c",
      "rgba(253,186,116,.9)",
      "0 34px 70px -46px rgba(234,88,12,.85)",
      "1 1 100%",
      `<div class="newsletters-grid">${news.map(cardNewsletter).join("")}</div>`,
    );
  if (yls.length)
    html += `<section class="youth-section"><div class="youth-section-header"><span class="youth-section-icon">🫂</span><div class="youth-section-heading-group"><h2 class="youth-heading">${h(SITE.youthHeading)}</h2><p class="youth-section-subtitle">${getData("youthLeaders").length} ${h(SITE.youthCount)}</p></div></div><p class="youth-introduction">${h(SITE.youthIntroStart)}<strong class="youth-introduction-emphasis">${h(SITE.assignedLabel)}</strong>${h(SITE.youthIntroEnd)}</p><div class="youth-grid">${yls.map(cardYL).join("")}</div></section>`;
  if (staff.length)
    html += `<section class="staff-section"><div class="staff-section-header"><span class="staff-section-icon">🏫</span><div class="staff-section-heading-group"><h2 class="staff-heading">${h(SITE.staffHeading)}</h2><p class="staff-section-subtitle">${getData("staff").length} ${h(SITE.staffCount)}</p></div></div><div class="staff-grid">${staff.map(cardStaff).join("")}</div></section>`;
  if (total === 0)
    html = `<div class="search-empty"><div class="search-empty-icon">🌤️</div><p class="search-empty-title">${h(SITE.noResults)} "${h(document.getElementById("search").value)}"</p><p class="search-empty-help">${h(SITE.searchHelp)}</p></div>`;
  document.getElementById("bento").innerHTML = html;
}

// Page wording and contact settings are maintained in SITE in data.js.
function renderSite() {
  document.title = SITE.pageTitle;
  document.querySelectorAll("[data-site]").forEach((el) => {
    el.textContent = SITE[el.dataset.site];
  });
  const logo = document.getElementById("school-logo");
  logo.src = SITE.logo;
  logo.alt = SITE.schoolName;
  document.getElementById("contact-link").href = "mailto:" + SITE.email;
  document.getElementById("search").placeholder = SITE.searchPlaceholder;
}

// Boot: no accounts, network data fetches, or publishing controls.
document.addEventListener("DOMContentLoaded", () => {
  renderSite();
  renderSlides();
  const wrap = document.getElementById("carousel-wrap");
  wrap.addEventListener("mouseenter", () => {
    SS.paused = true;
  });
  wrap.addEventListener("mouseleave", () => {
    SS.paused = false;
  });
  startTimer();
  document.getElementById("search").addEventListener("input", render);
  render();
});
