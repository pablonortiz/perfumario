import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePerfumeData {
  name: string;
  gender: "male" | "female" | "unisex";
  stock: number;
  brandId: string;
}

interface CreatePerfumeResponse {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  brandId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const createPerfume = async (
  data: CreatePerfumeData,
): Promise<CreatePerfumeResponse> => {
  const response = await fetch(API_ENDPOINTS.perfumes.create(), {
    method: "POST",
    ...DEFAULT_FETCH_OPTIONS,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al crear perfume: ${response.status}`,
    );
  }

  return response.json();
};

export const useCreatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPerfume,
    onSuccess: (newPerfume) => {
      // Invalidar la query de perfumes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });

      if (__DEV__) {
        console.log("Perfume creado exitosamente:", newPerfume);
      }
    },
    onError: (error) => {
      console.error("Error al crear perfume:", error);
    },
  });
};
