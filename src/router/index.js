import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import users from '../components/user/Users.vue'
import roles from '../components/power/Roles.vue'
import rights from '../components/power/Rights.vue'
import categories from '../components/goods/Categories'
import goods from '../components/goods/Goods'
import addgoods from '../components/goods/AddGoods'

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
      { path: 'goods', component: goods },
      { path: 'addgoods', component: addgoods, name: 'addgoods' }
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
