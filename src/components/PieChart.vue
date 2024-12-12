<template>
  <div>
    <apexchart
      type="pie"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [29, 24, 19, 19, 10], // Values for each section of the pie
      chartOptions: {
        labels: [
          "Structure/Facade",
          "Electrical",
          "Plumbing",
          "Piping",
          "Insulation",
        ],
        colors: ["#6366F1", "#A5B4FC", "#FDBA74", "#F87171", "#DC2626"],
        legend: {
          position: "top",
          labels: {
            colors: "#FFFFFF", // Legend text color
          },
        },
        dataLabels: {
          style: {
            colors: ["#FFFFFF"], // Data label color
          },
        },
      },
      fill: {
        opacity: 1,
      },
    };
  },
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>
