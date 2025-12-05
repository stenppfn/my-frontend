<script setup lang="ts">
import type { ScoreStats } from '../types/score';

interface Props {
  stats: ScoreStats;
}

const props = defineProps<Props>();
</script>

<template>
  <section class="stats-panel">
    <h2>成绩统计</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon average">📊</div>
        <div class="stat-content">
          <div class="stat-label">平均分</div>
          <div class="stat-value">{{ props.stats.averageScore.toFixed(1) }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon highest">🏆</div>
        <div class="stat-content">
          <div class="stat-label">最高分</div>
          <div class="stat-value">{{ props.stats.highestScore }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon lowest">📉</div>
        <div class="stat-content">
          <div class="stat-label">最低分</div>
          <div class="stat-value">{{ props.stats.lowestScore }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon total">📋</div>
        <div class="stat-content">
          <div class="stat-label">总阶段数</div>
          <div class="stat-value">{{ props.stats.totalStages }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon passed">✅</div>
        <div class="stat-content">
          <div class="stat-label">通过阶段</div>
          <div class="stat-value">{{ props.stats.passedStages }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pass-rate">📈</div>
        <div class="stat-content">
          <div class="stat-label">通过率</div>
          <div class="stat-value">
            {{ Math.round((props.stats.passedStages / props.stats.totalStages) * 100) }}%
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-panel {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-panel h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
  border-bottom: 2px solid #4a6fa5;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  width: 40px;
  text-align: center;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

/* 针对不同统计项的样式微调 */
.stat-icon.average {
  color: #2196f3;
}

.stat-icon.highest {
  color: #4caf50;
}

.stat-icon.lowest {
  color: #f44336;
}

.stat-icon.total {
  color: #ff9800;
}

.stat-icon.passed {
  color: #8bc34a;
}

.stat-icon.pass-rate {
  color: #9c27b0;
}
</style>