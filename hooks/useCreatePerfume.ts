import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

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
  const response = await fetch(`${API_BASE_URL}/perfumes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

      console.log("Perfume creado exitosamente:", newPerfume);
    },
    onError: (error) => {
      console.error("Error al crear perfume:", error);
    },
  });
};
