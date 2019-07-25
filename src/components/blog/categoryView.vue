<template>
  <v-flex xs12>
    <p v-if="payload.level === 1" class="headline category">{{ payload.tab }}</p>
    <p v-if="payload.level === 2" class="headline category">{{ payload.menu }}</p>
    <p v-if="payload.level === 3" class="headline category">{{ payload.submenu }}</p>

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
    // posts(val, oldVal) {},
    $route(to, from) {
      this.posts = {};
      this.path = to.path;
      this.getItems();
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
</style>
