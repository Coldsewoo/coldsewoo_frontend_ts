import axios from 'axios'
import { API_URL } from '@/lib/globalVar.js'
import store from '../store.js'

export default function setup() {
  axios.interceptors.request.use(
    (config) => {
      const tokenHeaders = config.headers['x-access-token']
      if (!store.state.tooManyRequests) {
        if (tokenHeaders === 'null') {
          store.dispatch('userStore/plsLogin')
        }
        return config
      }
      store.dispatch('addError', 'tooManyRequestsAlert')
    },
    (err) => {
      return Promise.reject(err)
    },
  )

  axios.interceptors.response.use(
    res => res,
    async (error) => {
      const type = error.response.data.type
      if (type === 'AccessTokenExpiredError') {
        const refreshData = await axios({
          url: `${API_URL}/auth/refresh`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          data: store.state.token,
        })
        localStorage.setItem('token', refreshData.data.token)
        localStorage.setItem('expiresIn', refreshData.data.expiresIn)
        store.commit('saveToken', refreshData.data)
        return new Promise((resolve, reject) => {
          error.config.headers['x-access-token'] = refreshData.data.token
          axios
            .request(error.config)
            .then((response) => {
              resolve(response)
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
      }
      switch (type) {
        case 'InvalidTokenError':
          store.dispatch('userStore/logout')
          break
        case 'RefreshTokenExpiredError':
          store.dispatch('userStore/logout')
          break
        case 'ValidationError':
          return Promise.reject(error.response.data)
        case 'ExceptionLogger':
          return Promise.reject(error.response.data)
        default:
          return Promise.reject(error.response.data)
      }
    },
  )
}
