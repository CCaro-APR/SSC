# College Office Hub — AI editing map

This static site serves aprssc.com. Work from the repository root. There is no admin dashboard, database, account system, Apps Script backend, or build step.

## Find the right file

| Request                                                                    | Location                                                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| School identity, logo, page wording, contact email, hours, search messages | `data.js` → `SITE`                                                                                                             |
| Resource headings and subtitles                                            | `data.js` → `SECTION_COPY`                                                                                                     |
| Resource links, scholarships, guides, social links                         | `data.js` → `HUB_LINKS`                                                                                                        |
| Announcements and order                                                    | `data.js` → `SLIDESHOW`                                                                                                        |
| Newsletters and order                                                      | `data.js` → `NEWSLETTERS`                                                                                                      |
| Names, assignments, availability, emails                                   | `data.js` → `YOUTH_LEADERS` / `SSC_STAFF`                                                                                      |
| Hero, footer, containers, script/style loading                             | `index.html`                                                                                                                   |
| Colors, fonts, spacing, responsive layout                                  | `styles.css` (computed styles also remain in `app.js`)                                                                         |
| Search, slideshow, card markup, section order                              | `app.js` → `render`, `renderSlides`, `cardApply`, `rowLink`, `cardGuide`, `rowSocial`, `cardNewsletter`, `cardYL`, `cardStaff` |
| Supplied images and PDFs                                                   | `uploads/` (create when needed); existing logo is `logo.png`                                                                   |
| Local checks                                                               | `scripts/check-content.cjs`, `tests/site.test.cjs`                                                                             |
| Maintainer workflow and pending facts                                      | `OWNER-GUIDE.md`, `CONTENT-REVIEW.md`                                                                                          |

Search for visible wording in data.js, then follow its property name into app.js or the data-site attribute in index.html. CSS sections are grouped by their owning component. Static styles live in CSS; computed colors/positions remain beside rendering logic. Use descriptive names for new classes.

## Editing rules

- Preserve the current design unless a design change is requested. Layout and functionality can be changed when asked; this map does not limit the AI to content edits.
- Never invent school facts, dates, deadlines, contacts, URLs, or attachments. Ask for essential missing information. Existing content is not automatically verified; consult CONTENT-REVIEW.md.
- SITE and SECTION_COPY contain plain text, not HTML. Keep escaping when rendering content.
- Copy complete entries and retain required fields. `placeholder: true` disables a link with a Coming Soon badge; remove it or set false only after supplying a real URL. Use booleans, not strings.
- Newsletter and announcement order follows array order. Newsletter `tag` badges are explicit; there is no automatic date sorting. Retain older newsletters unless removal is requested.
- Slideshow themes: sky, pink, amber, mint, violet. Empty `image` uses the emoji fallback. An empty SLIDESHOW hides the carousel.
- Use https:// URLs or relative files such as `uploads/october-2026-newsletter.pdf`. Copy actual supplied files. Everything deployed with this site is public.
- Adding a card only requires data.js. Adding a category also requires SECTION_COPY, getData()/render() in app.js, and the category list in scripts/check-content.cjs.
- When updating office hours/location, search related SITE and staff entries. Do not assume every staff member has the same schedule.

## Verify and publish

Run `node scripts/check-content.cjs` and `node --test tests/*.test.cjs`. Checks cover content shape, syntax, and local file existence, not school facts or external website availability.

The owner prefers to perform browser checks manually to limit cost. Do not launch Chromium, Playwright, or other automated browsers unless explicitly requested. Provide a short manual checklist for the affected behavior and phone layout.

Use a new branch from current main. Review the diff, push the branch, and open a PR into main when requested. More pushes update that PR. Merging main may deploy production; do not merge or push directly to main without an explicit request. Report local, pushed, merged, deployed, and verified-live states accurately.
