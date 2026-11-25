# David Eneasato

Personal site. Vite + React, fully static, deployed on Vercel.

```bash
npm install
npm run dev      # local site at http://localhost:5173
npm run build    # production build into dist/
```

## Posting a note

A note is a Markdown file in `content/notes/`. There is no CMS and no database: you add a file, commit it, and Vercel rebuilds the site. It is live about a minute later.

1. Pick a short address for the note, in lowercase with dashes: `why-i-cache-early`.
2. Create `content/notes/why-i-cache-early.md`. The filename is the address, so the note will live at `/notes/why-i-cache-early`.
3. Start the file with a title and a date, then write:

   ```md
   ---
   title: Why I cache early
   date: 2026-11-20
   ---
   Body in Markdown.
   ```

4. Commit to `main`. That's it.

Notes are sorted by `date`, newest first. The three newest also show on the home page. Use the `YYYY-MM-DD` date format.

### From your phone (GitHub web editor)

1. Open the repository on github.com in your phone's browser and go into `content/notes`.
2. Tap **Add file**, then **Create new file**.
3. Type the filename, for example `why-i-cache-early.md`.
4. Paste the title and date block from above, change them, and write the note under it.
5. Tap **Commit changes**, keep "Commit directly to the main branch", and confirm.

Vercel picks up the commit and redeploys. To fix a typo later, open the file on GitHub, tap the pencil icon, edit, and commit again. To take a note down, open it and choose **Delete file**.

### Markdown you can use

`## Subheading`, `**bold**`, `*italic*`, `[link text](https://example.com)`, `- list item`, `> quote`, `` `inline code` `` and fenced code blocks with three backticks.

`content/notes/sample-how-notes-work.md` is a sample that shows the format. Delete it after posting your first real note.

## Editing the rest of the site

- Work history, numbers and links: `src/content.js`
- Styles and design tokens: `src/styles.css`
- Portrait: `public/portrait-480.webp` and `public/portrait-960.webp` (4:3 crops of `public/myself.png`)

## Design

The design contract is in `DESIGN.md`. Colours: Ghost White, Cool Gray and Freezing Blue as the base,
with Cyan Navy `#0C2743` and Neon Pear `#D4F604` as accents. Type: Switzer and Gambetta from Fontshare,
self-hosted in `public/fonts` (ITF Free Font License).
