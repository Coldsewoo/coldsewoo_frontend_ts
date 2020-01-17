import axios from 'axios'
import router from '@/router.js'
import { API_URL } from 'Library/globalVar'
import UserService from 'Services/user'

const userStore = {
  namespaced: true,
  state: {
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
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
      state.loginStatus = payload
    },
    newAccountFailed(state, payload) {
      state.newAccountStatus.success = false
      state.newAccountStatus.message = payload
    },
    deleteAccountFailed(state, payload) {
      state.deleteAccountStatus.status = payload
    },
    resetPasswordSubmit(state, payload) {
      state.resetPasswordStauts.status = payload.status
      state.resetPasswordStauts.message = payload.message
    },
  },
  actions: {
    async newAccountSubmit(context, payload) {
      try {
        const res = await UserService.newAccountSubmit(payload)
        if (res.status === 200) {
          context.dispatch('logout')
          router.push('/users/login')
        }
        return new Promise((r, j) => r())
      } catch (err) {
        // context.commit('addError', err.message, { root: true })
        return new Promise((r, j) => j(err))
      }
    },
    async login(context, payload) {
      try {
        const res = await UserService.login(payload)
        if (res.status === 200) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('username', res.data.username)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          localStorage.setItem('expiresIn', res.data.expiresIn)
          localStorage.setItem('role', res.data.role)

          context.commit('saveToken', res.data, { root: true })
          context.commit('postStore/goHome', null, { root: true })
          return new Promise((resolve, reject) => resolve(true))
        }
      } catch (err) {
        // context.commit('addError', err.message, { root: true })
        return new Promise((r, j) => j(err))
      }
    },
    logout(context) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expiresIn')
      localStorage.removeItem('role')
      context.commit('logout', null, { root: true })
      router.replace('/users/login').catch((err) => {})
    },
    async editAccount(context, payload) {
      try {
        const res = await UserService.editAccount(payload)
        if (res.status === 200) {
          context.dispatch('logout')
          router.replace('/users/login')
        } else {
          for (const item in res.data.errors) {
            context.commit('addError', res.data.errors[item].message, { root: true })
          }
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteAccount(context, payload) {
      try {
        const deleteRes = await UserService.deleteAccount(payload)
        if (deleteRes.status === 200) {
          context.dispatch('logout')
          router.push('/')
        } else {
          context.commit('addError', deleteRes.data.message, { root: true })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async resetPasswordSubmit(context, payload) {
      try {
        const usernameRes = await UserService.resetPasswordSubmit(payload)
        if (usernameRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve(usernameRes.data.email)
          })
        }
        context.commit('addError', usernameRes.data.message, { root: true })
        return new Promise((resolve, reject) => resolve(false))
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async resetPasswordCodeSubmit(context, payload) {
      try {
        const codeRes = await UserService.resetPasswordCodeSubmit(payload)
        if (codeRes.status === 200) {
          return new Promise((resolve, reject) => resolve(true))
        }
        context.commit('addError', codeRes.data.message, { root: true })
        return new Promise((resolve, reject) => resolve(false))
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async saveNewPassword(context, payload) {
      try {
        const saveRes = await UserService.saveNewPassword(payload)
        if (saveRes.status === 200) {
          return new Promise((resolve, reject) => resolve(true))
        }
        context.commit('addError', saveRes.data.message, { root: true })
        return new Promise((resolve, reject) => resolve(false))
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    plsLogin(context) {
      router.push('/users/login')
    },
  },
}

export default userStore
