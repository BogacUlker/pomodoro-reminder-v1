// Shared utility functions

import type { Reminder, Priority } from '@pomodoro/types';

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#f59e0b'; // orange
    case 'low':
      return '#10b981'; // green
  }
}

/**
 * Sort reminders by priority and due date
 */
export function sortReminders(reminders: Reminder[]): Reminder[] {
  const priorityOrder: Record<Priority, number> = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...reminders].sort((a, b) => {
    // Completed items go last
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }

    // Sort by priority
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Sort by due date (null dates go last)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Finally by creation date
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

/**
 * Filter reminders for today
 */
export function getTodayReminders(reminders: Reminder[]): Reminder[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return reminders.filter((reminder) => {
    if (!reminder.dueDate || reminder.isCompleted) return false;
    const dueDate = new Date(reminder.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  });
}

/**
 * Check if reminder is overdue
 */
export function isOverdue(reminder: Reminder): boolean {
  if (!reminder.dueDate || reminder.isCompleted) return false;
  return new Date(reminder.dueDate) < new Date();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';

  const now = new Date();
  const target = new Date(date);

  // Today
  if (
    target.getDate() === now.getDate() &&
    target.getMonth() === now.getMonth() &&
    target.getFullYear() === now.getFullYear()
  ) {
    return `Today ${target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    target.getDate() === tomorrow.getDate() &&
    target.getMonth() === tomorrow.getMonth() &&
    target.getFullYear() === tomorrow.getFullYear()
  ) {
    return `Tomorrow ${target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Other dates
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate estimated time in hours/minutes
 */
export function formatEstimatedTime(pomodoros: number): string {
  const totalMinutes = pomodoros * 25; // 25 min per pomodoro
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
