import { useBrandsStore } from "@/stores/brandsStore";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "perfumario-schemas";
import { useEffect } from "react";

const API_BASE_URL = "https://perfumario-server.vercel.app";

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${API_BASE_URL}/brands`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al cargar marcas: ${response.status}`);
  }

  return response.json();
};

export const useBrands = () => {
  const { setBrands, setLoading, setError } = useBrandsStore();

  const query = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 30 * 60 * 1000, // 30 minutos - las marcas cambian poco
    gcTime: 60 * 60 * 1000, // 1 hora
    refetchOnMount: true, // Asegurar que se cargue al montar
    refetchOnWindowFocus: false, // No refetch en focus
  });

  // Usar useEffect para manejar los cambios de estado
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setBrands(query.data);
      setLoading(false);
    }

    if (query.error) {
      setError(query.error.message);
      setLoading(false);
    }

    if (query.isLoading) {
      setLoading(true);
    }
  }, [
    query.data,
    query.error,
    query.isLoading,
    setBrands,
    setLoading,
    setError,
  ]);

  return query;
};
