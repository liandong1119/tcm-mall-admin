import {createRouter, createWebHistory} from 'vue-router'
import i18n from '@/i18n'
import {watch} from 'vue'

const routes = [{
    path: '/seller/forgot-password',
    name: 'FindPassword',
    component: () => import('../views/login/forgot-password.vue'),
    meta: {
        title: 'menu.forgotPassword',
        icon: 'UserFilled'
    }
},
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/index.vue'),
        meta: {
            title: 'common.login',
            hidden: true
        }
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
                meta: {
                    title: 'menu.dashboard',
                    icon: 'Odometer',
                    affix: true
                }
            },
            // {
            //   path: 'merchant/list',
            //   name: 'MerchantList',
            //   component: () => import('../views/merchant/index.vue'),
            //   meta: {
            //     title: 'menu.merchant',
            //     icon: 'Shop'
            //   }
            // },
            {
                path: 'supplier',
                name: 'Supplier',
                redirect: '/supplier/list',
                meta: {
                    title: 'menu.supplier',
                    icon: 'TrendCharts'
                },
                children: [
                    {
                        path: 'list',
                        name: 'SupplierList',
                        component: () => import('../views/supplier/index.vue'),
                        meta: {
                            title: 'menu.supplierList'
                        }
                    }
                ]
            },
            {
                path: 'supplier/add',
                name: 'SupplierAdd',
                component: () => import('../views/supplier/index.vue'),
                meta: {
                    title: 'supplier.add',
                    hidden: true,
                    activeMenu: '/supplier/list'
                }
            },
            {
                path: 'supplier/edit/:id',
                name: 'SupplierEdit',
                component: () => import('../views/supplier/index.vue'),
                meta: {
                    title: 'supplier.edit',
                    hidden: true,
                    activeMenu: '/supplier/list'
                }
            },
            {
                path: 'product',
                name: 'Product',
                redirect: '/product/list',
                meta: {
                    title: 'menu.product',
                    icon: 'ShoppingBag'
                },
                children: [
                    {
                        path: 'list',
                        name: 'ProductList',
                        component: () => import('../views/product/index.vue'),
                        meta: {
                            title: 'menu.productList'
                        }
                    },
                    {
                        path: 'category',
                        name: 'Category',
                        component: () => import('../views/category/index.vue'),
                        meta: {
                            title: 'menu.category'
                        }
                    }
                ]
            },
            {
                path: 'product/add',
                name: 'ProductAdd',
                component: () => import('../views/product/add.vue'),
                meta: {
                    title: 'product.add',
                    hidden: true,
                    activeMenu: '/product/list'
                }
            },
            {
                path: 'product/edit/:id',
                name: 'ProductEdit',
                component: () => import('../views/product/edit.vue'),
                meta: {
                    title: 'product.edit',
                    hidden: true,
                    activeMenu: '/product/list'
                }
            },
            {
                path: 'order',
                name: 'Order',
                redirect: '/order/list',
                meta: {
                    title: 'menu.order',
                    icon: 'ShoppingCart'
                },
                children: [
                    {
                        path: 'list',
                        name: 'OrderList',
                        component: () => import('../views/order/index.vue'),
                        meta: {
                            title: 'menu.orderList'
                        }
                    },
                    {
                        path: 'refund',
                        name: 'Refund',
                        component: () => import('../views/order/refund/index.vue'),
                        meta: {
                            title: 'menu.refund'
                        }
                    }
                ]
            },
            {
                path: 'order/:id',
                name: 'OrderDetail',
                component: () => import('../views/order/detail.vue'),
                meta: {
                    title: 'order.detail',
                    hidden: true,
                    activeMenu: '/order/list'
                }
            },
            {
                path: 'review',
                name: 'Review',
                component: () => import('../views/review/index.vue'),
                meta: {
                    title: 'menu.review',
                    icon: 'ChatDotRound'
                }
            },
            {
                path: 'user/list',
                name: 'UserList',
                component: () => import('../views/user/index.vue'),
                meta: {
                    title: 'menu.user',
                    icon: 'User'
                }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/profile/index.vue'),
                meta: {
                    title: 'menu.profile',
                    icon: 'UserFilled',
                    hidden: true
                }
            },

        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 更新页面标题的函数
const updateTitle = (to) => {
    const title = to.meta.title ? i18n.global.t(to.meta.title) : ''
    const appTitle = i18n.global.locale.value === 'zh'
        ? import.meta.env.VITE_APP_TITLE
        : import.meta.env.VITE_APP_TITLE_EN
    document.title = title ? `${title} - ${appTitle}` : appTitle
}

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    updateTitle(to)

    const token = localStorage.getItem('token')
    if (to.path === '/login' || to.path === '/seller/forgot-password') {
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

// 监听语言变化
watch(
    () => i18n.global.locale.value,
    () => {
        const currentRoute = router.currentRoute.value
        updateTitle(currentRoute)
    }
)

export default router