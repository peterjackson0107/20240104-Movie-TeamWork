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
      name: 'ticket',
      component: () => import('../views/Ticket.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/Mypage.vue')
    },
    {
      path: '/mypageB',
      name: 'mypageB',
      component: () => import('../views/mypage/MypageB.vue')
    },
    {
      path: '/mypageShow',
      name: 'mypageShow',
      component: () => import('../views/mypage/Mypagehow.vue')
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
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/register.vue')
    },
    
    
    {
      path: '/introduce',
      name: 'introduce',
      component: () => import('../views/ticket/Introduce.vue')
    },
    {
      path: '/seat',
      name: 'seat',
      component: () => import('../views/ticket/Seat.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/ticket/test.vue')
    },
    {
    path: '/backCreate',
      name: 'backCreate',
      component: () => import('../views/ticket/backCreate.vue')
    },
    {
      path: '/backSearch',
        name: 'backSearch',
        component: () => import('../views/ticket/backSearch.vue')
      },
      {
      path: '/backAdd',
        name: 'backAdd',
        component: () => import('../views/ticket/backAdd.vue')
      }
  ]
})

export default router
