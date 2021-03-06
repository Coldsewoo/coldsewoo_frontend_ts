<template>
  <v-flex xs12>
    <div class="topSpacer">
      <p class="headline category">All Articles</p>
    </div>
    <v-list dense>
      <template v-for="(post, index) in currentPosts">
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
import axios from 'axios'
import { API_URL } from 'Libraries/globalVar'
import BaseBlogComponent from './BaseBlogComponent'

export default {
  name: 'Categoryview',
  props: {
    tab: String,
    menu: String,
    submenu: String,
  },
  extends: BaseBlogComponent,
  data() {
    return {
      payload: {},
      path: '',
      posts: [],
      error: false,
      postsLength: 0,
      currentPostsLength: 0,
    }
  },
  computed: {
    categoryLevel() {
      if (this.submenu) return 3
      if (this.menu) return 2
      return 1
    },
    selectedCategory() {
      const selected = this.$store.state.blogStore.selectedCategory
      if (!selected.includes('/')) return selected
      return selected.toUpperCase().split('/')[2]
    },
    currentPosts() {
      return this.posts.slice(0, this.currentPostsLength)
    },
  },
  metaInfo() {
    return {
      title: 'All Articles',
      titleTemplate: '%s | Coldsewoo - a blog',
      author: 'coldsewoo',
      description: 'Blog - all articles list',
    }
  },
  watch: {
    posts(val, oldVal) {},
    $route(to, from) {
      this.path = to.path
      // this.getItems();
    },
  },
  async mounted() {
    await this.getItems()
    this.postsLength = this.posts.length
    this.currentPostsLength = this.postsLength >= 12 ? 12 : this.postsLength
  },
  methods: {
    viewArticle(post) {
      this.$router.push(
        `/blog/category/${post.categories.path}/${post.articleId}`
      )
    },
    created(date) {
      const string = date.toString()
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      return `${year}/${month}/${day}`
    },
    async getItems() {
      const res = await axios({
        url: `${API_URL}/blog`,
        method: 'GET',
      })
      if (res.status === 200) {
        this.error = false
        this.posts = res.data
      } else {
        this.error = true
      }
    },
    showMore() {
      this.currentPostsLength += 10
      if (this.currentPostsLength > this.postsLength)
        this.currentPostsLength = this.postsLength
    },
  },
}
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
    font-size: 16px !important;
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
