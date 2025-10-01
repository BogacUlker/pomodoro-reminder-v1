import { useState } from 'react';
import { Plus, Play, Trash2 } from 'lucide-react';
import { generateId, getPriorityColor, formatDate, sortReminders } from '@pomodoro/utils';
import type { Reminder, Priority } from '@pomodoro/types';
import { useApp } from '../context/AppContext';

export function ReminderList() {
  const { reminders, setReminders, startTimerWithReminder } = useApp();
  const [newTitle, setNewTitle] = useState('');

  const addReminder = () => {
    if (!newTitle.trim()) return;

    const reminder: Reminder = {
      id: generateId(),
      title: newTitle,
      description: '',
      dueDate: null,
      priority: 'medium',
      category: 'general',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: new Date(),
      completedAt: null,
    };

    setReminders(prev => sortReminders([...prev, reminder]));
    setNewTitle('');
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleComplete = (id: string) => {
    setReminders(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, isCompleted: !r.isCompleted, completedAt: !r.isCompleted ? new Date() : null }
          : r
      )
    );
  };

  const updatePriority = (id: string, priority: Priority) => {
    setReminders(prev => sortReminders(prev.map(r => (r.id === id ? { ...r, priority } : r))));
  };

  return (
    <div className="w-full max-w-md p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>

      {/* Add New */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addReminder()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={addReminder}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 border rounded-lg transition-all ${
                reminder.isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-md'
              }`}
              style={{ borderLeftWidth: '4px', borderLeftColor: getPriorityColor(reminder.priority) }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reminder.isCompleted}
                      onChange={() => toggleComplete(reminder.id)}
                      className="w-4 h-4 text-red-500 focus:ring-red-500 rounded"
                    />
                    <h3
                      className={`font-medium ${
                        reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {reminder.title}
                    </h3>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-sm">
                    {/* Priority Selector */}
                    <select
                      value={reminder.priority}
                      onChange={(e) => updatePriority(reminder.id, e.target.value as Priority)}
                      className="text-xs border-none bg-transparent focus:ring-0 cursor-pointer"
                      disabled={reminder.isCompleted}
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>

                    {/* Pomodoros */}
                    <span className="text-gray-600">
                      {'🍅'.repeat(reminder.estimatedPomodoros)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!reminder.isCompleted && (
                    <button
                      onClick={() => startTimerWithReminder(reminder)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Start Pomodoro"
                    >
                      <Play size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {reminders.length > 0 && (
        <div className="mt-6 pt-4 border-t text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total: {reminders.length}</span>
            <span>Completed: {reminders.filter(r => r.isCompleted).length}</span>
            <span>
              Pending: {reminders.filter(r => !r.isCompleted).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
