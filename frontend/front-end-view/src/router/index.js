import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/home.vue"
import User from "../views/user.vue"
import Admin from "../views/admin.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
    },
    {
      path: "/user",
      name: "user",
      component: User,
    },
  ],
})

export default router
