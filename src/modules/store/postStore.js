import axios from 'axios'
import { API_URL } from 'Library/globalVar'
import PostService from 'Services/post'

const postStore = {
  namespaced: true,
  state: {
    filters: [
      'normal',
      'clarendon',
      'gingham',
      'moon',
      'lark',
      'reyes',
      'juno',
      'slumber',
      'aden',
      'perpetua',
      'mayfair',
      'rise',
      'hudson',
      'valencia',
      'xpro2',
      'willow',
      'lofi',
      'inkwell',
      'nashville',
    ],
    posts: [],
    step: 1,
    localImageURL: null,
    itemSelector: {
      filter: '',
      selected: false,
    },
    updateStatus: {
      status: 'false',
      message: '',
      item: '',
    },
    currentPost: {},
    maxPost: 8,
  },
  getters: {
    reversedPosts(state) {
      if (state.posts.length > 0) {
        return state.posts.slice().reverse()
      }
      return []
    },
    filteredPosts(state) {
      if (state.posts.length > 0 && state.itemSelector.selected) {
        return state.posts
          .filter((e) => {
            const filter = state.itemSelector.filter
            const item = state.itemSelector.key
            return e[filter].includes(item)
          })
          .reverse()
      }
      return []
    },
  },
  mutations: {
    getPosts(state, posts) {
      state.posts = posts
    },
    onImageSelected(state, payload) {
      state.localImageURL = payload.localImageURL
      state.step = payload.step
    },
    goHome(state) {
      state.step = 1
      state.localImageURL = null
      state.hashSelector = {
        item: '',
        selected: false,
      }
      state.updateStatus = {
        status: 'false',
        item: '',
        message: '',
      }
    },
    resetMaxPost(state) {
      state.maxPost = 8
    },
    changeStep(state, stepNum) {
      state.step = stepNum
      if (stepNum === 1) {
        state.localImageURL = null
        state.hashSelector = {
          item: '',
          selected: false,
        }
        state.updateStatus = {
          status: 'false',
          item: '',
          message: '',
        }
      }
    },
    findByItem(state, payload) {
      const key = Object.keys(payload)[0]
      state.itemSelector = {
        filter: key,
        key: payload[key],
        selected: true,
      }
    },
    editPage(state, post) {
      state.currentPost = post
    },
    publishStart(state, payload) {
      state.updateStatus.status = 'pending'
      state.updateStatus.item = payload
    },
    pending(state, payload) {
      state.updateStatus.status = payload
    },
    maxPost(state) {
      state.maxPost += 5
    },
  },
  actions: {
    async getPosts(context) {
      try {
        const res = await PostService.getPosts()
        if (res.status === 200) {
          context.commit('getPosts', res.data)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getSinglePost(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/posts/${payload}`,
          method: 'GET',
        })
        if (res.status === 200) {
          return res.data
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    onImageSelected(context, payload) {
      const file = payload.item.files
      const position = payload.position
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = (e) => {
        const payload = {
          localImageURL: e.target.result,
          step: position,
        }
        context.commit('onImageSelected', payload)
      }
    },
    async publish(context, payload) {
      try {
        const formData = new FormData()
        formData.append('image', context.state.localImageURL)
        const imgRes = await axios({
          url: `${API_URL}/images`,
          method: 'POST',
          headers: {
            'Content-type': 'application/form-data',
            'x-access-token': context.rootState.token.token,
          },
          data: formData,
        })
        payload.imageURL = imgRes.data.image
        payload.imagepId = imgRes.data.pId
        payload.thumbnail = imgRes.data.thumbnail
        const postRes = await PostService.publish(payload)
        if (postRes.status === 200) context.state.updateStatus.status = 'success'
        context.commit('goHome')
      } catch (err) {
        context.commit('addError', err.message, { root: true })
        context.commit('goHome')
      }
    },
    async deletePost(context, payload) {
      context.commit('changeStep', 4)
      try {
        const imgRes = await PostService.deletePostImg({ imagepId: payload.imagepId })
        if (imgRes.status === 200) {
          const postRes = await PostService.deletePost(payload._id)
          if (postRes.status === 200) {
            context.commit('goHome')
          }
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async editPage(context, payload) {
      try {
        const findPost = await PostService.editPage(payload._id)
        if (findPost.status === 200) {
          context.commit('editPage', findPost.data)
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async editPost(context, payload) {
      try {
        context.commit('publishStart', 'edit')
        const data = {
          username: payload.username,
          message: payload.message,
          categories: payload.categories,
          filter: payload.filter,
        }
        const editPostAfter = async function () {
          const editRes = await PostService.editRes(payload._id, data)
          if (editRes.status === 200) {
            context.commit('goHome')
          }
        }
        if (payload.imageURL !== context.state.currentPost.imageURL) {
          const formData = new FormData()
          formData.append('image', payload.imageURL)
          const imgUploadRes = await PostService.imgUpload(formData)
          if (imgUploadRes.status === 200) {
            data.imageURL = imgUploadRes.data.image
            data.imagepId = imgUploadRes.data.pId
            data.thumbnail = imgUploadRes.data.thumbnail
            await PostService.deletePostImg(payload.imagepId)
          }
        }
        editPostAfter()
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async editLike(context, payload) {
      try {
        const post = payload.post
        const likes = payload.likes

        post.likes = likes
        post.likesCount = likes.length
        const editLikeRes = await PostService.editLike(payload.post._id, post)
        if (editLikeRes.status === 200) context.commit('goHome')
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async addComment(context, payload) {
      try {
        const commentRes = await PostService.addComment(payload)
        if (commentRes.status === 200) {
          context.commit('goHome')
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(commentRes.status)
            }, 0)
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteComment(context, payload) {
      try {
        const deleteRes = await PostService.deleteComment(payload._id, { post_id: payload.post_id })
        if (deleteRes.status === 200) {
          context.commit('goHome')
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(deleteRes.status)
            }, 0)
          })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
  },
}

export default postStore
