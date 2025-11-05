import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeletePerfumeResponse {
  message: string;
}

const deletePerfume = async (
  perfumeId: string,
): Promise<DeletePerfumeResponse> => {
  const response = await fetch(API_ENDPOINTS.perfumes.delete(perfumeId), {
    method: "DELETE",
    ...DEFAULT_FETCH_OPTIONS,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al eliminar perfume: ${response.status}`,
    );
  }

  return response.json();
};

export const useDeletePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePerfume,
    onSuccess: (_, perfumeId) => {
      // Invalidar la query de perfumes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });

      // También invalidar búsquedas si están activas
      queryClient.invalidateQueries({ queryKey: ["perfumeSearch"] });

      if (__DEV__) {
        console.log("Perfume eliminado exitosamente:", perfumeId);
      }
    },
    onError: (error) => {
      console.error("Error al eliminar perfume:", error);
    },
  });
};
