# Kishorebabu S — Beyond the Interface

A responsive, interactive portfolio built with React, TypeScript, Vite, Lucide, and a selectively loaded Three.js scene. All six chapters, education, three project case studies, two experiments, and contact actions are implemented. It needs no application backend or API keys.

## Develop and build

```sh
npm install
npm run dev
npm run build
npm run preview
```

Vite prints the local development URL. `npm run build` checks TypeScript and produces a static site in `dist/`. Serve that directory through any static host. Keep the asset directory together with `index.html`.

## Edit content

- `src/content.ts`: personal details, experience, project ownership and contributions, technology lists, explanatory AI responses, social links, and live project URLs.
- `src/main.tsx`: reusable sections and interaction components; illustrative dashboard and playground data.
- `src/styles.css`: visual tokens, responsive layouts, reduced-motion and print styles.
- `src/scene.ts`: lazy-loaded Three.js node network. Mobile and reduced-motion visitors receive CSS orbit illustrations. The renderer caps pixel density and pauses offscreen and when the page is hidden; a CSS fallback remains when WebGL is unavailable.
- `public/assets/kishorebabu.png`: transparent portrait prepared from the image pasted into chat with the built-in image tool. It is a generated cutout based on the reference and may differ slightly from the source. Replace with the original file if available, keeping the same filename, to preserve the original photo exactly.
- `index.html`: title, description, social metadata, canonical URL, Person structured data, font loading, and a JavaScript-free content fallback.
- `public/favicon.svg` and `public/social-preview.svg`: vector branding and preview artwork. For platforms that require raster social images, provide a PNG/JPEG and update `og:image`.

Social URLs and project URLs are intentionally empty. Add valid HTTPS links in `src/content.ts` to show them. Empty values never generate dead links. If hosting on another domain, update `profile.canonicalUrl` and the canonical/OG URL fields in `index.html` together.

## Interactions

- Six-section navigation with active chapter, mobile disclosure, Escape dismissal, native scrolling, skip link, and scroll progress.
- Clickable capability nodes and expandable professional experience.
- Interngo: six functional area selectors with changing illustrative data.
- FC Labs: four tabs with arrow-key and Home/End navigation.
- AOKAH: seven explanatory RAG stages and two predefined conversation examples.
- All three projects expand into complete in-page contribution and technology case studies.
- Skill category tabs with keyboard navigation and links to related projects.
- LeetCode concept with category filters and problem selection.
- Tokenizer concept with real word/punctuation splitting, an explicit illustrative label, character limit, and empty state. It is not an LLM tokenizer.
- Mail links, email copying, full contact copying, and success/failure feedback.
- Ctrl/Cmd + K command menu, searchable actions, native dialog focus management, Escape, and backdrop dismissal.

Dashboard values are illustrative sample data. No live project URLs, social profiles, achievements, outcomes, proficiency percentages, or real AI connections are fabricated. FC Labs explicitly credits frontend work in a four-member team.

## Browser verification

The smoke suite checks desktop/mobile/tablet layouts, all project interactions, case studies, keyboard tabs, command dialog focus, clipboard content, portrait loading, mobile navigation, reduced motion, and runtime errors. It starts and stops its own Vite server.

Install the browser used by the included Playwright suite:

```sh
npx playwright install chromium
npm test
```

For an existing Playwright installation, set `PLAYWRIGHT_MODULE` to its absolute `index.mjs` path. The script uses the standard Playwright browser installation unless `BROWSER_EXECUTABLE` is set. Screenshots are written into ignored `test-results/`.

## Sites publication

`.openai/hosting.json` stores the private Site identity and static output directory. Source is synchronized through the Sites workflow helper; the deployment archive is built from that exact source commit. Do not create a second Site or replace its ID. Publishing preserves the Site audience. The owner can change access through Sites when ready to share publicly.

## Portrait preparation

Mode: built-in imagegen, background-extraction edit. Prompt: “Export the user's pasted portrait as a clean web asset with actual transparent background. Preserve the person's exact face, identity, glasses, hair, beard, skin tone, pose, light blue shirt, crop and existing slightly illustrated photographic appearance as closely as possible. Change only any black background to transparency. Do not redesign, beautify, reimagine, recolor, change clothing or add anything. Maintain the waist-up portrait composition. No text, no border, no decorative graphics.”

Saved asset: `public/assets/kishorebabu.png`.
