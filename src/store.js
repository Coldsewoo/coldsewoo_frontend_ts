import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { API_URL } from 'Library/globalVar'
import userStore from 'Store/userStore'
// import blogStore from './modules/store/blogStore';
import postStore from 'Store/postStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: {
      token: '',
      username: '',
      refreshToken: '',
      expiresIn: '',
      role: '',
    },
    isLoggedIn: !!localStorage.getItem('token'),
    user: {},
    errorsList: [],
    role: 0,
  },
  getters: {},
  mutations: {
    saveToken(state, payload) {
      state.token = payload
      state.isLoggedIn = true
    },
    getToken(state) {
      state.token = {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        refreshToken: localStorage.getItem('refreshToken'),
        expiresIn: localStorage.getItem('expiresIn'),
        role: localStorage.getItem('role'),
      }
      if (!localStorage.getItem('token')) state.token.token = null
    },
    logout(state) {
      state.token = {
        username: '',
        token: '',
        refreshToken: '',
        expiresIn: '',
      }
      state.isLoggedIn = false
      state.user = {}
      state.role = 0
    },
    getUser(state, payload) {
      state.user = payload
      const roleArr = ['User', 'Admin', 'Owner']
      state.role = roleArr.indexOf(payload.role)
    },
    errorChecked(state, payload) {
      const index = payload
      state.errorsList.splice(index, 1)
    },
    addError(state, payload) {
      const error = {
        message: payload,
        type: 'error',
      }
      state.errorsList.push(error)
    },
    resetErrors(state, payload) {
      state.errorsList = []
    },
  },
  actions: {
    async getUser(context, username) {
      try {
        if (!username) {
          const username = context.state.token.username
          const user = await axios({
            url: `${API_URL}/users/${username}`,
            method: 'GET',
          })
          context.commit('getUser', user.data)
        } else {
          const user = await axios({
            url: `${API_URL}/users/${username}`,
            method: 'GET',
          })
          return user.data
        }
      } catch (err) {
        context.dispatch('userStore/logout')
      }
    },
  },
  modules: {
    userStore,
    postStore,
  },
})
