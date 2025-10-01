// Timer core logic - platform agnostic

import type { TimerConfig, TimerType, TimerState, TimerStatus } from '@pomodoro/types';

export const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

export class PomodoroTimer {
  private config: TimerConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: {
    onTick?: (timeRemaining: number) => void;
    onComplete?: () => void;
    onStatusChange?: (status: TimerStatus) => void;
  } = {};

  constructor(config: TimerConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Get duration in seconds for a timer type
   */
  getDuration(type: TimerType): number {
    switch (type) {
      case 'work':
        return this.config.workDuration * 60;
      case 'shortBreak':
        return this.config.shortBreakDuration * 60;
      case 'longBreak':
        return this.config.longBreakDuration * 60;
    }
  }

  /**
   * Determine next timer type based on current session
   */
  getNextTimerType(currentSession: number, currentType: TimerType): TimerType {
    if (currentType !== 'work') {
      return 'work';
    }

    // After work session, check if it's time for long break
    if (currentSession >= this.config.sessionsUntilLongBreak) {
      return 'longBreak';
    }

    return 'shortBreak';
  }

  /**
   * Register callbacks for timer events
   */
  on(event: 'tick' | 'complete' | 'statusChange', callback: (data?: any) => void): void {
    if (event === 'tick') {
      this.callbacks.onTick = callback;
    } else if (event === 'complete') {
      this.callbacks.onComplete = callback;
    } else if (event === 'statusChange') {
      this.callbacks.onStatusChange = callback;
    }
  }

  /**
   * Start countdown timer
   */
  start(
    initialSeconds: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ): void {
    this.stop(); // Clear any existing interval

    let remaining = initialSeconds;

    this.intervalId = setInterval(() => {
      remaining--;
      onTick(remaining);

      if (remaining <= 0) {
        this.stop();
        onComplete();
      }
    }, 1000);
  }

  /**
   * Stop/clear the timer
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TimerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): TimerConfig {
    return { ...this.config };
  }
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage complete
 */
export function getProgress(elapsed: number, total: number): number {
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
