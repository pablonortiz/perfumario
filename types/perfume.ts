import { Perfume } from "perfumario-schemas";

// Tipo para perfumes que vienen del servidor (estructura real)
export interface PerfumeFromAPI {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  brandId: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Tipo para marcas que vienen del servidor (estructura real)
export interface BrandFromAPI {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Tipo para perfumes que ya tienen el nombre de la marca resuelto (compatibilidad)
export interface PerfumeWithBrandName extends Omit<Perfume, "brandId"> {
  brandName: string;
}
