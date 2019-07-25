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
    errorAlert: {
      status: false,
      message: null,
    },
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
    },
    tooManyRequests(state, payload) {
      state.tooManyRequests = payload;
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
