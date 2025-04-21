import { defineStore } from "pinia";
import { api } from "@/utils/api.js";
import useCore from "@/stores/core.pinia.js";
import { message } from "ant-design-vue";

const useAuth = defineStore("auth", {
  actions: {
    postLogin(data, callback) {
      const core = useCore();
      core.loadingUrl.add("accounts/signin/");
      api({
        url: "accounts/signin/",
        method: "POST",
        data,
      })
        .then(({ data }) => {
          localStorage.setItem("access_token", data.access);
          callback();
        })
        .catch((error) => {
          if (error.response.data.detail) {
            message.error(error.response.data.detail);
          } else {
            message.error("Что-то пошло не так!");
          }
        })
        .finally(() => {
          core.loadingUrl.delete("accounts/login");
        });
    },
  },
});

export default useAuth;
