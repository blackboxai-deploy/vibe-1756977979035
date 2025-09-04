// Types pour l'application éducative EcoLearn

export interface Subject {
  id: string;
  name: string;
  description: string;
  level: 'primaire' | 'college' | 'lycee';
  icon: string;
  color: string;
}

export interface Summary {
  id: string;
  title: string;
  originalContent: string;
  summaryContent: string;
  subject: string;
  level: 'court' | 'moyen' | 'detaille';
  createdAt: Date;
  wordCount: number;
}

export interface Question {
  id: string;
  type: 'qcm' | 'ouverte' | 'vrai-faux';
  question: string;
  options?: string[]; // Pour QCM
  correctAnswer: string;
  explanation: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  duration: number; // en minutes
  createdAt: Date;
  status: 'brouillon' | 'actif' | 'termine';
}

export interface ExamResult {
  id: string;
  examId: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  completedAt: Date;
  timeSpent: number; // en secondes
}

export interface UserProgress {
  subjectsStudied: string[];
  totalSummaries: number;
  totalExams: number;
  averageScore: number;
  lastActivity: Date;
  streakDays: number;
  achievements: string[];
}

export interface AIRequest {
  prompt: string;
  context?: string;
  type: 'summary' | 'exam' | 'feedback';
  parameters?: {
    length?: 'short' | 'medium' | 'long';
    difficulty?: 'easy' | 'medium' | 'hard';
    questionCount?: number;
  };
}

export interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
  processingTime?: number;
}