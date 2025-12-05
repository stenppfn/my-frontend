<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { studentInfo as initialStudentInfo, scoreData as initialScoreData, knowledgeMasteryData as initialKnowledgeMasteryData } from './data/mockData';
import type { StudentInfo } from './types/score';
import ScoreCard from './components/ScoreCard.vue';
import ChartComponent from './components/ChartComponent.vue';
import StudyAdvice from './components/StudyAdvice.vue';
import KnowledgeHeatmap from './components/KnowledgeHeatmap.vue';

// 本地存储键名
const STORAGE_KEYS = {
  STUDENT_INFO: 'student-info',
  KNOWLEDGE_MASTERY: 'knowledge-mastery'
};

// 响应式数据
const studentInfo = ref<StudentInfo>({ ...initialStudentInfo });
const knowledgeMasteryData = ref({ ...initialKnowledgeMasteryData });
const isEditing = ref(false);
const editForm = ref<Partial<StudentInfo>>({ ...studentInfo.value });
const isKnowledgeEditing = ref(false);

// 知识点掌握编辑区域展开/折叠
const toggleKnowledgeEdit = () => {
  isKnowledgeEditing.value = !isKnowledgeEditing.value;
};

// 从localStorage加载数据
onMounted(() => {
  const savedStudentInfo = localStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
  const savedKnowledgeMastery = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_MASTERY);
  
  if (savedStudentInfo) {
    studentInfo.value = JSON.parse(savedStudentInfo);
  }
  
  if (savedKnowledgeMastery) {
    knowledgeMasteryData.value = JSON.parse(savedKnowledgeMastery);
  }
  
  editForm.value = { ...studentInfo.value };
});

// 保存数据到localStorage
const saveData = () => {
  localStorage.setItem(STORAGE_KEYS.STUDENT_INFO, JSON.stringify(studentInfo.value));
  localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_MASTERY, JSON.stringify(knowledgeMasteryData.value));
};

// 编辑模式切换
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 取消编辑，重置表单
    editForm.value = { ...studentInfo.value };
  }
};

// 不同编程语言对应的知识点数据
const knowledgePoints = {
  'C': ['语法基础', '数据类型', '控制流', '函数', '数组', '指针', '内存管理', '文件操作'],
  'C++': ['面向对象', '继承与多态', '模板', 'STL容器', '智能指针', '异常处理', '内存管理', '算法'],
  'Python': ['语法基础', '数据类型', '控制流', '函数', '面向对象', '模块与包', '文件操作', '异常处理'],
  'Scratch': ['角色设计', '事件处理', '运动控制', '条件判断', '循环结构', '变量使用', '函数调用', '逻辑推理']
};

// 根据编程水平更新知识点
const updateKnowledgePoints = (level: 'C' | 'C++' | 'Python' | 'Scratch') => {
  const points = knowledgePoints[level];
  if (points) {
    // 保留现有掌握程度数据，只更新知识点名称
    const currentMastery = knowledgeMasteryData.value.masteryLevels;
    const newMastery = points.map((_, index) => currentMastery[index] || 80); // 默认80分
    
    knowledgeMasteryData.value = {
      labels: points,
      masteryLevels: newMastery
    };
  }
};

// 保存编辑
const saveEdit = () => {
  if (editForm.value.name && editForm.value.age && editForm.value.classNumber && editForm.value.programmingLevel) {
    const newProgrammingLevel = editForm.value.programmingLevel;
    const oldProgrammingLevel = studentInfo.value.programmingLevel;
    
    studentInfo.value = {
      name: editForm.value.name,
      age: editForm.value.age,
      classNumber: editForm.value.classNumber,
      programmingLevel: newProgrammingLevel
    };
    
    // 如果编程水平改变，更新知识点
    if (newProgrammingLevel !== oldProgrammingLevel) {
      updateKnowledgePoints(newProgrammingLevel);
    }
    
    isEditing.value = false;
    saveData();
  }
};

// 更新知识点名称
const updateKnowledgeLabel = (index: number, value: string) => {
  knowledgeMasteryData.value.labels[index] = value;
  saveData();
};

