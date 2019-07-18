import 'vuetify/dist/vuetify.min.css'
import 'es6-promise/auto'
import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

Vue.prototype.$axios = axios

Vue.config.productionTip = false
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
