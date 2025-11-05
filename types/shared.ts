/**
 * Shared types used across the application
 */

export type Gender = "male" | "female" | "unisex";

export interface PerfumeEditData {
  id: string;
  name: string;
  gender: Gender;
  brandId: string;
  stock: number;
}

export interface FilterOptions {
  gender?: Gender;
  brandId?: string;
}

export type ToastType = "success" | "error" | "info";

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}
