<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

interface ChartData {
  labels: string[];
  studentScores?: number[];
  classAverageScores?: (number | null)[];
  masteryLevels?: number[];
}

interface Props {
  chartType: 'line' | 'bar' | 'radar';
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
  
  // 根据图表类型和数据结构生成不同的数据集
  let datasets: any[] = [];
  
  if (props.chartType === 'radar' && props.data.masteryLevels) {
    // 雷达图数据集
    datasets = [{
      label: '知识点掌握程度',
      data: props.data.masteryLevels,
      backgroundColor: 'rgba(67, 97, 238, 0.2)',
      borderColor: '#4361ee',
      borderWidth: 2,
      pointBackgroundColor: '#4361ee',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4361ee'
    }];
  } else if (props.data.studentScores && props.data.classAverageScores) {
    // 折线图和柱状图数据集
    datasets = [
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
      }
    ];
    
    // 只添加有班级平均分数据的数据集
    const hasClassAverage = props.data.classAverageScores.some(avg => avg !== null && avg !== undefined);
    if (hasClassAverage) {
      datasets.push({
        label: '班级平均分',
        data: props.data.classAverageScores.map(avg => avg === null || avg === undefined ? 0 : avg), // 未设置的班级平均分显示为0
        backgroundColor: props.chartType === 'bar' ? '#ced4da' : 'rgba(206, 212, 218, 0.1)',
        borderColor: '#ced4da',
        borderWidth: 2,
        borderRadius: props.chartType === 'bar' ? 4 : 0,
        tension: props.chartType === 'line' ? 0.3 : 0,
        fill: props.chartType === 'line',
        pointBackgroundColor: '#ced4da',
        pointRadius: props.chartType === 'line' ? 4 : 0,
        pointHoverRadius: props.chartType === 'line' ? 6 : 0
      });
    }
  }
  
  // 生成图表配置
  const chartConfig: any = {
    type: props.chartType,
    data: {
      labels: props.data.labels,
      datasets
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
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  };
  
  // 添加特定图表类型的配置
  if (props.chartType === 'radar') {
    chartConfig.options.scales = {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      }
    };
  } else {
    chartConfig.options.scales = {
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
    };
  }
  
  chart = new Chart(ctx, chartConfig);
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
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(37, 99, 235, 0.1);
  position: relative;
  overflow: hidden;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}

.chart-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.2);
}

.chart-title {
  margin: 0 0 24px 0;
  color: #1f2937;
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.3px;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}
</style>