import { create } from 'zustand';
import type { Reminder } from '@pomodoro/types';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/config';
import { sortReminders } from '@pomodoro/utils';

interface TaskState {
  // State
  tasks: Reminder[];
  activeTask: Reminder | null;
  isLoading: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Reminder, 'id' | 'createdAt' | 'completedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  incrementTaskPomodoros: (id: string) => Promise<void>;
  setActiveTask: (task: Reminder | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  activeTask: null,
  isLoading: false,

  // Load tasks from storage
  loadTasks: async () => {
    set({ isLoading: true });
    const tasks = await storage.getItem<Reminder[]>(STORAGE_KEYS.TASKS);
    set({
      tasks: tasks ? sortReminders(tasks) : [],
      isLoading: false,
    });
  },

  // Add new task
  addTask: async (taskData) => {
    const newTask: Reminder = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      completedAt: null,
      completedPomodoros: 0,
      isCompleted: false,
    };

    const updatedTasks = sortReminders([...get().tasks, newTask]);
    set({ tasks: updatedTasks });
    await storage.setItem(STORAGE_KEYS.TASKS, updatedTasks);
  },

  // Update task
  updateTask: async (id, updates) => {
    const updatedTasks = get().tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    const sortedTasks = sortReminders(updatedTasks);
    set({ tasks: sortedTasks });
    await storage.setItem(STORAGE_KEYS.TASKS, sortedTasks);

    // Update active task if it's the one being updated
    if (get().activeTask?.id === id) {
      const updatedActiveTask = sortedTasks.find(t => t.id === id);
      set({ activeTask: updatedActiveTask || null });
    }
  },

  // Delete task
  deleteTask: async (id) => {
    const updatedTasks = get().tasks.filter(task => task.id !== id);
    set({ tasks: updatedTasks });
    await storage.setItem(STORAGE_KEYS.TASKS, updatedTasks);

    // Clear active task if it's being deleted
    if (get().activeTask?.id === id) {
      set({ activeTask: null });
    }
  },

  // Complete task
  completeTask: async (id) => {
    const updatedTasks = get().tasks.map(task =>
      task.id === id
        ? { ...task, isCompleted: true, completedAt: new Date() }
        : task
    );
    const sortedTasks = sortReminders(updatedTasks);
    set({ tasks: sortedTasks });
    await storage.setItem(STORAGE_KEYS.TASKS, sortedTasks);
  },

  // Increment pomodoro count
  incrementTaskPomodoros: async (id) => {
    const updatedTasks = get().tasks.map(task =>
      task.id === id
        ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
        : task
    );
    const sortedTasks = sortReminders(updatedTasks);
    set({ tasks: sortedTasks });
    await storage.setItem(STORAGE_KEYS.TASKS, sortedTasks);

    // Update active task pomodoro count
    if (get().activeTask?.id === id) {
      const updatedActiveTask = sortedTasks.find(t => t.id === id);
      set({ activeTask: updatedActiveTask || null });
    }
  },

  // Set active task
  setActiveTask: (task) => {
    set({ activeTask: task });
  },
}));
