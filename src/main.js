import 'vuetify/dist/vuetify.min.css'
import 'es6-promise/auto'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from './store'


Vue.config.productionTip = false

// dev Vue Console
Vue.config.devtools = process.env.NODE_ENV === 'development';

Vue.use(Vuetify, {
  iconfont: 'md',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
