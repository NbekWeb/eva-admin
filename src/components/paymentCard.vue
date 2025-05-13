<script setup>
import dayjs from "dayjs";
import "dayjs/locale/ru";
import useBlog from "@/stores/blog.pinia";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import info from "./icons/info.vue";
import close from "./icons/close.vue";

dayjs.locale("ru");
const blogPinia = useBlog();
const { prices } = storeToRefs(blogPinia);
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  first: {
    type: Boolean,
    default: false,
  },
});
const matchedPrice = computed(() =>
  prices.value.find((item) => item?.id === props.data?.product_pocket?.id)
);
</script>
<template>
  <div
    class="w-full flex justify-between py-6 text-sm text-dark-180 items-center"
    :class="!first && 'border-t border-grey-100'"
  >
    <div
      class="flex items-center gap-2 p-2 pr-5 rounded-3xl"
      :class="
        data?.status == 'success'
          ? 'bg-green-100'
          : data?.status == 'pending'
          ? 'bg-yellow-100/10'
          : 'bg-red-500/10'
      "
    >
      <span
        v-if="data?.status == 'success'"
        class="w-2 min-w-2 h-2 rounded-full bg-green-500"
      >
      </span>
      <info
        v-else-if="data?.status == 'pending'"
        class="text-yellow-500 text-sm"
      />
      <close v-else class="text-red-500 text-sm" />
      <span
        :class="
          data?.status == 'success'
            ? 'text-green-600'
            : data?.status == 'pending'
            ? 'text-yellow-500'
            : 'text-red-500'
        "
      >
        {{
          data?.status == "success"
            ? "Успешно"
            : data?.status == "pending"
            ? "В ожидании"
            : "Ошибка"
        }}
      </span>
    </div>
    <span class="font-semibold"> {{ data?.card?.card_number }}</span>
    <div class="flex flex-col gap-1">
      <span>{{ Number(data?.amount) }} рублей</span>
      <span class="text-xs text-grey-700">
        {{ dayjs(data?.created).format("MMM D, YYYY") }}
      </span>
    </div>
    <span class="text-grey-700"
      >{{ matchedPrice?.count_typing }} запросов
    </span>
  </div>
</template>
