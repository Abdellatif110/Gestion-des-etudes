import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import TimerPage from './pages/TimerPage';
import TasksPage from './pages/TasksPage';
import GoalsPage from './pages/GoalsPage';
import NotesPage from './pages/NotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import AssistantPage from './pages/AssistantPage';
import NotFound from './pages/NotFound';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Index />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timer"
        element={
          <ProtectedRoute>
            <Layout>
              <TimerPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <TasksPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <GoalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Layout>
              <NotesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/flashcards"
        element={
          <ProtectedRoute>
            <Layout>
              <FlashcardsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <Layout>
              <AssistantPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Layout>
              <StatsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
