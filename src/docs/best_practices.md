## Svelte MVP Development: Team Conventions

**Guiding Principle:** "Move Fast, Stay Lean, Iterate Often." For an MVP, prioritize features that deliver core value. Perfection is the enemy of done.

---

### 1. Project Setup & Core Tooling

1.  **Framework:** **SvelteKit**
    *   **Why:** Official, batteries-included framework for Svelte. Handles routing, SSR/SPA, build optimization, server-side logic, and more out-of-the-box.
    *   **Action:** Initialize new projects with `npm create svelte@latest`.
    *   **Configuration:**
        *   Choose "Skeleton project" for maximum control or "SvelteKit demo app" if you want examples. For speed, "Skeleton" is often better to avoid deleting example code.
        *   Enable TypeScript (even for small projects, it catches errors early).
        *   Enable ESLint and Prettier for code consistency.
        *   Enable Playwright for browser testing (optional for initial MVP, but good to have).

2.  **Version Control:** **Git**
    *   **Action:** Initialize a Git repository immediately.
    *   **Branching Strategy (Simplified for MVP):**
        *   `main`: Represents the latest stable, deployable code.
        *   `develop`: Integration branch where features are merged before going to `main`. (For a *very* small team/solo dev, you might work directly on feature branches off `main`).
        *   Feature Branches: `feature/<descriptive-name>` (e.g., `feature/user-login`). Create from `develop` (or `main`).
    *   **Commits:** Write clear, concise commit messages (e.g., "feat: add user login form", "fix: correct input validation").

3.  **Package Manager:** **npm** (or pnpm/yarn if preferred, but be consistent)
    *   **Action:** Use `npm install` and `npm run dev/build/preview`.

---

### 2. Development Workflow & Structure

1.  **File-Based Routing (SvelteKit):**
    *   **Convention:** All pages reside in `src/routes`. Subdirectories create nested routes (e.g., `src/routes/dashboard/settings/+page.svelte` maps to `/dashboard/settings`).
    *   `+page.svelte`: Defines the UI for a route.
    *   `+page.server.js` / `+page.js`: For `load` functions (data fetching) and form `actions`.
        *   Use `+page.server.js` for code that *must* run on the server (DB access, secrets).
        *   Use `+page.js` for code that can run on server OR client (fetching public APIs).
    *   `+layout.svelte`: Defines shared UI for a route segment and its children.

2.  **Component-Driven Development:**
    *   **Location:** Place reusable components in `src/lib/components/`.
    *   **Naming:** `PascalCase.svelte` (e.g., `UserProfileCard.svelte`).
    *   **Granularity:** Create components that are small and focused (Single Responsibility Principle). If a component gets too complex, break it down.
    *   **Props & Events:**
        *   Pass data down via `export let propName;`.
        *   Communicate up via `dispatch('eventName', detail)` and `on:eventName`.

3.  **State Management:**
    *   **Local Component State:** Use `let` variables for state confined to a single component.
    *   **Props:** For parent-child communication.
    *   **Svelte Stores (`src/lib/stores/`):** For global or shared state accessible across unrelated components.
        *   Start with `writable` stores.
        *   Use `readable` for values derived from other sources that shouldn't be directly modified.
        *   Use custom stores to encapsulate related logic.
        *   **Naming:** `storeName.js` or `storeName.ts` (e.g., `userStore.ts`, `cartStore.ts`).
    *   **Context API:** For passing data deep down the component tree without prop drilling. Use sparingly, as stores are often more flexible.

4.  **Styling:**
    *   **Scoped CSS:** Svelte's default. Styles in a `<style>` tag are scoped to that component. This is the preferred method.
    *   **Global Styles:** Place in `src/app.html` (for essential base styles) or a global CSS file imported in the root `+layout.svelte` (e.g., `src/app.pcss` or `src/global.css`). Use `:global()` sparingly within components.
    *   **CSS Variables:** Use for theming and consistent design tokens (colors, spacing). Define them globally.
    *   **Utility Classes (Optional for Speed):** Consider Tailwind CSS if the team is familiar. It can significantly speed up styling for MVPs. SvelteKit has an easy setup: `npx svelte-add@latest tailwindcss`. If not familiar, stick to plain CSS to avoid a learning curve.

