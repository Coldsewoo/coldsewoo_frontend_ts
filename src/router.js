import Vue from 'vue';
import Router from 'vue-router';

// Views
import Home from './views/Home.vue';
import Vuestagram from './views/Vuestagram.vue';
import Users from './views/Users.vue';
import Blog from './views/Blog.vue';
import Currency from './views/Currency.vue';
import About from './views/About.vue';

// Components
// users Components
import Login from './components/users/login.vue';
import newAccount from './components/users/newAccount.vue';
import userProfile from './components/users/profile.vue';
import userProfileEdit from './components/users/edit.vue';
import userDelete from './components/users/delete.vue';
import findIdPassword from './components/users/findidpassword.vue';
// blog Components
import newArticle from './components/blog/newArticle.vue';
import article from './components/blog/article.vue';
import categoryView from './components/blog/categoryView.vue';
import editArticle from './components/blog/editArticle.vue';
import editCategory from './components/blog/editCategory.vue';
import notFound from './components/notFound.vue';
import home from './components/blog/home.vue';

// Libraries
import interceptor from './lib/interceptor.js';

interceptor();
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
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
          path: 'category/Main/:articleId',
          name: 'mainArticle',
          component: article,
          props: true,
        },
        {
          path: 'category/:tab/:menu/:submenu/:articleId',
          name: 'article',
          component: article,
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
    { path: '/404', component: notFound },
    { path: '*', redirect: '/404' },
  ],
});
