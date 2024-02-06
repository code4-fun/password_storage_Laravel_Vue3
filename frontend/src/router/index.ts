import {createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw, RouterOptions } from 'vue-router'
import Layout from '../components/Layout.vue'
import HomeView from '../views/HomeView.vue'
import About from '../views/About.vue'
import Passwords from '../views/Passwords.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '../views/auth/ResetPasswordView.vue'
import {useAuthStore} from '@/stores/authStore'

const routes = <Array<RouteRecordRaw>>[
  {path: '/', name: 'layout', component: Layout, redirect: {name: 'home'},
    children: [
      {path: 'home', name: 'home', component: HomeView},
      {path: 'about', name: 'about', component: About, meta: {requiresAuth: true}},
      {path: 'passwords', name: 'passwords', component: Passwords, meta: {requiresAuth: true}},
      {path: 'login', name: 'login', component: LoginView},
      {path: 'register', name: 'register', component: RegisterView},
      {path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView},
      {path: 'password-reset/:token', name: 'reset-password', component: ResetPasswordView}
    ]
  },
  {path: '/:pathMatch(.*)*', redirect : 'home'}
]

const router = createRouter(<RouterOptions>{
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if(to.meta.requiresAuth && !authStore.user){
    next({
      name: 'login',
      query: {
        from: to.name as string
      }
    })
  } else {
    next()
  }
})

export default router
