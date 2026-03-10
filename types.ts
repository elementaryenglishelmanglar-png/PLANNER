export interface LessonData {
  topic: string;
  levels: string[];
  subject: string;
  skill: string;
  methodology: string;
  learningObjectives: string;
  country: string;
  standards: string;
  studentContext: string;
  duration: number;
}

export interface QuizData {
  questionType: string;
  topic: string;
  keywords: string;
  educationLevel: string;
  subject: string;
  coverage: string;
  numQuestions: string;
  difficulty: string;
  share: boolean;
  sourceText: string;
}

export interface CurricularAdaptationData {
  educationLevel: string;
  subjects: string[];
  learningConditions: string;
  medicalHistory: string;
  studentName: string;
  share: boolean;
  sourceText: string;
}

export interface WordSearchFormData {
  resourceName: string;
  theme: string;
  subject: string;
  grade: string;
  share: boolean;
}

export interface WordSearchSolutionEntry {
  word: string;
  start: { row: number; col: number };
  end: { row: number; col: number };
  direction: string;
}

export interface WordSearchAPIResponse {
  grid: string[][];
  words: string[];
  solution: WordSearchSolutionEntry[];
}

export interface ColoringImageData {
  educationLevel: string;
  subject: string;
  topic: string;
}

export interface DuaData {
  educationLevel: string;
  subjects: string[];
  topic: string;
  resourceName: string;
  share: boolean;
}

export interface ReadingData {
  topic: string;
  grade: string;
  objectives: string;
  textType: string;
  language: string;
  difficulty: string;
  wordCount: string;
}

export interface TimelineFormData {
  name: string;
  theme: string;
  grade: string;
  subject: string;
  share: boolean;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  category: string;
  icon: string;
}

export interface StudentReportData {
  studentName: string;
  grade: string;
  reportingPeriod: string;
  academicStrengths: string;
  academicImprovements: string;
  behavioralStrengths: string;
  behavioralImprovements: string;
  reportTone: string;
  closingRemark: string;
  language: string;
}

export interface WorksheetData {
  generationMode: 'topic' | 'text';
  topic: string;
  sourceText: string;
  grade: string;
  subject: string;
  language: string;
  difficulty: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GenerationHistory {
  id?: string;
  created_at?: string;
  tool_id: string;
  prompt_data: any;
  generated_result: string | object | null;
  user_id?: string;
}