import client from './client'

const { req, apiClient } = client;

export default {
  getPosts() {
    return req(apiClient.get('blog'))
  },
  saveArticle(payload) {
    return req(apiClient.post('blog', payload))
  },
  cloudinaryRename(articleId, images) {
    return req(apiClient.put(`images/blog/${articleId}`, images))
  },
  blogContentImageRename(articleId) {
    return req(apiClient.put(`blog/rename/${articleId}`))
  },
  getSingleArticle(articleId) {
    return req(apiClient.get(`blog/articles/${articleId}`))
  },
  getCategories() {
    return req(apiClient.get('blog/categories'))
  },
  selectMenuItem(path) {
    return req(apiClient.post('blog/categories', path))
  },
  deleteArticle(articleId) {
    return req(apiClient.delete(`blog/articles/${articleId}`))
  },
  deleteImgs(articleId) {
    return req(apiClient.delete(`images/blog/${articleId}`))
  },
  saveCategoryChanged(payload) {
    return req(apiClient.put('blog/categories', payload))
  },
  onImageSelected(formData) {
    return req(apiClient.post('images/blog', formData))
  },
  deleteImage(imagepId) {
    return req(apiClient.delete('images', { params: imagepId }))
  },
  getComments(articleId) {
    return req(apiClient.get(`blog/comments/${articleId}`))
  },
  addComment(articleId, payload) {
    return req(apiClient.post(`blog/comments/${articleId}`, payload))
  },
  deleteComment(articleId, commentId) {
    return req(apiClient.delete(`blog/comments/${articleId}/${commentId}`))
  },
  deleteCommentPassword(articleId, commentId, password) {
    return req(apiClient.delete(`blog/comments/${articleId}/${commentId}`, { data: password }))
  },
  editComment(articleId, commentId, comment) {
    return req(apiClient.put(`blog/comments/${articleId}/${commentId}`, comment))
  },
  editCommentPassword(articleId, commentId, { comment, password }) {
    return req(apiClient.put(`blog/comments/${articleId}/${commentId}`, { comment, password }))
  },
  addReply(articleId, commentId, payload) {
    return req(apiClient.post(`blog/comments/${articleId}/${commentId}`, payload))
  },
  deleteReplyRes(articleId, commentId, replyId) {
    return req(apiClient.delete(`blog/comments/${articleId}/${commentId}/${replyId}`))
  },
  deleteReplyResPassword(articleId, commentId, replyId, password) {
    return req(apiClient.delete(`blog/comments/${articleId}/${commentId}/${replyId}`, { data: password }))
  },
}
