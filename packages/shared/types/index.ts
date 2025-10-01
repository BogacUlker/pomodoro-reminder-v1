// Core types for Pomodoro app

export type Priority = 'high' | 'medium' | 'low';
export type TimerType = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  category: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export interface PomodoroSession {
  id: string;
  reminderId: string | null;
  startTime: Date;
  endTime: Date | null;
  duration: number; // minutes
  type: TimerType;
  wasCompleted: boolean;
  interruptions: number;
}

export interface TimerConfig {
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface TimerState {
  status: TimerStatus;
  type: TimerType;
  timeRemaining: number; // seconds
  currentSession: number; // 1-4
  totalSessions: number; // usually 4
  activeReminder: Reminder | null;
}

export interface UserAnalytics {
  userId: string;
  hourlyProductivity: {
    [hour: number]: {
      totalPomodoros: number;
      completionRate: number;
      avgFocusScore: number;
    };
  };
  categoryStats: {
    [category: string]: {
      avgPomodoros: number;
      totalCompleted: number;
      bestTimeSlots: number[];
    };
  };
  weeklyStreak: number;
  totalPomodoros: number;
  bestDay: string;
}
