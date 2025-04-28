<script setup>
import useBlog from "@/stores/blog.pinia";
import useCore from "@/stores/core.pinia";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import deleteIcon from "@/components/icons/delete.vue";
import editIcon from "@/components/icons/edit.vue";

const blogPinia = useBlog();
const corePinia = useCore();
const router = useRouter();

const { prices } = storeToRefs(blogPinia);
const { loadingUrl } = storeToRefs(corePinia);

function deletePrice(id) {
  blogPinia.deletePrice(id, () => {
    blogPinia.getPrices(() => {});
  });
}
function goPrice(id = "") {
  if (!id) {
    router.push({ name: "price" });
  } else {
    router.push({ name: "price", query: { id } });
  }
}
const columns = [
  {
    title: "Название",
    dataIndex: "title",
    key: "title",
    width: 120,
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    width: 100,
  },
  {
    title: "Количество",
    dataIndex: "count_typing",
    key: "count_typing",
    width: 70,
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
    width: 120,
  },
  {
    title: "Действие",
    dataIndex: "operation",
    key: "operation",
    fixed: "right",
    width: 60,
  },
];

onMounted(() => {
  blogPinia.getPrices(() => {});
});
</script>
<template>
  <a-spin :spinning="loadingUrl.has('prices/')">
    <div class="container px-2.5 mx-auto">
      <div class="flex justify-end mb-4">
        <button
          @click="goPrice('')"
          class="outline-none text-base bg-green-500 border-green-500 border rounded-lg text-white hover:text-green-500 hover:bg-white transition duration-300 h-12 px-10 flex items-center max-md:px-5 max-md:h-10"
        >
          Создать
        </button>
      </div>
      <div class="rounded-xl bg-white border-grey-100 p-5">
        <a-table
          :columns="columns"
          :data-source="prices"
          :scroll="{ x: 800 }"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'price'">
              <span>{{ Math.floor(record.price) }}</span>
            </template>

            <template v-if="column.key === 'operation'">
              <div
                class="flex items-center gap-4 text-2xl text-grey-700 justify-start"
              >
                <span
                  @click="deletePrice(record.id)"
                  class="hover:text-red-500 transition duration-300 hover:cursor-pointer"
                >
                  <delete-icon />
                </span>
                <span
                  @click="goPrice(record.id)"
                  class="hover:text-dark-200 transition duration-300 hover:cursor-pointer"
                >
                  <edit-icon />
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-spin>
</template>
