import axios from 'axios'
import API_URL from '@/lib/globalVar.js';
import store from '../store.js'

export default function setup() {
  axios.interceptors.request.use(
    (config) => {
      const token = store.state.token.token
      if (!store.state.tooManyRequests) {
        if (token) {
          config.headers['x-access-token'] = token
        }
        return config
      }
      store.dispatch('tooManyRequestsAlert')
    },
    (err) => {
      return Promise.reject(err)
    },
  )

  axios.interceptors.response.use(
    async (res) => {
      if (res.data.success) return res
      else if (res.data.errors && res.data.errors.TokenExpiredError) {
        const refreshData = await axios({
          url: `${API_URL}/auth/refresh`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
          },
          data: store.state.token,
        })
        localStorage.setItem('token', refreshData.data.data.token)
        store.commit('saveToken', refreshData.data)
        res.config.headers['x-access-token'] = refreshData.data.data.token
        await axios.request(res.config)
      } else if (res.data.message === 'refreshTokenExpired') {
        store.dispatch('userStore/logout')
      } else if (res.data.message === 'TooManyRequests') {
        store.dispatch('tooManyRequestsAlert', true)
      } else if (res.data.message === 'newAccountError') {
        return res
      } else {
        console.log('interceptors successFalse data ----')
        console.log(res.data)
        console.log('interceptors successFalse data ----')
        return res
      }
    },
    (error) => {
      console.log('interceptors error data ----')
      console.log(error)
      console.log('interceptors error data ----')
    },
  )
}