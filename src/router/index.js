import { createRouter, createWebHistory } from "vue-router";

// 公共路由
export const constantRoutes = [
  {
    path: "/",
    redirect: "/form-create-test",
  },
  // 测试动态表单
  {
    path: "/form-create-test",
    component: () => import("~/test/form-create-test.vue"),
  },
  // 测试tooltips
  {
    path: "/tooltips-test",
    component: () => import("~/test/tooltips-test.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
