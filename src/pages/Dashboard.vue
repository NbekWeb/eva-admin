<script setup>
import { onMounted, ref, watch } from "vue";
import usePayment from "@/stores/payment.pinia";
import useCore from "@/stores/core.pinia";
import { storeToRefs } from "pinia";
import * as echarts from "echarts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import upload from "@/components/icons/upload.vue";
import requestCard from "@/components/requestCard.vue";

dayjs.locale("ru");

const paymentPinia = usePayment();
const corePinia = useCore();
const { staticData, requests, messages } = storeToRefs(paymentPinia);
const { loadingUrl } = storeToRefs(corePinia);

const chartRef = ref(null);

const dates = ref([
  {
    value: "12",
    label: "12 Месяц",
  },
  {
    value: "6",
    label: "6 Месяц",
  },

  {
    value: "30",
    label: "30 День",
  },
  {
    value: "7",
    label: "7 Дня",
  },
]);

const selectedDate = ref(dates.value[0].value);

watch(
  selectedDate,
  (newDate) => {
    if (newDate) {
      paymentPinia.getStatic({ range: newDate });
    }
  },
  {
    immediate: true,
  }
);
watch(staticData, (newData) => {
  if (newData.length && chartRef.value) {
    const existingInstance = echarts.getInstanceByDom(chartRef.value);
    if (existingInstance) {
      existingInstance.dispose();
    }

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
const exportToPDF = async () => {
  if (!chartRef.value) return;

  const canvas = await html2canvas(chartRef.value);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
  pdf.save("chart.pdf");
};
onMounted(() => {
  paymentPinia.getRequestStatic();
  paymentPinia.getMessage();
});
</script>

<template>
  <a-spin
    :spinning="
      loadingUrl.has('chat/payment/statistics/') || loadingUrl.has('requests')
    "
  >
    <div class="container mx-auto px-2.5 overflow-x-hidden">
      <div class="grid grid-cols-3 gap-7 max-lg:grid-cols-1">
        <div class="col-span-2 overflow-x-auto max-lg:col-span-1 rounded-xl border border-grey-100 p-5 bg-white ">
          <div
            class=" flex flex-col min-w-[650px]"
          >
            <div class="flex justify-between">
              <span class="font-semibold text-dark-180 text-base">
                Продажы
              </span>
              <div
                class="flex items-center gap-5 text-grey-700 font-bold text-xs"
              >
                <span
                  v-for="(item, i) in dates"
                  :key="i"
                  class="h-7.5 hover:cursor-pointer border-grey-300 transition-all duration-300 flex items-center rounded px-3.5"
                  :class="
                    item.value == selectedDate && 'border-2 text-dark-180 '
                  "
                  @click="() => (selectedDate = item.value)"
                >
                  {{ item.label }}</span
                >
              </div>
              <div
                @click="exportToPDF"
                class="text-dark-180 hover:opacity-80 hover:cursor-pointer font-semibold text-xs flex items-center gap-1 px-1.5 h-7.5 border-2 border-grey-300/50 transition-colors duration-300 rounded"
              >
                <upload class="text-lg" />
                Экспорт PDF
              </div>
            </div>
            <div ref="chartRef" style="width: 100%; height: 400px"></div>
          </div>
        </div>
        <div class="max-h-[500px] overflow-y-auto">
          <div
            class="p-5 bg-white border border-grey-100 rounded-xl flex flex-col gap-8"
          >
            <span class="font-semibold text-dark-180 text-base">
              Популярные темы
            </span>
            <div class="flex flex-col gap-1 w-full text-sm text-dark-180">
              <div
                class="flex w-full justify-between items-center gap-4 "
                v-for="item in messages"
                :key="item.id"
              >
                <span class="truncate">{{ item?.messages_info?.[0] }}</span>
                <span class="text-xs text-grey-300 min-w-max">{{
                  item?.messages_count
                }} Раз</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 grid-cols-3 gap-7 grid max-lg:grid-cols-1">
        <div
          class="p-5 bg-white border border-grey-100 rounded-xl col-span-2 max-h-[400px]"
        >
          <div class="flex justify-between items-center">
            <span class="font-semibold text-dark-180 text-base"> Оплаты </span>
          </div>
        </div>
        <div
          class="py-5 flex flex-col gap-5 bg-white border border-grey-100 rounded-xl max-h-[400px]"
        >
          <span class="font-semibold text-dark-180 text-base px-5">
            Статистике запросов
          </span>
          <div class="flex flex-col gap-5 flex-grow overflow-auto px-5">
            <requestCard
              v-for="item in requests"
              :key="item.dispose"
              :data="item"
            />
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
