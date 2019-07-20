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
      <EditorContent :editor="editor" class="editor__content" />
    </section>
    <section class="right">
      <v-dialog v-model="deleteDialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn class="error" fab flat v-on="on">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Delete category</v-card-title>

          <v-card-text class="dialogText">
            <p>Do you want to remove this article?</p>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="error" flat @click="deleteDialog = !deleteDialog">Cancel</v-btn>
            <v-btn color="primary" flat @click="deleteArticle">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn class="primary" fab flat @click="editArticle">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn class="success" fab flat @click="goList">
        <v-icon>list</v-icon>
      </v-btn>
    </section>
  </v-flex>
</template>

<script>
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  CodeBlockHighlight,
} from 'tiptap-extensions';
import TextSize from '@/assets/textSize.js';
import TextColor from '@/assets/fontColor.js';

export default {
  components: {
    EditorContent,
  },
  props: {
    articleId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      article: {},
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Image(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
            },
          }),
          new TextColor(),
          new TextSize(),
        ],
        content: '',
        editable: false,
      }),
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
  },
  mounted() {
    this.getSingleArticle();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    getSingleArticle() {
      this.$store
        .dispatch('blogStore/getSingleArticle', this.articleId)
        .then((res) => {
          this.article = res.data.data;
          this.editor.setContent(this.article.content);
        })
        .catch(console.error);
    },
    deleteArticle() {
      const imageDeleteArr = this.article.images.map(e =>
        this.$store.dispatch('blogStore/deleteImage', e.pId),
      );
      Promise.all(imageDeleteArr).then(() => {
        this.$store.dispatch('blogStore/deleteArticle', this.article);
      });
    },
    editArticle() {
      this.$router.push(`/blog/edit/${this.articleId}`);
    },
    goList() {
      let url = this.$route.path;
      url = url.split('/');
      url.pop();
      this.$router.push(`${url.join('/')}/`);
      // url.split("/").shift();
      // url = url.join("/") + "/";
      // this.$router.push(url);
    },
  },
};
</script>

<style lang="scss" scoped>
  .article {
    padding: 8px;
    margin-top: 15px;
    margin-bottom: 10px;
    width: 100%;
    border: solid 1px #00000009;
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
