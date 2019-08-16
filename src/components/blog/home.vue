<template>
  <v-flex xs12>
    <div class="topSpacer">
      <p class="headline category">All Articles</p>
    </div>
    <v-list dense>
      <template v-for="(post, index) in posts">
        <v-list-tile
          :key="post.articleId"
          :class="{ odd: index % 2 === 1 }"
          ripple
          class="listItem"
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
              {{
              created(post.created)
              }}
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < posts.length" :key="index" />
      </template>
    </v-list>
  </v-flex>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/lib/globalVar';

const API_BLOG_URL = 'https://coldsewooweb-backend.herokuapp.com/blog';

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
      posts: {},
      error: false,
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
  },
  watch: {
    posts(val, oldVal) { },
    $route(to, from) {
      this.path = to.path;
      // this.getItems();
    },
  },
  mounted() {
    this.getItems();
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
      const res = await axios({
        url: `${API_URL}/blog`,
        method: 'GET',
      });
      if (res.data.success) {
        this.error = false;
        this.posts = res.data.data;
      } else {
        this.error = true;
      }
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
    border: solid 1px rgba(0, 0, 0, 0.12);
    padding: 1px !important;

    .odd {
      background: rgba(0, 0, 0, 0.12);
    }
    .v-list__tile__title {
      font-size: 18px !important;
    }

    .v-list__tile__action-text {
      font-size: 13px !important;
    }
  }

  .topSpacer {
    margin-top: 20px;

    p {
      font-size: 20px;
      font-style: bold;
    }
  }
</style>
