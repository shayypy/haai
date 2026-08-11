# Howrse Alternate Apple Index (HAAI)

A static site built with React Router (Declarative Mode) and Bun, deployed to GitHub Pages.

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

#### Data Source

The master data is an SQLite database managed in DBeaver. It is exported to JSON, which is then passed to `import.ts` to create `data.json` and `stats.json`. Do not modify either of those files as they are both automatically generated. This might seem like an awkward workflow but it works sufficiently well. To submit a data correction, notify us so that we can manually deal with it.

## Building for Production

Create a production build:

```bash
bun run build
```

This outputs a fully static site to `dist/`. Preview it locally with:

```bash
bun run preview
```

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site with Bun and publishes `dist/` to GitHub Pages via `actions/deploy-pages`.

The repo's Pages source must be set to **GitHub Actions**. The site is served at the custom domain in [`public/CNAME`](public/CNAME); update that file (and the domain's DNS) if the domain changes.

Because this is a client-side-routed single-page app, [`public/404.html`](public/404.html) redirects unknown paths back to `index.html` so deep links and refreshes work on GitHub Pages' static hosting.

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/).
