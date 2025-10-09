/**
 * Función para obtener propiedades visuales según el género del perfume
 * @param gender - Género del perfume ("male", "female", "unisex")
 * @returns Objeto con colores de fondo, ícono y nombre del ícono
 */
export const getGenderProps = (gender: "male" | "female" | "unisex") => {
  switch (gender) {
    case "male":
      return {
        genderBackgroundColor: "#EFF6FF", // Azul claro
        genderIconColor: "#3B82F6", // Azul
        genderIconName: "male" as const,
      };
    case "female":
      return {
        genderBackgroundColor: "#FDF2F8", // Rosa claro
        genderIconColor: "#EC4899", // Rosa
        genderIconName: "female" as const,
      };
    case "unisex":
      return {
        genderBackgroundColor: "#F9FAFB", // Gris claro
        genderIconColor: "#6B7280", // Gris
        genderIconName: "male-female" as const,
      };
    default:
      return {
        genderBackgroundColor: "#F9FAFB", // Gris claro
        genderIconColor: "#6B7280", // Gris
        genderIconName: "male-female" as const,
      };
  }
};
