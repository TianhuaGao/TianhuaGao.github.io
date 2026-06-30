# Tianhua Gao Personal Website

This repository contains the source for Tianhua Gao's personal academic website. It is built with Hugo and HugoBlox.

## Local Preview

Install the required tools first:

- Hugo Extended, preferably matching the deployed version in `netlify.toml`: `0.150.1`
- Node.js, matching the deployed major version in `netlify.toml`: `22`
- pnpm, matching `package.json`: `10.14.0`

Then run:

```bash
corepack enable
corepack prepare pnpm@10.14.0 --activate
pnpm install
pnpm dev
```

Open:

```text
http://localhost:1313/
```

The preview server reloads automatically when you edit content, configuration, or assets.

If the project-local toolchain has been installed under `.tools/`, you can also run:

```bash
./scripts/dev.sh
```

or call pnpm through:

```bash
./scripts/pnpm.sh check
```

## Useful Commands

```bash
pnpm dev
```

Start a local preview at `http://localhost:1313/`.

```bash
pnpm dev:1314
```

Start a local preview at `http://localhost:1314/` if port `1313` is already occupied.

```bash
pnpm dev:lan
```

Start a preview server bound to `0.0.0.0`, useful when previewing from another device on the same network.

```bash
pnpm build
```

Build the production site into `public/`.

```bash
pnpm check
```

Run a stricter local build with Hugo path and i18n warnings enabled.

## Repository Layout

- `content/`: public website content, including publications, projects, events, and profile pages
- `config/_default/`: Hugo and HugoBlox configuration
- `assets/`: source media and custom CSS
- `static/`: static files copied directly into the published site
- `layouts/`: local layout overrides and partials
- `AGENTS.md`: durable notes for AI coding agents working in this repository

## Deployment

Netlify deployment is configured in `netlify.toml`. The production build runs Hugo, then builds a Pagefind search index from the generated `public/` directory.

## License

This repository is source-available for viewing and deploying Tianhua Gao's personal academic website. Tianhua Gao's original content, assets, site-specific configuration, and custom code are all rights reserved unless explicit written permission is granted.

Copying, modification, redistribution, sublicensing, or derivative development from this repository is not permitted.

Third-party templates, themes, libraries, workflows, and dependencies remain under their respective licenses. See `LICENSE.md` for details.
