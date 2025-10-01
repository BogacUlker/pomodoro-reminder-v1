import React from 'react';
import { View, Text } from 'react-native';
import type { TimerType } from '@pomodoro/types';
import type { Reminder } from '@pomodoro/types';

interface SessionInfoProps {
  timerType: TimerType;
  activeTask: Reminder | null;
  nextBreakInfo?: string;
}

export default function SessionInfo({
  timerType,
  activeTask,
  nextBreakInfo,
}: SessionInfoProps) {
  const getSessionEmoji = () => {
    switch (timerType) {
      case 'work':
        return '🍅';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌴';
    }
  };

  const getSessionLabel = () => {
    switch (timerType) {
      case 'work':
        return 'Work Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <View className="items-center mb-8">
      {/* Session Type */}
      <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {getSessionEmoji()} {getSessionLabel()}
      </Text>

      {/* Active Task Title */}
      {activeTask && timerType === 'work' && (
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-3 text-center px-4">
          {activeTask.title}
        </Text>
      )}

      {/* Next Break Info */}
      {nextBreakInfo && timerType === 'work' && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Next: {nextBreakInfo}
        </Text>
      )}
    </View>
  );
}
