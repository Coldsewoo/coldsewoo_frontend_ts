import axios from 'axios'
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import router from '@/router.js'
import { API_URL } from '@/lib/globalVar'

const blogStore = {
  namespaced: true,
  state: {
    posts: [],
    categories: {},
    selectedPosts: [],
    selectedCategory: 'Main',
    latestImageURL: {},
    currentArticle: {},
    comments: [],
  },
  getters: {
    categoriesList(state) {
      const item = state.categories
      const returnArr = []
      for (const key in item) {
        const children = []
        const innerObj = {
          id: key,
          label: key,
          name: key,
        }
        for (const keya in item[key]) {
          if (keya === 'order') continue
          const children2 = []
          const innerObj2 = {
            id: `${key}/${keya}`,
            label: keya,
            name: keya,
          }
          for (const keyb of item[key][keya]) {
            const innerObj3 = {
              id: `${key}/${keya}/${keyb}`,
              label: keyb,
              name: keyb,
              isDisabled: true,
            }
            children2.push(innerObj3)
          }
          innerObj2.children = children2
          children.push(innerObj2)
        }
        innerObj.children = children
        returnArr.push(innerObj)
      }
      return returnArr
    },
    categoryListForArticle(state) {
      const item = state.categories
      const returnArr = []
      for (const key in item) {
        const children = []
        const innerObj = {
          id: key,
          label: key,
          name: key,
        }
        for (const keya in item[key]) {
          if (keya === 'order') continue
          const children2 = []
          const innerObj2 = {
            id: `${key}/${keya}`,
            label: keya,
            name: keya,
          }
          for (const keyb of item[key][keya]) {
            const innerObj3 = {
              id: `${key}/${keya}/${keyb}`,
              label: keyb,
              name: keyb,
            }
            children2.push(innerObj3)
          }
          innerObj2.children = children2
          children.push(innerObj2)
        }
        innerObj.children = children
        returnArr.push(innerObj)
      }
      return returnArr
    },
    orderedCategories(state) {
      const categories = state.categories
      const duplicate = {}
      for (const item in categories) {
        // item : coldsewooweb
        duplicate[item] = {}
        for (const item2 in categories[item]) {
          if (item2 === 'order') continue
          duplicate[item][item2] = categories[item][item2]
        }
      }
      return duplicate
    },
  },
  mutations: {
    getPosts(state, payload) {
      state.posts = payload.data
    },
    saveCategories(state, payload) {
      state.categories = payload
    },
    selectMenuItem(state, payload) {
      state.selectedPosts = payload.data
      state.selectedCategory = payload.selected
      router.push('/blog/categoryview')
    },
    onImageSelected(state, payload) {
      state.latestImageURL = payload
    },
    setCurrentArticle(state, payload) {
      if (payload === 'reset') Vue.set(state, 'currentArticle', {})
      else {
        Vue.set(state, 'currentArticle', payload)
        state.currentArticle.images = payload.images ? payload.images : []
      }
    },
    setComments(state, payload) {
      Vue.set(state, 'comments', payload)
    },
  },
  actions: {
    async getPosts(context) {
      try {
        const result = await axios({
          url: `${API_URL}/blog`,
          method: 'GET',
        })
        context.commit('getPosts', result)
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async saveArticle(context, payload) {
      try {
        const result = await axios({
          url: `${API_URL}/blog`,
          method: 'POST',
          data: payload,
          headers: {
            'Content-type': 'application/json',
            'x-access-token': context.rootState.token.token,
          },
        })
        if (result.status === 200) {
          const cloudinaryRenameRes = await axios({
            url: `${API_URL}/images/blog/${result.data.articleId}`,
            method: 'PUT',
            data: payload.images,
            headers: {
              'Content-type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
          })
          const blogContentImageRenameRes = await axios({
            url: `${API_URL}/blog/rename/${result.data.articleId}`,
            method: 'PUT',
            headers: {
              'x-access-token': context.rootState.token.token,
            },
          })
          if (cloudinaryRenameRes.status === 200 && blogContentImageRenameRes.status === 200) {
            return new Promise((resolve, reject) => {
              resolve(result)
            })
          }
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getSingleArticle(context, payload) {
      const articleId = payload
      try {
        const res = await axios({
          url: `${API_URL}/blog/articles/${articleId}`,
          method: 'GET',
        })
        context.commit('setCurrentArticle', res.data)
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getCategories(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/blog/categories`,
          method: 'GET',
        })
        if (res.status === 200) {
          context.commit('saveCategories', res.data)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async selectMenuItem(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/blog/categories`,
          method: 'POST',
          data: { path: payload },
        })
        if (res.status === 200) {
          context.commit('selectMenuItem', {
            data: res.data,
            selected: payload,
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteArticle(context, payload) {
      try {
        const articleId = payload.articleId
        const blogRes = await axios({
          url: `${API_URL}/blog/articles/${articleId}`,
          method: 'DELETE',
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        })
        const imgRes = await axios({
          url: `${API_URL}/images/blog/${articleId}`,
          method: 'DELETE',
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        })
        if (blogRes.status === 200 && imgRes.status === 200) {
          router.push(`/blog/category/${payload.categories.path}`)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async saveCategoryChanged(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/blog/categories`,
          method: 'PUT',
          headers: {
            'x-access-token': context.rootState.token.token,
            'Content-type': 'application/json',
          },
          data: payload,
        })
        if (res.status === 200) {
          context.dispatch('getCategories').then(() => {
            router.push('/blog/home')
          })
        }
      } catch (err) {
        // do nothing
      }
    },
    async onImageSelected(context, payload) {
      const formData = new FormData()
      formData.append('image', payload)
      try {
        const imgRes = await axios({
          url: `${API_URL}/images/blog`,
          method: 'POST',
          headers: {
            'Content-type': 'application/form-data',
            'x-access-token': context.rootState.token.token,
          },
          data: formData,
        })
        if (imgRes.status === 200) {
          return new Promise((resolve, reject) => {
            context.commit('onImageSelected', imgRes.data)
            setTimeout(() => {
              resolve(imgRes.data)
            }, 0)
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteImage(context, payload) {
      try {
        const imgRes = await axios({
          url: `${API_URL}/images`,
          method: 'DELETE',
          params: { imagepId: payload },
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        })
        if (imgRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getComments(context, payload) {
      try {
        const articleId = payload
        const commentsRes = await axios({
          url: `${API_URL}/blog/comments/${articleId}`,
          method: 'GET',
        })
        if (commentsRes.status === 200) {
          context.commit('setComments', commentsRes.data)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async addComment(context, payload) {
      try {
        const articleId = payload.articleId
        let addCommentRes
        if (payload.anonymous) {
          addCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}`,
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            data: payload,
          })
        } else {
          addCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}`,
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
            data: payload,
          })
        }
        if (addCommentRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteComment(context, payload) {
      try {
        const { articleId, commentId, anonymous, hasPermission } = payload
        let deleteCommentRes
        if (!anonymous || hasPermission) {
          deleteCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'DELETE',
            headers: {
              'x-access-token': context.rootState.token.token,
            },
          })
        } else {
          const { password } = payload
          deleteCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'DELETE',
            data: { password },
          })
        }

        if (deleteCommentRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
      } catch (err) {
        return new Promise((resolve, reject) => {
          if (err.type === 'NoAuthorizationError') {
            context.commit('addError', '비밀번호가 일치하지 않습니다.', { root: true })
          } else context.commit('addError', err.message, { root: true })
          reject()
        })
      }
    },
    async editComment(context, payload) {
      try {
        const { articleId, commentId, comment, anonymous } = payload
        let editCommentRes
        if (anonymous) {
          const { password } = payload
          editCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
            },
            data: { comment, password },
          })
        } else {
          editCommentRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
            data: { comment },
          })
        }
        return new Promise((resolve, reject) => {
          if (editCommentRes.status === 200) resolve()
        })
      } catch (err) {
        return new Promise((resolve, reject) => {
          if (err.type === 'NoAuthorizationError') {
            context.commit('addError', '비밀번호가 일치하지 않습니다.', { root: true })
          } else context.commit('addError', err.message, { root: true })
          reject()
        })
      }
    },
    async addReply(context, payload) {
      try {
        const { articleId, commentId } = payload
        let addReplyRes;
        if (payload.anonymous) {
          addReplyRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            data: payload,
          })
        } else {
          addReplyRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}`,
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
            data: payload,
          })
        }

        if (addReplyRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteReply(context, payload) {
      try {
        const { articleId, commentId, replyId, anonymous, hasPermission } = payload
        let deleteReplyRes
        if (!anonymous || hasPermission) {
          deleteReplyRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}/${replyId}`,
            method: 'DELETE',
            headers: {
              'x-access-token': context.rootState.token.token,
            },
          })
        } else {
          const { password } = payload
          deleteReplyRes = await axios({
            url: `${API_URL}/blog/comments/${articleId}/${commentId}/${replyId}`,
            method: 'DELETE',
            data: { password },
          })
        }

        if (deleteReplyRes.status === 200) {
          return new Promise((resolve, reject) => {
            resolve()
          })
        }
      } catch (err) {
        return new Promise((resolve, reject) => {
          if (err.type === 'NoAuthorizationError') {
            context.commit('addError', '비밀번호가 일치하지 않습니다.', { root: true })
          } else context.commit('addError', err.message, { root: true })
          reject()
        })
      }
    },
  },
}

export default blogStore
