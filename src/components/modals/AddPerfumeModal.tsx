import { useCreateBrand } from "@/hooks/useCreateBrand";
import { useCreatePerfume } from "@/hooks/useCreatePerfume";
import { FormTextField } from "@/src/components/common/FormTextField";
import {
  Gender,
  SegmentedControl,
} from "@/src/components/inputs/SegmentedControl";
import { Stepper } from "@/src/components/inputs/Stepper";
import { StockChips } from "@/src/components/inputs/StockChips";
import { BrandFromAPI } from "@/types/perfume";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type AddPerfumeFormValues = {
  name: string;
  brandId?: string;
  brandName?: string;
  gender: Gender;
  initialStockPreset?: number;
  initialStock: number;
};

export interface AddPerfumeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (values: AddPerfumeFormValues) => void; // Opcional ahora que manejamos la API internamente
  loading?: boolean;
  defaultValues?: Partial<AddPerfumeFormValues>;
  brands: BrandFromAPI[];
  primaryColor?: string;
}

/**
 * Modal for adding a new perfume with form validation and brand selection
 */
export const AddPerfumeModal: React.FC<AddPerfumeModalProps> = ({
  visible,
  onClose,
  onSave,
  loading = false,
  defaultValues = {},
  brands,
  primaryColor = "#603780",
}) => {
  // Hooks para la API
  const createBrandMutation = useCreateBrand();
  const createPerfumeMutation = useCreatePerfume();

  const [formValues, setFormValues] = useState<AddPerfumeFormValues>({
    name: "",
    brandId: undefined,
    brandName: "",
    gender: "female",
    initialStockPreset: 10,
    initialStock: 10,
    ...defaultValues,
  });

  const [errors, setErrors] = useState<Partial<AddPerfumeFormValues>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AddPerfumeFormValues> = {};

    if (!formValues.name.trim() || formValues.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Si no hay brandId, significa que necesitamos crear la marca primero
    if (!formValues.brandId && formValues.brandName?.trim()) {
      try {
        const newBrand = await createBrandMutation.mutateAsync({
          name: formValues.brandName.trim(),
        });

        // Actualizar el brandId con el ID de la nueva marca
        formValues.brandId = newBrand.id;
      } catch (error) {
        Alert.alert(
          "Error",
          `No se pudo crear la marca: ${error instanceof Error ? error.message : "Error desconocido"}`,
          [{ text: "OK" }],
        );
        return;
      }
    }

    // Crear el perfume
    if (formValues.brandId) {
      try {
        await createPerfumeMutation.mutateAsync({
          name: formValues.name.trim(),
          gender: formValues.gender,
          stock: formValues.initialStock,
          brandId: formValues.brandId,
        });

        Alert.alert(
          "Perfume creado",
          `El perfume "${formValues.name}" ha sido creado exitosamente.`,
          [{ text: "OK", onPress: onClose }],
        );
      } catch (error) {
        Alert.alert(
          "Error",
          `No se pudo crear el perfume: ${error instanceof Error ? error.message : "Error desconocido"}`,
          [{ text: "OK" }],
        );
      }
    } else {
      Alert.alert(
        "Error",
        "Debe seleccionar o crear una marca antes de guardar el perfume.",
        [{ text: "OK" }],
      );
    }
  };

  const handleAddBrand = async () => {
    if (!formValues.brandName?.trim()) return;

    try {
      const newBrand = await createBrandMutation.mutateAsync({
        name: formValues.brandName.trim(),
      });

      // Actualizar el formulario con la nueva marca creada
      setFormValues((prev) => ({
        ...prev,
        brandId: newBrand.id,
        brandName: newBrand.name,
      }));

      Alert.alert(
        "Marca creada",
        `La marca "${newBrand.name}" ha sido creada exitosamente.`,
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        `No se pudo crear la marca: ${error instanceof Error ? error.message : "Error desconocido"}`,
        [{ text: "OK" }],
      );
    }
  };

  const isFormValid = formValues.name.trim().length >= 2;
  const isLoading =
    loading || createBrandMutation.isPending || createPerfumeMutation.isPending;

  const genderOptions = [
    { label: "Mujer", value: "female" as Gender },
    { label: "Hombre", value: "male" as Gender },
    { label: "Unisex", value: "unisex" as Gender },
  ];

  const stockPresets = [0, 5, 10, 15, 20];

  return (
    <Modal
      testID="addPerfumeModal"
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F4F5" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Modal Card */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                padding: 24,
                marginTop: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 12,
                minHeight: "80%",
              }}
            >
              {/* Header */}
              <Text
                testID="modalTitle"
                accessibilityRole="header"
                style={{
                  fontSize: 28,
                  fontWeight: "600",
                  color: "#2b2354",
                  marginBottom: 24,
                }}
              >
                Añadir perfume
              </Text>

              {/* Perfume Name */}
              <FormTextField
                testID="nameInput"
                label="Nombre del perfume"
                placeholder="Nombre del perfume"
                value={formValues.name}
                onChangeText={(text) =>
                  setFormValues((prev) => ({ ...prev, name: text }))
                }
                error={errors.name}
                style={{ marginBottom: 20 }}
              />

              {/* Brand Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Marca
                </Text>

                <View>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      testID="brandInput"
                      value={formValues.brandName}
                      onChangeText={(text) =>
                        setFormValues((prev) => ({
                          ...prev,
                          brandName: text,
                          brandId: undefined, // Reset brandId when typing
                        }))
                      }
                      placeholder="Nombre de la marca"
                      placeholderTextColor="#9CA3AF"
                      style={{
                        height: 52,
                        paddingHorizontal: 16,
                        borderRadius: 16,
                        backgroundColor: "#F6F6F8",
                        fontSize: 16,
                        color: "#111827",
                        borderWidth: 0,
                      }}
                    />

                    {/* Indicador visual cuando se selecciona una marca existente */}
                    {formValues.brandName &&
                      brands.find(
                        (b) =>
                          b.name.toLowerCase() ===
                          (formValues.brandName || "").toLowerCase(),
                      ) && (
                        <View
                          style={{
                            position: "absolute",
                            right: 12,
                            top: 14,
                            backgroundColor: "#10B981",
                            borderRadius: 10,
                            width: 20,
                            height: 20,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          >
                            ✓
                          </Text>
                        </View>
                      )}
                  </View>

                  {/* Show add brand option if brand doesn't exist */}
                  {formValues.brandName &&
                    formValues.brandName.trim().length > 0 &&
                    !brands.find(
                      (b) =>
                        b.name.toLowerCase() ===
                        (formValues.brandName || "").toLowerCase(),
                    ) && (
                      <Pressable
                        onPress={handleAddBrand}
                        disabled={createBrandMutation.isPending}
                        style={{
                          marginTop: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          backgroundColor: createBrandMutation.isPending
                            ? "#E5E7EB"
                            : "#F3F4F6",
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: createBrandMutation.isPending
                            ? "#9CA3AF"
                            : primaryColor,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        {createBrandMutation.isPending && (
                          <ActivityIndicator
                            size="small"
                            color={primaryColor}
                          />
                        )}
                        <Text
                          style={{
                            fontSize: 14,
                            color: createBrandMutation.isPending
                              ? "#9CA3AF"
                              : primaryColor,
                            fontWeight: "500",
                          }}
                        >
                          {createBrandMutation.isPending
                            ? "Creando marca..."
                            : `+ Añadir '${formValues.brandName}'`}
                        </Text>
                      </Pressable>
                    )}

                  {/* Show existing brands suggestion */}
                  {formValues.brandName &&
                    formValues.brandName.trim().length > 0 &&
                    !brands.find(
                      (b) =>
                        b.name.toLowerCase() ===
                        (formValues.brandName || "").toLowerCase(),
                    ) &&
                    brands.filter((b) =>
                      b.name
                        .toLowerCase()
                        .includes((formValues.brandName || "").toLowerCase()),
                    ).length > 0 && (
                      <View style={{ marginTop: 8 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            marginBottom: 4,
                          }}
                        >
                          Marcas similares:
                        </Text>
                        {brands
                          .filter((b) =>
                            b.name
                              .toLowerCase()
                              .includes(
                                (formValues.brandName || "").toLowerCase(),
                              ),
                          )
                          .slice(0, 3)
                          .map((brand) => (
                            <Pressable
                              key={brand.id || brand.name}
                              onPress={() =>
                                setFormValues((prev) => ({
                                  ...prev,
                                  brandName: brand.name,
                                  brandId: brand.id || undefined,
                                }))
                              }
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                marginVertical: 2,
                                backgroundColor: "#F3F4F6",
                                borderRadius: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#111827",
                                }}
                              >
                                {brand.name}
                              </Text>
                            </Pressable>
                          ))}
                      </View>
                    )}
                </View>
              </View>

              {/* Gender Selection */}
              <View style={{ marginBottom: 24 }}>
                <SegmentedControl
                  testID="genderControl"
                  options={genderOptions}
                  value={formValues.gender}
                  onChange={(gender) =>
                    setFormValues((prev) => ({ ...prev, gender }))
                  }
                  primaryColor={primaryColor}
                />
              </View>

              {/* Stock Initial */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#111827",
                    marginBottom: 12,
                  }}
                >
                  Stock inicial
                </Text>

                {/* Stock Chips */}
                <StockChips
                  testID="stockChips"
                  values={stockPresets}
                  selected={formValues.initialStockPreset || 10}
                  onSelect={(value) =>
                    setFormValues((prev) => ({
                      ...prev,
                      initialStockPreset: value,
                      initialStock: value,
                    }))
                  }
                  primaryColor={primaryColor}
                  style={{ marginBottom: 16 }}
                />

                {/* Stepper */}
                <Stepper
                  testID="stepper"
                  value={formValues.initialStock}
                  min={0}
                  onChange={(value) =>
                    setFormValues((prev) => ({ ...prev, initialStock: value }))
                  }
                  primaryColor={primaryColor}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 24,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              flexDirection: "row",
              gap: 16,
            }}
          >
            <Pressable
              testID="cancelBtn"
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              onPress={onClose}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#6B7280",
                }}
              >
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              testID="saveBtn"
              accessibilityRole="button"
              accessibilityLabel="Guardar perfume"
              onPress={handleSave}
              disabled={!isFormValid || isLoading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 16,
                backgroundColor:
                  isFormValid && !isLoading ? primaryColor : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              {isLoading && <ActivityIndicator size="small" color="#FFFFFF" />}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: isFormValid && !isLoading ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
