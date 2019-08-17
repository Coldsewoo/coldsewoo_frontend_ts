<template>
  <div>
    <div class="footer">
      <div v-show="step === 5">
        <ul class="footer-button-plus">
          <div class="edit">
            <input id="editfile" type="file" class="inputfile" @change="onChanged" />
            <label for="editfile" class="input-plus">+</label>
          </div>
        </ul>
      </div>
    </div>

    <v-flex class="upload-image">
      <img width="449" max-width="449" max-height="500" :class="edit.filter" :src="edit.imageURL" alt="image to be uploaded" />
    </v-flex>

    <v-layout row align-content-center class="horiz-scroll">
      <v-flex v-for="(filter, i) in filters" :key="i" px-1 pb-1 mx-1>
        <div class="pos-relative" :class="{ active: activeIndex === i }">
          <p>{{ filter.toUpperCase() }}</p>
          <img
            :class="filter"
            class="ma-1 pa-1"
            :src="localImageURL"
            height="200"
            width="200"
            @click="selectFilter(filter, i)"
            alt="image filtered to be uploaded"
          />
          <v-btn small icon class="pos-absolute remove-media" color="basetext">
            <v-icon color="white">close</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>

    <div class="hashtags">
      <span
        v-for="(hashtag, i) in edit.hashtags.items"
        :key="i"
        @click="deletetagInput(i)"
      >#{{ hashtag }}</span>
      <input
        v-if="edit.hashtags.status"
        v-model="edit.hashtags.text"
        autofocus
        type="text"
        @keydown.enter="editHashtagSubmit"
      />

      <v-btn fab width="20" height="20" dark color="indigo" @click="addHashtagOpen">
        <v-icon dark>{{ tagMsg }}</v-icon>
      </v-btn>
    </div>
    <v-flex xs12 pt-0>
      <v-textarea
        v-model.lazy="edit.message"
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
</template>

<script>
import EventBus from '@/EventBus.js';
import { createNamespacedHelpers } from 'vuex';

const {
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} = createNamespacedHelpers('postStore');

export default {
  name: 'EditPage',
  components: {},
  data() {
    return {
      edit: {
        hashtags: {
          items: [],
          text: '',
          status: false,
        },
        message: '',
        filter: '',
        imageURL: '',
        imagepId: '',
      },
      activeIndex: null,
    };
  },
  computed: {
    ...mapState(['step', 'filters', 'currentPost', 'filter', 'localImageURL']),
    tagMsg() {
      return this.edit.hashtags.status ? 'done' : 'add';
    },
  },
  watch: {
    currentPost() {
      this.edit = {
        hashtags: {
          items: this.currentPost.categories.slice(),
          text: '',
          status: false,
        },
        username: this.currentPost.username,
        message: this.currentPost.message,
        filter: this.currentPost.filter,
        imageURL: this.currentPost.imageURL,
        _id: this.currentPost._id,
        imagepId: this.currentPost.imagepId,
      };
      this.activeIndex = this.filters.indexOf(this.edit.filter);
      this.$store.commit('postStore/onImageSelected', {
        localImageURL: this.currentPost.imageURL,
        step: 5,
      });
    },
    localImageURL() {
      if (this.$store.state.postStore.localImageURL) {
        this.edit.imageURL = this.$store.state.postStore.localImageURL;
      }
    },
  },
  mounted() {
    EventBus.$on('editPost', () => {
      const payload = {
        message: this.edit.message,
        categories: this.edit.hashtags.items,
        filter: this.edit.filter,
        _id: this.edit._id,
        imagepId: this.edit.imagepId,
        imageURL: this.edit.imageURL,
      };
      this.$store.dispatch('postStore/editPost', payload);
    });
    EventBus.$on('filter-selected', (e) => {
      this.edit.filter = e.filter;
    });
  },
  beforeDestroy() {
    EventBus.$off('editPost');
    EventBus.$off('filter-selected');
  },
  methods: {
    editHashtagSubmit(e) {
      if (e.keyCode !== 13) return;
      if (
        this.edit.hashtags.items.indexOf(this.edit.hashtags.text) === -1 &&
        this.edit.hashtags.text.length > 0
      ) { this.edit.hashtags.items.push(this.edit.hashtags.text); }

      this.edit.hashtags.text = '';
      this.edit.hashtags.status = false;
    },
    deletetagInput(i) {
      this.edit.hashtags.items.splice(i, 1);
    },
    addHashtagOpen() {
      if (this.edit.hashtags.status) {
        this.editHashtagSubmit();
      } else {
        this.edit.hashtags.status = true;
      }
    },
    onChanged(e) {
      this.$store.dispatch('postStore/onImageSelected', {
        item: e.target,
        position: 5,
      });
    },
    selectFilter(filter, i) {
      this.edit.filter = filter;
      this.activeIndex = i;
    },
  },
};
</script>

<style scoped>
  .footer {
    background-color: #fafafa !important;
  }

  .upload-image img {
    width: 100%;
    padding: 3px;
    border: solid 1px #00000033;
  }

  .edit {
    margin: 5px auto;
    padding: 2px;
    text-align: center;
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

  .hashtags span {
    cursor: pointer;
  }

  .hashtags span:hover {
    color: red;
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

  .active {
    border: solid 2px purple;
  }

  .overflow-hidden {
    overflow: hidden;
  }
  .horiz-scroll {
    background-color: white;
    overflow-y: hidden;
    overflow-x: auto;
    border: solid 1px #d3d5dc5d;
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

  .inputfile {
    display: none;
  }
  .input-plus {
    cursor: pointer;
    color: #7b22ee;
    font-size: 25px;
  }

  .v-btn--floating {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }
  .v-btn--floating i {
    font-size: 20px;
  }
</style>
