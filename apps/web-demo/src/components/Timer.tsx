import { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';
import { PomodoroTimer, formatTime, DEFAULT_CONFIG } from '@pomodoro/timer';
import type { TimerType, TimerStatus } from '@pomodoro/types';
import { useApp } from '../context/AppContext';

const timer = new PomodoroTimer(DEFAULT_CONFIG);

export function Timer() {
  const { activeReminder, clearActiveReminder, completeReminder, incrementReminderPomodoros } = useApp();
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [timeRemaining, setTimeRemaining] = useState(timer.getDuration('work'));
  const [currentSession, setCurrentSession] = useState(1);
  const [showCompletePrompt, setShowCompletePrompt] = useState(false);
  const [testMode, setTestMode] = useState(false); // 10-second test mode

  // Auto-start when reminder is selected
  useEffect(() => {
    if (activeReminder && status === 'idle') {
      handleStart();
    }
  }, [activeReminder]);

  const handleStart = () => {
    setStatus('running');
    const duration = testMode ? 10 : timeRemaining; // Use 10 seconds in test mode
    timer.start(
      duration,
      (remaining) => setTimeRemaining(remaining),
      () => {
        setStatus('completed');

        // If work session with active reminder, increment pomodoros and show prompt
        if (timerType === 'work' && activeReminder) {
          incrementReminderPomodoros(activeReminder.id);
          setShowCompletePrompt(true);
        }

        // Auto-advance to next session
        const nextType = timer.getNextTimerType(currentSession, timerType);
        setTimerType(nextType);
        setTimeRemaining(testMode ? 10 : timer.getDuration(nextType));

        if (timerType === 'work') {
          if (currentSession >= 4) {
            setCurrentSession(1);
          } else {
            setCurrentSession(prev => prev + 1);
          }
        }
      }
    );
  };

  const handleCompleteTask = () => {
    if (activeReminder) {
      completeReminder(activeReminder.id);
      clearActiveReminder();
    }
    setShowCompletePrompt(false);
    setStatus('idle');
    setTimerType('work');
    setTimeRemaining(testMode ? 10 : timer.getDuration('work'));
  };

  const handleSwitchTask = () => {
    clearActiveReminder();
    setShowCompletePrompt(false);
    setStatus('idle');
    setTimerType('work');
    setTimeRemaining(testMode ? 10 : timer.getDuration('work'));
  };

  const handleContinueTask = () => {
    setShowCompletePrompt(false);
    // Seamlessly start the break session
    setStatus('running');
    const breakDuration = testMode ? 10 : timeRemaining;
    timer.start(
      breakDuration,
      (remaining) => setTimeRemaining(remaining),
      () => {
        setStatus('completed');
        // After break, go back to work with same reminder
        const nextType = timer.getNextTimerType(currentSession, timerType);
        setTimerType(nextType);
        setTimeRemaining(testMode ? 10 : timer.getDuration(nextType));

        if (timerType === 'shortBreak' || timerType === 'longBreak') {
          // Auto-start next work session after break
          setTimeout(() => {
            if (activeReminder) {
              setStatus('running');
              const workDuration = testMode ? 10 : timer.getDuration('work');
              timer.start(
                workDuration,
                (remaining) => setTimeRemaining(remaining),
                () => {
                  setStatus('completed');
                  // After each work session, ALWAYS show prompt
                  if (activeReminder) {
                    incrementReminderPomodoros(activeReminder.id);
                    setShowCompletePrompt(true);
                  }
                  // Prepare next break
                  const nextBreakType = timer.getNextTimerType(currentSession, 'work');
                  setTimerType(nextBreakType);
                  setTimeRemaining(testMode ? 10 : timer.getDuration(nextBreakType));

                  if (currentSession >= 4) {
                    setCurrentSession(1);
                  } else {
                    setCurrentSession(prev => prev + 1);
                  }
                }
              );
            }
          }, 100);
        }
      }
    );
  };

  const handlePause = () => {
    timer.stop();
    setStatus('paused');
  };

  const handleStop = () => {
    timer.stop();
    setStatus('idle');
    setTimerType('work');
    setTimeRemaining(timer.getDuration('work'));
    setCurrentSession(1);
  };

  useEffect(() => {
    return () => timer.stop();
  }, []);

  const progress = ((timer.getDuration(timerType) - timeRemaining) / timer.getDuration(timerType)) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Test Mode Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="testMode"
          checked={testMode}
          onChange={(e) => {
            setTestMode(e.target.checked);
            setTimeRemaining(e.target.checked ? 10 : timer.getDuration(timerType));
          }}
          className="w-4 h-4"
        />
        <label htmlFor="testMode" className="text-sm text-gray-600">
          ⚡ Test Mode (10 seconds)
        </label>
      </div>

      {/* Timer Type */}
      <div className="mb-4 text-center">
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {timerType === 'work' ? '🍅 Work Session' : timerType === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}
        </span>
        {activeReminder && timerType === 'work' && (
          <div className="mt-2 text-lg font-semibold text-gray-900">
            {activeReminder.title}
          </div>
        )}
      </div>

      {/* Circular Timer */}
      <div className="relative w-64 h-64 mb-8">
        {/* Progress Ring */}
        <svg className="transform -rotate-90 w-64 h-64">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            className="text-red-500 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-500 mt-2">
            Session {currentSession}/4
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {status === 'idle' || status === 'paused' || status === 'completed' ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Play size={20} />
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Pause size={20} />
            Pause
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Square size={20} />
            Stop
          </button>
        )}
      </div>

      {/* Next Break Info */}
      {status === 'running' && timerType === 'work' && (
        <div className="mt-6 text-sm text-gray-600">
          Next: {currentSession >= 4 ? '15 min long break' : '5 min short break'}
        </div>
      )}

      {/* Completion Prompt Modal */}
      {showCompletePrompt && activeReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-500" size={32} />
              <h3 className="text-xl font-semibold">Pomodoro Complete!</h3>
            </div>
            <p className="text-gray-700 mb-6">
              You completed a pomodoro for: <strong>{activeReminder.title}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              🍅 Completed: {activeReminder.completedPomodoros + 1} / {activeReminder.estimatedPomodoros}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleCompleteTask}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✓ Mark as Complete
                </button>
                <button
                  onClick={handleContinueTask}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Continue Working
                </button>
              </div>
              <button
                onClick={handleSwitchTask}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                🔄 Switch to Another Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
