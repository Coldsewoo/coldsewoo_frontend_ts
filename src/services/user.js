import client from './client'

const { req, apiClient } = client;

export default {
  login(payload) {
    return req(apiClient.post('auth/login', {
      username: payload.username,
      password: payload.password,
    }))
  },
  newAccountSubmit(payload) {
    return req(apiClient.post('auth/register', payload))
  },
  editAccount(payload) {
    return req(apiClient.put(`users/${payload.username}`, payload))
  },
  deleteAccount(payload) {
    return req(apiClient.delete(`users/${payload._id}`))
  },
  resetPasswordSubmit(username) {
    return req(apiClient.post('users/reset', { username }))
  },
  resetPasswordCodeSubmit(code) {
    return req(apiClient.post('users/resetcode', { code }))
  },
  saveNewPassword(payload) {
    return req(apiClient.post('users/resetpassword', payload))
  },
}
