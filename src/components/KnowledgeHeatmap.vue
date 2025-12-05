<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  knowledgeData: {
    labels: string[];
    masteryLevels: number[];
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:mastery', index: number, score: number): void;
}>();

const heatmapRef = ref<HTMLDivElement | null>(null);

// 点击热力图格子，增加掌握程度
const incrementMastery = (index: number) => {
  const currentScore = props.knowledgeData.masteryLevels[index] || 0;
  const newScore = Math.min(currentScore + 10, 100); // 每次增加10%，最高100%
  emit('update:mastery', index, newScore);
};

// 确保至少有180个知识点数据
const processedKnowledgeData = computed(() => {
  const result = [...props.knowledgeData.labels];
  const levels = [...props.knowledgeData.masteryLevels];
  
  // 如果数据不足180个，补充空数据
  while (result.length < 180) {
    result.push(`知识点${result.length + 1}`);
    levels.push(0); // 默认未掌握
  }
  
  return {
    labels: result.slice(0, 180), // 只取前180个
    masteryLevels: levels.slice(0, 180)
  };
});

// 计算热力图颜色
const getHeatmapColor = (score: number): string => {
  if (score >= 90) return '#10b981'; // 绿色 - 优秀
  if (score >= 80) return '#3b82f6'; // 蓝色 - 良好
  if (score >= 70) return '#f59e0b'; // 黄色 - 中等
  if (score >= 60) return '#f97316'; // 橙色 - 及格
  return '#ef4444'; // 红色 - 不及格
};

// 生成180个格子的HTML
const generateHeatmapHTML = computed(() => {
  const { labels, masteryLevels } = processedKnowledgeData.value;
  return labels.map((label, index) => {
      const score = masteryLevels[index] || 0; // 确保score始终为number
      const color = getHeatmapColor(score);
      return {
        label,
        score,
        color,
        index
      };
    });
});
</script>

<template>
  <div class="heatmap-container">
    <h2>知识点掌握热力图</h2>
    <div class="heatmap-wrapper">
      <div class="grid-container" ref="heatmapRef">
        <div 
          v-for="item in generateHeatmapHTML" 
          :key="item.index"
          class="heatmap-cell"
          :style="{ backgroundColor: item.color }"
          :title="`${item.label}: ${item.score}分`"
          @click="incrementMastery(item.index)"
        >
        </div>
      </div>
    </div>
    <div class="heatmap-legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #10b981;"></div>
        <span>优秀 (90-100)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #3b82f6;"></div>
        <span>良好 (80-89)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #f59e0b;"></div>
        <span>中等 (70-79)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #f97316;"></div>
        <span>及格 (60-69)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #ef4444;"></div>
        <span>不及格 (0-59)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heatmap-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.heatmap-container h2 {
  margin: 0 0 28px 0;
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 700;
  padding-bottom: 16px;
  border-bottom: 3px solid #e5e7eb;
  letter-spacing: -0.5px;
  position: relative;
}

.heatmap-container h2::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 3px;
}

.heatmap-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(30, 1fr); /* 30列 */
  grid-template-rows: repeat(6, 1fr); /* 6行 */
  gap: 4px;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 5 / 1; /* 保持5:1的宽高比 */
}

.heatmap-cell {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #4b5563;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>