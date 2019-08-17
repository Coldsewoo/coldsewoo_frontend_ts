<template>
  <v-layout>
    <div class="container">
      <div v-show="step === 1 && !itemSelector.selected" class="wrapper">
        <Post
          v-for="(post, i) in reversedPosts"
          :key="i"
          :post="post"
          @deletePost="deleteRequest = $event"
        />
      </div>

      <div v-show="step === 1 && itemSelector.selected" class="wrapper">
        <Post
          v-for="(post, i) in filteredPosts"
          :key="i"
          :post="post"
          @deletePost="deleteRequest = $event"
        />
      </div>

      <div v-if="step === 2 || step === 3" class="upload-image-wrapper">
        <v-flex class="upload-image">
          <img
            width="449"
            max-width="449"
            max-height="500"
            :class="filterSelected"
            :src="localImageURL"
            alt="mainImage"
          />
        </v-flex>

        <v-layout v-show="step === 2" row align-content-center class="horiz-scroll">
          <v-flex v-for="(filter, i) in filters" :key="i" px-1 pb-1 mx-1>
            <div class="pos-relative" :class="{ active: activeIndex === i }">
              <p>{{ filter.toUpperCase() }}</p>
              <img
                :class="filter"
                class="ma-1 pa-1"
                :src="localImageURL"
                height="200"
                width="200"
                alt="filteredImage"
                @click="selectFilter(filter, i)"
              />
              <v-btn small icon class="pos-absolute remove-media" color="basetext">
                <v-icon color="white">close</v-icon>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
        <div v-if="step === 3">
          <div class="hashtags">
            <span
              v-for="(hashtag, i) in hashtags.items"
              :key="i"
              @click="deletetagInput(i)"
            >#{{ hashtag }}</span>
            <input
              v-if="hashtags.status"
              v-model="hashtags.text"
              type="text"
              autofocus
              @keydown.enter="hashtagSubmit"
            />

            <v-btn fab width="20" height="20" dark color="indigo" @click="addHashtagOpen">
              <v-icon dark>{{ tagMsg }}</v-icon>
            </v-btn>
          </div>
          <v-flex xs12 pt-0>
            <v-textarea
              v-model.lazy="message"
              class="post-message-input"
              box
              color="#964fffee"
              auto-grow
              name="input-7-4"
              label="Your message"
              rows="7"
              outline
              background-color="#0000000c"
            ></v-textarea>
          </v-flex>
        </div>
      </div>

      <Edit v-if="step === 5" />
    </div>
  </v-layout>
</template>

<script>
import EventBus from '@/EventBus.js';
import { createNamespacedHelpers } from 'vuex';
import Post from './Post.vue';
import Edit from './Edit.vue';


const {
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} = createNamespacedHelpers('postStore');

