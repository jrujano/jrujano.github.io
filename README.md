# jrujano.github.io

Personal portfolio for **Johan Rujano**, Senior Full Stack Engineer building scalable cloud solutions, event-driven microservices and generative AI on AWS/GCP and Odoo solutions.

The site is a dependency-free static page published with GitHub Pages. It includes a bilingual ES/EN interface, light/dark themes and accessible, reduced-motion-friendly animations.

## Live site

[jrujano.github.io](https://jrujano.github.io/)

## Stack

- Semantic HTML5
- Modern CSS (custom properties, grid, fluid type, `prefers-reduced-motion`)
- Vanilla JavaScript (no build step)
- Google Fonts: Space Grotesk & Inter

## Structure

```text
.
├── index.html            # Page markup (Spanish fallback copy)
├── 404.html              # Custom not-found page
├── assets/
│   ├── css/styles.css    # Design tokens, layout and responsive styles
│   ├── js/i18n.js        # ES/EN copy
│   ├── js/main.js        # Theme, language, navigation and reveal behavior
│   ├── favicon.svg
│   └── og-image.png      # Social sharing card (1200×630)
├── robots.txt
├── sitemap.xml
├── .nojekyll             # Serve files as-is on GitHub Pages
└── README.md
```

## Local preview

No build step is required. From the project root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

This repository is named `jrujano.github.io`, so GitHub Pages serves the root of the `main` branch automatically. Push changes and the site updates:

```bash
git add .
git commit -m "Add developer portfolio"
git push origin main
```

## Customize

- **Copy:** edit both language blocks in `assets/js/i18n.js`. Keep the Spanish text in `index.html` in sync as the no-JavaScript fallback.
- **Colors and type:** edit the design tokens at the top of `assets/css/styles.css`.
- **Links:** update the GitHub, LinkedIn and repository URLs in `index.html`.
- **Profile photo:** embedded as a base64 data URI in `index.html`; the `perfil.webp` source files are git-ignored.
- **Featured projects:** duplicate a `.project-card` in `index.html` and add its copy to `i18n.js`.
- **Social preview:** replace `assets/og-image.png` and keep the `og:image`/`twitter:image` URLs in `index.html`.
- **Email:** add a `mailto:` link to the contact section if you want to publish an address.

## Accessibility notes

- Skip link, semantic landmarks and visible focus states.
- Icon-only controls have accessible labels.
- Animations respect `prefers-reduced-motion`.
- Language switching updates the document language and announces the change.