// 更新知识点掌握程度
const updateKnowledgeMastery = (index: number, value: number) => {
  knowledgeMasteryData.value.masteryLevels[index] = value;
  saveData();
};

// 处理热力图格子点击事件
const handleHeatmapClick = (index: number, score: number) => {
  updateKnowledgeMastery(index, score);
};

// 删除阶段成绩
const deleteScore = (id: string) => {
  if (scoreData.value.length > 1) { // 确保至少保留一个阶段
    scoreData.value = scoreData.value.filter(item => item.id !== id);
    // 重新排序阶段编号
    scoreData.value.forEach((item, index) => {
      item.stage = index + 1;
    });
    saveData();
  }
};

// 添加新知识点
const addKnowledgePoint = () => {
  knowledgeMasteryData.value.labels.push('新知识点');
  knowledgeMasteryData.value.masteryLevels.push(80);
  saveData();
};

// 删除知识点
const removeKnowledgePoint = (index: number) => {
  if (knowledgeMasteryData.value.labels.length > 1) {
    knowledgeMasteryData.value.labels.splice(index, 1);
    knowledgeMasteryData.value.masteryLevels.splice(index, 1);
    saveData();
  }
};

// 更新阶段成绩
const updateScore = (updatedScore: any) => {
  const index = scoreData.value.findIndex(item => item.id === updatedScore.id);
  if (index !== -1) {
    scoreData.value[index] = updatedScore;
    saveData();
  }
};

// 添加新阶段
const addStage = () => {
  const newStage = scoreData.value.length + 1;
  const startLesson = (newStage - 1) * 10 + 1;
  const endLesson = newStage * 10;
  const programmingLevel = studentInfo.value.programmingLevel;
  const baseSubjects = {
    'C': 'C语言',
    'C++': 'C++语言',
    'Python': 'Python',
    'Scratch': 'Scratch'
  };
  
  const newScore: any = {
    id: `${newStage}`,
    stage: newStage,
    subject: `${baseSubjects[programmingLevel]}（第${startLesson}-${endLesson}课）`,
    score: 80,
    fullScore: 100,
    testDate: new Date().toISOString().split('T')[0],
    rank: 10,
    classAverage: 80,
    comment: '新添加的阶段成绩',
    scoreComposition: {
      multipleChoice: {
        count: 15,
        score: 12,
        total: 15
      },
      multipleSelect: {
        count: 15,
        score: 12,
        total: 15
      },
      trueFalse: {
        count: 10,
        score: 8,
        total: 10
      },
      programming: {
        count: 4,
        score: 48,
        total: 60
      }
    },
    skills: [
      { name: '基础知识', score: 80 },
      { name: '应用能力', score: 80 },
      { name: '创新思维', score: 80 },
      { name: '问题解决', score: 80 }
    ]
  };
  
  scoreData.value.push(newScore);
  saveData();
};



// 响应式的阶段成绩数据
const scoreData = ref([...initialScoreData]);

// 不同编程语言对应的阶段数据
const generateStageData = (level: 'C' | 'C++' | 'Python' | 'Scratch') => {
  const baseSubjects = {
    'C': 'C语言',
    'C++': 'C++语言',
    'Python': 'Python',
    'Scratch': 'Scratch'
  };
  
  return initialScoreData.map((item, index) => {
    const stage = index + 1;
    const startLesson = (stage - 1) * 10 + 1;
    const endLesson = stage * 10;
    
    return {
      ...item,
      subject: `${baseSubjects[level]}（第${startLesson}-${endLesson}课）`,
      stage: stage
    };
  });
};

// 动态生成科目对比数据
const subjectComparisonData = computed(() => {
  return {
    labels: scoreData.value.map(item => item.subject),
    studentScores: scoreData.value.map(item => item.score),
    classAverageScores: scoreData.value.map(item => item.classAverage || null) // 使用null表示未设置
  };
});



// 计算班级排名和总人数
const classRank = computed(() => {
  const lastScore = scoreData.value[scoreData.value.length - 1];
  if (!lastScore) return 1;
  return lastScore.rank || 1;
});

