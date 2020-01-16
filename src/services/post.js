import client from './client'

const { req, apiClient } = client;

export default {
  getPosts() {
    return req(apiClient.get('posts'))
  },
  getSinglePost(payload) {
    return req(apiClient.get(`posts/${payload}`))
  },
  publish(payload) {
    return req(apiClient.post('posts', payload, { validateStatus: status => true }))
  },
  deletePostImg(imagepId) {
    return req(apiClient.delete('images', { params: imagepId }))
  },
  deletePost(postId) {
    return req(apiClient.delete(`posts/${postId}`))
  },
  editPage(postId) {
    return req(apiClient.get(`posts/${postId}`))
  },
  editRes(postId, data) {
    return req(apiClient.put(`posts/${postId}`, data))
  },
  imgUpload(data) {
    return req(apiClient.post('images', data))
  },
  editLike(postId, post) {
    return req(apiClient.put(`posts/${postId}`, post))
  },
  addComment(payload) {
    return req(apiClient.post('posts/comments', payload))
  },
  deleteComment(commentId, post_id) {
    return req(apiClient.delete(`posts/comments/${commentId}`, { data: post_id }))
  },
}
