import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import Home1 from "../views/home1.vue";
import Home2 from "../views/home2.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/home1",
      name: "home1",
      component: Home1,
    },
    {
      path: "/home2",
      name: "home2",
      component: Home2,
    },
  ],
});

export default router;
