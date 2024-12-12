import {createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import ModelPage from "../pages/ModelPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/model",
    name: "ModelPage",
    component: ModelPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
