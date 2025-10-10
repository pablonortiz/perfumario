import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

interface DeletePerfumeResponse {
  message: string;
}

const deletePerfume = async (
  perfumeId: string,
): Promise<DeletePerfumeResponse> => {
  const response = await fetch(`${API_BASE_URL}/perfumes/${perfumeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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
