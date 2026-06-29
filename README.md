# InfluencerVibe - Creator Discovery Platform

A modern, high-performance web application designed to help brands discover top influencers across Instagram, YouTube, and TikTok, analyze creator metrics, and curate custom persistent lists.

---

## 🚀 Key Improvements & Features Implemented

### 1. 🐛 Bug Fixes & Code Corrections
- **Case-Insensitive Search**: Resolved filtering issues in `src/utils/dataHelpers.ts` where username matches were case-sensitive while full names were case-insensitive. Implemented clean handling for missing/null fields.
- **Engagement Rate Calculation**: Fixed math calculation bug in `src/pages/ProfileDetailPage.tsx` where rates were multiplied by `10000` instead of `100`.
- **Misassigned Analytics**: Fixed metric binding bug on the detail page where engagement rate was erroneously displayed under the "Total Engagements" header.
- **Responsive Layout Cleanup**: Removed rigid, fixed-width CSS constraints (`w-[700px]`) from creator cards to ensure responsive layout on all device sizes (mobile to desktop).
- **Profile Loader Robustness**: Enhanced `loadProfileByUsername` with fallback case-insensitive matching for local profile JSON definitions.

### 2. ⚡ State Management: React Context to Zustand Migration
- Replaced basic context patterns with a unified **Zustand store** (`src/store/useListStore.ts`).
- Integrated Zustand's `persist` middleware to automatically synchronize saved collections and creator lists with browser `localStorage`.
- Store features include:
  - Multi-list collection management (create, rename, delete custom lists).
  - Cross-platform creator saving with timestamping.
  - Duplicate prevention within lists.
  - Global reactive indicators for total saved creators across the platform.

### 3. 🎯 Complete "Select Profile & Add to List" Feature
- **Interactive Add-to-List Modal (`AddToListModal.tsx`)**: Modal interface on cards and detail pages allowing users to select or quickly create custom lists to save creators.
- **Saved Lists Manager Drawer (`ListDrawer.tsx`)**: Slide-over drawer accessible from the top navigation bar to view saved creator profiles, manage collections, and remove items.

### 4. 🎨 Modern UI/UX Redesign
- **Glassmorphism Theme System**: Tailored CSS design tokens with ambient radial gradients, backdrop blur effects, and polished typography.
- **Platform Branding**: Distinct color palettes and SVG badges for Instagram, YouTube, and TikTok.
- **Micro-Interactions & Animations**: Integrated **Framer Motion** for smooth page transitions, staggered card entrances, modal popovers, and drawer slide-overs.

### 5. 🚀 Performance Optimizations
- Applied `useMemo` hooks on `SearchPage.tsx` to memoize search indexing and filtering operations, preventing redundant re-computations during unrelated re-renders.
- Implemented lazy image loading with automatic fallback avatar generation for broken profile images.

---

## 📦 Libraries Added

| Library | Purpose & Rationale |
| :--- | :--- |
| `zustand` | Lightweight, un-opinionated state management with built-in persistence. Avoids Context provider boilerplate. |
| `framer-motion` | High-performance animation library for fluid UI transitions, layout morphing, and interactive micro-animations. |
| `lucide-react` | Modern, clean vector icon set for UI actions and status indicators. |
| `clsx` & `tailwind-merge` | Utility tools for merging dynamic CSS classes cleanly. |

*Note: The deprecated `react-beautiful-dnd` package was removed due to React 19 peer dependency incompatibilities.*

---

## 🛠️ Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run ESLint validation
npm run lint

# Create production build
npm run build
```

---

## 🧠 Assumptions & Trade-offs

- **Assumptions**:
  - Local JSON datasets in `src/assets/data` act as mock backend endpoints.
  - Creators can exist in multiple distinct custom lists simultaneously (e.g., "Tech" and "Campaign 2026"), but duplicate entries within a single list are strictly prevented.
- **Trade-offs**:
  - Selected client-side local storage persistence over a backend REST API server to keep the project self-contained and zero-dependency for deployment.
  - Used custom inline SVGs for social platform branding badges to avoid third-party icon library version conflicts.

---

## 🔮 Future Enhancements

- CSV/JSON exporting for curated influencer lists.
- Advanced filtering options (by follower ranges, engagement thresholds, or demographics).
- End-to-end testing suite using Playwright or Cypress.
