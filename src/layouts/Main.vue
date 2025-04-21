<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>
<template>
  <div class="">
    <Navbar />
    <div class="pt-10 pb-5 bg-grey-200">

      <router-view />
    </div>
  </div>
</template>
