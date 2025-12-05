<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ScoreItem } from '../types/score';

interface Props {
  score: ScoreItem;
}

interface Emits {
  (e: 'update:score', value: ScoreItem): void;
  (e: 'delete:score', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 删除当前阶段成绩
const deleteScore = () => {
  emit('delete:score', props.score.id);
};

const isEditing = ref(false);
const editForm = ref<ScoreItem>({ ...props.score });

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

// 计算总分
const totalScore = computed(() => {
  if (!editForm.value.scoreComposition) return editForm.value.score;
  
  const { multipleChoice, multipleSelect, trueFalse, programming } = editForm.value.scoreComposition;
  return multipleChoice.score + multipleSelect.score + trueFalse.score + programming.score;
});

// 切换编辑模式
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editForm.value = {
      ...props.score,
      scoreComposition: props.score.scoreComposition || {
        multipleChoice: { count: 15, score: 0, total: 15 },
        multipleSelect: { count: 15, score: 0, total: 15 },
        trueFalse: { count: 10, score: 0, total: 10 },
        programming: { count: 4, score: 0, total: 60 }
      },
      skills: props.score.skills || []
    };
  }
};

// 保存修改
const saveEdit = () => {
  // 更新总分
  editForm.value.score = totalScore.value;
  emit('update:score', editForm.value);
  isEditing.value = false;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  editForm.value = { ...props.score };
};
</script>

