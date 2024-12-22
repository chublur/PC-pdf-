import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/pdf',
    children: [
      {
        path: 'pdf',
        name: 'PDF',
        component: () => import('@/views/pdf/index.vue'),
        meta: { title: 'PDF预览' }
      },
      {
        path: 'page2',
        name: 'PageTwo',
        component: () => import('@/views/page2/index.vue'),
        meta: { title: '页面二' }
      },
      {
        path: 'page3',
        name: 'PageThree',
        component: () => import('@/views/page3/index.vue'),
        meta: { title: '页面三' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', noAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '管理系统'
  
  // 判断该路由是否需要登录权限
  if (!to.meta.noAuth) {
    if (getToken()) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router 