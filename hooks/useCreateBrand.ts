import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateBrandData {
  name: string;
}

interface CreateBrandResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const createBrand = async (
  data: CreateBrandData,
): Promise<CreateBrandResponse> => {
  const response = await fetch(API_ENDPOINTS.brands.create(), {
    method: "POST",
    ...DEFAULT_FETCH_OPTIONS,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al crear marca: ${response.status}`,
    );
  }

  return response.json();
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: (newBrand) => {
      // Invalidar la query de marcas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["brands"] });

      // También invalidar perfumes por si hay cambios
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });

      if (__DEV__) {
        console.log("Marca creada exitosamente:", newBrand);
      }
    },
    onError: (error) => {
      console.error("Error al crear marca:", error);
    },
  });
};
