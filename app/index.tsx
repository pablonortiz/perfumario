import Header from "@/components/Header";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </SafeAreaView>
  );
}
