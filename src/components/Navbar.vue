<script setup>
import { useRoute, useRouter } from "vue-router";
import SearchIcon from "./icons/Search.vue";
import Logout from "./icons/Logout.vue";
import Mobile from "./Mobile.vue";

const route = useRoute();
const router = useRouter();

const links = [
  { name: "home", label: "Дашборд ", to: "/" },
  { name: "blogs", label: "Блог", to: "/blogs" },
  { name: "prices", label: "Пакет", to: "/prices" },
];

function logOut() {
  localStorage.removeItem("access_token");
  router.push({ name: "login" });
}
</script>

<template>
  <div class="flex items-center border-b py-1.5 navbar bg-white">
    <div class="container px-2.5 mx-auto flex gap-12 items-center max-md:justify-between">
      <Mobile />
      <router-link to="/">
        <img src="@/assets/img/logo.svg" class="object-contain h-9 min-w-max max-md:h-6" />
      </router-link>
      <div
        class="flex max-md:hidden text-dark-300 items-center py-2.5 px-4 rounded-2xl border border-grey-100 gap-6 text-sm font-semibold capitalize"
      >
        <router-link
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          :class="[
            'px-5 py-1 rounded-2xl',
            route.name === link.name
              ? 'text-white bg-blue-500'
              : 'bg-transparent',
          ]"
        >
          {{ link.label }}
        </router-link>
      </div>
      <a-input placeholder="Поиск" class="h-10 max-w-[600px] hidden">
        <template #prefix>
          <search-icon class="text-grey-700" />
        </template>
      </a-input>
      <div
        @click="logOut"
        class="flex items-center gap-1 ml-auto text-2xl font-semibold text-dark-300 hover:cursor-pointer max-md:ml-0"
      >
        <Logout />
        <span class="text-lg">Выйти</span>
      </div>
   
    </div>
  </div>
</template>

<style scoped>
.navbar {
  box-shadow: 0px 1px 0px 0px rgba(18, 32, 59, 0.09);
}
</style>
