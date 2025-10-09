# Configuración de TanStack Query

## Descripción

Este proyecto utiliza TanStack Query (anteriormente React Query) para el manejo de estado del servidor, caché y sincronización de datos.

## Configuración

### 1. QueryClient Provider

El `QueryClient` está configurado en `app/_layout.tsx` y envuelve toda la aplicación:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/hooks/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Resto de la aplicación */}
    </QueryClientProvider>
  );
}
```

### 2. Configuración del QueryClient

El cliente está configurado en `hooks/queryClient.ts` con las siguientes opciones:

- **staleTime**: 5 minutos - Los datos se consideran frescos por 5 minutos
- **gcTime**: 10 minutos - Los datos se mantienen en caché por 10 minutos
- **retry**: 2 intentos - Reintenta las consultas fallidas 2 veces
- **refetchOnWindowFocus**: false - No refetch automático al enfocar la ventana
- **refetchOnReconnect**: true - Refetch automático al reconectar

## Hooks Disponibles

### usePerfumes()

Hook para obtener todos los perfumes:

```tsx
const { data: perfumes = [], isLoading, error } = usePerfumes();
```

### usePerfumeSearch(query)

Hook para buscar perfumes por término:

```tsx
const {
  data: searchResults = [],
  isLoading,
  error,
} = usePerfumeSearch(searchQuery);
```

## Características

- ✅ Caché automático de consultas
- ✅ Estados de loading y error
- ✅ Reintentos automáticos
- ✅ Invalidación de caché
- ✅ Búsqueda con debounce
- ✅ Manejo de tipos TypeScript
- ✅ Configuración centralizada

## Beneficios

1. **Mejor UX**: Estados de loading y error manejados automáticamente
2. **Performance**: Caché inteligente reduce llamadas innecesarias al servidor
3. **Sincronización**: Datos siempre actualizados
4. **Developer Experience**: Hooks simples y tipados
5. **Mantenibilidad**: Lógica de datos centralizada y reutilizable
