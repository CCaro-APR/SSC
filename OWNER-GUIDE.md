# Updating your College Office Hub

Open this project folder in your AI coding tool. Tell it what you want changed. It can edit the files directly; you do not need to copy code into a chat.

## Your usual workflow

1. Open the `SSC` project folder containing this guide.
2. Ask AI for an update using one of the examples below. Attach the newsletter or image if needed.
3. Open `SSC/index.html` in Chrome, or refresh its existing tab, to review the result.
4. Check the new text, click its link, and check the carousel order.
5. Once satisfied, publish using the instructions for your eventual host. Local edits do not update a public website automatically.

## Copy this starting prompt

> I maintain the College Office Hub. Follow AGENTS.md. Update the content I provide, preserve the existing design, and keep previous newsletters unless I request removal. Ask if essential information is missing. Check your changes and help me preview them before publishing. Here is my update:

## Common requests

**New announcement**

> Add this announcement as the first carousel slide: [headline, description, button text, link]. Use the attached image, or an emoji if I have not supplied one. Keep the other announcements.

**Remove or reorder announcements**

> Remove the “FAFSA Night is Thursday” slide. Move “CUNY applications are live” to the first position. Keep everything else.

**New newsletter**

> Add the attached October newsletter dated 2026-10-01. Its title is “October 2026” and description is “[your description]”. Put the PDF in uploads and keep older newsletters.

Newsletters sort by their dates automatically. The newest edition receives the Newest badge. Announcement slides follow the order in the content file.

**People and hours**

> Change [person]'s office hours to [hours] and email to [address]. Also update the office contact information at the bottom if applicable.

## Where things live

| File | Purpose |
| --- | --- |
| `SSC/data.js` | Routine editable content |
| `SSC/index.html` | Page layout and styling |
| `SSC/app.js` | Search, carousel, and card rendering |
| `SSC/logo.png` | School logo |
| `SSC/uploads/` | Your PDFs and announcement images; create when first needed |

Images can be omitted: each announcement also has an emoji and a color theme (`sky`, `pink`, `amber`, `mint`, or `violet`). You can remove all slides and the announcement area will disappear. The pause button lets students stop rotation; reduced-motion settings start it paused.

## Preview and undo

Keep a dated backup of `data.js` before an editing session, or ask AI to save a Git checkpoint of the reviewed state. If an update is wrong, ask AI to undo only that update. For a manual backup, restore the previous `data.js` and refresh Chrome. Keep previously uploaded files until you know they are no longer used.

If the page appears blank, ask AI to check JavaScript syntax and confirm `data.js` and `app.js` remain beside `index.html`.

Ask AI to run `node scripts/check-content.cjs` after each content update. It catches missing fields, invalid newsletter dates, unsupported slide colors, and JavaScript syntax errors. It does not check whether links work or whether announcement details are correct. Node is needed only for this optional local check, not to host or view the site.

The page title, main headline, contact heading, and contact button also live in `SITE` in `data.js`. Keep the headline short so it stays readable on phones.

## Publishing later

The whole inner `SSC/` folder is the website. Give that folder to the school host, or deploy its contents to a static host. Keep filenames and relative paths intact, including uploads. No database, build step, or paid editing dashboard is required. Once a host is selected, add its exact publishing and rollback steps to this guide.
