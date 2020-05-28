import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login/:id/:flag',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/order/:id/:flag',
    name: 'Order',
    component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue'),
  },
  {
    path: '/bind/:order',
    name: 'Bind',
    component: () => import(/* webpackChunkName: "bind" */ '../views/Bind.vue'),
  },
  {
    path: '/commodity/:id/:flag',
    name: 'Commodity',
    component: () => import(/* webpackChunkName: "commodity" */ '../views/CommodityList.vue'),
  },
  {
    path: '/staffOrder/:id',
    name: 'StaffOrder',
    component: () => import(/* webpackChunkName: "staffOrder" */ '../views/staff/StaffOrder.vue'),
  },
  {
    path: '/staffOrder/commodity/:id/:flag?',
    name: 'StaffOrderCommodity',
    component: () => import(/* webpackChunkName: "staffOrderCommodity" */ '../views/staff/CommodityList.vue'),
  },
  {
    path: '/staffOrder/entryOrder/:id',
    name: 'EntryOrder',
    component: () => import(/* webpackChunkName: "entryOrder" */ '../views/staff/EntryOrder.vue'),
  },
  {
    path: '/staffOrder/settlement/:id',
    name: 'Settlement',
    component: () => import(/* webpackChunkName: "settlement" */ '../views/staff/Settlement.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
