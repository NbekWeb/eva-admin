<template>
  <a-spin :spinning="loadingUrl.has('blogs/edit') || loadingUrl.has('blog/')">
    <div class="container px-2.5 mx-auto">
      <h2 class="mb-6 text-3xl font-semibold text-dark-300">
        Пост для странийы блога
      </h2>
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
  </a-spin>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { message } from "ant-design-vue";
import Editor from "@tinymce/tinymce-vue";
import useBlog from "@/stores/blog.pinia";
import useCore from "@/stores/core.pinia";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const formRef = ref(null);
const blogPinia = useBlog();
const corePinia = useCore();
const route = useRoute();
const router = useRouter();
const { blog } = storeToRefs(blogPinia);
const { loadingUrl } = storeToRefs(corePinia);

const form = reactive({
  title: "1",
  fileList: [],
  content: "1",
});

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      blogPinia.getBlog(newId, (data) => {
        form.title = data.title;
        form.content = data.description;
        if (data.images?.[0]?.image) {
          form.fileList = [
            {
              uid: "-1",
              name: "image.png",
              url: data.images?.[0]?.image,
            },
          ];
        }
      });
    }
  },
  { immediate: true }
);

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
      message: "Пожалуйста, добавьте изображение",
      trigger: "change",
      validator(_, value) {
        if (!value || value.length === 0) {
          return Promise.reject(new Error("Пожалуйста, добавьте изображение"));
        }
        return Promise.resolve();
      },
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

function goTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  router.push("/blogs");
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const addBlog = async () => {
  try {
    await formRef.value.validate();
    // const images = await Promise.all(
    //   form.fileList.map(async (file) => {
    //     if (file.url) {
    //       return file.url;
    //     } else if (file.originFileObj) {
    //       return await toBase64(file.originFileObj);
    //     }
    //     return null;
    //   })
    // );

    // const filteredImages = images.filter(Boolean);
    if (!route.query.id) {
      const images = await Promise.all(
        form.fileList.map(async (file) => {
          if (file.url) {
            return { image: file.url }; // URL bo'lsa, 'image' kalitiga url qiymatini beradi
          } else if (file.thumbUrl) {
            return { image: file.thumbUrl }; // 'thumbUrl' bo'lsa, 'image' kalitiga thumbUrl qiymatini beradi
          } else if (file.originFileObj) {
            return { image: await toBase64(file.originFileObj) }; // 'originFileObj' bo'lsa, uni Base64 formatiga o'zgartirib 'image' kalitiga beradi
          }
          return null; // Hech narsa bo'lmasa, null qaytariladi
        })
      );

      const filteredImages = images.filter(Boolean);
      console.log(filteredImages);
      blogPinia.postBlog(
        {
          title: form.title,
          images: filteredImages,
          status: "active",
          description: form.content,
        },
        () => {
          form.title = "";
          form.fileList = [];
          form.content = "";
          goTop();
        }
      );
    } else {
      console.log("sa");
      blogPinia.editBlog(
        {
          title: form.title,
          images: { id: blog.value.images?.[0]?.id, image: filteredImages },
          status: "active",
          description: form.content,
        },
        route.query.id,
        () => {
          form.title = "";
          form.fileList = [];
          form.content = "";
          goTop();
        }
      );
    }
  } catch (e) {
    console.log(e);
    message.error("Пожалуйста, заполните форму корректно!");
  }
};
</script>
<style>
:where(.css-dev-only-do-not-override-1p3hq3p).ant-upload-wrapper
  .ant-upload-list.ant-upload-list-picture-card
  .ant-upload-list-item {
  padding: 0;
}
:where(
    .css-dev-only-do-not-override-1p3hq3p
  ).ant-upload-wrapper.ant-upload-picture-card-wrapper
  .ant-upload-list.ant-upload-list-picture-card
  .ant-upload-list-item-thumbnail
  img {
  object-fit: cover !important;
  border-radius: 8px;
}
:where(
    .css-dev-only-do-not-override-1p3hq3p
  ).ant-upload-wrapper.ant-upload-picture-card-wrapper
  .ant-upload-list.ant-upload-list-picture-card
  .ant-upload-list-item::before {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
