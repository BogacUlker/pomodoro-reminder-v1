# 🍅 Pomodoro + Reminders App

Context-aware Pomodoro timer with intelligent reminder management and AI-powered productivity insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 📱 Platform Strategy

### Primary Product: Native Mobile App
- **iOS & Android** native experience with React Native + Expo
- Full access to platform capabilities (notifications, widgets, background processing)
- Offline-first architecture with local data persistence
- Touch-optimized UI with gesture controls and haptic feedback

### Secondary: Web Demo
- Lightweight showcase version for demonstrations
- Testing platform for core functionality
- Desktop-optimized with keyboard shortcuts
- Not intended for production use

## ✨ Core Features

### 🎯 Smart Pomodoro Timer
- Configurable work/break durations (25/5/15 min defaults)
- Background execution (timer continues when app minimized)
- Rich notifications with haptic feedback
- Session tracking (e.g., "Pomodoro 2/4")
- Lock screen controls

### 📋 Intelligent Reminders
- Full CRUD with categories and priorities
- Estimated pomodoros per task (learned over time)
- Quick-start pomodoro from any reminder
- Swipe gestures (complete/delete)
- Due date management

### 🧠 AI-Powered Insights
- Productivity pattern recognition
- Best performing time slots (hourly heatmap)
- Category-based task duration learning
- Morning planning assistant
- Weekly/monthly summaries

### 🎨 Native Platform Integration
- **iOS**: Live Activities, Siri Shortcuts, Focus Mode, Apple Watch (future)
- **Android**: Quick Settings tile, Always-on display, Wear OS (future)
- Home screen widgets (small, medium sizes)
- Deep linking for notifications
- System theme support (light/dark)

## 🏗️ Architecture

### Monorepo Structure
```
pomodoro-app/
├── packages/
│   ├── shared/          # Shared business logic
│   │   ├── timer/       # Timer engine
│   │   ├── analytics/   # Analytics calculations
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # Utilities
│   └── ui/              # Shared components
├── apps/
│   ├── mobile/          # React Native app (primary)
│   └── web-demo/        # React web app (showcase)
└── package.json
```

## 🛠️ Tech Stack

### Mobile (Primary)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State**: Zustand + AsyncStorage/MMKV
- **UI**: NativeWind (Tailwind for RN) + Native Base
- **Navigation**: React Navigation
- **Notifications**: Expo Notifications
- **Charts**: React Native Chart Kit
- **Storage**: AsyncStorage/MMKV/SQLite

### Web Demo (Secondary)
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context
- **Charts**: Recharts
- **Build**: Vite

## 🚀 Development Phases

### Phase 0: Web Demo (2-3 weeks) - 🎯 Current
- Basic timer + reminder CRUD
- LocalStorage persistence
- Desktop-optimized UI
- Foundation for shared packages

### Phase 1: Mobile MVP (4-6 weeks)
- React Native setup
- Core timer with background execution
- Full reminder management
- Local notifications
- Touch-optimized UI

### Phase 2: Intelligence (3-4 weeks)
- Analytics engine
- Pattern recognition
- Smart scheduling
- Morning planning

### Phase 3: Polish (3-4 weeks)
- Widgets (iOS/Android)
- Haptic feedback
- Themes
- Lock screen controls
- Platform-specific integrations

### Phase 4: Advanced (4-6 weeks)
- Cloud sync (optional)
- Watch apps
- Calendar integration
- Premium features

## 📊 Success Metrics

### Target KPIs
- **Day 1 Retention**: >60%
- **Day 7 Retention**: >40%
- **Daily Pomodoros**: 4-6 per active user
- **Widget Adoption**: 40%+
- **App Store Rating**: 4.5+ stars

## 🎯 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- (Mobile) Expo CLI
- (iOS) Xcode 14+
- (Android) Android Studio

### Installation

```bash
# Clone repository
git clone https://github.com/BogacUlker/pomodoro-reminder-v1.git
cd pomodoro-reminder-v1

# Install dependencies (monorepo setup coming soon)
npm install

# Web Demo (Phase 0)
cd apps/web-demo
npm run dev

# Mobile App (Phase 1+)
cd apps/mobile
npx expo start
```

## 📖 Documentation

- [Technical Specification](./pomodoro_app_spec.md) - Comprehensive product and technical spec
- Architecture Guide (coming soon)
- API Documentation (coming soon)
- Contributing Guide (coming soon)

## 🤝 Contributing

This project is currently in early development. Contribution guidelines will be added soon.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- Inspired by modern productivity apps
- Built with React Native and Expo

## 📬 Contact

- **Repository**: [github.com/BogacUlker/pomodoro-reminder-v1](https://github.com/BogacUlker/pomodoro-reminder-v1)
- **Issues**: [Report a bug or request a feature](https://github.com/BogacUlker/pomodoro-reminder-v1/issues)

---

**Status**: 🚧 Phase 0 (Web Demo) - In Development

**Current Focus**: Building web demo for feature showcase and testing
