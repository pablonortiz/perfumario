import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateStockRequest {
  perfumeId: string;
  stockChange: number; // Positivo para aumentar, negativo para disminuir
}

interface UpdateStockResponse {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  brandId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const updateStock = async ({
  perfumeId,
  stockChange,
}: UpdateStockRequest): Promise<UpdateStockResponse> => {
  // Primero obtenemos el perfume actual para calcular el nuevo stock
  const getResponse = await fetch(API_ENDPOINTS.perfumes.byId(perfumeId));

  if (!getResponse.ok) {
    throw new Error("Error al obtener el perfume actual");
  }

  const currentPerfume = await getResponse.json();
  const newStock = currentPerfume.stock + stockChange;

  // Actualizamos el perfume con el nuevo stock
  const response = await fetch(API_ENDPOINTS.perfumes.update(perfumeId), {
    method: "PATCH",
    ...DEFAULT_FETCH_OPTIONS,
    body: JSON.stringify({ stock: newStock }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el stock del perfume");
  }

  return response.json();
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      // Invalidar las queries relacionadas con perfumes
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      queryClient.invalidateQueries({ queryKey: ["perfumeSearch"] });

      if (__DEV__) {
        console.log("Stock actualizado exitosamente");
      }
    },
    onError: (error) => {
      if (__DEV__) {
        console.error("Error al actualizar stock:", error);
      }
    },
  });
};
