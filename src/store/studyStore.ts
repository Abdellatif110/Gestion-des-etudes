import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Note, StudySession, TimerSettings, DailyStats, TimerMode, ChatMessage, Flashcard, FlashcardDeck, StudyGoal, SubTask, TimerPreset } from '@/types/study';

interface StudyState {
  // Timer
  timerSettings: TimerSettings;
  currentMode: TimerMode;
  timeRemaining: number;
  isRunning: boolean;
  completedSessions: number;
  currentTaskId: string | null;

  // Timer Presets
  timerPresets: TimerPreset[];

  // Tasks
  tasks: Task[];
  
  // Notes
  notes: Note[];
  
  // Flashcards
  flashcards: Flashcard[];
  flashcardDecks: FlashcardDeck[];
  
  // Goals
  studyGoals: StudyGoal[];
  
  // Sessions
  sessions: StudySession[];
  
  // Stats
  dailyStats: DailyStats[];

  // Chat
  chatMessages: ChatMessage[];
  
  // Actions - Timer
  setTimerSettings: (settings: Partial<TimerSettings>) => void;
  setCurrentMode: (mode: TimerMode) => void;
  setTimeRemaining: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  incrementSessions: () => void;
  resetSessions: () => void;
  setCurrentTaskId: (taskId: string | null) => void;
  applyPreset: (preset: TimerPreset) => void;
  
  // Actions - Tasks
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  incrementTaskPomodoro: (id: string) => void;
  addSubTask: (taskId: string, subtask: SubTask) => void;
  toggleSubTask: (taskId: string, subtaskId: string) => void;
  deleteSubTask: (taskId: string, subtaskId: string) => void;
  
  // Actions - Notes
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Actions - Flashcards
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  addFlashcardDeck: (deck: FlashcardDeck) => void;
  updateFlashcardDeck: (id: string, updates: Partial<FlashcardDeck>) => void;
  deleteFlashcardDeck: (id: string) => void;
  
  // Actions - Goals
  addStudyGoal: (goal: StudyGoal) => void;
  updateStudyGoal: (id: string, updates: Partial<StudyGoal>) => void;
  deleteStudyGoal: (id: string) => void;
  
  // Actions - Sessions
  addSession: (session: StudySession) => void;
  
  // Actions - Stats
  updateDailyStats: (date: string, updates: Partial<DailyStats>) => void;
  
  // Actions - Chat
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

const defaultTimerSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
};

