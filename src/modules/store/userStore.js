import axios from 'axios';
import router from '@/router.js';
import API_URL from '@/lib/globalVar';

const userStore = {
  namespaced: true,
  state: {
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
    },
    loginStatus: {
      data: null,
      errors: null,
      message: '',
      success: true,
    },
    newAccountStatus: {
      success: true,
      message: [],
    },
    deleteAccountStatus: {
      status: true,
      message: [],
    },
    resetPasswordStauts: {
      status: true,
      message: null,
    },
  },
  getters: {
    // newAccountResultGetters: function(state) {
    //   let errors = [];
    //   for (const error in state.newAccountResult.errors) {
    //     errors.push(error);
    //   }
    //   return errors;
    // }
  },
  mutations: {
    loginFailed(state, payload) {
      state.loginStatus = payload;
    },
    newAccountFailed(state, payload) {
      state.newAccountStatus.success = false;
      state.newAccountStatus.message = payload;
    },
    deleteAccountFailed(state, payload) {
      state.deleteAccountStatus.status = payload;
    },
    resetPasswordSubmit(state, payload) {
      state.resetPasswordStauts.status = payload.status;
      state.resetPasswordStauts.message = payload.message;
    },
  },
  actions: {
    async newAccountSubmit(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/users`,
          method: 'POST',
          data: payload,
        });
        if (res.data.success) {
          context.dispatch('logout');
          router.push('/users/login');
        } else {
          const message = [];
          for (const item in res.data.errors) {
            message.push(res.data.errors[item].message);
          }
          context.commit('newAccountFailed', message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async login(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/auth/login`,
          method: 'POST',
          data: {
            username: payload.username,
            password: payload.password,
          },
        });
        if (res.data.success) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('username', res.data.data.username);
          localStorage.setItem('refreshToken', res.data.data.refreshToken);
          localStorage.setItem('expiresIn', res.data.data.expiresIn);
          context.commit('saveToken', res.data, { root: true });
          context.commit('postStore/goHome', null, { root: true });
          return new Promise((resolve, reject) => resolve());
        }
        context.commit('loginFailed', res.data);
        return new Promise((resolve, reject) => resolve());
      } catch (err) {
        console.log(err);
      }
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
      context.commit('logout', null, { root: true });
      router.replace('/users/login');
    },
    async editAccount(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/users/${payload.username}`,
          method: 'PUT',
          data: payload,
        });
        if (res.data.success) {
          context.dispatch('logout');
          router.replace('/users/login');
        } else {
          console.log('error?');
          const message = [];
          for (const item in res.data.errors) {
            message.push(res.data.errors[item].message);
          }
          context.commit('newAccountFailed', message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteAccount(context, payload) {
      const deleteRes = await axios({
        url: `${API_URL}/users/${payload._id}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': context.rootState.token.token,
        },
      });
      if (deleteRes.data.success) {
        context.commit('deleteAccountFailed', true);
        context.dispatch('logout');
        router.push('/');
      } else {
        context.commit('deleteAccountFailed', false);
      }
    },
    async resetPasswordSubmit(context, payload) {
      try {
        const usernameRes = await axios({
          url: `${API_URL}/users/reset`,
          method: 'POST',
          data: { username: payload },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (usernameRes.data.success) {
          context.commit('resetPasswordSubmit', {
            status: true,
            message: null,
          });
          return new Promise((resolve, reject) => {
            resolve(usernameRes.data.data.email);
          });
        }
        context.commit('resetPasswordSubmit', {
          status: false,
          message: usernameRes.data.message,
        });
      } catch (err) {
        console.log(err);
      }
    },
    async resetPasswordCodeSubmit(context, payload) {
      try {
        const codeRes = await axios({
          url: `${API_URL}/users/resetcode`,
          method: 'POST',
          data: { code: payload },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (codeRes.data.success) {
          context.commit('resetPasswordSubmit', {
            status: true,
            message: null,
          });
          return new Promise((resolve, reject) => resolve());
        }
        context.commit('resetPasswordSubmit', {
          status: false,
          message: codeRes.data.message,
        });
      } catch (err) {
        console.log(err);
      }
    },
    async saveNewPassword(context, payload) {
      try {
        const saveRes = await axios({
          url: `${API_URL}/users/resetpassword`,
          method: 'POST',
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (saveRes.data.success) {
          context.commit('resetPasswordSubmit', {
            status: true,
            message: null,
          });
          return new Promise((resolve, reject) => resolve());
        }
        context.commit('resetPasswordSubmit', {
          status: false,
          message: saveRes.data.message,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export default userStore;
