# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Hydration warnings on `<body>`

`app/layout.tsx` sets `suppressHydrationWarning` on the `<body>` tag. Browser
extensions (Grammarly, password managers, ad blockers, etc.) inject attributes
like `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` into `<body>`
before React hydrates, which trips Next.js's hydration mismatch warning even
though nothing is actually broken. Do not remove `suppressHydrationWarning`
from `<body>` to "fix" this warning, and do not chase down attribute mismatches
on `<body>` that come from extension-injected `data-*` attributes — they are
expected and harmless.

## Coding Rules

### DRY Principles

- Business logic belongs in `src/services/` or `src/utils/`, not in components.
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

```typescript
// BAD: Logic inline in component
const [data, setData] = useState();
useEffect(() => { fetchData().then(setData); }, []);

// GOOD: Logic in hook
const { data } = useFetchData();
```

### Conditional Rendering

- When JSX branches on multiple mutually-exclusive states (loading/error/empty/success, etc.), derive a single status value first instead of stacking independent ternaries/`&&` blocks that repeat the same conditions.

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