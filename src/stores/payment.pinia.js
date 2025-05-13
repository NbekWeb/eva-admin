import { defineStore } from "pinia";
import { api } from "@/utils/api.js";
import useCore from "@/stores/core.pinia.js";
import { message } from "ant-design-vue";

const usePayment = defineStore("payment", {
  state: () => ({
    staticData: {},
    requests: [],
    messages: [],
    payments: [],
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
    getRequestStatic() {
      const core = useCore();
      core.loadingUrl.add("requests/");
      api({
        url: "chat/user/statistics/",
        method: "GET",
      })
        .then(({ data }) => {
          this.requests = data;
        })
        .catch((error) => {})
        .finally(() => {
          core.loadingUrl.delete("requests/");
        });
    },
    getMessage() {
      const core = useCore();
      core.loadingUrl.add("message/");
      api({
        url: "chat/message/statistics/",
        method: "GET",
      })
        .then(({ data }) => {
          this.messages = data;
        })
        .catch((error) => {})
        .finally(() => {
          core.loadingUrl.delete("message/");
        });
    },
    getPayment() {
      const core = useCore();
      core.loadingUrl.add("prices/payments/");
      api({
        url: "prices/payments/",
        method: "GET",
      })
        .then(({ data }) => {
          this.payments = data;
        })
        .catch((error) => {})
        .finally(() => {
          core.loadingUrl.delete("prices/payments/");
        });
    },
  },
});

export default usePayment;
