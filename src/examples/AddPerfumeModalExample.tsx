import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  AddPerfumeFormValues,
  AddPerfumeModal,
} from "../components/modals/AddPerfumeModal";

/**
 * Example usage of AddPerfumeModal component
 */
export const AddPerfumeModalExample: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mockBrands = [
    { id: "1", name: "Dior" },
    { id: "2", name: "Chanel" },
    { id: "3", name: "Versace" },
    { id: "4", name: "Tom Ford" },
    { id: "5", name: "Yves Saint Laurent" },
  ];

  const handleSave = async (values: AddPerfumeFormValues) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Perfume saved:", values);

      // Close modal after successful save
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving perfume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = (proposedName: string) => {
    console.log("Adding new brand:", proposedName);
    // Here you would typically navigate to a brand creation screen
    // or show a brand creation modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Perfume Modal Example</Text>

      <Pressable style={styles.button} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.buttonText}>Open Add Perfume Modal</Text>
      </Pressable>

      <AddPerfumeModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
        loading={isLoading}
        brands={mockBrands}
        onAddBrand={handleAddBrand}
        defaultValues={{
          gender: "female",
          initialStockPreset: 10,
          initialStock: 10,
        }}
        primaryColor="#603780"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F4F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#603780",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