// 监听编程水平变化，更新阶段数据和知识点
watch(() => studentInfo.value.programmingLevel, (newLevel: 'C' | 'C++' | 'Python' | 'Scratch') => {
  // 更新阶段数据
  scoreData.value = generateStageData(newLevel);
  // 更新知识点
  updateKnowledgePoints(newLevel);
  // 保存数据
  saveData();
});

const totalStudents = 30; // 假设班级总人数为30人
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-title">
          <span class="header-icon">💻</span>
          <h1>编程阶段测试成绩展示</h1>
        </div>
        <div class="header-info">
          <div class="student-name">{{ studentInfo.name }}</div>
          <div class="grade-info">{{ studentInfo.age }}岁 | {{ studentInfo.programmingLevel }}</div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <!-- 学生信息卡片 -->
      <section class="student-info-card">
        <div class="card-header">
          <h2>学生信息</h2>
          <div class="header-actions">
            <div class="rank-badge">
              <span class="rank-label">班级排名：</span>
              <span class="rank-value">{{ classRank }}/{{ totalStudents }}</span>
            </div>
            <button class="edit-btn" @click="toggleEdit">
              {{ isEditing ? '取消' : '编辑' }}
            </button>
          </div>
        </div>
        
        <!-- 编辑模式 -->
        <div v-if="isEditing" class="edit-form">
          <div class="form-row">
            <div class="form-group">
              <label>姓名</label>
              <input type="text" v-model="editForm.name" placeholder="请输入姓名" required>
            </div>
            <div class="form-group">
              <label>年龄</label>
              <input type="number" v-model.number="editForm.age" placeholder="请输入年龄" min="5" max="18" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>班级编号</label>
              <input type="text" v-model="editForm.classNumber" placeholder="请输入班级编号" required>
            </div>
            <div class="form-group">
              <label>编程水平</label>
              <select v-model="editForm.programmingLevel" required>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Scratch">Scratch</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button class="save-btn" @click="saveEdit">保存</button>
          </div>
        </div>
        
        <!-- 显示模式 -->
        <div v-else class="info-grid">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ studentInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄：</span>
            <span class="value">{{ studentInfo.age }}岁</span>
          </div>
          <div class="info-item">
            <span class="label">班级编号：</span>
            <span class="value">{{ studentInfo.classNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">编程水平：</span>
            <span class="value">{{ studentInfo.programmingLevel }}</span>
          </div>
        </div>
      </section>
      
      <!-- 知识点掌握热力图 -->
      <KnowledgeHeatmap 
        :knowledgeData="knowledgeMasteryData" 
        @update:mastery="handleHeatmapClick"
      />
      
      <!-- 成绩分析图表 -->
      <section class="charts-section">
        <h2 class="section-title">成绩分析</h2>
        <div class="charts-grid">
          <ChartComponent 
            chart-type="bar" 
            :data="subjectComparisonData" 
            title="阶段科目对比" 
            x-label="科目" 
            y-label="分数"
          />
          <div class="radar-chart-container">
            <ChartComponent 
              chart-type="radar" 
              :data="knowledgeMasteryData" 
              title="知识点掌握情况" 
              x-label="知识点" 
              y-label="掌握程度"
            />
            <!-- 知识点掌握编辑 -->
            <div class="knowledge-edit-section">
              <div class="knowledge-edit-header" @click="toggleKnowledgeEdit">
                <h3>编辑知识点掌握程度</h3>
                <div class="toggle-icon">
                  {{ isKnowledgeEditing ? '▼' : '▶' }}
                </div>
              </div>
              <div v-if="isKnowledgeEditing" class="knowledge-edits">
                <div 
                  v-for="(_, index) in knowledgeMasteryData.labels" 
                  :key="index" 
                  class="knowledge-item"
                >
                  <div class="knowledge-label-container">
                    <input 
                      type="text" 
                      v-model="knowledgeMasteryData.labels[index]" 
                      @input="updateKnowledgeLabel(index, knowledgeMasteryData.labels[index] as string)"
                      class="knowledge-label-input"
                      placeholder="知识点名称"
                    >
                    <button 
                      class="remove-knowledge-btn"
                      @click="removeKnowledgePoint(index)"
                      title="删除知识点"
                    >
                      ✕
                    </button>
                  </div>
                  <div class="knowledge-slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5" 
                      :value="knowledgeMasteryData.masteryLevels[index]" 
                      @input="updateKnowledgeMastery(index, parseInt(($event.target as HTMLInputElement).value))"
                    >
                    <span class="knowledge-value">{{ knowledgeMasteryData.masteryLevels[index] }}</span>
                  </div>
                </div>
                <button class="add-knowledge-btn" @click="addKnowledgePoint">
                  + 添加知识点
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 阶段成绩详情 -->
      <section class="scores-section">
        <div class="section-header">
          <h2 class="section-title">阶段测试成绩</h2>
          <button class="add-stage-btn" @click="addStage">
            + 添加阶段
          </button>
        </div>
        <div class="score-cards">
          <ScoreCard 
            v-for="score in scoreData" 
            :key="score.id" 
            :score="score" 
            @update:score="updateScore"
          />
        </div>
      </section>
      
      <!-- 学习建议 -->
      <StudyAdvice />
    </main>
    
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2024 编程学习平台</p>
          <p class="footer-note">本报告仅供参考，请勿转发</p>
        </div>
        <div class="footer-right">
          <span class="contact-label">联系方式：</span>
          <a href="#" class="contact-link">13800138000</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  min-height: 100vh;
  line-height: 1.6;
  color: #1f2937;
}

/* 顶部导航栏 */
.app-header {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.student-name {
  font-size: 1.2rem;
  font-weight: 500;
}

.grade-info {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 主内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 卡片通用样式 */
.student-info-card, .scores-section, .charts-section {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(37, 99, 235, 0.1);
  position: relative;
  overflow: hidden;
}

.student-info-card::before, .scores-section::before, .charts-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}

.student-info-card:hover, .scores-section:hover, .charts-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.2);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.card-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* 卡片头部动作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 编辑按钮 */
.edit-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

/* 保存按钮 */
.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

/* 排名徽章 */
.rank-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.3s ease;
}

