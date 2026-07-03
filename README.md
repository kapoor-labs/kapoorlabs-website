# Anuj Kapoor Portfolio Site

This repository now includes a complete static portfolio website built from your Markdown files.

## What is included

- `index.html` - app shell and navigation
- `styles.css` - modern responsive visual design
- `app.js` - hash routing and Markdown rendering
- Existing Markdown files (`01-home.md` ... `11-contact.md`, `13-ai-leadership-brief.md`, `-kiara-usage`) as content source
- `profilePics/` portraits used in the hero

## How it works

- The website reads your `.md` files directly in the browser.
- Markdown is parsed with `marked` and sanitized with `DOMPurify`.
- Navigation uses hash routes (`#/about`, `#/projects/kiara-db`) so it works on simple static hosts.

## Local preview

Use any static web server. Example with Node:

```bash
npx serve .
```

Then open the displayed local URL.

## Publish to Azure Static Website (Storage Account)

1. Create a Storage Account.
2. Enable **Static website** in the Storage Account.
3. Set index document to `index.html`.
4. Upload all files from this folder to the `$web` container.
5. Open the primary endpoint URL from Azure.

Because this site uses hash routes, deep links continue to work without server-side rewrite rules.

## Optional: Publish to Azure Static Web Apps

If you use Azure Static Web Apps instead of Storage static website hosting, deploy this folder as-is.

## Content update workflow

1. Edit any Markdown file in this repo.
2. Refresh the browser.
3. The page updates automatically from the Markdown source.

## Public site caution

Before publishing, verify all metrics, internal project names, and screenshots are approved for public disclosure and compliant with employer policy.
