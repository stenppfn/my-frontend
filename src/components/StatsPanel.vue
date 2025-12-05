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
  margin: 0 0 28px 0;
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 700;
  padding-bottom: 16px;
  border-bottom: 3px solid #e5e7eb;
  letter-spacing: -0.5px;
  position: relative;
}

.stats-panel h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 3px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(37, 99, 235, 0.1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: rgba(37, 99, 235, 0.2);
}

.stat-icon {
  font-size: 2rem;
  width: 40px;
  text-align: center;
  color: #4361ee;
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
  color: #4361ee;
  line-height: 1;
}

/* 统一蓝色系配色 */
.stat-icon.average,
.stat-icon.highest,
.stat-icon.lowest,
.stat-icon.total,
.stat-icon.passed,
.stat-icon.pass-rate {
  color: #4361ee;
}
</style>