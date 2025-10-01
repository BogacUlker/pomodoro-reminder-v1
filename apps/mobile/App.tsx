import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { useInitializeApp } from './src/hooks/useInitializeApp';
import './global.css';

export default function App() {
  const isReady = useInitializeApp();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#EF4444" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
