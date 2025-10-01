import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useTimerStore } from '../store/timerStore';
import { useSettingsStore } from '../store/settingsStore';
import { notificationService } from '../services/notifications';

/**
 * Initialize app by loading all persisted data
 */
export function useInitializeApp() {
  const [isReady, setIsReady] = useState(false);
  const loadTasks = useTaskStore(state => state.loadTasks);
  const loadTimerState = useTimerStore(state => state.loadTimerState);
  const loadSettings = useSettingsStore(state => state.loadSettings);

  useEffect(() => {
    async function initialize() {
      try {
        // Request notification permissions
        await notificationService.requestPermissions();

        // Load all persisted data in parallel
        await Promise.all([
          loadTasks(),
          loadTimerState(),
          loadSettings(),
        ]);
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still mark as ready to allow app to function
        setIsReady(true);
      }
    }

    initialize();
  }, [loadTasks, loadTimerState, loadSettings]);

  return isReady;
}
