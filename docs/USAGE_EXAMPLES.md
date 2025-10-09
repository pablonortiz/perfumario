# Ejemplos de Uso - Zustand + TanStack Query

## Uso Básico en Componentes

### 1. Obtener nombre de marca por ID

```tsx
import { useBrandsStore } from "@/stores/brandsStore";

const MyComponent = ({ brandId }: { brandId: string }) => {
  const { getBrandName } = useBrandsStore();
  const brandName = getBrandName(brandId);

  return <Text>{brandName}</Text>;
};
```

### 2. Usar perfumes con marcas resueltas

```tsx
import { usePerfumesWithBrands } from "@/hooks/usePerfumesWithBrands";

const PerfumesList = () => {
  const { data: perfumes, isLoading, error } = usePerfumesWithBrands();

  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={perfumes}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.brandName}</Text> {/* ← Nombre ya resuelto */}
        </View>
      )}
    />
  );
};
```

### 3. Acceso directo al store completo

```tsx
import { useBrandsStore } from "@/stores/brandsStore";

const BrandsList = () => {
  const { brands, isLoading, error } = useBrandsStore();

  return (
    <View>
      {brands.map((brand) => (
        <Text key={brand.id}>{brand.name}</Text>
      ))}
    </View>
  );
};
```

## Casos de Uso Avanzados

### 1. Filtrado por marca

```tsx
const PerfumesByBrand = ({ brandId }: { brandId: string }) => {
  const { data: perfumes } = usePerfumesWithBrands();
  const { getBrandName } = useBrandsStore();

  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => perfume.brand_id === brandId);
  }, [perfumes, brandId]);

  const brandName = getBrandName(brandId);

  return (
    <View>
      <Text>Perfumes de {brandName}</Text>
      {/* Renderizar perfumes filtrados */}
    </View>
  );
};
```

### 2. Búsqueda con nombres de marcas

```tsx
const SearchWithBrands = ({ query }: { query: string }) => {
  const { data: searchResults } = usePerfumeSearch(query);
  const { getBrandName } = useBrandsStore();

  const resultsWithBrands = useMemo(() => {
    return searchResults.map((perfume) => ({
      ...perfume,
      brandName: getBrandName(perfume.brand_id),
    }));
  }, [searchResults, getBrandName]);

  return (
    <FlatList
      data={resultsWithBrands}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.brandName}</Text>
        </View>
      )}
    />
  );
};
```

## Patrones Recomendados

### 1. Usar getBrandName() para casos simples

```tsx
// ✅ Recomendado para casos simples
const brandName = getBrandName(brandId);
```

### 2. Usar usePerfumesWithBrands() para listas completas

```tsx
// ✅ Recomendado para listas con muchos perfumes
const { data: perfumes } = usePerfumesWithBrands();
```

### 3. Evitar re-renders innecesarios

```tsx
// ✅ Usar useMemo para transformaciones costosas
const processedData = useMemo(() => {
  return data.map((item) => ({
    ...item,
    brandName: getBrandName(item.brand_id),
  }));
}, [data, getBrandName]);
```

## Debugging

### 1. Verificar estado del store

```tsx
const { brands, brandsMap, isLoading, error } = useBrandsStore();
console.log("Brands loaded:", brands.length);
console.log("Brands map:", brandsMap);
```

### 2. Verificar carga de marcas

```tsx
// En BrandsInitializer o cualquier componente
const { error } = useBrands();
if (error) {
  console.error("Error loading brands:", error);
}
```
