# Timeline Site (Astro)

Static, accessible timeline that aggregates blog posts and saved articles (Readwise). Newest items appear at the top; click a node to open details on the right. Deployed on GitHub Pages via Actions.

## Local development

```bash
npm install
npm run dev
```

Mock data is in `src/data/timeline.json`.

## Data generation

- Readwise: set `READWISE_TOKEN` secret in GitHub → used by workflow.
- Blog posts: place Markdown files under `posts/` with frontmatter (`title`, `date`, `description`, `tags`, `slug`).

Manually generate locally:

```bash
READWISE_TOKEN=... npm run generate
npm run build
```

## Deploy

GitHub Actions "Build and Deploy Timeline" builds hourly and on push. It fetches sources, merges to `src/data/timeline.json`, builds Astro, and deploys to Pages.

