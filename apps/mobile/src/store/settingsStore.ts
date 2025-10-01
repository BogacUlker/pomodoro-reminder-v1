import { create } from 'zustand';
import { storage } from '../services/storage';
import { STORAGE_KEYS, TIMER_CONFIG } from '../constants/config';

interface SettingsState {
  // Settings
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Omit<SettingsState, 'loadSettings' | 'updateSettings'>>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings = {
  workDuration: TIMER_CONFIG.workDuration,
  shortBreakDuration: TIMER_CONFIG.shortBreakDuration,
  longBreakDuration: TIMER_CONFIG.longBreakDuration,
  soundEnabled: true,
  hapticEnabled: true,
  notificationsEnabled: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  ...defaultSettings,

  // Load settings from storage
  loadSettings: async () => {
    const savedSettings = await storage.getItem<Partial<typeof defaultSettings>>(
      STORAGE_KEYS.SETTINGS
    );

    if (savedSettings) {
      set(savedSettings);
    }
  },

  // Update settings
  updateSettings: async (updates) => {
    set(updates);
    const currentSettings = get();
    await storage.setItem(STORAGE_KEYS.SETTINGS, {
      workDuration: currentSettings.workDuration,
      shortBreakDuration: currentSettings.shortBreakDuration,
      longBreakDuration: currentSettings.longBreakDuration,
      soundEnabled: currentSettings.soundEnabled,
      hapticEnabled: currentSettings.hapticEnabled,
      notificationsEnabled: currentSettings.notificationsEnabled,
    });
  },

  // Reset to defaults
  resetSettings: async () => {
    set(defaultSettings);
    await storage.setItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
}));
