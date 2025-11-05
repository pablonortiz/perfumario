# 🏗️ Architecture Documentation

## Overview

Perfumario follows a modern React Native architecture with clean separation of concerns, type safety, and performance optimizations.

## Architecture Principles

### 1. **Separation of Concerns**
Each layer has a specific responsibility:
- **Presentation Layer** (Components) - UI rendering
- **Business Logic Layer** (Hooks) - Data fetching and mutations
- **Data Layer** (API, Storage) - External data sources

### 2. **Type Safety First**
- All code is written in TypeScript
- Strict type checking enabled
- No use of \`any\` type
- Shared types in \`types/\` directory

### 3. **Performance by Default**
- Memoization with \`memo()\`, \`useCallback()\`, \`useMemo()\`
- React Query caching with configurable stale times
- Local persistence with MMKV for instant loads
- Optimized FlatList rendering

## Data Flow Architecture

\`\`\`
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│   Presentation Layer        │
│   (Components)              │
│   - MainLayout              │
│   - PerfumeCard             │
│   - EmptyState              │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Business Logic Layer      │
│   (Custom Hooks)            │
│   - usePerfumes()           │
│   - useCreatePerfume()      │
│   - useUpdateStock()        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Caching Layer             │
│   (React Query)             │
│   - Query Cache             │
│   - Mutation Queue          │
└──────┬──────────────────────┘
       │
       ├──────────┬────────────┐
       ▼          ▼            ▼
┌──────────┐ ┌──────┐  ┌──────────┐
│   API    │ │ MMKV │  │ Zustand  │
│ (Remote) │ │(Local│  │ (Memory) │
└──────────┘ └──────┘  └──────────┘
\`\`\`

## State Management Strategy

### Server State (React Query)
Used for all API-related data:
- Perfumes list
- Brands list
- Search results
- Filter results

**Configuration:**
\`\`\`typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes
  gcTime: 10 * 60 * 1000,        // 10 minutes
  retry: 2,
  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
}
\`\`\`

### Client State (Zustand)
Used for synchronous lookups:
- Brand name resolution (brandId → name)
- Cached brand map

### UI State (useState)
Used for component-local state:
- Modal visibility
- Form inputs
- Search query
- Filters

## Component Architecture

### Component Hierarchy
\`\`\`
App (_layout.tsx)
│
├── ThemeProvider
│   └── QueryClientProvider
│       └── PaperProvider
│           └── MainLayout
│               ├── Header
│               ├── FilterChips
│               ├── Content (FlatList)
│               │   └── PerfumeCard
│               ├── Footer
│               └── Modals
│                   ├── AddPerfumeModal
│                   ├── FilterModal
│                   └── BrandManagementModal
\`\`\`

### Component Patterns

#### 1. Container/Presentational Pattern
\`\`\`typescript
// Container (Smart Component)
function PerfumeListContainer() {
  const { data, isLoading } = usePerfumes();
  return <PerfumeList data={data} isLoading={isLoading} />;
}

// Presentational (Dumb Component)
function PerfumeList({ data, isLoading }) {
  return <FlatList data={data} ... />;
}
\`\`\`

#### 2. Compound Components
\`\`\`typescript
<MainLayout {...layoutProps}>
  <FlatList data={perfumes} />
</MainLayout>
\`\`\`

#### 3. Render Props
\`\`\`typescript
<FlatList
  data={perfumes}
  renderItem={({ item }) => <PerfumeCard {...item} />}
/>
\`\`\`

## Hook Architecture

### Data Fetching Hooks
All API interactions are encapsulated in custom hooks:

\`\`\`typescript
// Query Hook Pattern
export const usePerfumes = () => {
  return useQuery({
    queryKey: ["perfumes"],
    queryFn: fetchPerfumes,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation Hook Pattern
export const useCreatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPerfume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    },
  });
};
\`\`\`

### Specialized Hooks
- \`useAccessibility()\` - Accessibility settings
- \`useDebouncedSearch()\` - Debounced search input
- \`useToast()\` - Toast notifications
- \`useTheme()\` - Theme context

## API Layer

### Centralized Configuration
All API endpoints are defined in \`config/api.ts\`:

\`\`\`typescript
export const API_ENDPOINTS = {
  perfumes: {
    list: () => \`\${API_BASE_URL}/perfumes\`,
    search: (q) => \`\${API_BASE_URL}/perfumes/search?q=\${q}\`,
    byId: (id) => \`\${API_BASE_URL}/perfumes/\${id}\`,
    // ...
  },
};
\`\`\`

### Error Handling
Consistent error handling across all API calls:

\`\`\`typescript
try {
  await mutation.mutateAsync(data);
} catch (error) {
  Alert.alert(
    "Error",
    error instanceof Error ? error.message : "Unknown error"
  );
}
\`\`\`

## Storage Strategy

### MMKV (Persistent Storage)
Used for:
- React Query cache persistence
- Theme preference
- Language preference

**Advantages:**
- Synchronous API
- Fast read/write
- Encrypted storage
- Small footprint

### Configuration
\`\`\`typescript
export const storage = new MMKV({
  id: "perfumario-storage",
  encryptionKey: "perfumario-secret-key",
});
\`\`\`

## Theme System

### Context-Based Theming
\`\`\`typescript
const ThemeContext = createContext<ThemeContextType>();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [userScheme, setUserScheme] = useState<ColorScheme>();

  const actualScheme = userScheme === "auto"
    ? systemScheme
    : userScheme;

  const colors = actualScheme === "dark"
    ? darkColors
    : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, actualScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
\`\`\`

## Internationalization (i18n)

### Translation System
Uses \`react-i18next\` with JSON translation files:

\`\`\`
i18n/
├── config.ts
└── locales/
    ├── en.json
    └── es.json
\`\`\`

### Usage Pattern
\`\`\`typescript
const { t } = useTranslation();

<Text>{t('perfume.add')}</Text>
// Spanish: "Añadir perfume"
// English: "Add perfume"
\`\`\`

## Performance Optimizations

### 1. Memoization
\`\`\`typescript
// Component Memoization
const PerfumeCard = memo(({ id, name, ... }) => {
  // Callback Memoization
  const handleEdit = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);

  // Value Memoization
  const stockStatus = useMemo(() => {
    return calculateStockStatus(stock);
  }, [stock]);

  return ...;
});
\`\`\`

### 2. FlatList Optimization
\`\`\`typescript
<FlatList
  data={perfumes}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
\`\`\`

### 3. Code Splitting
Future optimization opportunity:
\`\`\`typescript
const AddPerfumeModal = lazy(() =>
  import('@/components/modals/AddPerfumeModal')
);
\`\`\`

## Testing Strategy

### Unit Tests
- Hooks testing with \`@testing-library/react-hooks\`
- Component testing with \`@testing-library/react-native\`

### Integration Tests
- User flow testing
- API integration testing

### E2E Tests
- Critical path testing with Detox

## Security Considerations

### API Security
- HTTPS only
- Input validation
- Error message sanitization

### Data Security
- MMKV encryption
- Secure storage for sensitive data
- No logging of PII in production

## Scalability

### Current Optimizations
- Pagination-ready architecture
- Efficient caching strategy
- Optimized rendering

### Future Enhancements
- Virtual scrolling for large lists
- Background sync
- Image optimization
- Bundle size optimization

## Deployment Architecture

\`\`\`
┌─────────────────┐
│   Source Code   │
│   (GitHub)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions │
│  (CI/CD)        │
└────────┬────────┘
         │
         ├──────────┬──────────┐
         ▼          ▼          ▼
    ┌───────┐  ┌───────┐  ┌───────┐
    │ Lint  │  │ Test  │  │ Build │
    └───────┘  └───────┘  └───────┘
                              │
                              ▼
                         ┌────────┐
                         │  EAS   │
                         │ Build  │
                         └────┬───┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
               ┌─────────┐         ┌─────────┐
               │   iOS   │         │ Android │
               │  Store  │         │  Store  │
               └─────────┘         └─────────┘
\`\`\`

## Monitoring and Analytics

### Error Tracking
- React Error Boundaries
- Console logging in development
- Production error tracking (future)

### Performance Monitoring
- React DevTools
- Expo Performance Monitor
- Custom performance markers

## Best Practices

### 1. TypeScript
- Always define types
- Use interfaces for objects
- Avoid \`any\` type

### 2. Components
- Keep components small and focused
- Use composition over inheritance
- Memoize expensive renders

### 3. Hooks
- Follow Rules of Hooks
- Create custom hooks for reusable logic
- Keep hooks focused on single responsibility

### 4. Styling
- Use TailwindCSS utilities
- Avoid inline styles when possible
- Create reusable style constants

### 5. State Management
- Use React Query for server state
- Use local state for UI state
- Minimize global state

## Troubleshooting

### Common Issues

**Issue:** Metro bundler cache issues
**Solution:** \`expo start --clear\`

**Issue:** Type errors after package update
**Solution:** \`rm -rf node_modules && npm install\`

**Issue:** MMKV not working on Android
**Solution:** Rebuild native code with \`expo run:android\`

---

For more information, see:
- [API Documentation](./API.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [README](../README.md)
