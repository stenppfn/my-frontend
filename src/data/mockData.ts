import type { ScoreItem, StudentInfo } from '../types/score';

export const studentInfo: StudentInfo = {
  name: '张三',
  age: 12,
  classNumber: '2024001',
  programmingLevel: 'Scratch'
};

export const scoreData: ScoreItem[] = [
  {
    id: '1',
    stage: 1,
    subject: 'Scratch 基础（第1-10课）',
    score: 95,
    fullScore: 100,
    testDate: '2024-03-15',
    rank: 2,
    classAverage: 88,
    comment: '基础扎实，逻辑清晰',
    scoreComposition: {
      multipleChoice: {
        count: 15,
        score: 14,
        total: 15
      },
      multipleSelect: {
        count: 15,
        score: 14.5,
        total: 15
      },
      trueFalse: {
        count: 10,
        score: 9,
        total: 10
      },
      programming: {
        count: 4,
        score: 57.5,
        total: 60
      }
    },
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
    subject: 'Scratch 进阶（第11-20课）',
    score: 92,
    fullScore: 100,
    testDate: '2024-04-20',
    rank: 3,
    classAverage: 85,
    comment: '创意丰富，算法理解良好',
    scoreComposition: {
      multipleChoice: {
        count: 15,
        score: 13.5,
        total: 15
      },
      multipleSelect: {
        count: 15,
        score: 14,
        total: 15
      },
      trueFalse: {
        count: 10,
        score: 8.5,
        total: 10
      },
      programming: {
        count: 4,
        score: 56,
        total: 60
      }
    },
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
    subject: 'Scratch 项目实战（第21-30课）',
    score: 88,
    fullScore: 100,
    testDate: '2024-05-25',
    rank: 5,
    classAverage: 82,
    comment: '项目完成度高，但细节处理需要加强',
    scoreComposition: {
      multipleChoice: {
        count: 15,
        score: 13,
        total: 15
      },
      multipleSelect: {
        count: 15,
        score: 13.5,
        total: 15
      },
      trueFalse: {
        count: 10,
        score: 8,
        total: 10
      },
      programming: {
        count: 4,
        score: 53.5,
        total: 60
      }
    },
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
    subject: 'Python 基础（第31-40课）',
    score: 85,
    fullScore: 100,
    testDate: '2024-06-30',
    rank: 7,
    classAverage: 80,
    comment: 'Python 入门表现不错，继续加油',
    scoreComposition: {
      multipleChoice: {
        count: 15,
        score: 12.5,
        total: 15
      },
      multipleSelect: {
        count: 15,
        score: 13,
        total: 15
      },
      trueFalse: {
        count: 10,
        score: 7.5,
        total: 10
      },
      programming: {
        count: 4,
        score: 52,
        total: 60
      }
    },
    skills: [
      { name: '语法基础', score: 80 },
      { name: '数据类型', score: 85 },
      { name: '控制流', score: 88 },
      { name: '函数基础', score: 87 }
    ]
  }
];

// 知识点掌握情况数据
export const knowledgeMasteryData = {
  labels: ['角色设计', '事件处理', '运动控制', '条件判断', '循环结构', '变量使用', '函数调用', '逻辑推理'],
  masteryLevels: [90, 95, 98, 97, 90, 95, 92, 93]
};

// 科目对比数据
export const subjectComparisonData = {
  labels: scoreData.map(item => item.subject),
  studentScores: scoreData.map(item => item.score),
  classAverageScores: scoreData.map(item => item.classAverage || 0)
};

// 知识点趋势数据
export const knowledgeTrendData = {
  labels: ['第1-10课', '第11-20课', '第21-30课', '第31-40课', '第41-50课'],
  skills: [
    { name: '基础语法', data: [95, 92, 88, 85, 90] },
    { name: '逻辑思维', data: [92, 94, 89, 87, 93] },
    { name: '算法设计', data: [88, 90, 86, 84, 91] },
    { name: '项目实践', data: [85, 88, 92, 87, 89] }
  ]
};