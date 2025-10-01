import { Timer } from './components/Timer';
import { ReminderList } from './components/ReminderList';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            🍅 Pomodoro Demo
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Web showcase - Full mobile app coming soon
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks Panel */}
          <div className="bg-white rounded-lg shadow-md">
            <ReminderList />
          </div>

          {/* Timer Panel */}
          <div className="bg-white rounded-lg shadow-md">
            <Timer />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
        <p>Phase 0: Web Demo • Built with React + TypeScript + Tailwind</p>
        <p className="mt-1">
          Mobile app (React Native) in development
        </p>
      </footer>
      </div>
    </AppProvider>
  );
}

export default App;
