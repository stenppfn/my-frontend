import type { ScoreItem, StudentInfo } from '../types/score';

export const studentInfo: StudentInfo = {
  name: '张三',
  grade: '小学六年级',
  studentId: '2024001',
  programmingLevel: 'Scratch 进阶'
};

export const scoreData: ScoreItem[] = [
  {
    id: '1',
    stage: 1,
    subject: 'Scratch 基础',
    score: 95,
    fullScore: 100,
    testDate: '2024-03-15',
    rank: 2,
    classAverage: 88,
    comment: '基础扎实，逻辑清晰',
    skills: [
      { name: '角色设计', score: 90 },
      { name: '事件处理', score: 95 },
      { name: '运动控制', score: 98 },
      { name: '条件判断', score: 97 }
    ]
  },
  {
    id: '2',
    stage: 2,
    subject: 'Scratch 进阶',
    score: 92,
    fullScore: 100,
    testDate: '2024-04-20',
    rank: 3,
    classAverage: 85,
    comment: '创意丰富，算法理解良好',
    skills: [
      { name: '循环结构', score: 90 },
      { name: '变量使用', score: 95 },
      { name: '函数调用', score: 92 },
      { name: '逻辑推理', score: 93 }
    ]
  },
  {
    id: '3',
    stage: 3,
    subject: 'Scratch 项目实战',
    score: 88,
    fullScore: 100,
    testDate: '2024-05-25',
    rank: 5,
    classAverage: 82,
    comment: '项目完成度高，但细节处理需要加强',
    skills: [
      { name: '项目规划', score: 85 },
      { name: '代码组织', score: 88 },
      { name: '调试能力', score: 87 },
      { name: '创新思维', score: 92 }
    ]
  },
  {
    id: '4',
    stage: 4,
    subject: 'Python 基础',
    score: 85,
    fullScore: 100,
    testDate: '2024-06-30',
    rank: 7,
    classAverage: 80,
    comment: 'Python 入门表现不错，继续加油',
    skills: [
      { name: '语法基础', score: 80 },
      { name: '数据类型', score: 85 },
      { name: '控制流', score: 88 },
      { name: '函数基础', score: 87 }
    ]
  },
  {
    id: '5',
    stage: 5,
    subject: 'Python 进阶',
    score: 90,
    fullScore: 100,
    testDate: '2024-08-15',
    rank: 4,
    classAverage: 84,
    comment: '进步明显，算法思维有所提升',
    skills: [
      { name: '面向对象', score: 88 },
      { name: '数据结构', score: 92 },
      { name: '算法设计', score: 90 },
      { name: '问题解决', score: 93 }
    ]
  }
];

// 历史成绩趋势数据
export const scoreTrendData = {
  labels: ['阶段 1', '阶段 2', '阶段 3', '阶段 4', '阶段 5'],
  studentScores: [95, 92, 88, 85, 90],
  classAverageScores: [88, 85, 82, 80, 84]
};

// 科目对比数据
export const subjectComparisonData = {
  labels: scoreData.map(item => item.subject),
  studentScores: scoreData.map(item => item.score),
  classAverageScores: scoreData.map(item => item.classAverage || 0)
};