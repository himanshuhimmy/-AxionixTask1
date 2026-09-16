# AI Usage Disclosure

This project was built collaboratively with **Claude Code** (Anthropic's agentic CLI). AI was used throughout — planning, scaffolding, component implementation, debugging, and this documentation — under my direction and review, not as a one-shot "generate the whole app" prompt.

## How it was used

1. **Requirement breakdown & UI design.** I fed Claude the assignment PDF and asked it to explain the requirements. Before writing any code, I generated UI mockups in Google Stitch (a separate AI design tool) for every required screen and state (sign-in, dashboard, projects, Kanban/table, task modal, error/loading/empty states, mobile variants), and had Claude review each round of mockups against the assignment spec, flagging what was missing (an error-state design, loading skeletons, mobile modal sheets) before I generated the follow-up screens.
2. **Stack decisions.** I chose between the options Claude presented (JavaScript vs TypeScript, Tailwind vs a component library, Redux Toolkit vs Zustand vs Context, and the mock-backend approach) — Claude explained trade-offs for each, but the choices were mine.
3. **Scope decisions.** The Stitch mockups included extra polish beyond the assignment's data model (subtasks, file attachments, an activity/audit log, CI/PR badges, extra project fields like "Lead Assignee" and "Start Date"). I explicitly decided to trim the build to the assignment's required fields/flows first, rather than implementing everything the mockups showed.
4. **Implementation.** Claude wrote the scaffold, the RTK Query service layer, the Redux store, all page/feature components, the json-server mock backend and seed data, the Vitest/RTL/MSW test suite, and this documentation, in stages — infra, then auth/shell, then dashboard, then projects/tasks — verifying each stage by actually running the app in a browser (login flow, task CRUD, filters, responsive/mobile layout, the simulated error state, keyboard/Escape behavior on modals) rather than assuming the code worked.
5. **My review.** I read through the generated component structure, checked the seed data and business logic (overdue/due-soon date math, filter/sort logic) made sense, and drove the browser verification steps interactively as they happened, rather than accepting the result unseen.

### Example prompts/use cases

- "explain what we need to do" (after sharing the assignment PDF)
- "give me proper prompt... what all pages we need so I can generate ui" (for Stitch)
- Reviewing each batch of generated Stitch screens: "let me know if something missing or wrong"
- Directing the build once the plan and UI were settled: proceeding stage by stage through infra → auth/shell → dashboard → projects/tasks → tests → docs

## Where an AI suggestion was wrong or insufficient

Several concrete issues came up during the build that required diagnosis and correction rather than just accepting the first result:

1. **Wrong scaffold template.** The very first `npm create vite` command (run with a `--yes` flag to skip prompts) silently produced a bare TypeScript template instead of the requested React+JavaScript template — `npm create vite@latest . -- --template react --yes` ignored the `--template` argument. This wasn't caught until inspecting `package.json` afterward and had to be discarded and redone correctly.
2. **`json-server` version mismatch.** `npm install json-server` pulled the latest `1.0.0-beta` release, which turned out to have completely dropped the `--middlewares`/custom-routes support that earlier versions had. This broke the plan for simulating an API failure. It was only caught by running `npx json-server --help` and seeing the CLI had far fewer options than expected — the fix was pinning `json-server@0.17.4` instead.
3. **CommonJS/ESM mismatch in the middleware file.** The custom `server/middleware.js` (using `module.exports`) crashed at runtime with `ReferenceError: module is not defined`, because the project's `package.json` has `"type": "module"`, making Node treat all `.js` files as ES modules. This only surfaced when actually starting the server and reading its error output — the fix was renaming the file to `.cjs`.
4. **A Windows-specific filesystem bug.** `TaskFilters.jsx` (a component) and `taskFilters.js` (a utility module) coexisting in the same folder caused Vite's dev server to intermittently resolve the wrong file on Windows' case-insensitive filesystem, producing a confusing "does not provide an export named 'default'" error that persisted even after a full server restart and cache clear. It was only resolved by renaming the utility file to `filterTasks.js` to remove the near-collision, and confirmed fixed by testing in a fresh browser tab.

Each of these was caught by actually running the commands/app and reading the real output, not by inspection alone — a reminder that AI-generated code and AI-chosen dependency versions still need to be executed and verified, not just reviewed.
