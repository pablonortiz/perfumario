import { Perfume as BasePerfume } from "perfumario-schemas";

// Tipo personalizado para perfumes que vienen del servidor con brand_id
export interface PerfumeWithBrandId extends Omit<BasePerfume, "brand"> {
  brand_id: string;
}

// Tipo para perfumes que ya tienen el nombre de la marca resuelto
export interface PerfumeWithBrandName extends Omit<BasePerfume, "brand"> {
  brandName: string;
}
