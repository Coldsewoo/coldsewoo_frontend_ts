<template>
  <v-flex xs12>
    <v-layout row wrap class="header">
      <v-flex xs2 md1>
        <img :src="article.headImageURL" alt />
      </v-flex>
      <v-flex xs10 offset-xs-1 md8>
        <span class="title">{{ article.title }}</span>
      </v-flex>
      <v-flex xs12 md3>
        <span class="date">{{ article.nickname }}</span>
        <span class="date">{{ createdDay }}</span>
      </v-flex>
    </v-layout>
    <section class="article">
      <editorItem />
    </section>
    <section class="right">
      <v-dialog v-model="deleteDialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-if="editPriv" class="error" small fab flat v-on="on">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Delete category</v-card-title>

          <v-card-text class="dialogText">
            <p>The article will be deleted.</p>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="error" flat @click="deleteDialog = !deleteDialog">Cancel</v-btn>
            <v-btn color="primary" flat @click="deleteArticle">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn class="primary" v-if="editPriv" fab flat small @click="editArticle">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn class="success" fab flat small @click="goList">
        <v-icon>list</v-icon>
      </v-btn>
    </section>
  </v-flex>
</template>

<script>
import editorItem from '@/components/blog/editorView.vue'

export default {
  components: {
    editorItem,
  },
  props: {
    articleId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      monthEng: this.$store.state.postStore.monthEng,
      deleteDialog: false,
    };
  },
  computed: {
    createdDay() {
      if (this.article.created) {
        const date = this.article.created;
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(4, 6));
        const day = date.substring(6, 8);
        const result = `${this.monthEng[month - 1]} ${day} ${year}`;
        return result;
      } return '';
    },
    article() {
      return this.$store.state.blogStore.currentArticle
    },
    editPriv() {
      const isLoggedIn = this.$store.state.isLoggedIn;
      const role = this.$store.state.token.role;
      const username = this.$store.state.token.username;
      const adminIndex = ['Admin', 'Owner']

      return isLoggedIn && (username === this.article.username || adminIndex.includes(role))
    },
  },
  mounted() {
    this.getSingleArticle()
  },
  beforeDestroy() {
    this.$store.commit('blogStore/setCurrentArticle', 'reset')
  },
  methods: {
    getSingleArticle() {
      this.$store
        .dispatch('blogStore/getSingleArticle', this.articleId)
    },
    async deleteArticle() {
      this.$store.dispatch('blogStore/deleteArticle', this.article);
    },
    editArticle() {
      this.$router.push(`/blog/edit/${this.articleId}`);
    },
    goList() {
      let url = this.$route.path;
      url = url.split('/');
      url.pop();
      this.$router.push(`${url.join('/')}/`);
    },
  },
};
</script>

<style lang="scss" scoped>
  .article {
    margin-bottom: 10px;
    width: 100%;
    .editor__content {
      border-top: solid 1px black;
      border-bottom: solid 1px black;
    }

    .container {
      padding: 1px 10px 1px 10px !important;
    }
  }

  .header {
    border-bottom: solid 1px black;
    padding-left: 15px;
    margin-top: 30px;
    padding-bottom: 3px;

    div:last-child {
      text-align: right !important;
    }

    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: solid 1px purple;
    }
    .title {
      font-size: 28px !important;
      color: rgb(65, 65, 65);
      margin-left: 5px;
      padding-top: 7px;
      display: block;
    }

    .date {
      font-size: 15px !important;
      color: rgb(103, 103, 103);
      margin: auto;
      margin-right: 10px;
      margin-top: 5px;
      display: block;
    }
  }

  * {
    .is-active {
      background-color: rgb(255, 224, 254);
    }
    :focus {
      outline: none;
    }
  }
</style>
