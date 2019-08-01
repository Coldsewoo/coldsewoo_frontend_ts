import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_URL } from '@/lib/globalVar';
import postStore from './modules/store/postStore';
import userStore from './modules/store/userStore';
import blogStore from './modules/store/blogStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      refreshToken: localStorage.getItem('refreshToken'),
      expiresIn: localStorage.getItem('expiresIn'),
      role: localStorage.getItem('role'),
    },
    isLoggedIn: !!localStorage.getItem('token'),
    user: {},
    errorsList: [],
    role: 0,
  },
  getters: {},
  mutations: {
    saveToken(state, payload) {
      state.token = payload.data;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.token = {
        username: '',
        token: '',
        refreshToken: '',
        expiresIn: '',
      };
      state.isLoggedIn = false;
      state.user = {};
    },
    getUser(state, payload) {
      state.user = payload.data;
      const roleArr = ['User', 'Admin', 'Owner'];
      state.role = roleArr.indexOf(payload.data.role)
    },
    tooManyRequests(state, payload) {
      state.tooManyRequests = payload;
    },
    errorChecked(state, payload) {
      const index = payload;
      state.errorsList.splice(index, 1);
    },
    addError(state, payload) {
      const error = {
        message: payload,
        type: 'error',
      }
      state.errorsList.push(error)
    },
    resetErrors(state, payload) {
      state.errorsList = [];
    },
  },
  actions: {
    async getUser(context, username) {
      try {
        if (!username) {
          const username = context.state.token.username;
          const user = await axios({
            url: `${API_URL}/users/${username}`,
            method: 'GET',
          });
          context.commit('getUser', user.data);
        } else {
          const user = await axios({
            url: `${API_URL}/users/${username}`,
            method: 'GET',
          });
          return user.data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    tooManyRequestsAlert(context, payload) {
      context.commit('tooManyRequests', payload);
    },
  },
  modules: {
    postStore,
    userStore,
    blogStore,
  },
});
