import { createContext, useContext, useState, ReactNode } from 'react';
import type { Reminder } from '@pomodoro/types';

interface AppContextType {
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  activeReminder: Reminder | null;
  startTimerWithReminder: (reminder: Reminder) => void;
  clearActiveReminder: () => void;
  completeReminder: (reminderId: string) => void;
  incrementReminderPomodoros: (reminderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);

  const startTimerWithReminder = (reminder: Reminder) => {
    setActiveReminder(reminder);
  };

  const clearActiveReminder = () => {
    setActiveReminder(null);
  };

  const completeReminder = (reminderId: string) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === reminderId
          ? { ...r, isCompleted: true, completedAt: new Date() }
          : r
      )
    );
  };

  const incrementReminderPomodoros = (reminderId: string) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === reminderId
          ? { ...r, completedPomodoros: r.completedPomodoros + 1 }
          : r
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        reminders,
        setReminders,
        activeReminder,
        startTimerWithReminder,
        clearActiveReminder,
        completeReminder,
        incrementReminderPomodoros,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
