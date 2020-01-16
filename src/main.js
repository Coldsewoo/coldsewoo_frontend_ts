import 'vuetify/dist/vuetify.min.css'
import 'es6-promise/auto'
import 'moment/locale/ko'
import interceptor from 'Library/interceptor.js';
import moment from 'moment-timezone'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueMeta from 'vue-meta'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// dev Vue Console
Vue.config.devtools = process.env.NODE_ENV === 'development';

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
})

Vue.use(require('vue-moment'), { moment })


Vue.use(Vuetify, {
  iconfont: 'md',
});

interceptor();


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
