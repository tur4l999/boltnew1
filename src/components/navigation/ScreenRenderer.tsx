import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { HomeScreen } from '../screens/HomeScreen';
import { TopicsScreen } from '../screens/TopicsScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ExamConfigScreen } from '../screens/ExamConfigScreen';
import { ExamRunScreen } from '../screens/ExamRunScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { MistakesScreen } from '../screens/MistakesScreen';
import { StoreScreen } from '../screens/StoreScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { TeacherContactScreen } from '../screens/TeacherContactScreen';
import { PackagesScreen } from '../screens/PackagesScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export function ScreenRenderer() {
  const { currentScreen, currentTab } = useApp();
  
  // AI Chat screen - no header or navigation
  if (currentScreen.screen === 'AIChat') {
    return <AIChatScreen />;
  }
  
  // Tab screens
  if (currentScreen.screen === 'Home' || (currentTab === 'Home' && currentScreen.screen === 'Home')) {
    return <HomeScreen />;
  }
  if (currentScreen.screen === 'Topics' || (currentTab === 'Topics' && currentScreen.screen === 'Topics')) {
    return <TopicsScreen />;
  }
  if (currentScreen.screen === 'Store' || (currentTab === 'Store' && currentScreen.screen === 'Store')) {
    return <StoreScreen />;
  }
  if (currentScreen.screen === 'More' || (currentTab === 'More' && currentScreen.screen === 'More')) {
    return <MoreScreen />;
  }
  
  // Stack screens
  switch (currentScreen.screen) {
    case 'Lesson':
      return <LessonScreen />;
    case 'Practice':
      return <PracticeScreen />;
    case 'ExamConfig':
      return <ExamConfigScreen />;
    case 'ExamRun':
      return <ExamRunScreen />;
    case 'Results':
      return <ResultsScreen />;
    case 'Mistakes':
      return <MistakesScreen />;
    case 'TeacherContact':
      return <TeacherContactScreen />;
    case 'Packages':
      return <PackagesScreen />;
    case 'Transactions':
      return <TransactionsScreen />;
    case 'Settings':
      return <SettingsScreen />;
    default:
      return <HomeScreen />;
  }
}