import { defineStore } from "pinia";
import { api } from "@/utils/api.js";
import useCore from "@/stores/core.pinia.js";
import { message } from "ant-design-vue";

const useBlog = defineStore("blog", {
  actions: {
    postBlog(data, callback) {
      const core = useCore();
      core.loadingUrl.add("blogs/");
      api({
        url: "blogs/",
        method: "POST",
        data,
      })
        .then(() => {
          message.success("Блог успешно добавлен!");
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blogs/");
        });
    },
    postPrice(data, callback) {
      const core = useCore();
      core.loadingUrl.add("prices/");
      api({
        url: "prices/",
        method: "POST",
        data,
      })
        .then(() => {
          message.success("Тариф успешно добавлен");
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("prices/");
        });
    },
  },
});

export default useBlog;
