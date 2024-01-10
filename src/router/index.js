import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/ticket',
      name: 'shop',
      component: () => import('../views/Ticket.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/Mypage.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Create.vue')
    },
    {
      path: '/moviecomment',
      name: 'moviecomment',
      component: () => import('../views/MovieComment.vue')
    },
  ]
})

export default router
