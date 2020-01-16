<template>
  <v-flex xs12>
    <p v-if="payload.level === 1" class="headline category">
      {{ payload.tab }}
    </p>
    <p v-if="payload.level === 2" class="headline category">
      {{ payload.menu }}
    </p>
    <p
      v-if="payload.level === 3 && payload.submenu === '_'"
      class="headline category"
    >
      {{ payload.menu }}
    </p>
    <p
      v-if="payload.level === 3 && payload.submenu !== '_'"
      class="headline category"
    >
      {{ payload.submenu }}
    </p>

    <v-list dense>
      <template v-for="(post, index) in currentPosts">
        <v-list-tile
          :key="post.articleId"
          :class="{ odd: index % 2 === 1 }"
          ripple
          class="listItem"
          height="36"
          @click="viewArticle(post)"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              <strong>{{ index + 1 }}.</strong>
              {{ post.title }}
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              {{ created(post.created) }}
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < posts.length" :key="index" />
      </template>
    </v-list>
    <v-btn
      v-if="currentPostsLength < postsLength"
      block
      flat
      color="green darken-3"
      @click="showMore"
      >더보기</v-btn
    >
  </v-flex>
</template>

<script>
import axios from 'axios';
import { API_URL } from 'Library/globalVar';

export default {
  name: 'Categoryview',
  props: {
    tab: String,
    menu: String,
    submenu: String,
  },
  data() {
    return {
      payload: {},
      path: '',
      posts: [],
      error: false,
      postsLength: 0,
      currentPostsLength: 0,
    };
  },
  metaInfo() {
    return {
      title: `${this.payload.tab}`,
      titleTemplate: '%s | Coldsewoo - a blog',
      author: 'coldsewoo',
      description: 'Blog - articles list in a category',
    };
  },
  computed: {
    categoryLevel() {
      if (this.submenu) return 3;
      if (this.menu) return 2;
      return 1;
    },
    selectedCategory() {
      const selected = this.$store.state.blogStore.selectedCategory;
      if (!selected.includes('/')) return selected;
      return selected.toUpperCase().split('/')[2];
    },
    currentPosts() {
      return this.posts.slice(0, this.currentPostLength);
    },
  },
  watch: {
    // posts(val, oldVal) {},
    async $route(to, from) {
      this.posts = [];
      this.path = to.path;
      await this.getItems();
      this.postsLength = this.posts.length;
      this.currentPostsLength = this.postsLength >= 12 ? 12 : this.postsLength;
    },
  },
  async mounted() {
    await this.getItems();
    this.postsLength = this.posts.length;
    this.currentPostsLength = this.postsLength >= 12 ? 12 : this.postsLength;
  },
  methods: {
    viewArticle(post) {
      this.$router.push(
        `/blog/category/${post.categories.path}/${post.articleId}`,
      );
    },
    created(date) {
      const string = date.toString();
      const year = date.substring(0, 4);
      const month = date.substring(4, 6);
      const day = date.substring(6, 8);
      return `${year}/${month}/${day}`;
    },
    async getItems() {
      const payload = {};
      switch (this.categoryLevel) {
        case 1:
          payload.tab = this.tab;
          payload.path = `${this.tab}`;
          payload.level = 1;
          break;
        case 2:
          payload.tab = this.tab;
          payload.menu = this.menu;
          payload.path = `${this.tab}/${this.menu}`;
          payload.level = 2;
          break;
        case 3:
          payload.tab = this.tab;
          payload.menu = this.menu;
          payload.submenu = this.submenu;
          payload.path = `${this.tab}/${this.menu}/${this.submenu}`;
          payload.level = 3;
          break;
        default:
          break;
      }
      this.payload = payload;
      const res = await axios({
        url: `${API_URL}/blog/categories`,
        method: 'POST',
        data: this.payload,
      });
      if (res.status === 200) {
        this.error = false;
        this.posts = res.data;
      } else {
        this.error = true;
      }
    },
    showMore() {
      this.currentPostsLength += 10;
      if (this.currentPostsLength > this.postsLength) { this.currentPostsLength = this.postsLength; }
    },
  },
};
</script>

<style lang="scss" scoped>
.category {
  padding: 5px;
  margin-top: 20px;
}

.v-list {
  border: solid 1px rgba(0, 10, 0, 0.3) !important;
  padding: 1px !important;

  .odd {
    background: rgba(235, 235, 235, 1) !important;
  }
  .v-list__tile__title {
    font-size: 16px !important;
    font-weight: 400;
  }

  .v-list__tile__action-text {
    font-size: 12px !important;
  }
  .v-list--dense {
    height: 36px !important;
  }
}
</style>
