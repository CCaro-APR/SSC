// Run from any directory: node scripts/check-content.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
let content;
try {
  const context = vm.createContext({});
  vm.runInContext(read("data.js"), context, { timeout: 1000 });
  content = vm.runInContext(
    "({SITE,SECTION_COPY,HUB_LINKS,NEWSLETTERS,SLIDESHOW,YOUTH_LEADERS,SSC_STAFF})",
    context,
  );
  new vm.Script(read("app.js"));
} catch (error) {
  console.error("JavaScript/content error:", error.message);
  process.exit(1);
}
function fields(item, keys, label) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    errors.push(`${label}: expected an object`);
    return false;
  }
  for (const key of keys)
    if (typeof item[key] !== "string")
      errors.push(`${label}.${key}: expected text`);
  if ("placeholder" in item && typeof item.placeholder !== "boolean")
    errors.push(`${label}.placeholder: use true or false`);
  return true;
}
function asset(value, label, optional = false) {
  if (typeof value !== "string") return;
  if (optional && (!value || value === "#")) return;
  if (/^https?:\/\//i.test(value)) {
    try {
      new URL(value);
    } catch {
      errors.push(`${label}: invalid URL`);
    }
    return;
  }
  if (!value || /^[a-z][\w+.-]*:/i.test(value) || value.startsWith("//")) {
    errors.push(`${label}: use https:// or a local file path`);
    return;
  }
  const file = path.resolve(root, value.replace(/^\//, "").split(/[?#]/)[0]);
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile()
  )
    errors.push(`${label}: local file missing: ${value}`);
}
function rows(list, keys, label) {
  if (!Array.isArray(list)) {
    errors.push(`${label}: expected a list`);
    return;
  }
  list.forEach((item, i) => {
    const name = `${label}[${i}]`;
    if (!fields(item, keys, name)) return;
    if ("url" in item)
      asset(item.url, `${name}.url`, item.placeholder === true);
    if ("image" in item) asset(item.image, `${name}.image`, true);
    if ("email" in item && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email))
      errors.push(`${name}.email: invalid address`);
    if (
      "theme" in item &&
      !["sky", "pink", "amber", "mint", "violet"].includes(item.theme)
    )
      errors.push(`${name}.theme: unsupported color`);
  });
}
const siteKeys = [...read("app.js").matchAll(/SITE\.(\w+)/g)].map((m) => m[1]);
for (const match of read("index.html").matchAll(/data-site="([^"]+)"/g))
  siteKeys.push(match[1]);
fields(content.SITE, [...new Set(siteKeys)], "SITE");
asset(content.SITE.logo, "SITE.logo");
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.SITE.email))
  errors.push("SITE.email: invalid address");
for (const key of [
  "applying",
  "pathways",
  "financialAid",
  "scholarships",
  "guides",
  "social",
]) {
  rows(
    content.HUB_LINKS?.[key],
    ["emoji", "label", "sub", "url", "tag"],
    `HUB_LINKS.${key}`,
  );
}
for (const key of [...Object.keys(content.HUB_LINKS), "newsletters"])
  fields(
    content.SECTION_COPY?.[key],
    ["title", "subtitle"],
    `SECTION_COPY.${key}`,
  );
rows(
  content.NEWSLETTERS,
  ["emoji", "label", "sub", "url", "tag"],
  "NEWSLETTERS",
);
rows(
  content.SLIDESHOW,
  ["tag", "headline", "sub", "cta", "url", "image", "emoji", "theme"],
  "SLIDESHOW",
);
rows(
  content.YOUTH_LEADERS,
  ["name", "role", "assigned", "free", "work", "email"],
  "YOUTH_LEADERS",
);
rows(
  content.SSC_STAFF,
  ["name", "role", "room", "hours", "about", "email"],
  "SSC_STAFF",
);
for (const match of read("index.html").matchAll(/(?:src|href)="([^"]+)"/g))
  asset(match[1], "index.html asset");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Content, JavaScript syntax, and local asset checks passed.");
  console.log(
    "External link availability, school facts, and visual layout still need review.",
  );
}
