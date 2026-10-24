# CV and photography asset-delivery audit

## Goal

Make CV documents and photography assets reliable across desktop and mobile browsers,
and catch missing files, HTML rewrites, invalid media responses, and base-path mistakes
before release. Preserve native PDF viewing/downloading and original-photo downloads.

## Why

Certificate links reportedly open a 404 on desktop and mobile, the resume fails on
mobile Safari, and photography fails on mobile. The checkout contains the three
referenced PDFs and an existing responsive-image fallback. Link presence and a
successful download event do not prove the response contains a PDF or an image.

The live apex and www hostnames do not resolve from this environment. Hosting
rewrite rules and deployed contents therefore remain unverified; local findings
must not be presented as proof of the production root cause.

## Constraints

- Keep the client-side SPA, provider/motion contracts, data modules, and PUBLIC_URL.
- Do not replace or regenerate the resume, certificates, or original photographs.
- Preserve responsive WebP selection and the existing bounded original fallback.
- Keep Chromium sandboxing enabled; add WebKit coverage rather than treating a
  narrow Chromium viewport as Safari.
- Do not add dependencies or assume an undocumented hosting provider.

## Affected files and responsibilities

- `public/service-worker.js`: distinguish app routes from documents/assets and
  reject wrong-MIME cached media without breaking offline route recovery.
- `src/components/AppSpeedDial.tsx`: keep the trigger above the overlapping action
  tray so a small FAB remains tappable in WebKit; preserve the shared layer contract.
- `test/unit/serviceWorker.test.ts`: deterministic navigation and cache regressions.
- `scripts/` and `package.json`: verify shipped asset payloads and optionally probe
  a deployed origin so host rewrites cannot masquerade as successful file delivery.
- `test/e2e/`: real document bytes, responsive image decoding, original fallback,
  direct navigation, mobile WebKit, and production worker coverage.
- `playwright.config.ts`, `scripts/runPlaywrightSuite.js`: persist the focused
  browser regression matrix in local commands.
- `plans/cv-photography-workflow.patch`: preserve the exact CI workflow update for
  manual application by a workflow-authorized maintainer.
- `README.md`, `docs/engineering/testing-strategy.md`: asset hosting contract,
  deployment diagnostics, commands, and explicit physical-iOS limitations.

## Proposed approach

1. Check source media integrity and compile the production app to reproduce the
   reported paths locally before changing working link/UI semantics.
2. Limit worker HTML fallback to same-origin, in-scope application navigations.
   Documents and byte-range requests must retain network status/body/headers.
   Image responses with a non-image MIME must not poison the cache or displace a
   usable offline copy. Bump the worker cache version to retire poisoned entries.
3. Gate source/build/deployed assets on MIME and actual file signatures, not status
   alone. Cover all CV documents and photography source/display assets, reusing the
   source modules and generated manifest rather than a second content inventory.
4. Add focused desktop Chromium, mobile Chromium, and mobile WebKit browser coverage
   for the native CV links and decoded photography images. Include a PUBLIC_URL
   deployment and production worker tests; retain existing failure-injection tests.
5. Document the hosting requirement: real files before SPA fallback; never rewrite
   `/assets/**` (including PDF/WebP), range responses, or the service worker to HTML.
   Record unresolved deployment findings rather than inventing a provider fix.

## Execution steps

1. Audit links, media, worker, host reachability, and current test blind spots.
2. Implement the worker corrections and payload checks with unit regressions.
3. Wire browser projects and prepare CI activation; exercise normal and
   missing-derivative paths.
4. Validate root and subpath deployments; update this plan with actual results.

## Validation plan

- `npm run media:check`
- Targeted Jest tests for assets, display images, CV links, and service worker.
- `npm run lint -- --max-warnings=0` and `npm run typecheck`
- `npm run build` and built-asset validation
- Focused Chromium/mobile WebKit asset browser checks against the production build
- Production service-worker smoke coverage and a `/portfolio` PUBLIC_URL build
- Optional deployed-origin probe when DNS/network access permits

## Risks and rollback

- Returning HTML for a missing document produces a misleading application 404;
  excluding static assets must not remove legitimate SPA deep-link recovery.
- A 200 HTML rewrite is not a missing-file status. Tests must inspect MIME and bytes.
- iOS Safari's native PDF viewer is not identical to Playwright WebKit. Physical
  device and live-host acceptance remain necessary even when automated checks pass.
- Roll back worker and cache tests together; asset verification/browser projects
  can remain as independent diagnostics. No content migration is required.

## Progress notes

- Initial audit: all three referenced PDF files are tracked and have PDF signatures.
  Existing tests check resume download completion, not its contents; no WebKit project
  exists. Photography fallback coverage is desktop-only.
- Confirmed worker issues: every navigation can fall back to HTML, including static
  documents; successful image responses are cached without MIME validation.
- Live requests failed DNS lookup for both `danhenderson.dev` and `www.danhenderson.dev`.
- The first media check could not run because `sharp` is not installed; restore the
  declared dependencies before continuing.
