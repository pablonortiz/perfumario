import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdatePerfumeData {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  stock: number;
  brandId: string;
}

interface UpdatePerfumeResponse {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  brandId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const updatePerfume = async (
  data: UpdatePerfumeData,
): Promise<UpdatePerfumeResponse> => {
  const { id, ...updateData } = data;

  const response = await fetch(API_ENDPOINTS.perfumes.update(id), {
    method: "PATCH",
    ...DEFAULT_FETCH_OPTIONS,
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al actualizar perfume: ${response.status}`,
    );
  }

  return response.json();
};

export const useUpdatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePerfume,
    onSuccess: (updatedPerfume) => {
      // Invalidar la query de perfumes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });

      // También invalidar búsquedas si están activas
      queryClient.invalidateQueries({ queryKey: ["perfumeSearch"] });

      if (__DEV__) {
        console.log("Perfume actualizado exitosamente:", updatedPerfume);
      }
    },
    onError: (error) => {
      console.error("Error al actualizar perfume:", error);
    },
  });
};
