export const APP_CONFIG = {
  name: 'Pomodoro Timer',
  version: '1.0.0',
  author: 'Bogac Ulker',
  github: 'https://github.com/BogacUlker/pomodoro-reminder-v1',
} as const;

export const TIMER_CONFIG = {
  workDuration: 25, // minutes
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
} as const;

export const STORAGE_KEYS = {
  TASKS: '@pomodoro/tasks',
  TIMER_STATE: '@pomodoro/timer_state',
  SETTINGS: '@pomodoro/settings',
} as const;