5.  **Utilities & Helpers:**
    *   **Location:** `src/lib/utils/`.
    *   **Content:** Pure functions, constants, type definitions not tied to a specific component or store.
    *   **Example:** `formatDate.ts`, `apiClient.ts`, `constants.ts`.

---

### 3. Code Conventions & Best Practices

1.  **Reactivity:**
    *   Understand `$:` for reactive statements and derived values. Use it for calculations that depend on other reactive values.
    *   Use `{#each items as item (item.id)}` with a unique key for list rendering to ensure efficient updates.

2.  **Async Operations:**
    *   Use Svelte's `{#await promise}` block for handling loading/error states in templates.
    *   In `load` functions and form `actions`, use `async/await`.

3.  **Forms:**
    *   Leverage SvelteKit's progressive enhancement for forms. Use standard HTML `<form>` elements and server-side `actions` in `+page.server.js`.
    *   Use `enhance` action for client-side handling without full page reloads.

4.  **Error Handling:**
    *   Use `try...catch` for async operations.
    *   SvelteKit has `+error.svelte` pages for custom error display (e.g., 404, 500).

5.  **TypeScript (if used):**
    *   Define types for props, store values, API responses.
    *   Place shared types in `src/lib/types/` or alongside the relevant module.

6.  **Imports:**
    *   Use `$lib` alias for imports from `src/lib/` (e.g., `import MyComponent from '$lib/components/MyComponent.svelte'`).
    *   Group imports: Svelte/SvelteKit, external libraries, internal modules.

7.  **Accessibility (A11y):**
    *   Use semantic HTML elements (`<nav>`, `<button>`, `<main>`, etc.).
    *   Ensure interactive elements are keyboard accessible.
    *   Add ARIA attributes where necessary.
    *   Svelte compiler provides a11y warnings – pay attention to them!

8.  **Linting & Formatting:**
    *   **Enforce:** Run ESLint and Prettier automatically (e.g., via Husky pre-commit hooks).
    *   **Adhere:** Fix all linter/formatter warnings and errors before committing.

9.  **Comments:**
    *   Comment complex logic or non-obvious code.
    *   Avoid commenting obvious code.
    *   Use JSDoc for functions and components to describe props, events, and purpose.

---

### 4. Testing (MVP Scale)

1.  **Unit Tests (Vitest - comes with SvelteKit setup):**
    *   Focus on testing critical business logic in stores, utility functions, and complex component logic (if any).
    *   Don't aim for 100% coverage for an MVP; prioritize high-value tests.
2.  **Component Tests (Vitest + Svelte Testing Library):**
    *   Test component rendering and basic interactions if components have complex internal logic or many states.
3.  **End-to-End Tests (Playwright - comes with SvelteKit setup):**
    *   Write a few E2E tests for critical user flows (e.g., sign-up, core feature interaction). This provides the most confidence.
4.  **Manual Testing:** Crucial for an MVP. Continuously test the application in a browser as you develop.

---

### 5. Build & Deployment

1.  **Adapter:** Choose a SvelteKit adapter based on your deployment target (e.g., `adapter-auto` for Vercel, Netlify, Cloudflare Pages; `adapter-node` for Node.js servers).
2.  **Environment Variables:** Use `.env` files for local development and configure environment variables on your hosting platform for production (e.g., API keys). Access them via `$env/static/public` (public) or `$env/static/private` (private, server-side only).
3.  **Continuous Deployment:** Set up CI/CD (e.g., GitHub Actions) to automatically build and deploy `main` branch pushes to production and `develop` branch to staging. Vercel/Netlify offer this easily.

---

### Key Takeaway for MVP Speed:

*   **Don't Over-Engineer:** Solve today's problems. Avoid premature optimization or building features "just in case."
*   **Leverage SvelteKit:** It handles a lot for you. Trust its defaults.
*   **Iterate:** Get a basic version working, then refine.
*   **Communicate:** Especially important for teams. Regular, brief check-ins.