<template>
  <div class="container px-2.5 mx-auto">
    <h2 class="mb-6 text-3xl font-semibold text-dark-300">Добавить Тариф</h2>
    <a-form
      :model="form"
      :rules="rules"
      ref="formRef"
      layout="vertical"
      class="flex flex-col px-10 py-6 bg-white border rounded-2xl border-grey-100"
    >
      <span class="flex mb-2 text-2xl font-semibold text-dark-300">
        Изображения
      </span>
      <a-form-item name="fileList" class="mb-4">
        <a-upload
          v-model:file-list="form.fileList"
          list-type="picture-card"
          accept="image/png, image/jpeg"
          :max-count="1"
          :show-upload-list="{ showPreviewIcon: false }"
          :before-upload="handleBeforeUpload"
        >
          <div v-if="form.fileList.length === 0">
            <div class="flex flex-col items-center gap-0 text-grey-700">
              <span class="text-2xl font-semibold">+</span>
              <span class="text-sm">Добавить</span>
            </div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item
        label="Заголовок объявления"
        name="title"
        class="w-full mb-4"
      >
        <a-input v-model:value="form.title" placeholder="Введите заголовок" />
      </a-form-item>

      <a-form-item label="Описание" name="content" class="w-full mb-4">
        <editor
          api-key="2e6sys1khzjzlqhj5fk4hwvqs7yif539ijzy6nwawcbkcz1g"
          v-model="form.content"
          :init="{
            height: 400,
            toolbar_mode: 'sliding',
            menubar: false,
            plugins:
              'anchor autolink charmap codesample emoticons image link lists searchreplace table visualblocks wordcount image',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline | link image | align | numlist bullist',
            automatic_uploads: true,
            images_upload_handler: async (blobInfo, success) => {
              const base64 = blobInfo.base64();
              const mime = blobInfo.blob().type;
              const url = `data:${mime};base64,${base64}`;
              success(url);
            },
          }"
        />
      </a-form-item>
      <div class="flex justify-end">
        <button
          @click="addBlog"
          class="w-max py-3.5 px-11 bg-yellow-500 rounded-3xl text-dark-300 text-sm hover:opacity-80 transition duration-300 font-semibold"
        >
          Сохранитъ и опубликоватъ
        </button>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import Editor from "@tinymce/tinymce-vue";
import useBlog from "@/stores/blog.pinia";

const formRef = ref(null);
const blogPinia = useBlog();

const form = reactive({
  title: "",
  fileList: [],
  content: "",
});

const handleBeforeUpload = (file) => {
  form.fileList = [
    {
      uid: file.uid,
      name: file.name,
      url: URL.createObjectURL(file),
      originFileObj: file,
    },
  ];
  return false;
};

const rules = {
  title: [
    {
      required: true,
      message: "Пожалуйста, введите заголовок",
      trigger: "blur",
    },
  ],
  fileList: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "Пожалуйста, добавьте изображение",
      trigger: "change",
    },
  ],
  content: [
    {
      required: true,
      message: "Пожалуйста, введите описание",
      trigger: "blur",
    },
  ],
};

const addBlog = async () => {
  try {
    await formRef.value.validate();
    const images = form.fileList
      .map((file) => {
        return file.url || file.response?.url;
      })
      .filter(Boolean);

    blogPinia.postBlog(
      {
        title: form.title,
        images,
        status: "active",
        description: form.content,
      },
      () => {
        form.title = "";
        form.fileList = [];
        form.content = "";
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    );
  } catch {
    message.error("Пожалуйста, заполните форму корректно!");
  }
};
</script>
