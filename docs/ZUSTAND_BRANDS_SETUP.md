# Configuración de Zustand para Brands

## Descripción

Este proyecto utiliza Zustand para el manejo del estado global de las marcas (brands), permitiendo un acceso rápido y eficiente a los nombres de las marcas por ID.

## Arquitectura

### 1. Store de Zustand (`stores/brandsStore.ts`)

El store maneja:

- **brands**: Array completo de marcas
- **brandsMap**: Mapa de ID → nombre para búsquedas rápidas
- **isLoading**: Estado de carga
- **error**: Manejo de errores
- **getBrandName()**: Función para obtener nombre por ID

```tsx
const { getBrandName } = useBrandsStore();
const brandName = getBrandName(brandId);
```

### 2. Hook de TanStack Query (`hooks/useBrands.ts`)

Integra TanStack Query con Zustand:

- Carga las marcas desde la API
- Actualiza automáticamente el store de Zustand
- Maneja estados de loading y error
- Configuración de caché optimizada (30 min staleTime)
- Usa `useEffect` para manejar cambios de estado (compatible con TanStack Query v5)

### 3. Hook Personalizado (`hooks/useBrandName.ts`)

Hook optimizado para obtener nombres de marcas:

- Se suscribe directamente a `brands` y `brandsMap` del store
- Asegura re-renders automáticos cuando las marcas se cargan
- Más reactivo que usar `getBrandName` del store
- Soluciona problemas de timing en la carga inicial

### 4. Inicializador (`components/BrandsInitializer/index.tsx`)

Componente que se ejecuta al inicio de la aplicación:

- Carga las marcas automáticamente
- Se incluye en el layout principal
- No renderiza UI, solo inicializa datos

## Flujo de Datos

```
1. App inicia → BrandsInitializer se monta
2. useBrands() ejecuta fetchBrands()
3. Datos se guardan en Zustand store
4. PerfumeCard usa getBrandName(brandId)
5. Nombre de marca se resuelve desde el store
```

## Tipos Actualizados

### PerfumeWithBrandId

```tsx
interface PerfumeWithBrandId {
  id?: string;
  name: string;
  gender: "male" | "female" | "unisex";
  brand_id: string; // ← Cambio clave: ID en lugar de objeto
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Uso en Componentes

```tsx
// Antes
<PerfumeCard brand={item.brand?.name || ""} />

// Ahora
<PerfumeCard brandId={item.brand_id || ""} />

// En el componente PerfumeCard
const brandName = useBrandName(brandId); // Hook reactivo
```

## Beneficios

1. **Performance**: Búsquedas O(1) por ID en lugar de O(n)
2. **Consistencia**: Una sola fuente de verdad para marcas
3. **Eficiencia**: Caché inteligente con TanStack Query
4. **Escalabilidad**: Fácil agregar más datos globales
5. **Type Safety**: Tipos TypeScript completos

## Configuración de Caché

- **staleTime**: 30 minutos (las marcas cambian poco)
- **gcTime**: 1 hora (mantiene en memoria)
- **Retry**: Configurado en queryClient global

## API Endpoints

- `GET /brands` - Obtiene todas las marcas
- `GET /perfumes` - Obtiene perfumes con `brand_id`
- `GET /perfumes/search?q=query` - Búsqueda con `brand_id`

## Consideraciones

- Las marcas se cargan una sola vez al inicio
- El store persiste durante toda la sesión
- Fallback a "Marca desconocida" si no se encuentra el ID
- Logs de error en consola para debugging
