import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

interface DeleteBrandRequest {
  brandId: string;
}

const deleteBrand = async ({ brandId }: DeleteBrandRequest): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar la marca: ${response.status}`);
  }
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      queryClient.invalidateQueries({ queryKey: ["perfumeSearch"] });

      if (__DEV__) {
        console.log("Marca eliminada exitosamente");
      }
    },
    onError: (error) => {
      console.error("Error al eliminar marca:", error);
    },
  });
};
