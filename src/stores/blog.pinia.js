import { defineStore } from "pinia";
import { api } from "@/utils/api.js";
import useCore from "@/stores/core.pinia.js";
import { message } from "ant-design-vue";

const useBlog = defineStore("blog", {
  state: () => ({
    blog: {},
    blogs: {},
    prices: [],
    price: {},
  }),
  actions: {
    postBlog(data, callback) {
      const core = useCore();
      core.loadingUrl.add("blogs/");
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      api({
        url: "blogs/",
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
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
    editBlog(data, id, callback) {
      const core = useCore();
      core.loadingUrl.add("blogs/edit");
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      api({
        url: `blogs/${id}/`,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then(() => {
          message.success("Блог успешно отредактирован!");
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blogs/edit");
        });
      function base64ToFile(base64String, filename) {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
    },
    editPrice(data, id, callback) {
      const core = useCore();
      core.loadingUrl.add("prices/");
      api({
        url: `prices/${id}/`,
        method: "PUT",
        data,
      })
        .then(() => {
          message.success("Тариф успешно отредактирован!");
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("prices/");
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
    getPrices(callback) {
      const core = useCore();
      core.loadingUrl.add("prices/");
      api({
        url: "prices/",
        method: "GET",
      })
        .then(({ data }) => {
          this.prices = data;
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("prices/");
        });
    },
    getBlogs(params, callback) {
      const core = useCore();
      core.loadingUrl.add("blogs/");
      api({
        url: "blogs/",
        method: "GET",
        params,
      })
        .then(({ data }) => {
          this.blogs = data;
          callback(data);
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blogs/");
        });
    },
    getPrice(id, callback) {
      const core = useCore();
      core.loadingUrl.add("price/");
      api({
        url: `prices/${id}/`,
        method: "GET",
      })
        .then(({ data }) => {
          this.price = data;
          callback(data);
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("price/");
        });
    },
    getBlog(id, callback) {
      const core = useCore();
      core.loadingUrl.add("blog/");
      api({
        url: `blogs/${id}/`,
        method: "GET",
      })
        .then(({ data }) => {
          this.blog = data;
          callback(data);
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blog/");
        });
    },
    changeBlog(data, callback) {
      const core = useCore();
      core.loadingUrl.add("blog/");
      api({
        url: `blogs/${data.id}/`,
        method: "PUT",
        data,
      })
        .then(({ data }) => {
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blog/");
        });
    },
    deleteBlog(id, callback) {
      const core = useCore();
      core.loadingUrl.add("blog/");
      api({
        url: `blogs/${id}/`,
        method: "DELETE",
      })
        .then(({}) => {
          message.success("Блог успешно удалён!");
          callback();
        })
        .catch((error) => {
          message.error("Что-то пошло не так!");
        })
        .finally(() => {
          core.loadingUrl.delete("blog/");
        });
    },
    deletePrice(id, callback) {
      const core = useCore();
      core.loadingUrl.add("c/");
      api({
        url: `prices/${id}/`,
        method: "DELETE",
      })
        .then(({}) => {
          message.success("Тариф успешно удалён!");
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
