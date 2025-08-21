export type Language = 'az' | 'ru';

export interface NavigationScreen {
  screen: string;
  params: Record<string, any>;
}

export interface Module {
  id: string;
  title: string;
  progress: number;
  description?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  moduleId: string;
  text: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface ExamConfig {
  mode: 'mixed' | string;
  questionsCount: number;
  timeLimit?: number;
}

export interface ExamResult {
  score: number;
  total: number;
  timeSpent: number;
  weakTopics: string[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}