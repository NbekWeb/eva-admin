<script setup>
import { reactive } from "vue";
import useBlog from "@/stores/blog.pinia";

const blogPinia = useBlog();

const formState = reactive({
  title: "",
  description: "",
  price: "",
  count_typing: "",
});

const onInputNumber = (event, key) => {
  const value = event.target.value.replace(/\D/g, ""); // Оставляем только цифры
  formState[key] = value;
};

const onFinish = () => {
  blogPinia.postPrice({ ...formState, price_type: "RUB" }, () => {
    formState.title = "";
    formState.description = "";
    formState.price = "";
    formState.count_typing = "";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};
</script>

<template>
  <div class="container mx-auto px-2.5">
    <h2 class="mb-6 text-3xl font-semibold text-dark-300">
      Пост для странийы блога
    </h2>
    <a-form :model="formState" @finish="onFinish" layout="vertical">
      <a-form-item
        label="Название"
        name="title"
        :rules="[{ required: true, message: 'Пожалуйста, введите название' }]"
      >
        <a-input
          v-model:value="formState.title"
          placeholder="Введите название"
        />
      </a-form-item>

      <a-form-item
        label="Описание"
        name="description"
        :rules="[{ required: true, message: 'Пожалуйста, введите описание' }]"
      >
        <a-textarea
          v-model:value="formState.description"
          placeholder="Введите описание"
          rows="4"
        />
      </a-form-item>

      <a-form-item
        label="Цена"
        name="price"
        :rules="[{ required: true, message: 'Пожалуйста, введите цену' }]"
      >
        <a-input
          :value="formState.price"
          @input="(event) => onInputNumber(event, 'price')"
          placeholder="Введите цену"
        />
      </a-form-item>

      <a-form-item
        label="Количество вводов"
        name="count_typing"
        :rules="[
          {
            required: true,
            message: 'Пожалуйста, введите количество вводов',
          },
        ]"
      >
        <a-input
          :value="formState.count_typing"
          @input="(event) => onInputNumber(event, 'count_typing')"
          placeholder="Введите количество вводов"
        />
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button type="primary" html-type="submit" class="px-10">
          Добавить
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
