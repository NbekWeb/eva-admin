import { defineStore } from "pinia";
import { api } from "@/utils/api.js";
import useCore from "@/stores/core.pinia.js";
import { message } from "ant-design-vue";

const usePayment = defineStore("payment", {
  state: () => ({
    staticData: {},
  }),
  actions: {
    getStatic(params) {
      const core = useCore();
      core.loadingUrl.add("chat/payment/statistics/");
      api({
        url: "chat/payment/statistics/",
        method: "GET",
        params,
      })
        .then(({ data }) => {
          this.staticData = data;
        })
        .catch((error) => {})
        .finally(() => {
          core.loadingUrl.delete("chat/payment/statistics/");
        });
    },
  },
});

export default usePayment;
