import axios from 'axios';
import API_URL from '@/lib/globalVar';

const postStore = {
  namespaced: true,
  state: {
    monthEng: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
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
        return state.posts.slice().reverse();
      } return [];
    },
    filteredPosts(state) {
      if (state.posts.length > 0 && state.itemSelector.selected) {
        return state.posts
          .filter((e) => {
            const filter = state.itemSelector.filter;
            const item = state.itemSelector.key;
            return e[filter].includes(item);
          })
          .reverse();
      } return [];
    },
  },
  mutations: {
    getPosts(state, posts) {
      state.posts = posts;
    },
    onImageSelected(state, payload) {
      state.localImageURL = payload.localImageURL;
      state.step = payload.step;
    },
    goHome(state) {
      state.step = 1;
      state.localImageURL = null;
      state.hashSelector = {
        item: '',
        selected: false,
      };
      state.updateStatus = {
        status: 'false',
        item: '',
        message: '',
      };
    },
    changeStep(state, stepNum) {
      state.step = stepNum;
      if (stepNum === 1) {
        state.localImageURL = null;
        state.hashSelector = {
          item: '',
          selected: false,
        };
        state.updateStatus = {
          status: 'false',
          item: '',
          message: '',
        };
      }
    },
    findByItem(state, payload) {
      const key = Object.keys(payload)[0];
      state.itemSelector = {
        filter: key,
        key: payload[key],
        selected: true,
      };
    },
    editPage(state, post) {
      state.currentPost = post;
    },
    publishStart(state, payload) {
      state.updateStatus.status = 'pending';
      state.updateStatus.item = payload;
    },
    pending(state, payload) {
      state.updateStatus.status = payload;
    },
    maxPost(state) {
      state.maxPost += 5;
    },
  },
  actions: {
    async getPosts(context) {
      try {
        const res = await axios({
          url: `${API_URL}/posts`,
          method: 'GET',
        });
        if (res.data.success) {
          context.commit('getPosts', res.data.data);
        } else {
          console.log(res.data.errors);
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    async getSinglePost(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/posts/${payload}`,
          method: 'GET',
        });
        if (res.data.success) {
          return res.data.data;
        }
        console.log(res.data.errors);
      } catch (err) {
        console.log(err.response);
      }
    },
    onImageSelected(context, payload) {
      const file = payload.item.files;
      const position = payload.position;
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = (e) => {
        const payload = {
          localImageURL: e.target.result,
          step: position,
        };
        context.commit('onImageSelected', payload);
      };
    },
    async publish(context, payload) {
      try {
        const formData = new FormData();
        formData.append('image', context.state.localImageURL);
        const imgRes = await axios({
          url: `${API_URL}/images`,
          method: 'POST',
          headers: {
            'Content-type': 'application/form-data',
            'x-access-token': context.rootState.token.token,
          },
          data: formData,
        });
        payload.imageURL = imgRes.data.data.image;
        payload.imagepId = imgRes.data.data.pId;
        payload.thumbnail = imgRes.data.data.thumbnail;
        const postRes = await axios({
          url: `${API_URL}/posts`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': context.rootState.token.token,
          },
          data: payload,
          validateStatus: (status) => {
            return true;
          },
        });
        if (postRes.data.success) context.state.updateStatus.status = 'success';
        else {
          context.state.updateStatus.status = 'error';
          context.state.updateStatus.message = postRes.data.message;
        }
        context.state.updateStatus.status = 'false';
        context.commit('goHome');
      } catch (err) {
        console.log(err);
      }
    },
    async deletePost(context, payload) {
      context.commit('changeStep', 4);
      try {
        const imgRes = await axios({
          url: `${API_URL}/images`,
          method: 'DELETE',
          params: { imagepId: payload.imagepId },
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        });
        if (imgRes.status === 200) {
          const postRes = await axios({
            url: `${API_URL}/posts/${payload._id}`,
            method: 'DELETE',
            headers: {
              'x-access-token': context.rootState.token.token,
            },
          });
          if (postRes.status === 200) {
            context.commit('goHome');
          }
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    async editPage(context, payload) {
      try {
        const findPost = await axios({
          url: `${API_URL}/posts/${payload._id}`,
          method: 'GET',
        });
        if (findPost.data.success) {
          context.commit('editPage', findPost.data.data[0]);
        } else {
          console.log(findPost.data.errors);
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    async editPost(context, payload) {
      try {
        context.commit('publishStart', 'edit');
        const data = {
          username: payload.username,
          message: payload.message,
          categories: payload.categories,
          filter: payload.filter,
        };
        const editPostAfter = async function () {
          const editRes = await axios({
            url: `${API_URL}/posts/${payload._id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
            data,
          });
          if (editRes.data.success) {
            context.commit('goHome');
          }
        };
        if (payload.imageURL !== context.state.currentPost.imageURL) {
          const formData = new FormData();
          formData.append('image', payload.imageURL);
          const imgUploadRes = await axios({
            url: `${API_URL}/images`,
            method: 'POST',
            headers: {
              'Content-type': 'application/form-data',
              'x-access-token': context.rootState.token.token,
            },
            data: formData,
          });
          if (imgUploadRes.data.success) {
            data.imageURL = imgUploadRes.data.data.image;
            data.imagepId = imgUploadRes.data.data.pId;
            data.thumbnail = imgUploadRes.data.data.thumbnail;
            axios({
              url: `${API_URL}/images`,
              method: 'DELETE',
              params: { imagepId: payload.imagepId },
              headers: {
                'x-access-token': context.rootState.token.token,
              },
            });
          }
        }
        editPostAfter();
      } catch (err) {
        console.log(err.response);
      }
    },
    async editLike(context, payload) {
      try {
        const post = payload.post;
        const likes = payload.likes;

        post.likes = likes;
        post.likesCount = likes.length;

        const editLikeRes = await axios({
          url: `${API_URL}/posts/${payload.post._id}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': context.rootState.token.token,
          },
          data: post,
        });
        if (editLikeRes.status === 200) context.commit('goHome');
      } catch (err) {
        console.log(err.response);
      }
    },
    async addComment(context, payload) {
      try {
        const commentRes = await axios({
          url: `${API_URL}/posts/comments`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': context.rootState.token.token,
          },
          data: payload,
        });
        if (commentRes.status === 200) {
          context.commit('goHome');
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(commentRes.status);
            }, 0);
          });
        }
      } catch (err) {
        console.log(err.response);
      }
    },
    async deleteComment(context, payload) {
      try {
        const deleteRes = await axios({
          url: `${API_URL}/posts/comments/${payload._id}`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': context.rootState.token.token,
          },
          data: { post_id: payload.post_id },
        });
        if (deleteRes.status === 200) {
          context.commit('goHome');
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(deleteRes.status);
            }, 0);
          });
        }
      } catch (err) {
        console.log(err.response);
      }
    },
  },
};

export default postStore;
