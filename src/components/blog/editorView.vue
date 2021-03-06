<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <section class="editor">
          <EditorContent :editor="editor" class="editor__content" />
        </section>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import 'Assets/editorStyle.scss'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import typescript from 'highlight.js/lib/languages/typescript'
import { Sketch } from 'vue-color'

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
  Image,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  CodeBlockHighlight,
} from 'tiptap-extensions'

import TextSize from 'Assets/textSize.js'
import TextColor from 'Assets/fontColor.js'
import isEmpty from 'lodash.isempty'
import BaseBlogComponent from './BaseBlogComponent'

export default {
  components: {
    EditorContent,
    Editor,
  },
  extends: BaseBlogComponent,
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3, 4, 5, 6] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Image(),
          new Underline(),
          new History(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
              typescript,
            },
          }),
          new TextColor(),
          new TextSize(),
          new Table({
            resizable: true,
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
        ],
        content: '',
        editable: false,
      }),
      font: {
        color: '',
        size: 1,
      },
      show: {
        colorPicker: false,
        textSize: false,
      },
      list: [],
      value: null,
      treeshow: false,
      title: '',
      toggle: {
        decoration: [],
      },
      previewImage: null,
      imagesToUpload: [],
      content: {},
    }
  },
  watch: {
    article(article, old) {
      if (!isEmpty(article)) {
        this.editor.setContent(article.content)
      }
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  computed: {
    article() {
      return this.$store.state.blogStore.currentArticle
    },
  },
  methods: {
    openJson() {
      this.editor.setContent(this.article.content)
    },
  },
}
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  background-color: #fcfcfc;
}

.editor__content {
  border-top: solid 2px rgb(213, 213, 213);
  border-bottom: solid 1px rgb(213, 213, 213);
  padding: 15px;
}
</style>
