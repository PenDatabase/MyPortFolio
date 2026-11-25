---
title: Sample note, how posting works
date: 2026-11-20
---
**This is a sample note. Delete this file once your first real note is up.**

Every note is one Markdown file in `content/notes/`. The filename becomes the address, so `content/notes/why-i-cache-early.md` lives at `/notes/why-i-cache-early`.

The top of each file holds a title and a date:

```md
---
title: Why I cache early
date: 2026-11-20
---
Your note starts here.
```

## What Markdown gives you

Paragraphs are separated by a blank line. Use `##` for a subheading, `**bold**` for emphasis, `-` for a list, backticks for `inline code`, and three backticks for a code block.

- Notes are sorted newest first by their date.
- The three newest show on the home page.
- Commit the file and the site rebuilds on its own in about a minute.
