## Coding Rules

### DRY Principles

- Business logic belongs in `src/services/` or `src/utils/`, not in components.
- Before adding a new helper, method, service call, component, or formatter, search the codebase for an existing implementation and reuse or extend it when it fits.
- Do not duplicate code or create parallel methods for behavior that already exists in the codebase.
- If logic is used in 2+ places, extract it.
- No inline business logic in components — components orchestrate, services do the work:

```typescript
// BAD: Logic in component
const handleSubmit = async () => {
  const [a, b, c] = await Promise.all([getA(), getB(), getC()]);
  if (!a) router.replace('/x');
  else if (!b) router.replace('/y');
};

// GOOD: Logic in service, component orchestrates
const route = await resolveInitialRoute();
router.replace(route);
```

- All config in `src/config/`.
- Shared strings, routes, enums in config or types — never inline.
- Define interfaces in `src/types/`, re-export from `src/types/index.ts`.
- Use `type` for unions, `interface` for object shapes.

### React Native & Component Patterns

- Use functional components only.
- Order within a file: imports → component → styles → export.
- Colocate `StyleSheet.create` with the component.
- Extract reusable logic into custom hooks; components should focus on rendering:

```typescript
// BAD: Logic inline in component
const [data, setData] = useState();
useEffect(() => { fetchData().then(setData); }, []);

// GOOD: Logic in hook
const { data } = useFetchData();
```

- Use strict TypeScript — avoid `any`. Define props interfaces for all components.
- Export shared types from `src/types/`.
- **Low-end Android first**: avoid unnecessary re-renders, use `FlatList`/`SectionList` with stable `keyExtractor`, avoid inline functions in `renderItem` where it matters.
- **Async safety**: guard against setState-after-unmount, dedupe/disable-while-pending for anything triggered by a button (repeated taps), prefer cancellation (`AbortController`/flags) for in-flight requests when a screen unmounts.
- **JSX shape**: use early returns for loading/error/empty instead of nested ternaries or chained `&&` in JSX; compute booleans/derived values above the `return`, not inline. Avoid non-trivial `map`, ternary, or conditional logic directly inside JSX; extract small render methods/components when it improves readability.
- **Layout/grid math** (for any fixed-column row of cards): don't mix `space-between` + margins + `flex: 1`. Pick container `paddingHorizontal` + one `gap` + computed `itemWidth = floor((containerWidth - 2*padding - (n-1)*gap) / n)`. Don't size off `useWindowDimensions()`/screen width for anything inside a padded parent — measure via `onLayout` or accept `contentWidth` as a prop instead.

### Styling

- Use `colors`, `spacing`, `typography` from `@/src/theme` — no hardcoded hex/magic numbers.
- Prefer `StyleSheet.create` over inline styles for performance.
- Avoid inline styles for anything beyond a one-off.

### Storage Conventions

- All storage keys MUST be defined in `STORAGE_KEYS` in `src/constants/data.ts` — **never use raw string literals**:

```typescript
// BAD
AsyncStorage.getItem('hasSeenOnboarding');

// GOOD
AsyncStorage.getItem(STORAGE_KEYS.hasSeenOnboarding);
```

- Prefer `storageService` from `@/src/services/storage` over calling `AsyncStorage` directly for app-managed keys:

```typescript
// BAD
await AsyncStorage.multiRemove(['key1', 'key2']);

// GOOD
await storageService.clearAllAppStorage();
await storageService.clearKey('hasSeenOnboarding');
```

- Use `keyof typeof STORAGE_KEYS` when referencing keys. Storage values are strings — parse/serialize at the boundary.

### Comments

- Default to no comments, but do add a short comment for: non-obvious conditionals, parsing/mapping logic, error-handling/fallback branches, *why* a `useEffect` exists (not what it does), and temporary workarounds (with `TODO`).

### Security / Privacy

- **No PII in logs**: never log phone/Aadhaar/PAN/bank details/OTP, even in dev-only logging helpers.

---

## Preferred Libraries — Don't Suggest Alternatives

- **State**: Zustand only (not Redux/Jotai/Context for global state)
- **Forms**: react-hook-form + zod only
- **Data fetching**: TanStack React Query only
- **Navigation**: Expo Router only (not React Navigation directly)

---

## Never Do

