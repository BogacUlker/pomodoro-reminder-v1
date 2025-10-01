import { create } from 'zustand';
import type { TimerType, TimerStatus } from '@pomodoro/types';
import { PomodoroTimer, DEFAULT_CONFIG } from '@pomodoro/timer';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/config';

interface TimerState {
  // State
  status: TimerStatus;
  timerType: TimerType;
  timeRemaining: number;
  currentSession: number;
  timer: PomodoroTimer;
  testMode: boolean;

  // Actions
  loadTimerState: () => Promise<void>;
  saveTimerState: () => Promise<void>;
  setStatus: (status: TimerStatus) => void;
  setTimerType: (type: TimerType) => void;
  setTimeRemaining: (time: number) => void;
  setCurrentSession: (session: number) => void;
  setTestMode: (enabled: boolean) => void;
  resetTimer: () => void;
  completeSession: () => void;
}

const timer = new PomodoroTimer(DEFAULT_CONFIG);

export const useTimerStore = create<TimerState>((set, get) => ({
  // Initial state
  status: 'idle',
  timerType: 'work',
  timeRemaining: timer.getDuration('work'),
  currentSession: 1,
  timer,
  testMode: false,

  // Load timer state from storage
  loadTimerState: async () => {
    const savedState = await storage.getItem<{
      status: TimerStatus;
      timerType: TimerType;
      timeRemaining: number;
      currentSession: number;
      testMode: boolean;
    }>(STORAGE_KEYS.TIMER_STATE);

    if (savedState) {
      set({
        status: savedState.status === 'running' ? 'idle' : savedState.status, // Don't auto-resume
        timerType: savedState.timerType,
        timeRemaining: savedState.timeRemaining,
        currentSession: savedState.currentSession,
        testMode: savedState.testMode || false,
      });
    }
  },

  // Save timer state to storage
  saveTimerState: async () => {
    const state = get();
    await storage.setItem(STORAGE_KEYS.TIMER_STATE, {
      status: state.status,
      timerType: state.timerType,
      timeRemaining: state.timeRemaining,
      currentSession: state.currentSession,
      testMode: state.testMode,
    });
  },

  // Setters
  setStatus: (status) => {
    set({ status });
    get().saveTimerState();
  },

  setTimerType: (type) => {
    set({
      timerType: type,
      timeRemaining: get().testMode ? 10 : timer.getDuration(type),
    });
    get().saveTimerState();
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },

  setCurrentSession: (session) => {
    set({ currentSession: session });
    get().saveTimerState();
  },

  setTestMode: (enabled) => {
    const currentType = get().timerType;
    set({
      testMode: enabled,
      timeRemaining: enabled ? 10 : timer.getDuration(currentType),
    });
    get().saveTimerState();
  },

  // Reset timer to initial state
  resetTimer: () => {
    set({
      status: 'idle',
      timerType: 'work',
      timeRemaining: get().testMode ? 10 : timer.getDuration('work'),
      currentSession: 1,
    });
    get().saveTimerState();
  },

  // Complete current session and progress to next
  completeSession: () => {
    const state = get();

    // Work session completed
    if (state.timerType === 'work') {
      const nextSession = state.currentSession;

      // Determine next break type
      if (nextSession >= 4) {
        // Long break after 4th work session
        set({
          timerType: 'longBreak',
          timeRemaining: state.testMode ? 10 : timer.getDuration('longBreak'),
          status: 'idle',
        });
      } else {
        // Short break after 1st, 2nd, 3rd work sessions
        set({
          timerType: 'shortBreak',
          timeRemaining: state.testMode ? 10 : timer.getDuration('shortBreak'),
          status: 'idle',
        });
      }
    }
    // Break completed
    else {
      // After long break, reset to session 1
      if (state.timerType === 'longBreak') {
        set({
          timerType: 'work',
          timeRemaining: state.testMode ? 10 : timer.getDuration('work'),
          currentSession: 1,
          status: 'idle',
        });
      }
      // After short break, increment session and start work
      else {
        set({
          timerType: 'work',
          timeRemaining: state.testMode ? 10 : timer.getDuration('work'),
          currentSession: state.currentSession + 1,
          status: 'idle',
        });
      }
    }

    get().saveTimerState();
  },
}));
