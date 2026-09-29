# ryannortham.dev

Source for [ryannortham.dev](https://ryannortham.dev), a static personal site
and technical blog built with [Astro](https://astro.build).

The visual foundation is [Astro Nano](https://github.com/markhorn-dev/astro-nano),
adapted for this site and published through GitHub Pages.

## Development

Requirements:

- Node.js 22.12 or later
- pnpm

Install dependencies and start the local development server:

```shell
pnpm install
pnpm dev
```

Run the production build and Astro checks:

```shell
pnpm build
```

## Content

Content is split across `src/content/posts`, `src/content/work`, and
`src/content/projects`. Public images live in `public`.

## Deployment

`pnpm build` generates the `dist` directory. GitHub Pages serves the built site
from this repository's `gh-pages` branch at `ryannortham.dev`. Update that branch
when publishing changes from `main`.

## License

The Astro Nano-derived code is available under its MIT license. Site content
and images remain the property of their respective owners.
