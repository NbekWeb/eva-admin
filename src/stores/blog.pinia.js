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
    editBlog(data, id, callback) {
      const core = useCore();
      core.loadingUrl.add("blogs/edit");
      api({
        url: `blogs/${id}/`,
        method: "PUT",
        data,
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
        .then(({data}) => {
          this.prices=data
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
