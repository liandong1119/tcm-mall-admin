import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: 'menu.dashboard' }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('../views/product/index.vue'),
        meta: { title: 'menu.product' }
      },
      {
        path: 'product/add',
        name: 'ProductAdd',
        component: () => import('../views/product/add.vue'),
        meta: { title: 'product.add' }
      },
      {
        path: 'product/edit/:id',
        name: 'ProductEdit',
        component: () => import('../views/product/edit.vue'),
        meta: { title: 'product.edit' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('../views/category/index.vue'),
        meta: { title: 'menu.category' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../views/order/index.vue'),
        meta: { title: 'menu.order' }
      },
      {
        path: 'order/:id',
        name: 'OrderDetail',
        component: () => import('../views/order/detail.vue'),
        meta: { title: 'order.detail' }
      },
      {
        path: 'review',
        name: 'Review',
        component: () => import('../views/review/index.vue'),
        meta: { title: 'menu.review' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/user/index.vue'),
        meta: { title: 'menu.user' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/index.vue'),
        meta: { title: 'menu.profile' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router