# 🌸 Perfumario - Inventory Management App

A modern, feature-rich perfume inventory management application built with React Native and Expo.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)
![Expo](https://img.shields.io/badge/Expo-54-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)

## ✨ Features

### Core Features
- 📦 **Inventory Management** - Add, edit, and delete perfume products
- 🔍 **Advanced Search** - Real-time debounced search with 500ms delay
- 🎯 **Smart Filtering** - Filter by gender (Male/Female/Unisex) and brand
- 📊 **Stock Management** - Track stock levels with visual indicators
- 🏷️ **Brand Management** - Create and manage perfume brands
- 📄 **PDF Export** - Generate professional inventory reports

### Technical Features
- 🌐 **Internationalization** - Multi-language support (English/Spanish)
- 🌙 **Dark Mode** - Automatic and manual theme switching
- 📱 **Offline Support** - Local data persistence with MMKV
- ♿ **Accessibility** - Screen reader support and reduce motion preferences
- 🎨 **Modern UI** - TailwindCSS with NativeWind for styling
- ⚡ **Performance** - Optimized with React Query caching and memoization
- 🔄 **Real-time Updates** - Optimistic updates for instant feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI (\`npm install -g expo-cli\`)
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app (for physical device testing)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/pablonortiz/perfumario.git
cd perfumario
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start the development server:
\`\`\`bash
npm start
\`\`\`

5. Run on your preferred platform:
\`\`\`bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
\`\`\`

## 📁 Project Structure

\`\`\`
perfumario/
├── app/                        # Main app screens (file-based routing)
│   ├── _layout.tsx            # Root layout with providers
│   └── index.tsx              # Home screen
├── components/                 # Reusable UI components
│   ├── AnimatedList/          # List animations
│   ├── EmptyState/            # Empty state component
│   ├── MainLayout/            # Main layout wrapper
│   ├── PerfumeCard/           # Product card
│   └── ...
├── config/                     # Configuration files
│   ├── api.ts                 # API endpoints and configuration
│   └── storage.ts             # MMKV storage configuration
├── context/                    # React contexts
│   └── ThemeContext.tsx       # Theme provider
├── hooks/                      # Custom React hooks
│   ├── usePerfumes.ts         # Perfume data fetching
│   ├── useAccessibility.ts    # Accessibility settings
│   └── ...
├── i18n/                       # Internationalization
│   ├── config.ts              # i18next configuration
│   └── locales/               # Translation files
│       ├── en.json            # English
│       └── es.json            # Spanish
├── stores/                     # Zustand stores
│   └── brandsStore.ts         # Brands state management
├── types/                      # TypeScript type definitions
│   ├── perfume.ts             # API types
│   └── shared.ts              # Shared types
└── docs/                       # Documentation
    └── ARCHITECTURE.md         # Architecture overview
\`\`\`

## 🏗️ Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## 🌐 Internationalization

Switch languages easily:

\`\`\`typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return <Text>{t('common.save')}</Text>;
  
  // Change language
  i18n.changeLanguage('en');
}
\`\`\`

## 📡 API Configuration

**Base URL:** \`https://perfumario-server.vercel.app\`

See \`config/api.ts\` for all available endpoints.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Pablo Nortiz**
- GitHub: [@pablonortiz](https://github.com/pablonortiz)

---

Built with ❤️ using React Native and Expo

## 🧪 Testing

### E2E Tests con Maestro

La aplicación incluye una suite completa de tests End-to-End usando [Maestro](https://maestro.mobile.dev/).

**Tests disponibles:**
- ✅ Inicio de aplicación
- 🔍 Búsqueda de perfumes
- ➕ Crear perfume
- 🎯 Filtros por género/marca
- 📊 Actualizar stock
- ✏️ Editar perfume
- 🗑️ Eliminar perfume
- 📄 Generar PDF
- 🏷️ Gestión de marcas
- 🔄 Pull to refresh
- 🎯 Smoke test completo

**Ejecutar tests:**

```bash
# Todos los tests
npm run test:e2e

# Solo smoke test
npm run test:e2e:smoke

# Un solo test
maestro test .maestro/flows/01-app-launch.yaml

# Modo interactivo (Maestro Studio)
maestro studio
```

Ver [E2E_TESTING.md](./docs/E2E_TESTING.md) para documentación completa.

