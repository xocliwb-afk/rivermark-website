# Rivermark Website — Local Implementation Baseline

## Current A131 authorization — October 9, 2026

Brandon authorizes the bounded F1 quote wording and F2 identity schema implementation,
verification, affected records and reviewed explicit-file commit/normal main push. The
repository is temporarily PUBLIC by the owner; older private-only A128 statements below
are historical setup context. Do not change visibility, Actions, Pages or deployment.
Credential/private-source exclusions remain mandatory. This candidate awaits owner visual
sign-off; implementation does not accept Stage 8, freeze the website or authorize launch.
A129 remains paused by owner and A130 is preserved. Future unrelated writes require their
own task authorization. The short next step after explicit sign-off is acceptance/freeze
closeout, not another broad review.


**Status:** Accepted V2 UI baseline; real-browser implementation and refinement in progress  
**Owner:** Brandon Wilcox  
**Working location:** `~/Rivermark/website`  
**Canonical authority:** `/home/brandon/Home Inspections/Master Project Sources`; `~/Rivermark/context` is read-only historical/reference context  
**Version control:** A128 private source repository at https://github.com/xocliwb-afk/rivermark-website on main; initial upload and fresh remote clone verified. Dated local snapshots remain the rollback system.

## Current local framework

- Next.js 16.3.4
- React 19.2.8
- TypeScript 5.9.3
- npm with the reviewed `package-lock.json` included in the authorized source repository
- App Router and `src/` layout
- ESLint
- No Tailwind
- No React Compiler
- Verified private repository: `https://github.com/xocliwb-afk/rivermark-website`, branch `main`; Actions disabled, no Pages or deployment configured

## Product baseline

Rivermark is a proprietary responsive website for an independent residential home
inspection company serving Grand Rapids and broader West Michigan. It is not a customer
mobile app or a Spectora-hosted marketing site.

The website must explain the company, scope, prices, process, benefits, limitations, and
next step; qualify standard work; route unusual work to manual review; and hand authoritative
transaction work to Spectora.

## Locked design baseline

- Measured Editorial with modified Clear Report structure
- Square Aperture — Option B identity
- Warm mineral palette and restrained oxide
- Source Sans 3 primary; IBM Plex Mono for measured data only
- Flat structured surfaces, hairline organization, 6–8px radii, nearly no shadows
- Supplied service-area map in the Home hero and fuller map on Service Area (A124); bounded map/layout corrections under A125
- One dominant `See Price & Availability` action
- `What Your Inspection Includes` as the homepage hero secondary action, linked to Residential (A123)
- One restrained persistent mobile booking action after the hero
- Full approved homepage content sequence retained
- Approved website phone `616-308-5359` and one adaptive Contact form; separate New Construction Interest (A123)
- All 24 local routes/services, 19-page sample and three Resources remain visible (A122); retain prelaunch noindex/nofollow, blocked robots, empty sitemap and inactive promotion
- Stage 8 is in progress; owner re-review, final acceptance, freeze and launch remain separate gates

## Repository boundary

A128 permits reviewed initial source commits and upload to the intended private repository;
later commits/pushes require task authorization. Keep credentials, real environment files,
private account/report records and local review/snapshot/build history outside it. Repository
setup does not authorize Actions execution, deployment, hosting changes or publication.

The following canonical and context paths are external owner-held references, not files
bundled with the repository or prerequisites for the documented build/tests. On a fresh
clone, use `README.md` and these implementation instructions; obtain the current approved
task and canonical sources from Brandon before changes that depend on their authority.
Do not create a second set of canonical masters in the repository.

## Source-of-truth files

Business and decision authority:

- `/home/brandon/Home Inspections/Master Project Sources/PROJECT_FOUNDATION_AND_CURRENT_DECISIONS.md`
- `/home/brandon/Home Inspections/Master Project Sources/PROJECT_STATE.md`
- `/home/brandon/Home Inspections/Master Project Sources/DECISION_LOG.md`
- `/home/brandon/Home Inspections/Master Project Sources/ASSUMPTIONS_AND_OPEN_QUESTIONS.md`

Website authority:

- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_COPY_MASTER.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_CONTENT_BRIEFS_MASTER.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_SITEMAP.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_STRATEGY.md`
- `/home/brandon/Home Inspections/Master Project Sources/VISUAL_DIRECTION.md`
- `/home/brandon/Home Inspections/Master Project Sources/BRAND_IDENTITY_BRIEF.md`
- `/home/brandon/Home Inspections/Master Project Sources/SERVICES_AND_PRICING.md`
- `/home/brandon/Home Inspections/Master Project Sources/WEBSITE_TECHNOLOGY_AND_INTEGRATION_REQUIREMENTS.md`
- `/home/brandon/Home Inspections/Master Project Sources/SPECTORA_IMPLEMENTATION_MASTER.md`
- `/home/brandon/Home Inspections/Master Project Sources/COMPLIANCE_AND_RISK_CHECKLIST.md`

UI implementation references:

- `../context/ui-v2/README_CURRENT_UI.txt`
- `../context/ui-v2/rivermark-final-ui-artboards-v2.dc.html`
- `../context/ui-v2/RIVERMARK_FINAL_UI_HANDOFF_V2_CANDIDATE.md`
- `../context/ui-v2/RIVERMARK_UI_V2_CHANGE_LOG.md`

Identity:

- `../context/identity/RIVERMARK_IDENTITY_PACKET_V2_0_LOCKED_2026-08-31.pdf`
- `../context/identity/asset-library/assets/`

## Build boundaries

- Static/server rendering by default
- Client components only for real interaction
- Typed centralized configuration for public facts, routes, prices, links, and feature states
- Repository-style local Markdown/MDX content; no V1 CMS
- No database until a retained workflow requires persistent website-owned data
- No custom live quote engine or scheduler
- No payment, agreement, customer portal, or inspection report implementation
- No production credentials or secrets during the local UI build

## Current implementation sequence

1. Local foundation and agent governance
2. Design tokens and global shell
3. Full homepage vertical slice
4. Browser click-through and responsive corrections
5. Core conversion pages
6. Remaining routes and conditional-state infrastructure
7. Forms and Spectora shell
8. Local release-candidate checks
9. A128 bounded private GitHub preparation and verified initial upload; deployment remains a separate future owner decision