const defaultPresets: TimerPreset[] = [
  { id: '1', name: 'Classic Pomodoro', workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, icon: '🍅' },
  { id: '2', name: 'Deep Focus', workDuration: 50, shortBreakDuration: 10, longBreakDuration: 30, icon: '🧠' },
  { id: '3', name: 'Quick Sprint', workDuration: 15, shortBreakDuration: 3, longBreakDuration: 10, icon: '⚡' },
  { id: '4', name: 'Extended Session', workDuration: 45, shortBreakDuration: 10, longBreakDuration: 20, icon: '📚' },
  { id: '5', name: 'Study Marathon', workDuration: 60, shortBreakDuration: 15, longBreakDuration: 30, icon: '🏃' },
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Math Assignment',
    description: 'Solve problems 1-20 from Chapter 5',
    completed: false,
    priority: 'high',
    pomodoros: 4,
    completedPomodoros: 1,
    createdAt: new Date(),
    category: 'Math',
    subtasks: [
      { id: 's1', title: 'Problems 1-5', completed: true },
      { id: 's2', title: 'Problems 6-10', completed: false },
      { id: 's3', title: 'Problems 11-15', completed: false },
      { id: 's4', title: 'Problems 16-20', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Read History Chapter 8',
    description: 'Take notes on key events',
    completed: false,
    priority: 'medium',
    pomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date(),
    category: 'History',
  },
  {
    id: '3',
    title: 'Review Biology Notes',
    completed: false,
    priority: 'low',
    pomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date(),
    category: 'Science',
  },
  {
    id: '4',
    title: 'Practice Spanish Vocabulary',
    description: 'Learn 20 new words',
    completed: false,
    priority: 'medium',
    pomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date(),
    category: 'Languages',
  },
  {
    id: '5',
    title: 'Write Essay Outline',
    description: 'English literature essay',
    completed: true,
    priority: 'high',
    pomodoros: 3,
    completedPomodoros: 3,
    createdAt: new Date(),
    category: 'English',
  },
];

const sampleDecks: FlashcardDeck[] = [
  { id: 'd1', name: 'Spanish Vocabulary', description: 'Common words and phrases', color: '#10B981', createdAt: new Date(), cardCount: 3 },
  { id: 'd2', name: 'Biology Terms', description: 'Cell structure and functions', color: '#6366F1', createdAt: new Date(), cardCount: 2 },
];

const sampleFlashcards: Flashcard[] = [
  { id: 'f1', front: 'Hola', back: 'Hello', deckId: 'd1', difficulty: 'easy', correctCount: 5, incorrectCount: 1 },
  { id: 'f2', front: 'Gracias', back: 'Thank you', deckId: 'd1', difficulty: 'easy', correctCount: 3, incorrectCount: 0 },
  { id: 'f3', front: 'Buenos días', back: 'Good morning', deckId: 'd1', difficulty: 'medium', correctCount: 2, incorrectCount: 2 },
  { id: 'f4', front: 'Mitochondria', back: 'The powerhouse of the cell - produces ATP through cellular respiration', deckId: 'd2', difficulty: 'medium', correctCount: 4, incorrectCount: 1 },
  { id: 'f5', front: 'Nucleus', back: 'Control center of the cell - contains DNA and directs cell activities', deckId: 'd2', difficulty: 'easy', correctCount: 6, incorrectCount: 0 },
];

const sampleGoals: StudyGoal[] = [
  { id: 'g1', title: 'Daily Study Goal', targetMinutes: 120, currentMinutes: 45, targetSessions: 4, currentSessions: 2, completed: false, createdAt: new Date() },
  { id: 'g2', title: 'Weekly Reading Goal', targetMinutes: 300, currentMinutes: 120, targetSessions: 10, currentSessions: 4, completed: false, createdAt: new Date() },
];

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      // Initial state
      timerSettings: defaultTimerSettings,
      currentMode: 'work',
      timeRemaining: defaultTimerSettings.workDuration * 60,
      isRunning: false,
      completedSessions: 0,
      currentTaskId: null,
      timerPresets: defaultPresets,
      tasks: sampleTasks,
      notes: [],
      flashcards: sampleFlashcards,
      flashcardDecks: sampleDecks,
      studyGoals: sampleGoals,
      sessions: [],
      dailyStats: [],
      chatMessages: [],

      // Timer actions
      setTimerSettings: (settings) =>
        set((state) => ({
          timerSettings: { ...state.timerSettings, ...settings },
        })),
      
      setCurrentMode: (mode) =>
        set((state) => {
          const duration = 
            mode === 'work' ? state.timerSettings.workDuration :
            mode === 'shortBreak' ? state.timerSettings.shortBreakDuration :
            state.timerSettings.longBreakDuration;
          return { currentMode: mode, timeRemaining: duration * 60, isRunning: false };
        }),
      
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      
      setIsRunning: (running) => set({ isRunning: running }),
      
      incrementSessions: () =>
        set((state) => ({ completedSessions: state.completedSessions + 1 })),
      
      resetSessions: () => set({ completedSessions: 0 }),
      
      setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),

      applyPreset: (preset) =>
        set((state) => ({
          timerSettings: {
            ...state.timerSettings,
            workDuration: preset.workDuration,
            shortBreakDuration: preset.shortBreakDuration,
            longBreakDuration: preset.longBreakDuration,
          },
          timeRemaining: preset.workDuration * 60,
          currentMode: 'work',
          isRunning: false,
        })),

      // Task actions
      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      
      toggleTaskComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      
      incrementTaskPomodoro: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
          ),
        })),

      addSubTask: (taskId, subtask) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), subtask] } : t
          ),
        })),

      toggleSubTask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? {
              ...t,
              subtasks: t.subtasks?.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            } : t
          ),
        })),

      deleteSubTask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? {
              ...t,
              subtasks: t.subtasks?.filter((st) => st.id !== subtaskId),
            } : t
          ),
        })),

      // Note actions
      addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note] })),
      
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
          ),
        })),
      
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      // Flashcard actions
      addFlashcard: (flashcard) =>
        set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
      
      updateFlashcard: (id, updates) =>
        set((state) => ({
          flashcards: state.flashcards.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),
      
      deleteFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((f) => f.id !== id),
        })),
      
      addFlashcardDeck: (deck) =>
        set((state) => ({ flashcardDecks: [...state.flashcardDecks, deck] })),
      
      updateFlashcardDeck: (id, updates) =>
        set((state) => ({
          flashcardDecks: state.flashcardDecks.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      
      deleteFlashcardDeck: (id) =>
        set((state) => ({
          flashcardDecks: state.flashcardDecks.filter((d) => d.id !== id),
          flashcards: state.flashcards.filter((f) => f.deckId !== id),
        })),

      // Goal actions
      addStudyGoal: (goal) =>
        set((state) => ({ studyGoals: [...state.studyGoals, goal] })),
      
      updateStudyGoal: (id, updates) =>
        set((state) => ({
          studyGoals: state.studyGoals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),
      
      deleteStudyGoal: (id) =>
        set((state) => ({
          studyGoals: state.studyGoals.filter((g) => g.id !== id),
        })),

      // Session actions
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      // Stats actions
      updateDailyStats: (date, updates) =>
        set((state) => {
          const existing = state.dailyStats.find((s) => s.date === date);
          if (existing) {
            return {
              dailyStats: state.dailyStats.map((s) =>
                s.date === date ? { ...s, ...updates } : s
              ),
            };
          }
          return {
            dailyStats: [
              ...state.dailyStats,
              { date, totalMinutes: 0, completedSessions: 0, completedTasks: 0, ...updates },
            ],
          };
        }),

      // Chat actions
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'studyflow-storage',
    }
  )
);