// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  avatar?: string;
  role: "student" | "admin";
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Question types
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  subject: string;
  topic: string;
  chapter: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  isBookmarked?: boolean;
}

// Exam types
export interface ExamSession {
  id: string;
  examType: string;
  subject: string;
  questions: Question[];
  answers: Record<string, number | null>;
  markedForReview: string[];
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  status: "not-started" | "in-progress" | "paused" | "completed";
  currentQuestion: number;
}

export interface ExamResult {
  id: string;
  userId: string;
  examType: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  score: number;
  percentage: number;
  grade: string;
  passed: boolean;
  timeTaken: number;
  completedAt: string;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
  explanation: string;
}

// Practice types
export interface PracticeSession {
  subject: string;
  topic?: string;
  chapter?: string;
  difficulty?: Difficulty;
  questionCount: number;
}

// Progress types
export interface UserProgress {
  userId: string;
  subjectProgress: Record<string, SubjectProgress>;
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  overallScore: number;
  rank?: number;
  totalExamsTaken: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  streak: number;
}

export interface SubjectProgress {
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  lastPracticed: string;
}

export interface WeeklyData {
  week: string;
  score: number;
  questionsAnswered: number;
}

export interface MonthlyData {
  month: string;
  score: number;
  examsCompleted: number;
}

// Notification types
export type NotificationType = "exam" | "result" | "update" | "system" | "assignment";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "exam" | "update" | "system";
  priority: "high" | "medium" | "low";
}

// Admin types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalQuestions: number;
  totalExams: number;
  averageScore: number;
  passRate: number;
}

// Form types
export interface LoginForm {
  identifier: string; // email or phone
  password: string;
  rememberMe: boolean;
}

export interface SignUpForm {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  password: string;
  confirmPassword: string;
}

export interface OTPForm {
  otp: string;
}
