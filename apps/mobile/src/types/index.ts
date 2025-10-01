// Re-export shared types
export * from '@pomodoro/types';

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  AddTask: { taskId?: string };
};

export type MainTabParamList = {
  Timer: undefined;
  Tasks: undefined;
  Insights: undefined;
  Settings: undefined;
};
