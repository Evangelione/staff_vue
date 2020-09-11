import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import(/* webpackChunkName: "index" */ '../views/index'),
  },
  {
    path: '/login/:id/:flag',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/customer/Login'),
  },
  {
    path: '/bind/:sid/:order/:face/:staff?',
    name: 'Bind',
    component: () => import(/* webpackChunkName: "bind" */ '../views/customer/Bind'),
  },
  {
    path: '/order/:id/:flag',
    name: 'Order',
    component: () => import(/* webpackChunkName: "order" */ '../views/customer/Order'),
  },
  {
    path: '/commodity/:id/:flag/:uid/:order?',
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
    component: () => import(/* webpackChunkName: "staffOrder" */ '../views/staff/drawbill/CommodityList'),
  },
  {
    path: '/staffOrder/entryOrder',
    name: 'EntryOrder',
    component: () => import(/* webpackChunkName: "staffOrder" */ '../views/staff/drawbill/EntryOrder'),
  },
  {
    path: '/staffOrder/settlement',
    name: 'Settlement',
    component: () => import(/* webpackChunkName: "staffOrder" */ '../views/staff/drawbill/Settlement'),
  },
  {
    path: '/staff/chat/withRobot',
    name: 'withRobot',
    component: () => import(/* webpackChunkName: "chat" */ '../views/staff/chat/WithRobot'),
  },
  {
    path: '/staff/message',
    component: () => import(/* webpackChunkName: "message" */ '../views/staff/message'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "message" */ '../views/staff/message/List'),
      },
    ],
  },
  {
    path: '/staff/task',
    name: 'task',
    component: () => import(/* webpackChunkName: "message" */ '../views/staff/task'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "task" */ '../views/staff/task/TaskList.vue'),
      },
      {
        path: 'create/:id?',
        component: () => import(/* webpackChunkName: "task" */ '../views/staff/task/TaskCreate'),
      },
    ],
  },
  {
    path: '/staff/curise',
    name: 'curise',
    component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise/Dashboard'),
      },
      {
        path: 'routeManager',
        component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise/RouteManager'),
      },
      {
        path: 'routeCRU/:id?',
        component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise/RouteCRU'),
      },
      {
        path: 'robotRoute',
        component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise/RobotRoute'),
      },
      {
        path: 'routeBind/:id',
        component: () => import(/* webpackChunkName: "curise" */ '../views/staff/curise/BindRoute'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
