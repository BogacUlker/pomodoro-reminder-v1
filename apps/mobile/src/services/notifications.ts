import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import type { TimerType } from '@pomodoro/types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  /**
   * Show completion notification
   */
  async showCompletionNotification(
    timerType: TimerType,
    nextType?: TimerType
  ): Promise<void> {
    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Notification content
    const content: Notifications.NotificationContentInput = {
      title: this.getCompletionTitle(timerType),
      body: this.getCompletionBody(timerType, nextType),
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      vibrate: [0, 250, 250, 250],
    };

    // Show notification
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: null, // Show immediately
    });
  },

  /**
   * Get completion title based on timer type
   */
  getCompletionTitle(timerType: TimerType): string {
    switch (timerType) {
      case 'work':
        return '🍅 Work Session Complete!';
      case 'shortBreak':
        return '☕ Short Break Complete!';
      case 'longBreak':
        return '🌴 Long Break Complete!';
    }
  },

  /**
   * Get completion body message
   */
  getCompletionBody(timerType: TimerType, nextType?: TimerType): string {
    if (timerType === 'work') {
      if (nextType === 'longBreak') {
        return 'Great work! Time for a 15-minute long break.';
      } else {
        return 'Great work! Time for a 5-minute break.';
      }
    } else {
      return 'Break is over. Ready for another work session?';
    }
  },

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
