// Local maintenance check. No installation needed: node scripts/check-content.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.resolve(__dirname, '../SSC/data.js');
const errors = [];
let data;
try {
  data = vm.runInNewContext(fs.readFileSync(file, 'utf8') +
    '\n;({SITE,HUB_LINKS,NEWSLETTERS,SLIDESHOW,YOUTH_LEADERS,SSC_STAFF})', {}, {timeout:1000});
} catch (error) {
  console.error(`Cannot read content: ${error.message}\nAsk AI to fix SSC/data.js before publishing.`);
  process.exit(1);
}
function fields(row, names, location) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    errors.push(`${location}: expected a content entry.`);
    return false;
  }
  for (const name of names) {
    if (typeof row[name] !== 'string') errors.push(`${location}.${name}: must be quoted text.`);
  }
  return true;
}
function rows(value, names, location, extra = () => {}) {
  if (!Array.isArray(value)) { errors.push(`${location}: must be a list.`); return; }
  value.forEach((row, i) => {
    const label = `${location}[${i + 1}]`;
    if (fields(row, names, label)) extra(row, label);
  });
}
fields(data.SITE, ['pageTitle','headlineStart','headlineMiddle','headlineHighlight','contactHeading',
  'contactButton','staffLocation','searchHelp','schoolName','logo','updateLabel','intro',
  'officeDetails','walkInHours','email'], 'SITE');
for (const category of ['applying','pathways','financialAid','scholarships','guides','social']) {
  rows(data.HUB_LINKS?.[category], ['emoji','label','sub','url','tag'], `HUB_LINKS.${category}`);
}
rows(data.NEWSLETTERS, ['date','emoji','label','sub','url','tag'], 'NEWSLETTERS', (row, label) => {
  const date = typeof row.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.date)
    ? new Date(`${row.date}T00:00:00Z`) : new Date(NaN);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== row.date)
    errors.push(`${label}.date: use a real calendar date in YYYY-MM-DD format.`);
});
rows(data.SLIDESHOW, ['tag','headline','sub','cta','url','image','emoji','theme'], 'SLIDESHOW', (row,label) => {
  if (!['sky','pink','amber','mint','violet'].includes(row.theme))
    errors.push(`${label}.theme: choose sky, pink, amber, mint, or violet.`);
});
rows(data.YOUTH_LEADERS, ['name','role','assigned','free','work','email'], 'YOUTH_LEADERS');
rows(data.SSC_STAFF, ['name','role','room','hours','about','email'], 'SSC_STAFF');
if (errors.length) {
  console.error('Content needs attention:\n' + errors.map(error => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Content structure passed. Preview the site before publishing.');
  console.log('This check does not verify link destinations or factual accuracy.');
}