.rank-label {
  font-weight: 500;
}

.rank-value {
  font-weight: bold;
  font-size: 1rem;
}

/* 编辑表单样式 */
.edit-form {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 雷达图容器 */
.radar-chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 知识点编辑区域 */
.knowledge-edit-section {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(37, 99, 235, 0.1);
}

.knowledge-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.knowledge-edit-header:hover {
  color: #3b82f6;
}

.knowledge-edit-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.toggle-icon {
  font-size: 0.7rem;
  color: #64748b;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.knowledge-edit-header:hover .toggle-icon {
  color: #3b82f6;
  transform: scale(1.05);
}

.knowledge-edits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.knowledge-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.knowledge-label-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.knowledge-label-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex: 1;
}

.knowledge-label-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.remove-knowledge-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-knowledge-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.add-knowledge-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  width: 100%;
}

.add-knowledge-btn:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.knowledge-slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.knowledge-slider-container input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  transition: all 0.2s ease;
}

.knowledge-slider-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  transition: all 0.2s ease;
}

.knowledge-slider-container input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.knowledge-value {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #2563eb;
  font-size: 1rem;
}

/* 学生信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.info-item:hover {
  background: #e9ecef;
}

.label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1.15rem;
  color: #333;
  font-weight: 500;
}

/* 图表区域 */
.charts-section {
  margin-top: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 20px;
}

.section-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 700;
  padding-bottom: 16px;
  border-bottom: 3px solid #e5e7eb;
  letter-spacing: -0.5px;
  position: relative;
  flex: 1;
}

.add-stage-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  white-space: nowrap;
}

.add-stage-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 3px;
}

/* 成绩卡片列表 */
.score-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

/* 页脚 */
.app-footer {
  background: #212529;
  color: white;
  padding: 25px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.footer-left p {
  margin: 0;
  font-size: 0.9rem;
}

.footer-note {
  color: #adb5bd;
  font-size: 0.8rem;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-label {
  font-size: 0.9rem;
  color: #adb5bd;
}

.contact-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #4361ee;
}
</style>
