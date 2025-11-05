import { BrandsInitializer } from "@/components/BrandsInitializer";
import { ThemeProvider } from "@/context/ThemeContext";
import { queryClient } from "@/hooks/queryClient";
import "@/i18n/config";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <BrandsInitializer />
            <Stack screenOptions={{ headerShown: false }} />
          </PaperProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