export default {
  name: 'Body',
  components: {
    Post,
    Edit,
  },
  props: {},
  data() {
    return {
      message: '',
      filterSelected: 'normal',
      hashtags: {
        items: [],
        text: '',
        status: false,
      },
      activeIndex: 0,
    };
  },
  computed: {
    ...mapState([
      'posts',
      'step',
      'localImageURL',
      'itemSelector',
      'imageUploading',
      'filters',
      'currentPost',
      'maxPost',
    ]),
    reversedPosts() {
      return this.$store.getters['postStore/reversedPosts'].slice(
        0,
        this.maxPost,
      );
    },
    filteredPosts() {
      return this.$store.getters['postStore/filteredPosts'].slice(
        0,
        this.maxPost,
      );
    },
    tagMsg() {
      return this.hashtags.status ? 'done' : 'add';
    },
  },
  watch: {
    step() {
      if (this.step === 1) {
        this.getPosts();
        this.message = '';
        this.hashtags = {
          items: [],
          text: '',
          status: false,
        };
        this.filterSelected = 'normal';
        this.$nextTick(() => {
          window.scroll(0, 0);
        });
      }
    },
    Edit: {
      handler() { },
      deep: true,
    },
    posts: {
      handler() { },
      deep: true,
    },
  },
  mounted() {
    this.getPosts();
    this.scroll();

    EventBus.$on('publish', () => {
      const payload = {
        message: this.message,
        categories: this.hashtags.items,
        filter: this.filterSelected,
      };
      this.$store.dispatch('postStore/publish', payload);
    });
    EventBus.$on('filter-selected', (e) => {
      this.filterSelected = e.filter;
    });
    EventBus.$on('commentUpdated', async (_id) => {
      this.getPosts();
    });
  },
  beforeDestroy() {
    EventBus.$off('publish');
    EventBus.$off('filter-selected');
    EventBus.$off('commentUpdated');
  },
  methods: {
    ...mapActions(['getPosts', 'onImageSelected']),
    hashtagSubmit(e) {
      if (e.keyCode !== 13) return;
      if (
        this.hashtags.items.indexOf(this.hashtags.text) === -1 &&
        this.hashtags.text.length > 0
      ) { this.hashtags.items.push(this.hashtags.text); }
      this.hashtags.text = '';
      this.hashtags.status = false;
    },
    addHashtagOpen() {
      if (this.hashtags.status) {
        this.hashtagSubmit();
      } else {
        this.hashtags.status = true;
      }
    },
    selectFilter(filter, i) {
      this.filterSelected = filter;
      this.activeIndex = i;
    },
    deletetagInput(i) {
      this.hashtags.items.splice(i, 1);
    },
    isActive(filterName) {
      return this.filterSelected === filterName;
    },
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop,
          ) +
          window.innerHeight >=
          document.documentElement.scrollHeight - 2;
        if (bottomOfWindow) {
          this.$store.commit('postStore/pending', 'bottom');
          setTimeout(() => {
            this.$store.commit('postStore/pending', 'false');
            this.$store.commit('postStore/maxPost');
          }, 1000);
        }
      };
    },
  },
};
</script>

<style scoped>
  .container {
    width: 455px;
    padding: 0;
    padding-top: 35px;
    margin-bottom: 25px;
  }

  .wrapper > div {
    margin-bottom: 15px;
  }
  .wrapper > div:last-child {
    margin-bottom: 40px;
  }

  .upload-image-wrapper {
    padding: 1px;
    overflow: hidden;
    margin-top: 10px;
  }
  .upload-image img {
    width: 100%;
    margin-bottom: 5px;
    padding: 3px;
    border: solid 1px #00000033;
  }

  .upload-image-step3 img {
    border: solid 1px #00000033;
  }

  .write-box {
    border: none;
    width: 90%;
    height: 100px;
    padding: 15px;
    margin: auto;
    display: block;
    outline: none;
  }

  .hashtags {
    margin-top: 15px;
  }

  .hashtags span {
    font-size: 18px;
    cursor: pointer;
  }
  .hashtags span:hover {
    color: #ee0000cc;
  }

  .hashtags input {
    height: 25px;
    width: 100px;
    background-color: #fefefe;
    border: solid 1px #00000033;
    border-radius: 10%;
    font-size: 18px;
  }

  .v-btn--floating {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }
  .v-btn--floating i {
    font-size: 20px;
  }
  .pos-relative {
    height: 240px;
    text-align: center;
    padding: 1px;
  }

  .pos-relative p {
    font-size: 15px;
    color: black;
    margin: 1px auto;
  }
  .pos-relative img {
    padding: 1px;
    background-color: snow;
    border: solid 1px #00000044;
  }

  .overflow-hidden {
    overflow: hidden;
  }
  .horiz-scroll {
    background-color: white;
    overflow-y: hidden;
    overflow-x: auto;
    border: solid 1px #d3d5dc5d;
    margin-top: 10px;
  }

  .active {
    border: solid 2px purple;
  }
</style>
