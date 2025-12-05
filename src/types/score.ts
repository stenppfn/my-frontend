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
  // 分数构成
  scoreComposition?: {
    multipleChoice: {
      count: number;
      score: number;
      total: number;
    };
    multipleSelect: {
      count: number;
      score: number;
      total: number;
    };
    trueFalse: {
      count: number;
      score: number;
      total: number;
    };
    programming: {
      count: number;
      score: number;
      total: number;
    };
  };
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
  age: number;
  classNumber: string;
  programmingLevel: 'C' | 'C++' | 'Python' | 'Scratch';
}