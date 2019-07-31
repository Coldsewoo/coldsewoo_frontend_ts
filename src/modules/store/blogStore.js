import axios from 'axios';
import router from '@/router.js';
import { API_URL } from '@/lib/globalVar';

const blogStore = {
  namespaced: true,
  state: {
    posts: [],
    categories: {},
    selectedPosts: [],
    selectedCategory: 'Main',
    latestImageURL: {},
    currentArticle: {},
  },
  getters: {
    categoriesList(state) {
      const item = state.categories;
      const returnArr = [];
      for (const key in item) {
        const children = [];
        const innerObj = {
          id: key,
          label: key,
          name: key,
        };
        for (const keya in item[key]) {
          const children2 = [];
          const innerObj2 = {
            id: `${key}/${keya}`,
            label: keya,
            name: keya,
          };
          for (const keyb of item[key][keya]) {
            const innerObj3 = {
              id: `${key}/${keya}/${keyb}`,
              label: keyb,
              name: keyb,
              isDisabled: true,
            };
            children2.push(innerObj3);
          }
          innerObj2.children = children2;
          children.push(innerObj2);
        }
        innerObj.children = children;
        returnArr.push(innerObj);
      }
      return returnArr;
    },
    categoryListForArticle(state) {
      const item = state.categories;
      const returnArr = [];
      for (const key in item) {
        const children = [];
        const innerObj = {
          id: key,
          label: key,
          name: key,
        };
        for (const keya in item[key]) {
          const children2 = [];
          const innerObj2 = {
            id: `${key}/${keya}`,
            label: keya,
            name: keya,
          };
          for (const keyb of item[key][keya]) {
            const innerObj3 = {
              id: `${key}/${keya}/${keyb}`,
              label: keyb,
              name: keyb,
            };
            children2.push(innerObj3);
          }
          innerObj2.children = children2;
          children.push(innerObj2);
        }
        innerObj.children = children;
        returnArr.push(innerObj);
      }
      let main = returnArr.filter(e => e.name === 'Main')[0];
      const index = returnArr.indexOf(main);
      main = {
        id: 'Main',
        label: 'Main',
        name: 'Main',
      };
      returnArr.splice(index, 1, main);
      return returnArr;
    },
    orderedCategories(state) {
      const categories = state.categories;
      const duplicate = {};
      for (const item in categories) {
        // item : coldsewooweb
        duplicate[item] = {};
        for (const item2 in categories[item]) {
          duplicate[item][item2] = categories[item][item2];
        }
      }
      return duplicate;
    },
  },
  mutations: {
    getPosts(state, payload) {
      state.posts = payload.data;
    },
    saveCategories(state, payload) {
      state.categories = payload;
    },
    selectMenuItem(state, payload) {
      state.selectedPosts = payload.data;
      state.selectedCategory = payload.selected;
      router.push('/blog/categoryview');
    },
    onImageSelected(state, payload) {
      state.latestImageURL = payload;
    },
    setCurrentArticle(state, payload) {
      if (payload === 'reset') state.currentArticle = {};
      else {
        state.currentArticle = payload;
        state.currentArticle.images = payload.images ? payload.images : [];
      }
    },
  },
  actions: {
    async getPosts(context) {
      try {
        const result = await axios({
          url: `${API_URL}/blog`,
          method: 'GET',
        });
        context.commit('getPosts', result);
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
        });
        if (result.data.success) {
          const cloudinaryRenameRes = await axios({
            url: `${API_URL}/images/blog/${result.data.data.articleId}`,
            method: 'PUT',
            data: payload.images,
            headers: {
              'Content-type': 'application/json',
              'x-access-token': context.rootState.token.token,
            },
          })
          const blogContentImageRenameRes = await axios({
            url: `${API_URL}/blog/rename/${result.data.data.articleId}`,
            method: 'PUT',
            headers: {
              'x-access-token': context.rootState.token.token,
            },
          })
          if (cloudinaryRenameRes.data.success && blogContentImageRenameRes.data.success) {
            return new Promise((resolve, reject) => {
              resolve(result)
            });
          }
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getSingleArticle(context, payload) {
      const articleId = payload;
      try {
        const res = await axios({
          url: `${API_URL}/blog/articles/${articleId}`,
          method: 'GET',
        });
        context.commit('setCurrentArticle', res.data.data)
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async getCategories(context, payload) {
      try {
        const res = await axios({
          url: `${API_URL}/blog/categories`,
          method: 'GET',
        });
        if (res.data.success) {
          context.commit('saveCategories', res.data.data);
        } else {
          context.commit('addError', res.data.message, { root: true })
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
        });
        if (res.data.success) {
          context.commit('selectMenuItem', {
            data: res.data.data,
            selected: payload,
          });
        } else {
          context.commit('addError', res.data.message, { root: true })
        }
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
    async deleteArticle(context, payload) {
      try {
        const articleId = payload.articleId;
        const blogRes = await axios({
          url: `${API_URL}/blog/articles/${articleId}`,
          method: 'DELETE',
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        });
        const imgRes = await axios({
          url: `${API_URL}/images/blog/${articleId}`,
          method: 'DELETE',
          headers: {
            'x-access-token': context.rootState.token.token,
          },
        })
        if (blogRes.data.success && imgRes.data.success) {
          router.push(`/blog/category/${payload.categories.path}`);
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
        });
        if (res.data.success) {
          context.dispatch('getCategories').then(() => {
            router.push('/blog/home');
          });
        }
      } catch (err) {
        // do nothing
      }
    },
    async onImageSelected(context, payload) {
      const formData = new FormData();
      formData.append('image', payload);
      try {
        const imgRes = await axios({
          url: `${API_URL}/images/blog`,
          method: 'POST',
          headers: {
            'Content-type': 'application/form-data',
            'x-access-token': context.rootState.token.token,
          },
          data: formData,
        });
        if (imgRes.data.success) {
          return new Promise((resolve, reject) => {
            context.commit('onImageSelected', imgRes.data.data);
            setTimeout(() => {
              resolve(imgRes.data.data);
            }, 0);
          });
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
        });
        return new Promise((resolve, reject) => {
          resolve();
        });
      } catch (err) {
        context.commit('addError', err.message, { root: true })
      }
    },
  },
};

export default blogStore;
