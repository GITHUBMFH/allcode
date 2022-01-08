/*
 * @Description: 
 * @Version: 2.0
 * @Autor: mfh
 * @Date: 2021-09-30 21:14:49
 * @LastEditors: mfh
 * @LastEditTime: 2021-10-02 00:42:37
 */
// import { createRouter, createWebHashHistory } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import notfound from "../views/404.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>import("../views/About.vue"),
  },
  {
    path: "/:all*",
    name: "404",
    component: notfound,
  },
];

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
