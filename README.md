# Perfumario

A mobile app to manage your perfume collection. Track your inventory, manage brands, filter and search your perfumes, update stock, and export your collection to PDF.

## Features

- **Full perfume CRUD** — Create, view, edit, and delete perfumes from your collection
- **Brand management** — Add and manage perfume brands
- **Smart search & filters** — Find perfumes quickly with debounced search and filter chips
- **Stock tracking** — Update stock levels with a single tap
- **PDF export** — Generate a PDF report of your collection
- **Swipeable cards** — Swipe to reveal quick actions
- **Pull to refresh** — Stay in sync with the latest data
- **Smooth animations** — Animated modals, buttons, lists, and loading shimmers

## Tech Stack

| Technology | Purpose |
|---|---|
| **Expo SDK 54** | Framework & native APIs |
| **React Native** | Cross-platform UI |
| **TypeScript** | Type safety |
| **NativeWind / TailwindCSS** | Styling |
| **Zustand** | State management |
| **TanStack React Query** | Data fetching & caching |
| **React Navigation** | Routing (expo-router) |
| **React Native Paper** | UI components |
| **perfumario-schemas** | Shared Zod schemas with backend |

## Getting Started

### Prerequisites

- Node.js (check `.nvmrc` for version)
- Expo CLI

### Installation

```bash
npm install
npx expo start
```

## Project Structure

```
perfumario/
├── app/                  # Screens (file-based routing)
├── components/           # Reusable UI components
│   ├── AnimatedButton/
│   ├── AnimatedList/
│   ├── AnimatedModal/
│   ├── BrandManagementModal/
│   ├── FilterChips/
│   ├── FilterModal/
│   ├── PerfumeCard/
│   ├── SwipeableCard/
│   └── ...
├── hooks/                # Custom hooks (queries, mutations, filters)
├── stores/               # Zustand stores
├── types/                # TypeScript types
├── src/                  # Theme & shared utilities
└── assets/               # Images & fonts
```

## License

MIT
