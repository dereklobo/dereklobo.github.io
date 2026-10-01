# dereklobo.github.io

Source for my personal website: **https://dereklobo.github.io**

I'm Derek, a full-stack software developer, curious about technology and nature.
This site is hand-built static HTML and CSS, hosted on GitHub Pages.

## Pages

| Page | What it is |
|---|---|
| [Home](https://dereklobo.github.io/) | Intro, featured work and links |
| [About](https://dereklobo.github.io/about.html) | Who I am, what I do, where to find me |
| [Travel map](https://dereklobo.github.io/travel-map.html) | Vintage-style world map with pins for places I've visited |
| [Travel list](https://dereklobo.github.io/travel.html) | Countries and cities with highlights, plus an [Ireland list](https://dereklobo.github.io/travel-Ireland.html) |
| [Cuisines](https://dereklobo.github.io/cuisines.html) | Foods I like |
| [IDF](https://dereklobo.github.io/idf.html) | Interaction Design Foundation accessibility certificate |

## Features

- Light and dark themes (follows the system setting; the choice is remembered)
- Interactive travel map with keyboard-accessible pins
- Accessibility work: skip links, landmarks, WCAG AA contrast, reduced-motion support
- No build step, no framework

## Running locally

Serve the folder with any static server. The map's land layer needs `http://`, not `file://`:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
css/        shared styles (main, about, theme)
images/     photos, certificate, travel map SVG, share image
*.html      one file per page; each *-darkmode.html mirrors its light page
particles.js, bg-particles.js   decorative background
```

## Credits

- World map artwork by [Al MacDonald](https://commons.wikimedia.org/wiki/File:World_map_-_low_resolution.svg), licensed [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- Background hexagons: [particles.js](https://github.com/VincentGarreau/particles.js)
- Flags: [svg-country-flags](https://github.com/hjnilsson/country-flags)

## License

Code is [MIT](LICENSE). Map artwork keeps its CC BY-SA 3.0 licence; photos, text and the IDF certificate are © Derek Lobo, all rights reserved.
