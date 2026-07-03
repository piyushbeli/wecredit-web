# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (Next.js, Turbopack off by default)
npm run build           # Production build
npm run start            # Serve a production build
npm run lint             # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npm run typing-check      # tsc --noEmit
```

There is no test runner configured in this repo (no `test` script, no test files) — do not assume Jest/Vitest exist. Verify behavior by running `npm run typing-check`, `npm run lint`, and exercising the feature in the dev server.

Node version is pinned via `.nvmrc` to `20.18` (matches the Docker base image).

## Architecture

This is a Next.js 16 App Router marketing/lead-gen site for WeCredit (loan/credit-card comparison platform). Key structural facts:

### Environment configuration
`lib/config/index.ts` exposes a singleton `environment` that switches between `staging`/`production` based on `NEXT_PUBLIC_ENVIRONMENT`, controlling API base URLs and headers (e.g. staging adds `X-Agent-Host: gateway-uat`). Don't read `process.env.NEXT_PUBLIC_*` directly in feature code — go through `environment`/`wecreditConfig` (`lib/config/index.ts`) or `wecreditApi` (`lib/config/endpoints.ts`).

### API layer
- `lib/utils/api.ts` — `ApiHandler` static class wrapping `fetch` with timeouts, abort handling, and typed exceptions (`lib/api/api-exceptions.ts`: `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ServerException`, `NoInternetException`, `RequestTimeoutException`). Auth token/mobile are read from cookies (via `cookies-next`) and attached automatically in `get`/`postWithToken`. A legacy `api.*` object exists for backward compatibility — prefer `ApiHandler` in new code.
- `lib/api/*-service.ts` — one file per domain (business-loan, car-loan, gold-loan, home-loan, primepl-lead, lead, auth, partner, credit-card-analytics, upswing-navigation-event). Each wraps `ApiHandler` calls with the domain payload/response shapes and returns a `{ success, data?, error? }`-style result (see `LeadServiceResult` in `lib/api/lead-service.ts`) rather than throwing, so callers can branch without try/catch.
- API logging in dev mode happens automatically inside `execute()` in `lib/utils/api.ts` (console groups with request/response); gated by `environment.isDevelopment`.

### Auth flow
- `providers/auth-provider.tsx` validates the token once on app mount (wraps the whole tree in `app/layout.tsx`, inside `FeatureFlagProvider`).
- `stores/auth-store.ts` (Zustand + `persist` + `devtools`) is the source of truth for modal state (`phone`/`otp` steps) and auth state. Cookies (`STORAGE_AUTH_TOKEN`, `STORAGE_MOBILE`) are the real source of truth for `isAuthenticated`; only `user` is persisted to localStorage, and `syncWithCookies()`/`onRehydrateStorage` reconcile the two on load and tab focus — don't add new persisted auth fields without going through this reconciliation.
- **Pending actions**: when an unauthenticated user triggers something gated by login (view an offer, submit a loan form, check eligibility), the intended action is captured as a `PendingAction` (`type` + payload) via `openModalWithPendingAction`/`openModalWithPendingActionAtOtp`, the auth modal opens, and after OTP success the caller consumes it via `consumePendingAction()` to resume exactly what the user was doing. When adding a new gated action, add a new `PendingActionType` + payload field rather than a bespoke mechanism.
- `components/auth/` holds the modal, phone/OTP screens, and `hooks/use-auth-handlers.ts` / `hooks/use-post-login.ts` for the actual send-OTP/verify-OTP orchestration.

### Lead / loan form pattern
Each loan product (`business-loan`, `car-loan`, `gold-loan`, `home-loan`, `primepl-lead`) under `components/<product>/` follows the same three-file shape — copy this pattern for new loan types:
- `<product>-form.config.ts` — form state type, default values, step/field mapping (for multi-step forms), pure `validate<Product>Form()` and `build<Product>Payload()` functions.
- `use-<product>-form.ts` — the stateful hook: field change handlers, step navigation, submit (calls the matching `lib/api/<product>-service.ts`), auth-based prefill, and an existing-lead check on mount.
- `<product>-form.tsx` / `<product>-form-modal.tsx` — presentation, wired to the hook.

Test/dev prefill data lives alongside the config (`*_PREFILL_TEST_VALUES`) and is gated by a feature flag plus `?prefill=1` in non-production — see `enableBusinessLoanPrefill` below.

### Dedupe / lender status checks
`hooks/use-check-dedupe.ts` decides whether a logged-in user needs to fill a lead form or can skip straight to offers, based on `leadService.checkDedupe` status codes (`1003` = new user → form; `1004` = existing mobile → check `isWecreditWebsiteData` and lender status via `checkStatusAll`). Single-lender flows pass `statusBeforeFormLenderName` so the check also verifies whether that specific lender already has a status entry (`lib/utils/common-helper.ts#hasMatchingStatusLender`) before deciding to show the form. Lender name matching/normalization utilities live in `lib/utils/lenders.ts` (`normalizeLenderNameForMatch`, `getMatchedLenderCanonicalName`, `filterActiveLenders`) — reuse these instead of ad hoc string comparisons when matching a URL slug or user-facing lender name against API data.

### State (Zustand stores, `stores/`)
- `auth-store.ts` — see Auth flow above.
- `offer-store.ts`, `url-params-store.ts` — reset together on logout (`useAuthStore.logout()` calls both) so stale user data/query params don't leak across sessions.
- `loading-store.ts` — drives the global `LoadingScreen` in `app/layout.tsx`.
- `feature-flag-store.ts` — see Feature flags below.

### Feature flags
Dev-only toggles defined in `lib/constants/feature-flags.ts` (`DEFAULT_FEATURE_FLAGS`, metadata for a UI panel) and read via `useFeatureFlag(name)` / `useFeatureFlags()` (`hooks/use-feature-flag.ts`). Flags always resolve `false` when not in dev mode (`isDevMode` from `feature-flag-store.ts`, controlled by `NEXT_PUBLIC_ENABLE_DEV_TOOLS`) — no separate production check is needed in feature code. Current flags: `enableDebugLogs`, `enableOfferMockData`, `showPreAuthFlow`, `bypassDedupeCheck`, `enableBusinessLoanPrefill`. Add new flags to both `DEFAULT_FEATURE_FLAGS` and `FEATURE_FLAG_METADATA` (category + label + description) so they show up in the dev panel (`components/dev/feature-flag-panel.tsx`).

### SEO / sitemaps
- `lib/seo/` builds page metadata (`build-page-metadata.ts`), site-wide constants (`site-metadata.ts`), and sanitizes externally-sourced HTML (`sanitize-external-html.ts`).
- `lib/sitemap/` fetches sitemap route lists from an external Google Sheet per category (blog/loans/pages) and `app/sitemap-*/sitemap.ts` + `app/sitemap.xml/route.ts` assemble them; `next.config.ts` `rewrites()` maps the friendly `/sitemap-*.xml` URLs to these routes.
- Structured data (Organization JSON-LD) is injected directly in `app/layout.tsx` via `<Script type="application/ld+json">` — see `docs/json-ld-schemas.md` (local/untracked) for the broader schema plan if present.

### Path aliases & UI primitives
- `@/*` resolves to the repo root (`tsconfig.json`).
- shadcn/ui is configured (`components.json`, style `new-york`, no prefix) with primitives in `components/ui/`. Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional class composition, consistent with existing components.
- Tailwind v4 (CSS-based config via `app/globals.css`, no `tailwind.config.js` JS-driven theme beyond what `components.json` points at).

### Deployment
Multi-stage `Dockerfile` (Node 20.18 slim) builds a Next.js `standalone` output (`next.config.ts` sets `output: 'standalone'`) and runs as a non-root `nextjs` user. `Dockerfile.staging` is the staging variant. Build-time `NEXT_PUBLIC_*` args are baked into the client bundle at image build time, not read at container runtime — when adding a new public env var, thread it through both the Dockerfile `ARG`/`ENV` pair and wherever else the image is built (CI).


# Separation of Concerns and Business Logic Rules

## Keep Components Focused

React components should mainly handle:

- Rendering UI
- Managing local UI state
- Handling user interactions
- Composing child components

Avoid writing complex business logic directly inside `.tsx` or `.jsx` components.

## Separate Business Logic

Move business logic into:

- Custom hooks
- Helper functions
- Utility modules
- Service layers

Use separate methods for:

- Data transformation
- Validation
- Calculations
- API handling
- Navigation decisions
- Filtering and sorting
- Permission checks
- Repeated conditions

## Keep JSX Clean

JSX should be simple and readable.

Avoid:

- Long inline functions
- Complex calculations
- Nested conditions
- Large `map/filter/reduce` chains
- Repeated expressions
- Business rules inside JSX

Prefer:

```tsx
const visibleUsers = getVisibleUsers users);

return <UserList users={visibleUsers} />;