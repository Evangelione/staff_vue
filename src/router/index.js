import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: () => import(/* webpackChunkName: "index" */ '../views/Index'),
  // },
  {
    path: '/login/:id/:flag',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/customer/Login'),
  },
  {
    path: '/order/:id/:flag',
    name: 'Order',
    component: () => import(/* webpackChunkName: "order" */ '../views/customer/Order'),
  },
  {
    path: '/bind/:sid/:order/:face/:staff?',
    name: 'Bind',
    component: () => import(/* webpackChunkName: "bind" */ '../views/customer/Bind'),
  },
  {
    path: '/commodity/:id/:flag',
    name: 'Commodity',
    component: () => import(/* webpackChunkName: "commodity" */ '../views/customer/CommodityList'),
  },
  {
    path: '/staffOrder',
    name: 'StaffOrder',
    component: () => import(/* webpackChunkName: "staffOrder" */ '../views/staff/drawbill/StaffOrder'),
  },
  {
    path: '/staffOrder/commodity/:orderId?',
    name: 'StaffOrderCommodity',
    component: () => import(/* webpackChunkName: "staffOrderCommodity" */ '../views/staff/drawbill/CommodityList'),
  },
  {
    path: '/staffOrder/entryOrder',
    name: 'EntryOrder',
    component: () => import(/* webpackChunkName: "entryOrder" */ '../views/staff/drawbill/EntryOrder'),
  },
  {
    path: '/staffOrder/settlement',
    name: 'Settlement',
    component: () => import(/* webpackChunkName: "settlement" */ '../views/staff/drawbill/Settlement'),
  },
  {
    path: '/staff/chat/withRobot',
    name: 'Settlement',
    component: () => import(/* webpackChunkName: "settlement" */ '../views/staff/chat/WithRobot'),
  },
  {
    path: '/staff/message',
    name: 'Message',
    component: () => import(/* webpackChunkName: "settlement" */ '../views/staff/message'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "settlement" */ '../views/staff/message/List'),
      },
    ],
  },
]

const router = new VueRouter({
  base: '/neworder/',
  mode: 'history',
  routes,
})

export default router
