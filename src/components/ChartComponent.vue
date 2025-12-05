<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

interface ChartData {
  labels: string[];
  studentScores: number[];
  classAverageScores: number[];
}

interface Props {
  chartType: 'line' | 'bar';
  data: ChartData;
  title: string;
  xLabel?: string;
  yLabel?: string;
}

const props = defineProps<Props>();
const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createChart = () => {
  if (!chartRef.value) return;
  
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;
  
  // 销毁现有图表
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(ctx, {
    type: props.chartType,
    data: {
      labels: props.data.labels,
      datasets: [
        {
          label: '学生分数',
          data: props.data.studentScores,
          backgroundColor: props.chartType === 'bar' ? '#4361ee' : 'rgba(67, 97, 238, 0.1)',
          borderColor: '#4361ee',
          borderWidth: 2,
          borderRadius: props.chartType === 'bar' ? 4 : 0,
          tension: props.chartType === 'line' ? 0.3 : 0,
          fill: props.chartType === 'line',
          pointBackgroundColor: '#4361ee',
          pointRadius: props.chartType === 'line' ? 4 : 0,
          pointHoverRadius: props.chartType === 'line' ? 6 : 0
        },
        {
          label: '班级平均分',
          data: props.data.classAverageScores,
          backgroundColor: props.chartType === 'bar' ? '#ced4da' : 'rgba(206, 212, 218, 0.1)',
          borderColor: '#ced4da',
          borderWidth: 2,
          borderRadius: props.chartType === 'bar' ? 4 : 0,
          tension: props.chartType === 'line' ? 0.3 : 0,
          fill: props.chartType === 'line',
          pointBackgroundColor: '#ced4da',
          pointRadius: props.chartType === 'line' ? 4 : 0,
          pointHoverRadius: props.chartType === 'line' ? 6 : 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: props.chartType === 'bar',
          min: props.chartType === 'line' ? 70 : 0,
          max: 100,
          ticks: {
            stepSize: 10
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: !!props.yLabel,
            text: props.yLabel
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: !!props.xLabel,
            text: props.xLabel
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

watch(() => props.chartType, () => {
  createChart();
});
</script>

<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.chart-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.chart-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}
</style>