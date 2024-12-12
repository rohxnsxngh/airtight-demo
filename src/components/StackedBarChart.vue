<template>
  <div>
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          name: "In Design",
          data: [30, 10, 50, 40, 30, 20],
        },
        {
          name: "Ordered",
          data: [50, 70, 40, 30, 40, 60],
        },
        {
          name: "Installed",
          data: [20, 20, 10, 30, 30, 20],
        },
      ],
      chartOptions: {
        chart: {
          stacked: true,
          stackType: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        xaxis: {
          categories: [
            "Piping",
            "Structure",
            "Walls",
            "Plumbing",
            "Insulation",
            "Electrical",
          ],
          labels: {
            style: {
              colors: "#FFFFFF", // White color for x-axis labels
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#FFFFFF", // White color for y-axis labels
            },
          },
        },
        legend: {
          position: "top",
          labels: {
            colors: "#FFFFFF", // White color for legend labels
          },
        },
        colors: ["#6E57FF", "#A5B4FC", "#F59E0B"],
        fill: {
          opacity: 1,
        },
      },
    };
  },
};
</script>
