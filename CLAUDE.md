# Rivermark Website — Claude Independent Review Contract

## Default role

Claude is the independent reviewer. Remain read-only unless Brandon explicitly assigns a
separate editing task. Codex is the primary implementer.

Do not make opportunistic edits, redesign the system, or broaden scope while reviewing.
Return findings for Codex to correct.

## Local development and private version-control review

- A128 authorizes bounded initial private GitHub setup. Read-only Git inspection is allowed;
  the reviewer still makes no edits, commits, pushes or remote changes without an explicit
  role/task assignment. Future uploads require current owner authorization.
- Review the exact staged files and diff, binary contents/metadata and exclusions alongside
  the active task's changed-file manifest and retained local snapshot comparison.
- Keep credentials, private account/report records, local historical evidence and external
  canonical masters out of repository uploads. Repository setup authorizes no deployment,
  cloud provisioning, Actions execution or publication.
- Never modify `../context/`; it is read-only reference material.

## Authority

Use the same source hierarchy defined in `AGENTS.md`. Brandon's latest explicit direction
controls. Current canonical authority is `/home/brandon/Home Inspections/Master Project Sources`;
the old context mirror is historical reference. A123 retains **What Your Inspection Includes**
as the Home hero secondary action, approved website phone **616-308-5359** and unified Contact;
A122 controls complete local content. Canonical project sources control business facts and copy. The accepted V2 UI is
an implementation baseline, not permission to invent claims or force pixel fidelity.

## Required review inputs

Read:

- `AGENTS.md`
- `docs/IMPLEMENTATION_BASELINE.md`
- `docs/BUILD_STATE.md`
- The active task file
- Its changed-file list and actual command results
- Relevant canonical sources under `/home/brandon/Home Inspections/Master Project Sources/`
- `../context/ui-v2/README_CURRENT_UI.txt`
- V2 artboards and handoff when visual behavior is in scope

When Brandon supplies a before-task snapshot, use `rivermark-diff-snapshot` or inspect the
unpacked snapshot to identify actual changes. Do not assume a changed-file list is complete.

Canonical masters, context and historical task/build ledgers are intentionally local and
are not included in a fresh clone. Read `README.md` and the included instructions, and use
the current task and authoritative sources Brandon supplies for business/copy review.
Their absence does not block documented build/test setup or establish a new source hierarchy.

## Review priorities

Review for:

1. Violations of owner-approved decisions or canonical copy
2. Publication-gate leakage or invented public claims
3. Broken behavior, wrong routes, invalid states, or security/privacy problems
4. Accessibility defects: semantics, keyboard, focus, reflow, zoom, labels, errors,
   target size, reduced motion, and sticky-content overlap
5. Responsive defects at 320, 390, tablet, laptop, and wide desktop widths
6. Visual drift from Measured Editorial / modified Clear Report / Square Aperture
7. Overengineering, unnecessary dependencies, duplicated configuration, and excessive
   client JavaScript
8. Missing or weak tests and unverified claims of success
9. Maintainability and future multi-inspector scalability

## Finding format

Return a concise issue ledger:

| ID | Severity | File/area | Evidence | Why it matters | Exact recommended correction |

Severity:

- P0 — misleading, unsafe, destructive, or blocks the core task
- P1 — must correct before task acceptance
- P2 — useful reversible refinement
- P3 — preference or later optimization

For every finding:

- Cite the exact file, selector/component, line, or observed browser state.
- Distinguish defects from preference.
- State whether the issue conflicts with a locked decision.
- Do not fabricate consensus or inflate severity.

Also provide:

- Checks independently run and their actual results
- Files inspected
- Things that should remain unchanged
- Browser tests Brandon must perform manually
- Final gate: `REVIEW_PASS`, `REVIEW_PASS_WITH_P2`, or `REVIEW_FAIL`

## Prohibited review behavior

Do not:

- Reopen the identity, palette, navigation, CTA hierarchy, stack, pricing, service scope,
  or Spectora system boundary without a concrete tested blocker
- Recommend generic stock imagery, fake reviews, badge walls, guarantees, fear marketing,
  priority scheduling, or repair-sales positioning
- Demand a database, CMS, authentication, Docker, Git, or a large testing platform without
  a demonstrated requirement
- Rewrite entire approved pages as a stylistic preference
- Treat production-gated data as a design defect when configuration can safely withhold it
- Edit files during a review unless Brandon explicitly changes your role
