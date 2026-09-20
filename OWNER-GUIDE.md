# Maintaining aprssc.com with AI

Open this repository in an AI coding tool that can read and edit files. Start with:

> Read AGENTS.md. Update the site using the information below. Preserve the design unless I request a change, don't invent missing facts, run local checks, and give me a manual preview checklist. Don't publish yet. Here is the change: [describe it].

The AI's map in AGENTS.md explains where content, layout, appearance, and behavior live. You do not need to know filenames or write code yourself.

## Example requests

- “Replace the counselor's email with [address] everywhere it appears.”
- “Add this scholarship: [name, description, URL].”
- “Replace the Coming Soon FAFSA guide with this attached PDF and enable the link.”
- “Add this newsletter first, mark it Newest, update the previous badge, and retain older issues.”
- “Replace the youth leaders with this approved roster: [names, roles, assignments, availability, email].”
- “Make the announcement text easier to read on phones.”
- “Add a summer programs section using these links, matching the existing design.”
- “List the remaining placeholder information and tell me what you need from me.”

Provide the actual attachment or destination URL. The AI should ask about essential missing details rather than fabricate them.

## Check locally

Ask the AI to run:

```
node scripts/check-content.cjs
node --test tests/*.test.cjs
```

Then open index.html in your own browser. Alternatively, run `python3 -m http.server 8000` from the repository and open http://localhost:8000. Stop that preview server with Ctrl+C when finished. Node is only needed for local checks; Python is an optional preview server. The website itself needs no package installation, build, or account.

Review the new wording, click changed links and PDFs, try search and announcement controls, and check phone layout. Automated browser checks are deliberately omitted; you perform that review. Local checks cannot certify school facts or external links.

## Publish through a pull request

Repository: https://github.com/CCaro-APR/SSC

1. Start a fresh branch from the latest main before editing.
2. Preview the result and review the changes.
3. Ask the AI to commit and push the branch and open a pull request into main. Your GitHub account needs collaborator access; otherwise use a fork.
4. Review and merge the PR when ready to publish.
5. Confirm the hosting dashboard shows a Ready production deployment for that commit, then check https://aprssc.com.

A push does not automatically create a PR. Subsequent pushes to that branch update an existing PR. A local preview is not publication.

Deploy from the repository root. Keep index.html, data.js, app.js, styles.css, logo.png, and uploaded files together. The hosting account controls the production branch and domain settings; verify those settings before changing deployment configuration.

If a published change is wrong, ask the AI to revert its commit in a new PR. This preserves later work. Do not remove old attachments while their links are still used.

Use CONTENT-REVIEW.md to track information staff still need to supply or verify.
