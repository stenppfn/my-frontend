<script setup lang="ts">
import type { ScoreItem } from '../types/score';

interface Props {
  score: ScoreItem;
}

defineProps<Props>();

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#4caf50';
  if (score >= 80) return '#2196f3';
  if (score >= 70) return '#ff9800';
  if (score >= 60) return '#ffc107';
  return '#f44336';
};

const getPercentage = (score: number, fullScore: number): number => {
  return Math.round((score / fullScore) * 100);
};
</script>

<template>
  <div class="score-card">
    <div class="card-header">
      <div class="stage-info">
        <span class="stage-badge">阶段 {{ score.stage }}</span>
        <h3 class="subject">{{ score.subject }}</h3>
      </div>
      <div class="date-info">
        {{ score.testDate }}
      </div>
    </div>
    
    <div class="card-body">
      <div class="score-main">
        <div class="score-display">
          <span class="score-value" :style="{ color: getScoreColor(score.score) }">
            {{ score.score }}
          </span>
          <span class="score-max">/{{ score.fullScore }}</span>
        </div>
        <div class="score-percentage">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ 
                width: `${getPercentage(score.score, score.fullScore)}%`,
                backgroundColor: getScoreColor(score.score)
              }"
            ></div>
          </div>
          <span class="percentage-text">
            {{ getPercentage(score.score, score.fullScore) }}%
          </span>
        </div>
      </div>
      
      <div class="score-details">
        <div class="detail-item" v-if="score.rank">
          <span class="detail-label">排名：</span>
          <span class="detail-value">第 {{ score.rank }} 名</span>
        </div>
        <div class="detail-item" v-if="score.comment">
          <span class="detail-label">评语：</span>
          <span class="detail-value comment">{{ score.comment }}</span>
        </div>
      </div>
      
      <div class="skills-section" v-if="score.skills.length > 0">
        <h4>技能评分</h4>
        <div class="skills-grid">
          <div class="skill-item" v-for="(skill, index) in score.skills" :key="index">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-bar-container">
              <div 
                class="skill-bar" 
                :style="{ 
                  width: `${skill.score}%`,
                  backgroundColor: getScoreColor(skill.score)
                }"
              ></div>
            </div>
            <div class="skill-score">{{ skill.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4a6fa5;
  transition: transform 0.2s, box-shadow 0.2s;
}

.score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-badge {
  background: #4a6fa5;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.subject {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.date-info {
  color: #666;
  font-size: 0.9rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.score-max {
  font-size: 1.2rem;
  color: #666;
}

.score-percentage {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.percentage-text {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  gap: 8px;
}

.detail-label {
  font-weight: bold;
  color: #666;
  min-width: 60px;
}

.detail-value {
  color: #333;
}

.comment {
  font-style: italic;
  color: #555;
}

.skills-section {
  margin-top: 10px;
}

.skills-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-name {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
}

.skill-bar-container {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.skill-score {
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
}
</style>