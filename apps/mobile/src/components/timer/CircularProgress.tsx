import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  timeText: string;
  sessionText: string;
}

export default function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 12,
  timeText,
  sessionText,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      {/* SVG Circle */}
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.border.light}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Time Display - Centered */}
      <View className="absolute items-center justify-center">
        <Text className="text-6xl font-bold text-gray-900 dark:text-white">
          {timeText}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {sessionText}
        </Text>
      </View>
    </View>
  );
}
