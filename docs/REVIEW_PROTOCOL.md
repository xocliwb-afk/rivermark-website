# Rivermark Website — Local Review Protocol

## Roles

- Brandon: product owner and final decision authority
- Codex: primary implementer
- Claude: independent read-only reviewer by default
- ChatGPT project: source reconciliation, task scoping, and decision control

## Local snapshots and private version-control review

1. Stop the dev server before a milestone snapshot.
2. Run `rivermark-snapshot <before-task-label>`.
3. Record the exact snapshot path in the task file.
4. Codex implements the narrow task.
5. Codex records every changed file and actual check result.
6. Compare the task scope with the Git diff and exact staged-file list when version control
   is available; use `rivermark-diff-snapshot <snapshot.tar.gz>` for retained local evidence.
   Inspect staged binary content/metadata and exclude credentials, private reports/account
   records, machine history and external canonical masters before any commit.
7. Claude reviews the task, changed files, browser result, and canonical sources without
   editing.
8. Codex corrects supported P0/P1 findings.
9. Brandon clicks through the result.
10. Run the required checks again.
11. Run `rivermark-snapshot <accepted-task-label>` after acceptance.
12. Commit/push only when the current owner-authorized task includes it, after the reviewed
    scope and required checks are complete. A128 permits the bounded initial private source
    upload; it does not authorize future uploads, public visibility, Actions or deployment.

Snapshot utilities, historical task/build ledgers and authoritative canonical/context files
are local owner-held material, not clean-clone build dependencies. A fresh clone uses
`README.md`, the included implementation instructions and the current task/evidence Brandon
supplies. Missing historical ledgers do not authorize business or copy changes.

## Review evidence

A completion claim must include:

- Task acceptance criteria
- Changed/added/deleted file list
- Commands actually run
- Exit status or visible result
- Browser states reviewed
- Known limitations
- Publication gates still withheld

“Should pass,” “looks correct,” and mock-only evidence do not count.

## Browser checkpoints

At meaningful milestones review:

- 320 CSS px
- 390 CSS px
- 768 CSS px
- Typical laptop width
- 1440 CSS px
- 200% zoom
- Keyboard only
- Reduced motion
- Real phone on the local network when practical

## Stop conditions

Stop and escalate rather than guessing when:

- Canonical sources conflict
- A price, service state, route, public claim, or professional boundary is unclear
- A task would require changing a locked decision
- A dependency or architecture expansion is not justified by the task
- Spectora behavior is being assumed rather than tested
- Private source material risks entering deployable code or `public/`
