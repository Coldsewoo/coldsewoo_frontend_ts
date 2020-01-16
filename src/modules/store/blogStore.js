import axios from 'axios'
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import router from '@/router.js'
import { API_URL } from 'Library/globalVar'
import BlogService from 'Services/blog'

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
        const result = await BlogService()
        context.commit('getPosts', result)
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async saveArticle(context, payload) {
      try {
        const result = await BlogService.saveArticle(payload)
        if (result.status === 200) {
          const cloudinaryRenameRes = await BlogService.cloudinaryRename(result.data.articleId, payload.images)
          const blogContentImageRenameRes = await BlogService.blogContentImageRename(result.data.articleId)
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
        const res = await BlogService.getSingleArticle(articleId)
        context.commit('setCurrentArticle', res.data)
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getCategories(context) {
      try {
        const res = await BlogService.getCategories()
        if (res.status === 200) {
          context.commit('saveCategories', res.data)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async selectMenuItem(context, payload) {
      try {
        const res = await BlogService.selectMenuItem({ path: payload })
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
        const deleteArticleRes = await BlogService.deleteArticle(articleId)
        const deleteImgsRes = await BlogService.deleteImgs(articleId)
        if (deleteArticleRes.status === 200 && deleteImgsRes.status === 200) {
          router.push(`/blog/category/${payload.categories.path}`)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async saveCategoryChanged(context, payload) {
      try {
        const res = await BlogService.saveCategoryChanged(payload)
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
        const imgRes = await BlogService.onImageSelected(formData)
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
        const imgRes = await BlogService.deleteImage({ imagepId: payload })
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
        const commentsRes = await BlogService.getComments(articleId)
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
          deleteCommentRes = await BlogService.deleteComment(articleId, commentId)
        } else {
          const { password } = payload
          deleteCommentRes = await BlogService.deleteCommentPassword(articleId, commentId, { password })
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
          editCommentRes = await BlogService.editCommentPassword(articleId, commentId, { comment, password })
        } else {
          editCommentRes = await BlogService.editComment(articleId, commentId, { comment })
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
        const addReplyRes = await BlogService.addReply(articleId, commentId, payload)
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
          deleteReplyRes = await BlogService.deleteReplyRes(articleId, commentId, replyId)
        } else {
          const { password } = payload
          deleteReplyRes = await BlogService.deleteReplyResPassword(articleId, commentId, replyId, { password })
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
