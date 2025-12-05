<script setup lang="ts">
import { computed } from 'vue';
import { studentInfo, scoreData, scoreTrendData, subjectComparisonData } from './data/mockData';
import type { ScoreStats } from './types/score';
import ScoreCard from './components/ScoreCard.vue';
import StatsPanel from './components/StatsPanel.vue';
import ChartComponent from './components/ChartComponent.vue';
import StudyAdvice from './components/StudyAdvice.vue';

const stats = computed<ScoreStats>(() => {
  const scores = scoreData.map(item => item.score);
  return {
    averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    totalStages: scoreData.length,
    passedStages: scoreData.filter(item => item.score >= 60).length
  };
});

// 计算班级排名和总人数
const classRank = computed(() => {
  const lastScore = scoreData[scoreData.length - 1];
  if (!lastScore) return 1;
  return lastScore.rank || 1;
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
          <div class="grade-info">{{ studentInfo.grade }} | {{ studentInfo.programmingLevel }}</div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <!-- 学生信息卡片 -->
      <section class="student-info-card">
        <div class="card-header">
          <h2>学生信息</h2>
          <div class="rank-badge">
            <span class="rank-label">班级排名：</span>
            <span class="rank-value">{{ classRank }}/{{ totalStudents }}</span>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ studentInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">年级：</span>
            <span class="value">{{ studentInfo.grade }}</span>
          </div>
          <div class="info-item">
            <span class="label">学号：</span>
            <span class="value">{{ studentInfo.studentId }}</span>
          </div>
          <div class="info-item">
            <span class="label">编程水平：</span>
            <span class="value">{{ studentInfo.programmingLevel }}</span>
          </div>
        </div>
      </section>
      
      <!-- 成绩统计面板 -->
      <StatsPanel :stats="stats" />
      
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
          <ChartComponent 
            chart-type="line" 
            :data="scoreTrendData" 
            title="成绩趋势变化" 
            x-label="阶段" 
            y-label="分数"
          />
        </div>
      </section>
      
      <!-- 阶段成绩详情 -->
      <section class="scores-section">
        <h2 class="section-title">阶段测试成绩</h2>
        <div class="score-cards">
          <ScoreCard 
            v-for="score in scoreData" 
            :key="score.id" 
            :score="score" 
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
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部导航栏 */
.app-header {
  background: linear-gradient(135deg, #4361ee 0%, #3f37c9 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片通用样式 */
.student-info-card, .scores-section, .charts-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.student-info-card:hover, .scores-section:hover, .charts-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
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
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 排名徽章 */
.rank-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4361ee;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.rank-label {
  font-weight: 500;
}

.rank-value {
  font-weight: bold;
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

.section-title {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid #4361ee;
  margin-bottom: 20px;
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
