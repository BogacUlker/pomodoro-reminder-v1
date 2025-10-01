import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTimerStore, useTaskStore } from '../hooks';
import { formatTime } from '@pomodoro/timer';
import { notificationService } from '../services/notifications';
import CircularProgress from '../components/timer/CircularProgress';
import TimerControls from '../components/timer/TimerControls';
import SessionInfo from '../components/timer/SessionInfo';
import TestModeToggle from '../components/timer/TestModeToggle';

export default function TimerScreen() {
  const {
    status,
    timerType,
    timeRemaining,
    currentSession,
    timer,
    testMode,
    setStatus,
    setTimerType,
    setTimeRemaining,
    setCurrentSession,
    setTestMode,
    completeSession,
  } = useTimerStore();

  const { activeTask } = useTaskStore();

  // Calculate progress percentage
  const totalDuration = testMode ? 10 : timer.getDuration(timerType);
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  // Format time display
  const timeText = formatTime(timeRemaining);
  const sessionText = `Session ${currentSession}/4`;

  // Next break info
  const getNextBreakInfo = () => {
    if (timerType !== 'work') return undefined;
    return currentSession >= 4 ? '15 min long break' : '5 min short break';
  };

  // Handlers
  const handleStart = () => {
    const duration = testMode ? 10 : timeRemaining;
    setStatus('running');

    timer.start(
      duration,
      (remaining) => setTimeRemaining(remaining),
      async () => {
        setStatus('completed');

        // Determine next timer type for notification
        const nextType = timerType === 'work'
          ? (currentSession >= 4 ? 'longBreak' : 'shortBreak')
          : 'work';

        // Show completion notification
        await notificationService.showCompletionNotification(timerType, nextType);

        // Progress to next session
        completeSession();
      }
    );
  };

  const handlePause = () => {
    timer.stop();
    setStatus('paused');
  };

  const handleStop = () => {
    timer.stop();
    setStatus('idle');
    setTimerType('work');
    setTimeRemaining(testMode ? 10 : timer.getDuration('work'));
    setCurrentSession(1);
  };

  const handleTestModeToggle = (enabled: boolean) => {
    if (status !== 'running') {
      setTestMode(enabled);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => timer.stop();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerClassName="py-8"
    >
      {/* Test Mode Toggle */}
      <TestModeToggle
        enabled={testMode}
        onToggle={handleTestModeToggle}
      />

      {/* Session Info */}
      <SessionInfo
        timerType={timerType}
        activeTask={activeTask}
        nextBreakInfo={getNextBreakInfo()}
      />

      {/* Circular Timer */}
      <View className="items-center justify-center px-4">
        <CircularProgress
          progress={progress}
          timeText={timeText}
          sessionText={sessionText}
        />
      </View>

      {/* Controls */}
      <View className="px-8">
        <TimerControls
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
        />
      </View>
    </ScrollView>
  );
}
