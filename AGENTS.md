# College Office Hub editing instructions

The site is static: `SSC/index.html`, `SSC/data.js`, `SSC/app.js`, and `SSC/logo.png` ship together. No build or account is required for a local preview.

For routine content requests, edit `SSC/data.js`. Preserve the bright existing design, typography, colors, cards, and layout unless the owner requests a design change. Do not invent dates, people, email addresses, links, or claims. Ask for essential missing content. Existing placeholder links are outside routine maintenance unless requested.

- `SITE`: school name, logo, introduction, update badge, office hours and email.
- `HUB_LINKS`: resource cards grouped by category.
- `SLIDESHOW`: announcement order is array order. Add, remove, or move complete objects; do not leave empty objects. Zero slides hides the carousel. Images are optional. Retain the field names and use a supported theme.
- `NEWSLETTERS`: each entry needs a `date` in `YYYY-MM-DD` format. The page sorts newest first and assigns the Newest badge automatically. Retain older editions unless explicitly asked to remove them.
- `YOUTH_LEADERS` and `SSC_STAFF`: people and contact information.

For PDFs or images, use descriptive filenames in `SSC/uploads/` and relative links such as `uploads/october-2026.pdf`. Copy provided files; do not fabricate attachments. All assets deployed here are public.

After edits, run `node scripts/check-content.cjs` and `node --check SSC/app.js` when Node is available. Preview the relevant content, search, carousel, and phone layout after behavior changes. Report what changed and any checks you could not perform. Preview is not publication. Hosting is undecided: do not claim changes are live or introduce hosting dependencies. Help the owner review before publishing.
