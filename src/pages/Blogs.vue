<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import useBlog from "@/stores/blog.pinia";
import useCore from "@/stores/core.pinia";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import deleteIcon from "@/components/icons/delete.vue";
import editIcon from "@/components/icons/edit.vue";

const router = useRouter();
const blogPinia = useBlog();
const corePinia = useCore();
const { blogs } = storeToRefs(blogPinia);
const { loadingUrl } = storeToRefs(corePinia);
const page = ref(1);
const pageSize = ref(8);
const total = ref(0);
const data = ref([]);
const activeDropdown = ref(null);

function goBlog(id = "") {
  if (!id) {
    router.push({ name: "blog" });
  } else {
    router.push({ name: "blog", query: { id } });
  }
}

function deleteBlog(id) {
  blogPinia.deleteBlog(id, () => {
    page.value = 1;
    fetchBlogs();
  });
}

const columns = [
  {
    title: "Дата и время",
    width: 100,
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Активность",
    width: 40,
    dataIndex: "activite",
    key: "activite",
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
    width: 150,
  },
  {
    title: "Действие",
    dataIndex: "operation",
    key: "operation",
    fixed: "right",
    width: 40,
  },
];

function fetchBlogs() {
  blogPinia.getBlogs({ limit: pageSize.value, page: page.value }, (items) => {
    data.value = items?.results;
    total.value = items?.count;
  });
}

function onPageChange(p) {
  page.value = p;
  fetchBlogs();
}

function toggleDropdown(record) {
  activeDropdown.value = activeDropdown.value === record.id ? null : record.id;
}

function changeStatus(record, status) {
  record.status = status;
  blogPinia.changeBlog(record, () => {});
  activeDropdown.value = null;
}

function handleClickOutside(e) {
  const dropdowns = document.querySelectorAll(".custom-dropdown");
  let clickedInside = false;
  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(e.target)) {
      clickedInside = true;
    }
  });
  if (!clickedInside) {
    activeDropdown.value = null;
  }
}

function handleScrollClose() {
  activeDropdown.value = null;
}

onMounted(() => {
  fetchBlogs();
  document.addEventListener("click", handleClickOutside);
  const tableWrapper = document.querySelector(".ant-table-body");
  if (tableWrapper) {
    tableWrapper.addEventListener("scroll", handleScrollClose);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  const tableWrapper = document.querySelector(".ant-table-body");
  if (tableWrapper) {
    tableWrapper.removeEventListener("scroll", handleScrollClose);
  }
});
</script>

<template>
  <a-spin :spinning="loadingUrl.has('blogs/')">
    <div class="container px-2.5 mx-auto">
      <div class="flex justify-end mb-4">
        <button
          @click="goBlog('')"
          class="outline-none text-base bg-green-500 border-green-500 border rounded-lg text-white hover:text-green-500 hover:bg-white transition duration-300 h-12 px-10 flex items-center max-md:px-5 max-md:h-10"
        >
          Создать
        </button>
      </div>

      <div class="rounded-xl bg-white border-grey-100 p-5">
        <a-table
          :columns="columns"
          :data-source="data"
          :scroll="{ x: 800 }"
          :pagination="{
            current: page,
            pageSize: pageSize,
            total: total,
            onChange: onPageChange,
            hideOnSinglePage: true,
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <div class="flex items-center gap-3">
                <img
                  :src="record?.images?.[0]?.image"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div class="flex flex-col">
                  <span class="text-dark-100 text-sm limit-1">
                    {{ record?.title }}
                  </span>
                  <span class="text-grey-700 text-xs">
                    {{ dayjs(record.date).format("DD/MM/YYYY") }}
                  </span>
                </div>
              </div>
            </template>

            <template v-if="column.key === 'activite'">
              <div class="relative flex justify-center">
                <div
                  class="rounded-2xl py-0.5 px-2 flex items-center gap-1.5 text-sm cursor-pointer"
                  :class="
                    record.status === 'active'
                      ? 'bg-green-100 text-green-500'
                      : 'bg-yellow-100 text-yellow-500'
                  "
                  @click.stop="toggleDropdown(record)"
                >
                  <span
                    class="min-w-1.5 h-1.5 rounded-full"
                    :class="
                      record.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    "
                  ></span>
                  <span>
                    {{ record.status === "active" ? "Активный" : "Неактивный" }}
                  </span>
                </div>

                <div
                  v-if="activeDropdown === record.id"
                  class="custom-dropdown absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg overflow-hidden z-50 w-32"
                >
                  <div
                    class="px-3 py-2 hover:bg-green-100 cursor-pointer text-sm flex items-center gap-2"
                    @click="changeStatus(record, 'active')"
                  >
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    Активный
                  </div>
                  <div
                    class="px-3 py-2 hover:bg-yellow-100 cursor-pointer text-sm flex items-center gap-2"
                    @click="changeStatus(record, 'inactive')"
                  >
                    <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Неактивный
                  </div>
                </div>
              </div>
            </template>

            <template v-if="column.key === 'description'">
              <div class="limit-3 text-sm" v-html="record.description"></div>
            </template>
            <template v-if="column.key === 'operation'">
              <div
                class="flex items-center gap-4 text-2xl text-grey-700 justify-start"
              >
                <span @click="deleteBlog(record.id)"  class="hover:text-red-500 transition duration-300 hover:cursor-pointer">
                  <delete-icon />
                </span>
                <span @click="goBlog(record.id)"  class="hover:text-dark-200 transition duration-300 hover:cursor-pointer">
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
