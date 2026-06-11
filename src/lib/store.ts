"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, ExamSession, Notification, UserProgress } from "./types";

// Auth Store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);

// Theme Store
interface ThemeStore {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-storage" }
  )
);

// Exam Store
interface ExamStore {
  currentSession: ExamSession | null;
  setSession: (session: ExamSession | null) => void;
  updateAnswer: (questionId: string, answer: number) => void;
  toggleMarkForReview: (questionId: string) => void;
  setCurrentQuestion: (index: number) => void;
  pauseExam: () => void;
  resumeExam: () => void;
  completeExam: () => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      setSession: (session) => set({ currentSession: session }),
      updateAnswer: (questionId, answer) => {
        const session = get().currentSession;
        if (!session) return;
        set({
          currentSession: {
            ...session,
            answers: { ...session.answers, [questionId]: answer },
          },
        });
      },
      toggleMarkForReview: (questionId) => {
        const session = get().currentSession;
        if (!session) return;
        const marked = session.markedForReview.includes(questionId)
          ? session.markedForReview.filter((id) => id !== questionId)
          : [...session.markedForReview, questionId];
        set({ currentSession: { ...session, markedForReview: marked } });
      },
      setCurrentQuestion: (index) => {
        const session = get().currentSession;
        if (!session) return;
        set({ currentSession: { ...session, currentQuestion: index } });
      },
      pauseExam: () => {
        const session = get().currentSession;
        if (!session) return;
        set({ currentSession: { ...session, status: "paused" } });
      },
      resumeExam: () => {
        const session = get().currentSession;
        if (!session) return;
        set({ currentSession: { ...session, status: "in-progress" } });
      },
      completeExam: () => {
        const session = get().currentSession;
        if (!session) return;
        set({
          currentSession: {
            ...session,
            status: "completed",
            endTime: Date.now(),
          },
        });
      },
    }),
    { name: "exam-storage" }
  )
);

// Notification Store
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "1",
          type: "exam",
          title: "New Mock Test Available",
          message: "A new Computer Science mock test has been added.",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          type: "result",
          title: "Your Results Are Ready",
          message: "Your Mathematics practice results are now available.",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "3",
          type: "update",
          title: "New Study Material",
          message: "New questions for Engineering department have been uploaded.",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      unreadCount: 2,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: "notification-storage" }
  )
);

// Progress Store
interface ProgressStore {
  progress: UserProgress | null;
  bookmarkedQuestions: string[];
  setProgress: (progress: UserProgress) => void;
  toggleBookmark: (questionId: string) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {
        userId: "demo-user",
        subjectProgress: {
          "computer-science": {
            subject: "Computer Science",
            totalQuestions: 150,
            correctAnswers: 112,
            accuracy: 74.7,
            lastPracticed: new Date().toISOString(),
          },
          mathematics: {
            subject: "Mathematics",
            totalQuestions: 120,
            correctAnswers: 84,
            accuracy: 70,
            lastPracticed: new Date(Date.now() - 86400000).toISOString(),
          },
          english: {
            subject: "English",
            totalQuestions: 100,
            correctAnswers: 88,
            accuracy: 88,
            lastPracticed: new Date(Date.now() - 172800000).toISOString(),
          },
        },
        weeklyData: [
          { week: "Mon", score: 65, questionsAnswered: 20 },
          { week: "Tue", score: 72, questionsAnswered: 25 },
          { week: "Wed", score: 68, questionsAnswered: 18 },
          { week: "Thu", score: 80, questionsAnswered: 30 },
          { week: "Fri", score: 75, questionsAnswered: 22 },
          { week: "Sat", score: 85, questionsAnswered: 35 },
          { week: "Sun", score: 78, questionsAnswered: 28 },
        ],
        monthlyData: [
          { month: "Oct", score: 65, examsCompleted: 3 },
          { month: "Nov", score: 70, examsCompleted: 4 },
          { month: "Dec", score: 75, examsCompleted: 5 },
          { month: "Jan", score: 80, examsCompleted: 6 },
        ],
        overallScore: 76,
        rank: 42,
        totalExamsTaken: 18,
        totalQuestionsAnswered: 370,
        averageScore: 76,
        streak: 5,
      },
      bookmarkedQuestions: [],
      setProgress: (progress) => set({ progress }),
      toggleBookmark: (questionId) => {
        const current = get().bookmarkedQuestions;
        const updated = current.includes(questionId)
          ? current.filter((id) => id !== questionId)
          : [...current, questionId];
        set({ bookmarkedQuestions: updated });
      },
    }),
    { name: "progress-storage" }
  )
);
