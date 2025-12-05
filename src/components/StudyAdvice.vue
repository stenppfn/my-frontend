<script setup lang="ts">
interface AdviceItem {
  id: string;
  title: string;
  content: string;
  type: 'excellent' | 'improve' | 'habit' | 'cooperation';
}

const adviceData: AdviceItem[] = [
  {
    id: '1',
    title: '优势技能保持',
    content: 'Scratch相关技能掌握扎实，特别是运动控制和条件判断，建议保持现有学习节奏，可适当增加拓展性项目练习。',
    type: 'excellent'
  },
  {
    id: '2',
    title: '待提升领域',
    content: 'Python基础语法和面向对象概念需要进一步加强，建议多做相关练习题，巩固基础知识。',
    type: 'improve'
  },
  {
    id: '3',
    title: '学习习惯建议',
    content: '继续保持良好的学习习惯，建议建立编程学习笔记，记录每次测试的错题和知识点，定期复习巩固。',
    type: 'habit'
  },
  {
    id: '4',
    title: '家校配合建议',
    content: '家长可以鼓励孩子参加编程竞赛或项目实践，培养孩子的编程兴趣和实践能力。',
    type: 'cooperation'
  }
];

const getAdviceConfig = (type: string) => {
  switch (type) {
    case 'excellent':
      return {
        icon: '✅',
        color: 'success',
        bgColor: '#4caf50',
        textColor: '#2e7d32'
      };
    case 'improve':
      return {
        icon: '📈',
        color: 'warning',
        bgColor: '#ff9800',
        textColor: '#e65100'
      };
    case 'habit':
      return {
        icon: '📚',
        color: 'primary',
        bgColor: '#2196f3',
        textColor: '#1565c0'
      };
    case 'cooperation':
      return {
        icon: '🤝',
        color: 'secondary',
        bgColor: '#9c27b0',
        textColor: '#6a1b9a'
      };
    default:
      return {
        icon: '💡',
        color: 'info',
        bgColor: '#00bcd4',
        textColor: '#00838f'
      };
  }
};
</script>

<template>
  <div class="study-advice">
    <h2 class="advice-title">学习建议</h2>
    <div class="advice-grid">
      <div 
        v-for="advice in adviceData" 
        :key="advice.id"
        class="advice-card"
        :style="{
          borderLeftColor: getAdviceConfig(advice.type).bgColor
        }"
      >
        <div class="advice-header">
          <span 
            class="advice-icon"
            :style="{
              backgroundColor: getAdviceConfig(advice.type).bgColor + '20',
              color: getAdviceConfig(advice.type).bgColor
            }"
          >
            {{ getAdviceConfig(advice.type).icon }}
          </span>
          <h3 class="advice-card-title">{{ advice.title }}</h3>
        </div>
        <p class="advice-content">{{ advice.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.study-advice {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.advice-title {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
  border-bottom: 2px solid #4a6fa5;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.advice-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #4361ee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.advice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.advice-icon {
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advice-card-title {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.advice-content {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>