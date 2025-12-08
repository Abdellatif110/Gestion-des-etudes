export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

export interface TimerPreset {
  id: string;
  name: string;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  icon: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  pomodoros: number;
  completedPomodoros: number;
  createdAt: Date;
  dueDate?: Date;
  category?: string;
  subtasks?: SubTask[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  tags?: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  incorrectCount: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  cardCount: number;
}

export interface StudyGoal {
  id: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  targetSessions: number;
  currentSessions: number;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  mode: TimerMode;
  taskId?: string;
  completed: boolean;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  completedSessions: number;
  completedTasks: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}