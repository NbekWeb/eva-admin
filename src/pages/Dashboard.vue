<script setup>
import { ref, watch } from "vue";
import usePayment from "@/stores/payment.pinia";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Import Russian locale
dayjs.locale("ru"); // Set locale globally to Russian

const paymentPinia = usePayment();
const { staticData } = storeToRefs(paymentPinia);

const chartRef = ref(null);

paymentPinia.getStatic({ range: "7" });

watch(staticData, (newData) => {
  if (newData.length && chartRef.value) {
    const chart = echarts.init(chartRef.value);

    chart.setOption({
      xAxis: {
        type: "category",
        data: newData.map((item) => dayjs(item.date).format("MMM")), // Янв, Фев, Мар
        axisLabel: {
          formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1), // Capitalize first letter
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: newData.map((item) => item.amount),
          type: "line",
          smooth: true,
          lineStyle: {
            width: 3,
            color: "#4F46E5",
          },
          areaStyle: {
            color: "rgba(79, 70, 229, 0.1)",
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const item = params[0];
          const date = dayjs(newData[item.dataIndex].date)
            .format("MMMM YYYY")
            .replace(/^([a-zа-яё])/i, (match) => match.toUpperCase()); // Май 2025
          const amount = new Intl.NumberFormat("ru-RU").format(item.data); // 50,000
          return `${date}<br/>${amount} руб`;
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "5%",
        containLabel: true,
      },
    });

    window.addEventListener("resize", () => {
      chart.resize();
    });
  }
});
</script>

<template>
  <div class="container mx-auto px-2.5">
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
  </div>
</template>
