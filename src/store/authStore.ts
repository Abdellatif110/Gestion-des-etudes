import { create } from 'zustand';

interface User {
  email: string;
}

interface StoredUser {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

// Helper functions for localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'studyflow_current_user',
  USERS: 'studyflow_users',
};

const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUser = (email: string, password: string) => {
  const users = getStoredUsers();
  if (!users.find(u => u.email === email)) {
    users.push({ email, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

const validateCredentials = (email: string, password: string): boolean => {
  const users = getStoredUsers();
  return users.some(u => u.email === email && u.password === password);
};

const saveCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Initialize demo account if no users exist
const initializeDemoAccount = () => {
  const users = getStoredUsers();
  if (users.length === 0) {
    // Create demo account
    saveUser('demo@studyflow.com', 'demo123');
    console.log('✅ Demo account created: demo@studyflow.com / demo123');
  }
};

// Initialize demo account on module load
initializeDemoAccount();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: () => {
    const user = getCurrentUser();
    if (user) {
      set({ user, isAuthenticated: true, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (validateCredentials(email, password)) {
      const user = { email };
      set({ user, isAuthenticated: true });
      saveCurrentUser(user);
      return true;
    }
    return false;
  },

  signup: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      return false;
    }

    // Save new user
    saveUser(email, password);
    const user = { email };
    set({ user, isAuthenticated: true });
    saveCurrentUser(user);
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    clearCurrentUser();
  },
}));
