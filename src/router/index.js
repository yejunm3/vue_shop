import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import( /* webpackChunkName: "login_home" */ '../components/Login')
const home = () => import( /* webpackChunkName: "login_home" */ '../components/Home')
// 
const roles = () => import( /* webpackChunkName: "roles_rights" */ '../components/power/Roles')
const rights = () => import( /* webpackChunkName: "roles_rights" */ '../components/power/Rights')
// 
const categories = () => import( /* webpackChunkName: "goods_params_categories" */ '../components/goods/Categories')
const params = () => import( /* webpackChunkName: "goods_params_categories" */ '../components/goods/Params')
const goods = () => import( /* webpackChunkName: "goods_params_categories" */ '../components/goods/Goods')
const addgoods = () => import( /* webpackChunkName: "goods_params_categories" */ '../components/goods/AddGoods')
const editgoods = () => import( /* webpackChunkName: "goods_params_categories" */ '../components/goods/EditGoods')
// 
const users = () => import( /* webpackChunkName: "users_orders_reports" */ '../components/user/Users')
const orders = () => import( /* webpackChunkName: "users_orders_reports" */ '../components/order/Orders')
const reports = () => import( /* webpackChunkName: "users_orders_reports" */ '../components/report/Reports')

// import login from '../components/Login'
// import home from '../components/Home'
// import users from '../components/user/Users'
// import roles from '../components/power/Roles'
// import rights from '../components/power/Rights'
// import categories from '../components/goods/Categories'
// import params from '../components/goods/Params'
// import goods from '../components/goods/Goods'
// import addgoods from '../components/goods/AddGoods'
// import editgoods from '../components/goods/EditGoods'
// import orders from '../components/order/Orders'
// import reports from '../components/report/Reports'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { name: 'login', path: '/login', component: login },
  {
    name: 'home',
    path: '/home',
    component: home,
    redirect: '/home/users',
    children: [
      { path: 'users', component: users },
      { path: 'roles', component: roles },
      { path: 'rights', component: rights },
      { path: 'categories', component: categories },
      { path: 'params', component: params },
      { path: 'goods', component: goods },
      { path: 'addgoods', component: addgoods, name: 'addgoods' },
      { path: 'editgoods', component: editgoods, name: 'editgoods' },
      { path: 'orders', component: orders },
      { path: 'reports', component: reports }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

/**
 * 路由导航守卫
 * 1、判断要前往的路径是否为'/login'，是，则放行
 * 2、获取token，如果有的话就放行，否则强制定向到'/login'
 *
 * 参数：
 * to：表示将要前往的路由
 * from：表示路由来源
 * next：是一个函数，表示放行
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('./login')
  next()
})

export default router
