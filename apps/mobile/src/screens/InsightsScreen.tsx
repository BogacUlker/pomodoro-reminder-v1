import React from 'react';
import { View, Text } from 'react-native';

export default function InsightsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-4xl font-bold text-gray-900 dark:text-white">📊</Text>
      <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
        Insights Screen
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Phase 2 feature
      </Text>
    </View>
  );
}
