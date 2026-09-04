# "Did You Ping It" — Phase 1 Initialization Plan

This plan outlines the initialization and scaffolding of the **Did You Ping It** web application based on our alignment.

## Goal
Set up the core project structure, design system, and testing environment to prepare for building the Week 1 networking tools.

## Proposed Changes

We will execute the following steps to initialize the project in the `/mnt/wdblue/resume/didyoupingit` workspace:

### 1. Framework & Tooling Setup
- Run `npx create-next-app@latest .` with the following configuration:
  - TypeScript: **Yes**
  - Tailwind CSS: **Yes**
  - App Router: **Yes**
  - ESLint: **Yes**
  - `src/` directory: **Yes**
- Install **Vitest** and `@testing-library/react` for unit testing the core calculation logic.

### 2. Design System (Tailwind CSS)
- Configure `src/app/globals.css` with a **Dark Mode First** aesthetic.
- Following your feedback, we will:
  - Keep the UI strictly dark and muted (e.g., deep zinc or black backgrounds).
  - **Avoid** vibrant colors and bright gradients.
  - Apply **glassmorphism** (semi-transparent backgrounds with backdrop blur) tastefully for panels and cards, ensuring it doesn't look like generic "vibeslop".
  - Use modern, functional typography.

### 3. Scaffolding Core Directory Structure
We will create the directory structure outlined in the Game Plan:

#### [NEW] `src/tools/`
Directory to hold UI components for individual tools.

#### [NEW] `src/lib/`
Directory to hold pure TypeScript networking calculations (e.g., `ipv4.ts`).

#### [NEW] `tests/`
Directory for Vitest test files to ensure all calculations are bulletproof.

### 4. Initial Landing Page Structure
- Update `src/app/page.tsx` to include the foundational homepage layout:
  - Search bar placeholder: "What networking problem are you solving?"
  - Subdued, premium look with the glassmorphic panels for categories.

## Open Questions

- We will be running the initialization inside the `didyoupingit` root folder (which currently has the `extra/` folder). This means Next.js files like `package.json` and `src/` will live directly alongside `extra/`. Is that acceptable?

## Verification Plan
1. Ensure the Next.js development server runs without errors.
2. Verify the subdued Dark Mode glassmorphic Tailwind CSS custom configuration is applied correctly on the homepage.
3. Run a basic Vitest sanity check to confirm the testing framework is operational.
