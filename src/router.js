import Vue from 'vue'
import Router from 'vue-router'

// Views

import Vuestagram from './views/Vuestagram.vue'
import Users from './views/Users.vue'
import Blog from './views/Blog.vue'
import Currency from './views/Currency.vue'
import About from './views/About.vue'
import Qrcode from './views/Qrcode.vue'

// Components
// users Components
const Login = () => import('./components/users/login.vue')
const newAccount = () => import('./components/users/newAccount.vue')
const userProfile = () => import('./components/users/profile.vue')
const userProfileEdit = () => import('./components/users/edit.vue')
const userDelete = () => import('./components/users/delete.vue')
const findIdPassword = () => import('./components/users/findidpassword.vue')
// blog Components
const newArticle = () => import('./components/blog/newArticle.vue')
const singleArticle = () => import('./components/blog/singleArticle.vue')
const categoryView = () => import('./components/blog/categoryView.vue')
const editArticle = () => import('./components/blog/editArticle.vue')
const editCategory = () => import('./components/blog/editCategory.vue')
const notFound = () => import('./components/notFound.vue')
const home = () => import('./components/blog/home.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/blog/home',
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/vuestagram',
      name: 'Vuestagram',
      component: Vuestagram,
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login,
        },
        {
          path: 'newaccount',
          name: 'newAccount',
          component: newAccount,
        },
        {
          path: 'profile/:username',
          name: 'User Profile',
          component: userProfile,
          props: true,
        },
        {
          path: 'edit/:username',
          name: 'User Profile Edit',
          component: userProfileEdit,
          props: true,
        },
        {
          path: 'delete/:username',
          name: 'User Delete',
          component: userDelete,
          props: true,
        },
        {
          path: 'findIdPassword',
          name: 'find ID or Password',
          component: findIdPassword,
        },
      ],
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
      children: [
        {
          path: 'home',
          name: 'home',
          component: home,
        },
        {
          path: 'newarticle',
          name: 'editor',
          component: newArticle,
        },
        {
          path: 'category/:tab/:menu/:submenu/:articleId',
          name: 'article',
          component: singleArticle,
          props: true,
        },
        {
          path: 'category/:tab/:menu/:submenu',
          name: 'submenu',
          component: categoryView,
          props: true,
        },
        {
          path: 'category/:tab/:menu',
          name: 'menu',
          component: categoryView,
          props: true,
        },
        {
          path: 'category/:tab',
          name: 'tab',
          component: categoryView,
          props: true,
        },
        {
          path: 'edit/:articleId',
          name: 'eaitArticle',
          component: editArticle,
          props: true,
        },
        {
          path: 'editcategory',
          name: 'editCategory',
          component: editCategory,
        },
      ],
    },
    {
      path: '/currency',
      name: 'Currency',
      component: Currency,
    },
    {
      path: '/qrcode',
      name: 'Qrcode',
      component: Qrcode,
    },
    { path: '/404', component: notFound },
    { path: '*', redirect: '/404' },
  ],
})
