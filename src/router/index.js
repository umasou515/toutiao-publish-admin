import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '@/views/login/index.vue'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Settings from '@/views/settings/'
import Fans from '@/views/fans/index.vue'

Vue.use(VueRouter)

//路由配置表
const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  { path: '/' , redirect: '/login'},
  { 
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    //命名路由 layout 有一个默认子路由，这个路由没有意义，所以警告
    //正确的做法是: 如果有默认子路由，就不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',// path 为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }

]

const router = new VueRouter({
  routes
  // routes : [
  //   // { path: '/' , redirect: '/login'},
  //   { path:'/login', component: Login },
  //   { path:'/layout', component: Layout  }
  // ]
})

//路由导航守卫（拦截器）的作用就是控制页面的访问状态
//beforEach 是全局前置守卫，任何页面的访问都要经过这里
//路由导航守卫：说白了所有页面的导航都会经过这里
//守卫页面的导航

router.beforeEach((to, from, next) => {  
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //     next()  放行  next('/login') 强制跳转

const user = JSON.parse(window.localStorage.getItem('user'))

  //校验非登录页面的登录状态 
  if(to.path !== '/login') {
    if(user) {
      //已登录，允许通过
      next()
    } else {
      next('/login')
    }
  }else {
    //登录页面，正常允许通行
    next()
  }
})

// 我们在组件中使用的 this.$router 其实就是这个模块中的 router
export default router