- Dependencies restored; all 61 media sources and 305 built CV/media files pass.
- New unit tests reproduced 11 worker navigation/cache failures before the fix.
- Browser audit found that the speed-dial action tray can intercept the small
  trigger's pointer events. The trigger now stacks above the tray, with touch and
  center-point hit-testing coverage and unchanged public component props.
- CV hash scrolling can drift as preceding sections expand. A layout-dependency
  hypothesis did not resolve this; do not change page orchestration speculatively.
  Certificate tests scroll the section into view as a visitor would. Stabilizing
  hash targets across asynchronous section expansion remains separate UX debt.
- Resume header downloads, PDFs/ranges, and normal responsive photography already
  pass locally in mobile WebKit. The live site's root cause is still unconfirmed.
- Full unit run: 136 suites passed; one command-palette close-timing test failed
  during concurrent browser execution, then its entire suite passed in isolation.
- The final full unit run, without competing browser workloads, passed all 137
  suites / 1,041 tests. No command-palette source changes were needed.
- The old photography fallback test jumped directly to the page bottom, leaving
  intermediate lazy images unloaded. It now scrolls each image into view and
  blocks workers for deterministic network fault injection; all 16 selected
  existing CV-action, photography, and cross-route tests pass.
- New production asset coverage passes 21 cases at the root and 21 under a real
  `/portfolio` deployment. Both resume entry points save PDF bytes; both certificate
  links request PDFs; range responses preserve `%PDF-`; responsive images decode;
  404/200-HTML derivative failures recover covers, detail cover, tiles, and lightbox.
- WebKit's memory-heavy original-image cases run sequentially within that project.
  Native PDF tabs are closed and focus returned before the next certificate click.
  The asset suite uses reduced motion; existing route tests retain normal motion.
- All 20 production smoke cases passed, including the real-worker missing-PDF
  regression, app-shell deep-link recovery, and same-path cache refresh.
- Final lint, typecheck, default/test-runtime builds, media verification, and eager
  bundle gate pass. The CLI also verified all 305 files, MIME types, and PDF ranges
  against the local HTTP deployment. Chromium ran as an unprivileged user with
  sandboxing enabled; no sandbox bypass was introduced.

## Audit outcome and release follow-through

| Finding | Evidence and revision | Remaining action |
| --- | --- | --- |
| Failed PDF navigations could become successful HTML responses | Reproduced in worker unit tests and a controlled browser; file/range requests now bypass HTML fallback | Verify the deployed host serves the three existing PDFs, not an HTML rewrite |
| HTML returned for display-image URLs could poison the image cache | Reproduced with a 200 HTML response and cached/offline cases; enforce image MIME and retire the v2 caches | Verify every deployed WebP candidate and original; atomically deploy the complete build |
| Small CV action trigger could be covered by its action tray | WebKit pointer-interception failure; corrected local stacking and added hit tests | Covered by root/subpath mobile browser projects; CI activation requires the preserved workflow patch |
| Asset tests previously accepted incomplete evidence | Download events without PDF bytes, no WebKit, and unvisited lazy tiles | Build payload gate, deployed-origin audit, mobile projects, range checks, and deterministic lazy-image tests are wired locally; mobile/subpath CI activation is pending |
| CV fragment targets can drift during asynchronous section growth | Observed while reaching certificates on mobile; not a PDF/URL failure | Separate UX follow-up: verify the anchor after preceding sections settle without fighting user scrolling |

The reported production failures are **not claimed resolved on the live site**:
DNS prevented retrieving its responses, and no hosting configuration or deployment
credentials were available in the repository. Source links and files are correct
and the three flows pass locally. Incorrect PDF/WebP host rewrites or incomplete
deployments are consistent with the reports, but remain hypotheses until measured.

Release acceptance:

1. Deploy the complete build and v3 worker atomically. Ensure actual files win over
   SPA fallback and that PDF/WebP MIME and byte-range handling match the README.
2. From the deployed revision, run
   `npm run assets:check -- --url https://danhenderson.dev` and investigate every
   failed status, MIME, signature, range, or byte-equality check.
3. Verify both certificates, both resume controls, and photography on a physical
   iPhone in fresh Safari and an existing controlled session. Confirm the native
   viewer/share-save flow and the return to the site.

Original-photo fallback necessarily transfers larger files. This is intentional
recovery, not a replacement for delivering the generated mobile-friendly assets.

## Workflow publishing constraint

GitHub rejected publication of the original commit because the session app lacks
`workflows` permission for `.github/workflows/build.yml`. The user approved
publishing the remaining changes and preserving the workflow changes separately.
The original workflow-inclusive commit remains on the local
`fix/cv-photography-asset-delivery` branch; the publishable branch does not modify
the workflow file.

`plans/cv-photography-workflow.patch` contains the exact original workflow diff.
A workflow-authorized maintainer must check and apply it with `git apply --check`
and `git apply`, then commit and push the workflow change. It is not applied
automatically. Until then, the existing CI runs the build asset gate and desktop
smoke tests, but not the new mobile projects or subpath matrix.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete: repository audit, confirmed fixes, regression coverage, and plan.
  Workflow activation, live deployment, and physical-iPhone acceptance remain
  external release steps.
