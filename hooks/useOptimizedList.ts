import { useCallback, useMemo } from "react";

interface OptimizedListConfig {
  itemHeight: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  initialNumToRender?: number;
  windowSize?: number;
}

export const useOptimizedList = (config: OptimizedListConfig) => {
  const {
    itemHeight,
    maxToRenderPerBatch = 10,
    updateCellsBatchingPeriod = 50,
    initialNumToRender = 10,
    windowSize = 10,
  } = config;

  // KeyExtractor optimizado
  const keyExtractor = useCallback((item: any, index: number) => {
    return item.id ? item.id.toString() : `item-${index}`;
  }, []);

  // GetItemLayout optimizado para listas con altura fija
  const getItemLayout = useCallback(
    (data: any[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight]
  );

  // Configuración de rendimiento memoizada
  const performanceConfig = useMemo(
    () => ({
      removeClippedSubviews: true,
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
      initialNumToRender,
      windowSize,
      getItemLayout,
    }),
    [
      maxToRenderPerBatch,
      updateCellsBatchingPeriod,
      initialNumToRender,
      windowSize,
      getItemLayout,
    ]
  );

  return {
    keyExtractor,
    getItemLayout,
    performanceConfig,
  };
};
