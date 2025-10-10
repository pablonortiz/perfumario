import { PerfumeFromAPI } from "@/types/perfume";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

const fetchPerfumes = async (): Promise<PerfumeFromAPI[]> => {
  const response = await fetch(`${API_BASE_URL}/perfumes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al cargar perfumes: ${response.status}`);
  }

  return response.json();
};

export const usePerfumes = () => {
  return useQuery({
    queryKey: ["perfumes"],
    queryFn: fetchPerfumes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    // Asegurar que las marcas se carguen primero
    enabled: true, // Siempre habilitado, pero las marcas se cargan en paralelo
  });
};
