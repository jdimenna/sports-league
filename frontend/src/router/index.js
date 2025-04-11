import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login.vue';
import Dashboard from '../components/dashboard.vue';
import Admin from '../components/admin.vue';
import addEvent from '../components/addEvent.vue';
import addLeague from '../components/addLeague.vue';
import addUser from '../components/addUser.vue';
import deleteEvent from '../components/deleteEvent.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard},
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/add-Event', name: 'AddEvent', component: addEvent, meta: { requiresAuth: true } },
  { path: '/add-League', name: 'AddLeague', component: addLeague, meta: { requiresAuth: true } },
  { path: '/add-User', name: 'AddUser', component: addUser, meta: { requiresAuth: true } },
  { path: '/delete-Event', name: 'DeleteEvent', component: deleteEvent, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;