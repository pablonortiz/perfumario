import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

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
  const response = await fetch(`${API_BASE_URL}/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