<template>
  <div class="score-card">
    <div class="card-header">
      <div class="stage-info">
        <span class="stage-badge">阶段 {{ score.stage }}</span>
        <h3 class="subject">{{ score.subject }}</h3>
      </div>
      <div class="card-header-actions">
        <div class="date-info">
          {{ score.testDate }}
        </div>
        <button class="edit-btn" @click="toggleEdit">
          {{ isEditing ? '取消' : '编辑' }}
        </button>
        <button class="delete-btn" @click="deleteScore">
          删除
        </button>
      </div>
    </div>
    
    <div class="card-body">
      <div class="score-main">
        <div class="score-display">
          <span class="score-value" :style="{ color: getScoreColor(isEditing ? totalScore : score.score) }">
            {{ isEditing ? totalScore : score.score }}
          </span>
          <span class="score-max">/{{ score.fullScore }}</span>
        </div>
        <div class="score-percentage">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ 
                width: `${getPercentage(isEditing ? totalScore : score.score, score.fullScore)}%`,
                backgroundColor: getScoreColor(isEditing ? totalScore : score.score)
              }"
            ></div>
          </div>
          <span class="percentage-text">
            {{ getPercentage(isEditing ? totalScore : score.score, score.fullScore) }}%
          </span>
        </div>
      </div>
      
      <div class="score-details">
        <div class="detail-item" v-if="score.rank">
          <span class="detail-label">排名：</span>
          <span class="detail-value">
            <span v-if="!isEditing">第 {{ score.rank }} 名</span>
            <input 
              v-else 
              type="number" 
              v-model.number="editForm.rank" 
              min="1" 
              :max="30" 
              step="1"
              class="detail-input"
            >
          </span>
        </div>
        <div class="detail-item" v-if="score.classAverage">
          <span class="detail-label">班级平均分：</span>
          <span class="detail-value">
            <span v-if="!isEditing">{{ score.classAverage }}</span>
            <input 
              v-else 
              type="number" 
              v-model.number="editForm.classAverage" 
              min="0" 
              max="100" 
              step="0.5"
              class="detail-input"
            >
          </span>
        </div>
        <div class="detail-item" v-if="score.comment">
          <span class="detail-label">评语：</span>
          <span class="detail-value comment">
            <span v-if="!isEditing">{{ score.comment }}</span>
            <textarea 
              v-else 
              v-model="editForm.comment" 
              rows="2"
              class="detail-textarea"
            ></textarea>
          </span>
        </div>
      </div>
      
      <!-- 分数构成部分 -->
      <div class="score-composition-section" v-if="score.scoreComposition">
        <h4>分数构成</h4>
        <div class="composition-grid">
          <!-- 单选题 -->
          <div class="composition-item">
            <div class="composition-header">
              <span class="composition-label">单选题</span>
              <span class="composition-total">
                {{ isEditing ? editForm.scoreComposition?.multipleChoice.score : score.scoreComposition.multipleChoice.score }}/
                {{ score.scoreComposition.multipleChoice.total }}分
              </span>
            </div>
            <div class="composition-detail">
              <span>{{ score.scoreComposition.multipleChoice.count }}题</span>
              <span v-if="isEditing" class="edit-input">
                <input 
                  type="number" 
                  v-model.number="editForm.scoreComposition!.multipleChoice.score" 
                  min="0" 
                  :max="score.scoreComposition!.multipleChoice.total"
                  step="0.5"
                >
              </span>
            </div>
          </div>
          
          <!-- 多选题 -->
          <div class="composition-item">
            <div class="composition-header">
              <span class="composition-label">多选题</span>
              <span class="composition-total">
                {{ isEditing ? editForm.scoreComposition?.multipleSelect.score : score.scoreComposition.multipleSelect.score }}/
                {{ score.scoreComposition.multipleSelect.total }}分
              </span>
            </div>
            <div class="composition-detail">
              <span>{{ score.scoreComposition.multipleSelect.count }}题</span>
              <span v-if="isEditing" class="edit-input">
                <input 
                  type="number" 
                  v-model.number="editForm.scoreComposition!.multipleSelect.score" 
                  min="0" 
                  :max="score.scoreComposition!.multipleSelect.total"
                  step="0.5"
                >
              </span>
            </div>
          </div>
          
          <!-- 判断题 -->
          <div class="composition-item">
            <div class="composition-header">
              <span class="composition-label">判断题</span>
              <span class="composition-total">
                {{ isEditing ? editForm.scoreComposition?.trueFalse.score : score.scoreComposition.trueFalse.score }}/
                {{ score.scoreComposition.trueFalse.total }}分
              </span>
            </div>
            <div class="composition-detail">
              <span>{{ score.scoreComposition.trueFalse.count }}题</span>
              <span v-if="isEditing" class="edit-input">
                <input 
                  type="number" 
                  v-model.number="editForm.scoreComposition!.trueFalse.score" 
                  min="0" 
                  :max="score.scoreComposition!.trueFalse.total"
                  step="0.5"
                >
              </span>
            </div>
          </div>
          
          <!-- 编程题 -->
          <div class="composition-item">
            <div class="composition-header">
              <span class="composition-label">编程题</span>
              <span class="composition-total">
                {{ isEditing ? editForm.scoreComposition?.programming.score : score.scoreComposition.programming.score }}/
                {{ score.scoreComposition.programming.total }}分
              </span>
            </div>
            <div class="composition-detail">
              <span>{{ score.scoreComposition.programming.count }}题</span>
              <span v-if="isEditing" class="edit-input">
                <input 
                  type="number" 
                  v-model.number="editForm.scoreComposition!.programming.score" 
                  min="0" 
                  :max="score.scoreComposition!.programming.total"
                  step="0.5"
                >
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 技能评分 -->
      <div class="skills-section" v-if="score.skills.length > 0">
        <h4>技能评分</h4>
        <div class="skills-grid">
          <div class="skill-item" v-for="(skill, index) in score.skills" :key="index">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-bar-container">
              <div 
                class="skill-bar" 
                :style="{
                  width: `${isEditing ? (editForm.skills && editForm.skills[index] ? editForm.skills[index].score : skill.score) : skill.score}%`,
                  backgroundColor: getScoreColor(isEditing ? (editForm.skills && editForm.skills[index] ? editForm.skills[index].score : skill.score) : skill.score)
                }"
              ></div>
            </div>
            <div class="skill-score-container">
              <span class="skill-score">
                {{ isEditing ? (editForm.skills && editForm.skills[index] ? editForm.skills[index].score : skill.score) : skill.score }}
              </span>
              <span v-if="isEditing" class="edit-input-small">
                <input 
                  type="number" 
                  v-model.number="editForm.skills![index]!.score" 
                  min="0" 
                  max="100"
                  step="1"
                >
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 编辑操作按钮 -->
      <div class="edit-actions" v-if="isEditing">
        <button class="cancel-btn" @click="cancelEdit">取消</button>
        <button class="save-btn" @click="saveEdit">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.score-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2563eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.score-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.score-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.edit-btn {
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.edit-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
  border-color: #3b82f6;
  transform: none;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

.cancel-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.delete-btn:hover {
  background: #dc2626;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
  transform: none;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.edit-input, .edit-input-small, .detail-input, .detail-textarea {
  margin-top: 8px;
}

.detail-input, .detail-textarea {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 100%;
}

.detail-input:focus, .detail-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.detail-input {
  width: auto;
  min-width: 60px;
  max-width: 120px;
}

.detail-textarea {
  width: 100%;
  resize: vertical;
  min-height: 60px;
}

.edit-input input, .edit-input-small input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 100%;
}

.edit-input input:focus, .edit-input-small input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.edit-input-small input {
  width: 60px;
  padding: 4px 8px;
  font-size: 0.8rem;
}

.skill-score-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.composition-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-badge {
  background: #4361ee;
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

.score-composition-section {
  margin-top: 10px;
}

.score-composition-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1rem;
}

.composition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.composition-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #4361ee;
  transition: transform 0.2s, box-shadow 0.2s;
}

.composition-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.composition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.composition-label {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

.composition-total {
  font-weight: bold;
  color: #4361ee;
  font-size: 0.95rem;
}

.composition-detail {
  color: #666;
  font-size: 0.85rem;
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