import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Blog from "@/pages/Blog.vue";
import Blogs from "@/pages/Blogs.vue";
import Price from "@/pages/Price.vue";
import Prices from "@/pages/Prices.vue";
import Main from "@/layouts/Main.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      name: "main",
      component: Main,
      children: [
        {
          path: "",
          name: "home",
          component: Dashboard,
        },
        {
          path: "/blogs",
          name: "blogs",
          component: Blogs,
        },
        {
          path: "/blog",
          name: "blog",
          component: Blog,
        },
        {
          path: "/prices",
          name: "prices",
          component: Prices,
        },
        {
          path: "/price",
          name: "price",
          component: Price,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("access_token");

  // document.title = to.meta.title || "Авторизоваться";
  if (to.name === "login" && accessToken) {
    return next({ name: "home" });
  }
  if (to.name === "login") {
    return next();
  }

  if (accessToken) {
    return next();
  } else {
    return next({
      name: "login",
    });
  }
});

export default router;
