import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { AddPerfumeModal } from "../src/components/modals/AddPerfumeModal";

// Mock SafeAreaView
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock MaterialCommunityIcons
jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: "MaterialCommunityIcons",
}));

const mockBrands = [
  { id: "1", name: "Dior" },
  { id: "2", name: "Chanel" },
  { id: "3", name: "Versace" },
];

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
  brands: mockBrands,
};

describe("AddPerfumeModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId, getByText } = render(
      <AddPerfumeModal {...defaultProps} />,
    );

    expect(getByTestId("addPerfumeModal")).toBeTruthy();
    expect(getByText("Añadir perfume")).toBeTruthy();
    expect(getByTestId("nameInput")).toBeTruthy();
    expect(getByTestId("brandRow")).toBeTruthy();
    expect(getByTestId("genderControl")).toBeTruthy();
    expect(getByTestId("stockChips")).toBeTruthy();
    expect(getByTestId("stepper")).toBeTruthy();
    expect(getByTestId("cancelBtn")).toBeTruthy();
    expect(getByTestId("saveBtn")).toBeTruthy();
  });

  it("disables save button when name is empty", () => {
    const { getByTestId } = render(<AddPerfumeModal {...defaultProps} />);

    const saveButton = getByTestId("saveBtn");
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("enables save button when name has at least 2 characters", () => {
    const { getByTestId } = render(<AddPerfumeModal {...defaultProps} />);

    const nameInput = getByTestId("nameInput");
    fireEvent.changeText(nameInput, "Test Perfume");

    const saveButton = getByTestId("saveBtn");
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("calls onClose when cancel button is pressed", () => {
    const { getByTestId } = render(<AddPerfumeModal {...defaultProps} />);

    const cancelButton = getByTestId("cancelBtn");
    fireEvent.press(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("updates stock when chip is selected", () => {
    const { getByTestId } = render(<AddPerfumeModal {...defaultProps} />);

    const chip15 = getByTestId("stockChips-15");
    fireEvent.press(chip15);

    // The stepper should reflect the new value
    const stepper = getByTestId("stepper");
    expect(stepper).toBeTruthy();
  });

  it("calls onSave with correct values when save button is pressed", async () => {
    const { getByTestId } = render(<AddPerfumeModal {...defaultProps} />);

    // Fill in the form
    const nameInput = getByTestId("nameInput");
    fireEvent.changeText(nameInput, "Test Perfume");

    const saveButton = getByTestId("saveBtn");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith({
        name: "Test Perfume",
        brandId: undefined,
        brandName: "",
        gender: "female",
        initialStockPreset: 10,
        initialStock: 10,
      });
    });
  });

  it("shows loading state correctly", () => {
    const { getByTestId } = render(
      <AddPerfumeModal {...defaultProps} loading={true} />,
    );

    const saveButton = getByTestId("saveBtn");
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("applies default values correctly", () => {
    const defaultValues = {
      name: "Default Perfume",
      gender: "male" as const,
      initialStock: 5,
    };

    const { getByTestId } = render(
      <AddPerfumeModal {...defaultProps} defaultValues={defaultValues} />,
    );

    const nameInput = getByTestId("nameInput");
    expect(nameInput.props.value).toBe("Default Perfume");
  });
});
