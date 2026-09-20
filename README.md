# College Office Hub — aprssc.com

Static school resource site maintained through AI-assisted file edits and GitHub pull requests. No dashboard, database, build step, or runtime package installation.

Start with [OWNER-GUIDE.md](OWNER-GUIDE.md). AI tools should read [AGENTS.md](AGENTS.md). Pending school information is tracked in [CONTENT-REVIEW.md](CONTENT-REVIEW.md).

- `data.js`: content and page wording
- `index.html`: page structure
- `styles.css`: appearance
- `app.js`: rendering, search, slideshow

Preview: open index.html, or run `python3 -m http.server 8000` and visit http://localhost:8000.

Check: `node scripts/check-content.cjs` and `node --test tests/*.test.cjs`.

Deploy from the repository root. Review on a feature branch; merge a PR into main when ready to publish.
