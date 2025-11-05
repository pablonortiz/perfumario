import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { storage } from "@/config/storage";

export type ColorScheme = "light" | "dark" | "auto";

interface ThemeContextType {
  colorScheme: ColorScheme;
  actualColorScheme: "light" | "dark";
  setColorScheme: (scheme: ColorScheme) => void;
  colors: typeof lightColors | typeof darkColors;
}

const lightColors = {
  background: "#FFFFFF",
  surface: "#F4F4F5",
  primary: "#603780",
  primaryLight: "#8B5CF6",
  secondary: "#6366F1",
  text: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  card: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

const darkColors = {
  background: "#111827",
  surface: "#1F2937",
  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  secondary: "#818CF8",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  border: "#374151",
  error: "#F87171",
  success: "#34D399",
  warning: "#FBBF24",
  card: "#1F2937",
  overlay: "rgba(0, 0, 0, 0.7)",
} as const;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useRNColorScheme() ?? "light";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const saved = storage.getString("colorScheme");
    return (saved as ColorScheme) || "auto";
  });

  const actualColorScheme: "light" | "dark" =
    colorScheme === "auto" ? systemColorScheme : colorScheme;

  const colors = actualColorScheme === "dark" ? darkColors : lightColors;

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    storage.set("colorScheme", scheme);
  };

  useEffect(() => {
    // Save preference to storage
    storage.set("colorScheme", colorScheme);
  }, [colorScheme]);

  const value: ThemeContextType = {
    colorScheme,
    actualColorScheme,
    setColorScheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
