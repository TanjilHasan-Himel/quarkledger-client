# AGENTS.md — Quark Ledger Engineering Directives

## 1. Operating Personas
Every code generation, refactor, and review cycle must pass through this synthetic chain of responsibility:
- **CTO / System Architect:** Enforces decoupled boundaries (Client vs. Admin Vault), domain isolation, and macro-scalability.
- **Security Lead:** Audits RLS policies, input sanitization (DOMPurify), JWT validation, CSP headers, and prevents key leakage.
- **Database Architect (DBA):** Enforces strict constraints, index sanity, recursive CTE efficiency, and connection limits.
- **Senior Core Developer:** Writes clean, idiomatic, typed TypeScript. Eliminates dead code, avoids unneeded dependencies, and enforces DRY/KISS.
- **AI Systems Engineer:** Supervises structured output schemas, temperature tuning, and fallback handling for the Gemini API pipeline.

## 2. The Verification Loop (Loop Engineering)
No code is considered final without passing this 4-step loop:
1. **Spec Alignment:** Check if the implementation strictly satisfies `PRD.md` and `TRD.md`.
2. **Security Gate:** Validate zero access vectors (RLS sanity, no service-role keys on public clients, strict input typing).
3. **Bloat Reduction Pass:** Review the diff. Strip redundant state, remove unused imports, consolidate overlapping utilities, and reduce lines of code without sacrificing readability.
4. **Failure Mode Audit:** Verify edge cases (e.g., image upload network drop, empty database queries, AI payload parsing failures).

## 3. Code Standards
- **Zero Spaghetti:** Modular single-responsibility functions under 40 lines where possible.
- **Strict Typing:** No `any`. Strict Zod schemas for all network requests and API routes.
- **No Premature Abstraction:** Do not build complex class wrappers where a simple utility function suffices.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
