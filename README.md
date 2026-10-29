# KISHORE.EXE — The playable portfolio

A complete browser-based 3D exploration game for Kishorebabu S, Full-Stack Developer / AI Engineer. React and TypeScript provide the accessible interface; Three.js provides the original procedural world, articulated explorer, third-person camera, and graphics effects. The existing portrait remains in the profile terminal and Quick Portfolio.

## Run locally

```sh
npm ci
npm run dev
```

Vite prints the local URL. Build and inspect the production assets with:

```sh
npm run build
npm run preview
```

The production output is `dist/`, deployable on a static host. There is no application backend, live LLM, messaging integration, or API key requirement.

## Play

- **WASD / arrow keys:** move relative to the camera, with acceleration and collision boundaries.
- **Drag the world:** orbit the third-person camera.
- **Shift:** sprint. **Space:** jump.
- **E / Enter:** interact with a nearby terminal or portal.
- **M:** open the fast-travel world map.
- **J:** mission journal. **Tab while the world canvas has focus:** mission journal. Shift+Tab exits the canvas to the ordinary interface navigation.
- **Escape:** pause or close the current panel.
- **R:** reset camera. **H:** hide/restore HUD for screenshots.
- **Mobile:** pointer joystick, drag camera, jump control, sprint toggle, and large contextual interaction prompt.

The bottom destination dock and world map provide immediate fast travel. Walk toward a project portal and interact to enter its distinct 3D room; interact again with the room’s mission terminal to open the project. The room’s exit portal and “Return to hub world” action bring you back. All six zones and all project case studies are available from the start.

**Quick Portfolio** is available from the welcome screen, HUD, pause menu, and every terminal. It contains all professional information using the same content source. Switching modes preserves the current game position and progress.

## Missions

1. **Identity terminal:** activate the frontend, backend, and AI holograms.
2. **Career timeline:** activate both career gates.
3. **Interngo / Restore the workflow:** connect Attendance → Performance → Resources → Helpdesk → Analytics → Daily report, then trigger a simulated Slack update. Incorrect connections produce helpful feedback; no real message is sent.
4. **FC Labs / Activate the campus:** use a fictional dataset to identify incomplete workshop participation, the correct trainer, and the top sample score, then unlock the overview.
5. **AOKAH / Awaken the AI core:** choose a fictional PDF/CSV source, extract and normalize its example text, select relevant context, and trigger a predefined grounded response. No document is uploaded and no LLM is called. This is an educational RAG illustration, not an exact proprietary architecture.
6. **Skill nexus:** connect an illustrative full-stack or AI technology pipeline. The full skills list is always visible independently of the puzzle.
7. **Experimental lab:** inspect an illustrative problem tile and enter text in a functional Unicode word/punctuation segmenter. It is explicitly not a model-specific tokenizer. The education archive is available here too.
8. **Connection portal:** discover the contact terminal. Sending an email is not required to complete this mission.

Eight optional mission badges plus the final Universe Explorer achievement represent **visitor game exploration only**, not professional awards, certifications, or career achievements. Puzzles can be revisited or replayed.

## Progress, audio, and accessibility

- Progress stays in memory by default. “Remember progress on this device” opts into browser storage under `kishore-exe-v2`. Turning it off removes this game’s saved state; blocked or unavailable storage leaves the game usable for the current session.
- Restored data is validated and bounded. Resetting local progress requires a second in-interface confirmation. Returning to the hub preserves discoveries.
- Audio is off on every fresh page load, even with saved preferences. A user gesture enables original Web Audio ambient tones and interaction sounds. There are no audio assets or copyrighted soundtracks.
- Settings include three graphics presets, reduced motion, particles, higher contrast, optional audio, and opt-in storage.
- Graphics adapt downward when the measured frame rate is low. Rendering pauses while Quick Portfolio is visible or the document is hidden; a paused world renders only occasional static updates. Pixel density is capped, distant buildings/windows use instancing, and Three.js is loaded separately from the initial interface.
- Native dialogs include explicit focus wrapping, Escape dismissal, visible close controls, and focus restoration. There are no timed challenges or required precision platforming.
- If WebGL cannot initialize or its context is lost, tap-to-explore mode preserves every terminal and mission. Quick Portfolio remains available. A basic professional profile and email are also present without JavaScript.

## Editable content and architecture

- `src/content.ts`: verified personal details, professional summary, experience, projects, ownership, contributions, technologies, education, experiments, and optional social/project URLs. Empty URLs never become broken links.
- `src/game/config.ts`: zones, positions, mission definitions, controls, fictional campus/document datasets, and educational technology pipelines.
- `src/game/logic.ts`: walkable surfaces, collision clearance, sequence validation, text processing, and saved-progress validation.
- `src/game/world.ts`: original procedural architecture, six destinations, three project realms, interactable objects, articulated avatar, reusable geometry/materials, instanced skyline, and visual mission state.
- `src/game/engine.ts`: input, actual movement/jump simulation, distance-based interactions, camera orbit/follow/collision, project transitions, adaptive rendering, and resource cleanup.
- `src/game/audio.ts`: original synthesized audio with explicit activation.
- `src/game/missions.tsx`: deterministic mission controls, skill puzzle, education archive, grid explorer, and text segmenter.
- `src/game/panels.tsx`: accessible sheets, shared verified content, project case studies, map, journal, and Quick Portfolio.
- `src/main.tsx`: app modes, state, progress, HUD, input routing, joystick, settings, and rendering fallback.
- `src/styles.css`: responsive visual system, higher contrast, reduced motion, and printable Quick Portfolio.

Add valid HTTPS profiles under `profile.socials` in `src/content.ts`; add actual project links in each project’s `url`. None were supplied, so none are invented. The site’s canonical URL is in the content configuration and `index.html`; update both when changing domain. `public/social-preview.svg` is vector preview artwork; replace its OG reference with a PNG/JPEG for social platforms requiring raster images.

The existing `public/assets/kishorebabu.png` is an AI-prepared transparent cutout based on the previously pasted portrait. It may differ slightly from the original. Replace it with the original file at the same path if exact preservation is desired. No new portrait was generated for this redesign.

## Verification

```sh
npx playwright install chromium
npm test
```

`npm run test:logic` checks walkable ground/bridges, collision clearance, correct and incorrect mission sequences, whitespace processing, Unicode segmentation (including combining marks), and defensive progress restoration.

`node tests/browser.mjs` starts and stops a local Vite server and checks actual keyboard movement, sprint, jump, mouse camera orbit/reset, pause, dialog focus, fast travel, all three 3D project-room entries, all missions and invalid puzzle input, case study accuracy, clipboard actions, eight badges, mode switching, sound controls, opt-in persistence, five viewport sizes, pointer joystick input, reduced motion, WebGL failure fallback, runtime exceptions, and missing local assets. It writes screenshots into ignored `test-results/`. Set `BROWSER_EXECUTABLE` to use a specific Chromium binary.

Headless browser checks verify functionality and layout, not a guaranteed frame-rate target on physical mobile hardware. No Lighthouse score or universal FPS claim is made.

## Sites hosting

The existing Site identity is preserved in `.openai/hosting.json`, with `dist/` as the static directory. The Sites workflow helper builds, commits, pushes, and packages that exact source state. Publication preserves the current audience. Do not create a new Site or replace its project ID to update this application.
