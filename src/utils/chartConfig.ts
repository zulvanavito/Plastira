import { ChartOptions, ScriptableContext } from "chart.js";

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  animation: {
    delay: (context: ScriptableContext<"line">) => {
      let delay = 0;
      delay = context.dataIndex * 300 + context.datasetIndex * 100;
      return delay;
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

export const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
