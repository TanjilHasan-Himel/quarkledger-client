# CLAUDE.md — Strict Execution Guardrails

## 1. Golden Rules
- **Aesthetic Guardrail:** Strict Anti-AI Brutalism. Sharp edges (`rounded-none`), visible borders (`border-ledger-border`), Paper (`#F6F4EE`), Ink (`#111111`), Accent (`#D9381E`). No floating cards or soft shadows.
- **Architecture Guardrail:** - `frontend-client`: STRICTLY READ-ONLY via Supabase Public Anon Key.
  - `backend-admin`: Authenticated writes, Novel/TipTap editor, Gemini AI classification, image compression.
- **Token Efficiency:** Be concise. Provide production-ready, minimal diffs instead of reprinting 300 lines of unchanged boilerplate.

## 2. TypeScript & Next.js Conventions
- Use Next.js App Router idioms (Server Components by default, Client Components marked with `'use client'` only at interactive leaf nodes).
- All database operations in `frontend-client` must leverage edge caching / ISR revalidation.
- Sanitize all TipTap HTML output with `isomorphic-dompurify` before database mutation or dynamic rendering.