- Don't call `AsyncStorage` directly — use `storageService`
- Don't use raw string keys for storage — use `STORAGE_KEYS` from `src/constants/data.ts`
- Don't deep-import when a barrel `index.ts` exists, except to prevent require cycles in low-level internals
- Don't run `eas update` directly — use the `npm run ota-*` scripts
- Don't read remote feature flags directly off the store — use `src/config/resolvedAppConfig.ts` resolvers
- Don't make breaking changes to `app.json` / `app.config.js` (permissions, scheme, associated domains) unless explicitly asked

---

## Known Intentional Patterns (Do Not "Fix")

- `app/(tabs)/_layout.tsx` re-runs auth check intentionally — tabs stay mounted across reloads/deep links
- `FreeRaspInitializer` has a dev-mode guard (`enableFreeRaspInDev`) — removing it causes a native crash on Fast Refresh
- `GATE_ROUTES` swallow cold-start deep links intentionally — deep links only resolve post-auth
- `resetDeviceSecuritySession()` exists only for `dev-panel.tsx` manual testing — not a bug


### Conditional Rendering

- When JSX branches on multiple mutually-exclusive states (loading/error/empty/success, etc.), derive a single status value first instead of stacking independent ternaries/`&&` blocks that repeat the same conditions.
- Keep derived UI status keys as named constants at the top of the file, or in a shared config/types module when reused across files. Do not repeat raw string literals inside render functions or branch checks.

```typescript
// BAD: repeated conditions across independent ternaries
{error ? <ErrorContainer /> : null}
{pending && !data ? <Spinner /> : null}
{!pending && data && items.length === 0 ? <EmptyCard /> : null}
{!pending && data && items.length > 0 ? <ListScreen items={items} /> : null}

// GOOD: one derived status, mutually exclusive branches (if/else, not nested ternaries — those get hard to read past two levels)
let status: 'error' | 'loading' | 'empty' | 'success';
if (error) status = 'error';
else if (pending && !data) status = 'loading';
else if (items.length === 0) status = 'empty';
else status = 'success';

{status === 'error' && <ErrorContainer />}
{status === 'loading' && <Spinner />}
{status === 'empty' && <EmptyCard />}
{status === 'success' && <ListScreen items={items} />}
```

- No ternaries that produce JSX — in inline JSX expressions or in JSX-returning functions — even for a single binary condition. Compute the value with if/else into a variable first, then reference the variable in the JSX.

```typescript
// BAD: ternary producing JSX
{isEmpty ? <EmptyCard /> : <ListScreen items={items} />}

// GOOD: if/else into a variable, then render it
let content: ReactNode;
if (isEmpty) {
  content = <EmptyCard />;
} else {
  content = <ListScreen items={items} />;
}

{content}
```

Plain ternaries that pick a non-JSX value (e.g. `const activeItems = activeTab === 'a' ? itemsA : itemsB;`) are unaffected, in `.tsx` files or otherwise — this rule is about ternaries whose result is JSX.

### TypeScript Types & Interfaces Rules

- Do not define interfaces, types, or props directly inside `.tsx` files.
- `.tsx` files should focus on rendering, UI state, and orchestration only.
- Keep TypeScript shapes in separate type files.

#### Folder Rules

- Do not create a separate `interfaces/` folder.
- Use `src/types/` as the single shared place for domain types, API response types, object shapes, unions, and shared interfaces.
- `interface` is a TypeScript keyword, not a folder naming convention.
- For shared/domain types, create files inside `src/types/<domain>.ts`.
- Re-export shared/domain types from `src/types/index.ts`.
- For component-only props/types, create a nearby `ComponentName.types.ts` file beside the component.
- Do not put every component prop type into global `src/types/`; keep local component types close to the component.

#### Naming Rules

- Use `interface` for object shapes and component props.
- Use `type` for unions, mapped types, and utility-composed types.
- Use clear names like `LoanOfferCardProps`, `UserProfileResponse`, or `ExternalAppConfigData`.
- Avoid vague shared names like `Props`, `Data`, `Response`, or `Item`.

#### Import Rules

- Import types using `import type` where possible.
- Prefer importing shared types from `@/src/types` when they are re-exported.
- Prefer nearby imports for component-only types.

#### Examples

```typescript
// BAD: interface inside TSX file
interface LoanOfferCardProps {
  amount: number;
  tenure: string;
  interestRate: string;
}

export function LoanOfferCard(props: LoanOfferCardProps) {
  return <View />;
}
