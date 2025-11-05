import React, { memo } from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string | string[];
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Reusable EmptyState component for showing no results, errors, etc.
 */
export const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ title, description, icon, actions }) => {
    const descriptions = Array.isArray(description)
      ? description
      : description
        ? [description]
        : [];

    return (
      <View className="items-center px-8">
        {icon && <View className="mb-4">{icon}</View>}

        <Text className="text-gray-500 text-lg font-semibold text-center">
          {title}
        </Text>

        {descriptions.map((desc, index) => (
          <Text key={index} className="text-gray-400 text-center mt-2">
            {desc}
          </Text>
        ))}

        {actions && <View className="mt-4">{actions}</View>}
      </View>
    );
  },
);

EmptyState.displayName = "EmptyState";
