<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="flex items-center min-w-max justify-between text-dark-180 text-sm gap-4">
    <div class="flex items-center gap-3">
      <img
        :src="data?.user_info?.avatar"
        v-if="data?.user_info?.avatar"
        class="w-9 h-9 rounded-full"
      />
      <img src="@/assets/img/user.jpg" v-else class="w-9 h-9 rounded-full" />
      <div class="flex gap-1 flex-col">
        <span class="font-semibold truncate">
          {{ data?.user_info?.username }}
        </span>
        <span class="text-grey-700 text-xs">
          {{ data?.user_info?.email }}
        </span>
      </div>
    </div>
    <span class="font-medium min-w-max">
      {{ data?.messages_count }}
      Раз
    </span>
  </div>
</template>
