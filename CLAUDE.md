# CLAUDE.md

## File Exploration
- Use Glob/Read/Grep tools instead of shell commands for file exploration. 

## Development Workflow

**Always use `npm`.**

### Step-by-step workflow:

1. **Make changes**

2. **Typecheck (fast)**
   ```bash
   npm run typecheck
   ```

3. **Run tests**
   ```bash
   npm run test -- -t "test name"  
   npm run test:file -- "glob"    
   ```

4. **Lint before committing**
   ```bash
   npm run lint:file -- "file1.ts" 
   npm run lint                   
   ```

5. **Before creating a PR**
   ```bash
   npm run lint:claude && npm run test
   ```

## Skills

This repository has additional agent skills installed under `.agents/skills/`.

Use the relevant skill before making changes in areas it covers, especially for React, Next.js, UI design, deployment, and Vercel workflows.[page:1][page:2]

### Installed skills

#### Core React & Web Design
- `vercel-react-best-practices`: Performance, bundle size, and rendering optimization.
- `web-design-guidelines`: UI/UX, accessibility, and general web design best practices.
- `vercel-composition-patterns`: Advanced React composition patterns (compound components, etc).
- `vercel-react-view-transitions`: Smooth page and component transitions using View Transitions API.

#### Node.js & TypeScript
- `node`: Best practices for Node.js development with TypeScript (async patterns, error handling, streams, modules, testing, performance).
- `nodejs-core`: Native module debugging, V8 optimization, node-gyp, N-API bindings, libuv event loop diagnostics.
- `typescript-magician`: Complex generic types, refactoring `any` to strict alternatives, type guards, utility types, and resolving TS compiler errors.
- `documentation`: Technical documentation following the Diátaxis framework (tutorials, how-to guides, reference, explanation).
- `skill-optimizer`: Optimizes AI skills for activation, clarity, and cross-model reliability.

#### Stitch Design & Generation
- `stitch-design`: Main entry point for Stitch design, screen generation, and editing.
- `design-md`: Synthesizes Stitch projects into semantic `DESIGN.md` files.
- `enhance-prompt`: Optimizes UI prompts for high-fidelity Stitch generation.
- `taste-design`: Enforces premium UI standards (typography, color, motion).
- `react-components`: Converts Stitch designs into modular, validated React components.
- `stitch-loop`: Autonomous iterative building loop for Stitch projects.
- `remotion`: Generates walkthrough videos for Stitch designs.
- `shadcn-ui`: Best practices and integration for shadcn/ui components.

## Skill usage rules

### React and Next.js

Before creating or refactoring React or Next.js code, consult `vercel-react-best-practices`, which is a Vercel-maintained guide with 62 rules across 8 priority categories including async waterfalls, bundle size, server-side performance, client-side fetching, and re-render optimization.[page:2]

Apply these patterns when relevant:[page:2]

- Prefer parallel async work with `Promise.all()` when tasks are independent.[page:2]
- Avoid barrel imports when direct imports reduce bundle size.[page:2]
- Use dynamic imports for heavy components.[page:2]
- Minimize unnecessary client-side serialization and re-renders.[page:2]

### Node.js and Express

Before writing or refactoring backend code, consult `node` for:

- Async patterns (error handling, graceful shutdown, stream usage).
- TypeScript configuration with native type stripping (Node 22+).
- Testing strategies and flaky test diagnosis.
- Performance profiling and environment configuration.

For native module issues, V8 optimization, or event loop diagnostics, consult `nodejs-core`.

### TypeScript

Before designing complex types, refactoring `any`, or resolving TS compiler errors, consult `typescript-magician` for:

- Generic types, conditional types, mapped types, template literal types.
- Type guards and branded/opaque types.
- Utility types (`Partial`, `Record`, `ReturnType`, `Awaited`).
- Strict alternatives to `any` (always `error`, never `warn`).

### Design & Generation

Before starting design work or generating screens, consult `stitch-design` and `enhance-prompt`.

- Use `design-md` to maintain a consistent `DESIGN.md` file.
- Use `react-components` when converting Stitch screens to code.
- Apply `taste-design` principles for premium, high-fidelity UI.
- Use `shadcn-ui` for consistent component building.

### Design and composition

When working on UI, layout, or app structure, check these skills first:[page:1]

- `web-design-guidelines`
- `vercel-composition-patterns`
- `vercel-react-view-transitions`

## Design Guidelines

Always read [DESIGN.md](technical-interview/DESIGN.md) before implementing any UI.

[DESIGN.md](technical-interview/DESIGN.md) is the single source of truth for all visual and interaction decisions in this project. It covers typography, color tokens, spacing, component patterns, and layout conventions.

### Rules

- Never introduce new colors, fonts, or spacing values not defined in [DESIGN.md](technical-interview/DESIGN.md).
- All new UI components must conform to the patterns and tokens specified in [DESIGN.md](technical-interview/DESIGN.md).
- When in doubt about a visual decision, defer to [DESIGN.md](technical-interview/DESIGN.md) over personal judgment or external references.
- If a design decision is not covered in [DESIGN.md](technical-interview/DESIGN.md), flag it before implementing rather than improvising.

## Next.js App Router Rules

**CRITICAL: Always add `'use client'` directive when components use:**
- React hooks (`useState`, `useEffect`, `useContext`, `useRef`, etc.)
- Custom hooks that use React hooks internally
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `document`, `localStorage`, etc.)
- Third-party libraries that require client-side execution

**Why this matters:**
- Next.js 15 App Router defaults to Server Components
- Tests run in Node.js and DON'T catch Server/Client Component errors
- Runtime errors only appear when running the dev server (`npm run dev`)
- Always test in browser after making component changes

**Examples:**
```tsx
'use client';  // ← REQUIRED when using hooks or event handlers

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Practical conventions

- Check `.agents/skills/` for relevant guidance before implementing major changes.
- Follow repository scripts from `npm run ...` commands only.
- Prefer existing project conventions over introducing new tooling.
- For deployment-related tasks, default to preview deployments.
- For React and Next.js work, optimize for performance, bundle size, and reduced waterfalls.

## Examples

### Stitch work
Before generating or editing screens, review:
```bash
.agents/skills/stitch-design/
```

### React work
Before implementing a new page or component, review:
```bash
.agents/skills/vercel-react-best-practices/
```

### General rule
If a task matches an installed skill, use that skill’s guidance before making changes.


## Testing Rules

- Every non-trivial unit (Redux slice, Express route, form, or interactive component)
  MUST have tests created alongside implementation.
- For client React components:
  - Use Vitest + Testing Library.
  - Focus tests on behavior (what the user sees/does), not implementation details.
- For server routes:
  - Use Jest + Supertest.
  - Mock Mongoose / external services; never hit real databases in tests.
- No step is considered “done” until:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  all pass with 0 errors.
- When adding new components or features, always:
  1. Implement the feature.
  2. Add or update tests.
  3. Run typecheck + lint + tests and report results.