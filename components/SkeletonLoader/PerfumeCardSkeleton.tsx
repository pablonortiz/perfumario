import { LoadingShimmer } from "@/components/LoadingShimmer";
import React from "react";
import { View } from "react-native";

export const PerfumeCardSkeleton: React.FC = () => {
  return (
    <View style={{ marginHorizontal: 16, marginVertical: 8 }}>
      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Header with gender icon and name */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {/* Gender icon skeleton */}
          <LoadingShimmer
            width={24}
            height={24}
            borderRadius={12}
            style={{ marginRight: 12 }}
          />
          {/* Perfume name skeleton */}
          <LoadingShimmer width={120} height={20} borderRadius={4} />
        </View>

        {/* Brand name skeleton */}
        <LoadingShimmer
          width={80}
          height={16}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />

        {/* Stock status and quantity row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {/* Stock status skeleton */}
          <LoadingShimmer width={90} height={24} borderRadius={12} />
          {/* Stock quantity skeleton */}
          <LoadingShimmer width={40} height={16} borderRadius={4} />
        </View>

        {/* Counter buttons skeleton */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Decrement button */}
          <LoadingShimmer
            width={40}
            height={40}
            borderRadius={20}
            style={{ marginRight: 16 }}
          />
          {/* Counter value */}
          <LoadingShimmer
            width={30}
            height={20}
            borderRadius={4}
            style={{ marginRight: 16 }}
          />
          {/* Increment button */}
          <LoadingShimmer width={40} height={40} borderRadius={20} />
        </View>
      </View>
    </View>
  );
};

export default PerfumeCardSkeleton;
