---
name: code-style
description: JavaScript and TypeScript coding conventions for this package. Use when writing or reviewing any .ts file under src/, or when the user asks about code style or conventions.
argument-hint: [filename]
metadata:
  internal: true
---

## Rules

### Extract the varying part - never repeat surrounding structure

When a conditional changes only one part of a value, extract that part. Never repeat the template.

```ts
// ✗
border: variant === 'outlined'
  ? `${theme.borderWidths.thin} solid ${main}`
  : `${theme.borderWidths.thin} solid transparent`

// ✓
const borderColor = variant === 'outlined' ? main : 'transparent'
border: `${theme.borderWidths.thin} solid ${borderColor}`
```

Applies everywhere: template literals, object spreads - anywhere the surrounding structure is identical across branches.

---

### Destructure instead of repeated property access

When a variable's properties are used more than once, destructure at the top instead of accessing them repeatedly.

```ts
// ✗
const theme = _props.theme
if (_props.error) {
  return { borderColor: get(_props.theme, 'colors.error') }
}

// ✓
const { theme, error } = props
if (error) {
  return { borderColor: get(theme, 'colors.error') }
}
```

---

### Use `system()` to map a prop to a CSS property on a theme scale

When a prop maps one-to-one to a CSS property + theme scale, use `system()`. Never hand-write a theme lookup for it.

```ts
// ✗ - hardcoded, not prop-driven
const elevationStyle = ({ theme }: { theme?: Theme }) => ({
  boxShadow: theme?.shadows?.[4],
})

// ✓ - prop-driven, reads theme.shadows[elevation]
const elevationVariant = system({
  elevation: { property: 'boxShadow', scale: 'shadows' },
})
```

---

### Barrel `index.ts` files re-export modules with `export *`

An `index.ts` that re-exports a module uses `export *` so new exports are picked up automatically. A module's `default` export and its `export type` lines are the exception: `export *` does not carry them.

```ts
// ✗ - named re-export: new exports must be added by hand
export { space, margin, padding } from './space'

// ✓ - wildcard: all named exports picked up automatically
export * from './space'
export { default } from './space'
```

---

If `$ARGUMENTS` names a file, read it and report violations with corrected code. Otherwise apply to the code being discussed.
