export interface ScoreItem {
  id: string;
  stage: number;
  subject: string;
  score: number;
  fullScore: number;
  testDate: string;
  rank?: number;
  classAverage?: number;
  comment?: string;
  skills: {
    name: string;
    score: number;
  }[];
}

export interface ScoreStats {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalStages: number;
  passedStages: number;
}

export interface StudentInfo {
  name: string;
  grade: string;
  studentId: string;
  programmingLevel: string;
}