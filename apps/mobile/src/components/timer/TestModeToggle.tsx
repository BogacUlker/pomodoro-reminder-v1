import React from 'react';
import { View, Text, Switch } from 'react-native';
import { COLORS } from '../../constants/theme';

interface TestModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TestModeToggle({ enabled, onToggle }: TestModeToggleProps) {
  return (
    <View className="flex-row items-center justify-center mb-4 px-4">
      <Text className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        ⚡ Test Mode (10 seconds)
      </Text>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border.medium, true: COLORS.primary }}
        thumbColor={enabled ? COLORS.text.inverse : COLORS.background.light}
      />
    </View>
  );
}
