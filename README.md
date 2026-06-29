# InfluencerVibe — Creator Discovery & List Engine

![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand_Persist-purple)
![Vite](https://img.shields.io/badge/Build-Vite_8.1-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested-Vitest-FCC72C?logo=vitest&logoColor=black)

A modern, high-performance web application built for discovering top influencers across Instagram, YouTube, and TikTok, analyzing performance analytics, and curating persistent creator lists.

---

## 🌟 Submission Overview & Key Changes

### 1. 🐛 Bug Fixes & Code Corrections

- **Case-Insensitive Search**: Resolved filtering issues in `src/utils/dataHelpers.ts` where username matches were case-sensitive while full names were case-insensitive. Added null-safety checks for handles and missing attributes.
- **Engagement Rate Math Fix**: Corrected metric calculation in `src/pages/ProfileDetailPage.tsx` where decimal engagement rates were multiplied by `10000` instead of `100` (e.g., preventing `300%` display errors).
- **Misassigned Analytics Headers**: Fixed metric bindings on the profile detail view so total engagements display under the "Total Engagements" card, and percentage rates display under "Engagement Rate".
- **Responsive Layout Correction**: Removed hardcoded `w-[700px]` width constraints on creator cards to ensure seamless fluid layout on mobile, tablet, and desktop viewports.
- **React 19 Linter Compliance**: Fixed synchronous `setState` inside `useEffect` hooks in `ProfileDetailPage.tsx` to eliminate cascading render warnings.

<br />

### 2. ⚡ State Management Migration (React Context ➔ Zustand)

- Replaced React Context with a lightweight, scalable **Zustand store** (`src/store/useListStore.ts`).
- Integrated Zustand's `persist` middleware to automatically synchronize saved lists with browser `localStorage`.
- **Core State Features**:
  - Full CRUD collection management (create, rename, delete custom lists).
  - Cross-platform profile saving with timestamp tracking.
  - Strict duplicate prevention per list.
  - Global reactive indicators for total saved creators across all collections.

<br />

### 3. 🎯 "Select Profile & Add to List" Feature Complete

- **Add to List Modal (`AddToListModal.tsx`)**: Interactive modal accessible from cards and detail pages allowing users to select an existing list or create a new collection on the fly.
- **Saved Lists Manager Drawer (`ListDrawer.tsx`)**: Slide-over drawer accessible from the top navigation bar to view saved creator profiles, manage collections, inspect profiles, and remove items.
- **Real-time Feedback (`Toast.tsx` & `useToastStore.ts`)**: Built a floating toast notification system providing visual confirmation when creators are added or removed.

<br />

### 4. 🎨 Modern Human-Centric UI/UX Redesign

- **Glassmorphism Aesthetic**: Custom CSS design tokens in `src/index.css` featuring dark background gradients, backdrop blur effects, and crisp typography.
- **Platform-Specific Branding**: Custom SVG branding and color gradients for Instagram, YouTube, and TikTok.
- **Micro-Interactions & Animations**: Integrated **Framer Motion** for smooth staggered grid entrances, modal scale popovers, and slide-over drawers.
- **Discovery Analytics Bar**: Added real-time platform benchmark cards displaying indexed creators, average audience sizes, and engagement rates.
- **Sorting Controls**: Implemented sorting by Most Followers, Highest Engagement, and Alphabetical order.

<br />

### 5. 🚀 Performance & DX Optimizations

- Applied `useMemo` on `SearchPage.tsx` to memoize search indexing and filtering operations, preventing redundant recalculations during unrelated re-renders.
- Added lazy image loading with automatic fallback avatar generation for broken profile images.
- Implemented unit testing suite with Vitest (`src/utils/dataHelpers.test.ts`).

---

## 📦 Libraries Introduced

| Library | Version | Purpose & Rationale |
| :--- | :---: | :--- |
| **`zustand`** | `^5.0.3` | Un-opinionated, lightweight state management with built-in localStorage persistence. |
| **`framer-motion`** | `^12.42.0` | High-performance motion library for layout transitions, modals, and micro-interactions. |
| **`lucide-react`** | `^1.16.0` | Clean, modern vector icon set for action buttons and status indicators. |
| **`vitest`** | `^4.1.9` | Next-generation fast unit testing framework. |
| **`clsx` & `tailwind-merge`** | `^2.1.1` | Utilities for cleanly merging conditional Tailwind styles. |

> *Note: The deprecated `react-beautiful-dnd` package was uninstalled due to React 19 peer dependency conflicts.*

---

## 🧠 Technical Assumptions & Engineering Trade-offs

### Assumptions
1. Local JSON datasets located in `src/assets/data` simulate asynchronous server responses.
2. Creators can belong to multiple distinct custom lists simultaneously (e.g., "Top Tech" and "Q3 Campaign"), but duplicate entries within the same list are prevented.

### Trade-offs
1. **Local Browser Storage vs REST API**: Selected client-side `localStorage` persistence with Zustand to keep the application 100% self-contained and zero-dependency for static deployment.
2. **Inline SVGs vs Icon Package Fonts**: Used hand-crafted SVG brand paths for Instagram, YouTube, and TikTok to guarantee exact brand colors without third-party asset bloat.

---

## 🛠️ Developer Commands & Testing

```bash
# 1. Install project dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Execute unit test suite with Vitest
npm test

# 4. Run ESLint code quality checks
npm run lint

# 5. Build production bundle
npm run build
```

---

## 🔮 Future Roadmap Improvements

- CSV and JSON export tools for downloading saved influencer lists.
- Advanced multi-faceted demographic and follower-tier filter ranges.
- End-to-end user flow tests using Cypress or Playwright.
