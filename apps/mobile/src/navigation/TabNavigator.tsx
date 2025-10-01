import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Timer, ListTodo, BarChart3, Settings } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import type { MainTabParamList } from '../types';

// Screens
import TimerScreen from '../screens/TimerScreen';
import TasksScreen from '../screens/TasksScreen';
import InsightsScreen from '../screens/InsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background.light,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border.light,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          title: 'Pomodoro',
          tabBarIcon: ({ color, size }) => <Timer color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
