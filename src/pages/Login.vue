<script setup>
import { ref, reactive } from "vue";
import useAuth from "@/stores/auth.pinia";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const authPinia = useAuth();
const router = useRouter();

const form = reactive({
  identifier: "",
  password: "",
});
const formRef = ref(null);

const rules = {
  identifier: [
    { required: true, message: "Введите имя пользователя", trigger: "blur" },
  ],
  password: [{ required: true, message: "Введите пароль", trigger: "blur" }],
};

const onSubmit = async () => {
  try {
    await formRef.value.validate();
    authPinia.postLogin({ ...form }, () => {
      router.push({ name: "home" });
      form.identifier = "";
      form.password = "";
    });
  } catch {
    message.error("Пожалуйста, заполните форму корректно!");
  }
};
</script>

<template>
  <div class="grid min-h-screen grid-cols-2 auth max-lg:grid-cols-1">
    <div class="flex flex-col items-center justify-center max-h-full">
      <div class="py-10 min-h-max max-sm:py-7">
        <h2
          class="text-5xl font-medium text-center max-sm:text-3xl max-sm:mb-7 text-dark-200 mb-15"
        >
          Вход
        </h2>

        <a-form
          layout="vertical"
          ref="formRef"
          :model="form"
          :rules="rules"
          @finish="onSubmit"
          class="max-w-md mt-4"
        >
          <a-form-item label="Имя пользователя" name="identifier">
            <a-input
              v-model:value="form.identifier"
              placeholder="Введите имя пользователя"
            />
          </a-form-item>

          <a-form-item label="Пароль" name="password">
            <a-input-password
              v-model:value="form.password"
              placeholder="Введите пароль"
            />
          </a-form-item>

          <a-button type="primary" html-type="submit" class="w-full"
            >Вход</a-button
          >
        </a-form>
      </div>
    </div>
    <div class="relative w-full max-lg:hidden">
      <img
        src="@/assets/img/auth.png"
        class="fixed top-0 right-0 object-cover w-1/2 h-screen rounded-l-3xl"
        loading="lazy"
      />
    </div>
  </div>
</template>
