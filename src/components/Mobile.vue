<script setup>
import { useRouter } from "vue-router";
import {ref} from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: "dark",
  },
});

const open = ref(false);
const iconClass = ref("icon-menu");
const router = useRouter();

const onMenuToggle = () => {
  open.value = !open.value;
  iconClass.value = open.value ? "icon-close" : "icon-menu";
};

const navLinks = [
  { name: "Дашборд", to: "/" },
  { name: "Блог", to: "/blogs" },
  { name: "Пакет", to: "/prices" },
];

const handleNavigation = (to) => {
  router.push(to);
  onMenuToggle();
};
</script>
<template>
  <div class="md:hidden">
    <div
      @click="onMenuToggle"
      class="relative z-20"
      :class="type === 'dark' ? 'dark' : 'whiting'"
    >
      <div id="icon-container" class="block w-6 h-6 cursor-pointer">
        <div
          :class="[iconClass, type === 'dark' ? 'bg-dark-200' : 'bg-whiting']"
          id="icon"
          class="absolute top-1/2 transform -translate-y-1/2 w-5 h-0.5 rounded transition-all ease-in-out duration-300"
        ></div>
      </div>
    </div>

    <div
      class="fixed top-0 left-0 z-[11] flex flex-col items-center justify-center w-screen h-screen gap-5 text-lg font-semibold transition-transform duration-500 ease-in-out bg-blue-300 text-whiting"
      :class="open ? 'translate-x-0' : 'translate-x-full'"
    >
      <span
        v-for="(link, index) in navLinks"
        :key="index"
        class="cursor-pointer"
        @click="handleNavigation(link.to)"
      >
        {{ link.name }}
      </span>
    </div>
  </div>
</template>
<style>
.icon-menu::before,
.icon-menu::after,
.icon-close::before,
.icon-close::after {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 2px;
  border-radius: 4px;
  transition: top ease 0.3s, transform ease 0.3s 0.3s, background 0.3s ease 0.3s;
}

.dark .icon-menu::before,
.dark .icon-menu::after,
.dark .icon-close::before,
.dark .icon-close::after {
  background: #222;
}

.whiting .icon-menu::before,
.whiting .icon-menu::after,
.whiting .icon-close::before,
.whiting .icon-close::after {
  background: #fefeff;
}

.icon-menu::before {
  top: -7px;
  transition: background ease 0.3s, top ease 0.3s 0.3s, transform ease 0.3s;
}

.icon-menu::after {
  top: 7px;
  transition: background ease 0.3s, top ease 0.3s 0.3s, transform ease 0.3s;
}

.icon-close {
  background: transparent;
}

.icon-close::before {
  transform: rotate(45deg);
  top: 0px;
  background: #fefeff !important;
}

.icon-close::after {
  transform: rotate(-45deg);
  top: 0px;
  background: #fefeff !important;
}
</style>
