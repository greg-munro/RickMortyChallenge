# OVERVIEW - Developer Skills & Standards

This project follows a few key practices to keep development fast,
predictable, and low-friction. If something feels annoying to maintain,
we fix the system, not the person.

---

## 1. Component Simplicity First

- Keep components under \~150 lines
- Extract logic into hooks early (`useSomething`)
- UI components should focus on rendering, not business logic

**Bad** - API calls, state logic, and UI all in one file

**Good** - `useUserData.ts` → handles logic\

- `UserScreen.tsx` → handles UI

---

## 2. Predictable File Structure

    /components
    /hooks
    /screens
    /services
    /utils

Rules: - No random folders\

- If you hesitate where something goes, it probably belongs in
  `services` or `utils`

---

## 3. Naming \> Comments

- Prefer clear, self-explanatory naming over comments\
- Avoid vague names like `data`, `item`, `stuff`

**Bad**

```ts
const data = getData()
```

**Good**

```ts
const userProfile = getUserProfile()
```

---

## 4. Comment Discipline

- Do **not** add unnecessary comments\
- First ask: _can this be made obvious through naming or structure?_\
- Only add comments when they provide real value:
  - explaining _why_, not _what_
  - documenting non-obvious decisions or tradeoffs

**Bad**

```ts
// increment i
i++
```

**Good**

```ts
// Required to offset pagination bug from backend API
i++
```

---

## 5. Async Logic Discipline

- Always handle loading + error states\
- Never leave a promise without try/catch

```ts
try {
  const res = await fetchUser()
} catch (e) {
  // handle error
}
```

---

## 6. Console Hygiene

- No stray `console.log` in production\
- Use a helper if needed:

```ts
const log = __DEV__ ? console.log : () => {}
```

---

## 7. Re-render Awareness

- Use `React.memo` only when needed\
- Avoid premature optimization\
- But:
  - FlatLists → always optimize\
  - Expensive components → memoize

---

## 8. Styling Consistency

- One system only (StyleSheet / Tailwind / etc.)\
- No mixing styles randomly

---

## 9. React Patterns First

- Follow established React design patterns where possible\
- Prefer proven approaches over custom abstractions\
- Reference: https://www.patterns.dev/react/

Examples: - Container / Presentational separation\

- Custom hooks for reusable logic\
- Controlled vs uncontrolled components\
- Composition over inheritance

---

## 10. "Would I Understand This in 3 Months?"

Before committing, ask: \> Would future me understand this in 30
seconds?

If not: - Rename things\

- Split logic\
- Simplify

---

## 11. Default to Boring Solutions

- Avoid over-engineering\
- Avoid unnecessary libraries\
- Simple \> clever

---

## 12. If Something Feels Painful → Fix It

Pain = signal.

Examples: - Repeating code → extract\

- Confusing API → wrap it\
- Hard to debug → improve logs

---

## TL;DR

- Small components\
- Clear naming \> comments\
- Comments only when they add real value\
- Logic in hooks\
- Follow React patterns\
- Keep things boring and predictable

---

This file is a living document. If something annoys you twice, add a
rule.
