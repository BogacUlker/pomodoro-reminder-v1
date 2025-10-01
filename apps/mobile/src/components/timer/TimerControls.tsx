import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Play, Pause, Square } from 'lucide-react-native';
import type { TimerStatus } from '@pomodoro/types';
import { COLORS } from '../../constants/theme';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export default function TimerControls({
  status,
  onStart,
  onPause,
  onStop,
}: TimerControlsProps) {
  const canStart = status === 'idle' || status === 'paused' || status === 'completed';
  const canPause = status === 'running';
  const canStop = status !== 'idle';

  return (
    <View className="flex-row gap-4 mt-8">
      {/* Start/Resume Button */}
      {canStart && (
        <TouchableOpacity
          onPress={onStart}
          className="flex-1 bg-red-500 py-4 px-6 rounded-2xl flex-row items-center justify-center active:bg-red-600"
          activeOpacity={0.8}
        >
          <Play color={COLORS.text.inverse} size={24} fill={COLORS.text.inverse} />
          <Text className="text-white text-lg font-semibold ml-2">
            {status === 'paused' ? 'Resume' : 'Start'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Pause Button */}
      {canPause && (
        <TouchableOpacity
          onPress={onPause}
          className="flex-1 bg-yellow-500 py-4 px-6 rounded-2xl flex-row items-center justify-center active:bg-yellow-600"
          activeOpacity={0.8}
        >
          <Pause color={COLORS.text.inverse} size={24} fill={COLORS.text.inverse} />
          <Text className="text-white text-lg font-semibold ml-2">Pause</Text>
        </TouchableOpacity>
      )}

      {/* Stop Button */}
      {canStop && (
        <TouchableOpacity
          onPress={onStop}
          className="bg-gray-500 py-4 px-6 rounded-2xl flex-row items-center justify-center active:bg-gray-600"
          activeOpacity={0.8}
          style={{ minWidth: 100 }}
        >
          <Square color={COLORS.text.inverse} size={24} fill={COLORS.text.inverse} />
          <Text className="text-white text-lg font-semibold ml-2">Stop</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
