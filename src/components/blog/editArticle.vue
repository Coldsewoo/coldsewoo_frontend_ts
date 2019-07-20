<template>
  <v-container>
    <v-layout xs12>
      <v-flex xs12>
        <div class="editor">
          <EditorMenuBar v-slot="{ commands, isActive }" :editor="editor">
            <section class="menubar">
              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="white" dark class="menubar__button" v-on="on">
                    <v-icon>title</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-btn-toggle v-model="toggle.decoration" multiple>
                    <v-btn :class="{ 'is-active': isActive.bold() }" flat @click="commands.bold">
                      <v-icon>format_bold</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.italic() }"
                      flat
                      @click="commands.italic"
                    >
                      <v-icon>format_italic</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.underline() }"
                      flat
                      @click="commands.underline"
                    >
                      <v-icon>format_underlined</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.strike() }"
                      flat
                      @click="commands.strike"
                    >
                      <v-icon>format_strikethrough</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-list>
              </v-menu>

              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="white" dark class="menubar__button" v-on="on">
                    <v-icon>code</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-tile :class="{ 'is-active': isActive.code() }" @click="commands.code">Code</v-list-tile>
                  <v-list-tile
                    :class="{ 'is-active': isActive.code_block() }"
                    @click="commands.code_block"
                  >Code Block</v-list-tile>
                </v-list>
              </v-menu>

              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="white" dark class="menubar__button" v-on="on">
                    <v-icon>line_weight</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-btn-toggle>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                      flat
                      @click="commands.heading({ level: 1 })"
                    >H1</v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                      flat
                      @click="commands.heading({ level: 2 })"
                    >H2</v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                      flat
                      @click="commands.heading({ level: 3 })"
                    >H3</v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 4 }) }"
                      flat
                      @click="commands.heading({ level: 4 })"
                    >H4</v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 5 }) }"
                      flat
                      @click="commands.heading({ level: 5 })"
                    >H5</v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.heading({ level: 6 }) }"
                      flat
                      @click="commands.heading({ level: 6 })"
                    >H6</v-btn>
                  </v-btn-toggle>
                </v-list>
              </v-menu>

              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="white" dark class="menubar__button" v-on="on">
                    <v-icon>format_list_bulleted</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-btn-toggle>
                    <v-btn
                      :class="{ 'is-active': isActive.paragraph() }"
                      flat
                      @click="commands.paragraph"
                    >
                      <v-icon>drag_handle</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.ordered_list() }"
                      flat
                      @click="commands.ordered_list"
                    >
                      <v-icon>format_list_numbered</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.bullet_list() }"
                      flat
                      @click="commands.bullet_list"
                    >
                      <v-icon>format_list_bulleted</v-icon>
                    </v-btn>
                    <v-btn
                      :class="{ 'is-active': isActive.blockquote() }"
                      flat
                      @click="commands.blockquote"
                    >
                      <v-icon>format_quote</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-list>
              </v-menu>

              <v-menu :close-on-content-click="false" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn color="white" dark class="menubar__button" v-on="on">
                    <v-icon color="purple darken-1">format_color_text</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-card max-width="400">
                    <v-card-text>
                      <v-layout ma-0 text-xs-center>
                        <span class="title font-weight-light">Font-size : {{ font.size }}px</span>
                      </v-layout>
                    </v-card-text>
                    <v-slider
                      v-model="font.size"
                      class="mx-3 my-0"
                      height="30"
                      step="1"
                      ticks
                      @change="commands.textSize({ level: `${font.size}px` })"
                    />
                    <chrome-picker
                      v-model="font.color"
                      class="color-picker"
                      @input="commands.textColor({ level: font.color.hex })"
                    />
                  </v-card>
                </v-list>
              </v-menu>

              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="commands.horizontal_rule" v-on="on">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </template>
                <span>horizontal rule</span>
              </v-tooltip>
              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <input
                    id="file"
                    type="file"
                    class="input-photo"
                    @change="onImageSelected($event, commands.image)"
                  />
                  <label for="file" class="menubar__button input-center" v-on="on">
                    <v-icon>insert_photo</v-icon>
                  </label>
                </template>
                <span>Insert image</span>
              </v-tooltip>
              <v-btn
                class="menubar__button"
                @click="
                  commands.createTable({
                    rowsCount: 3,
                    colsCount: 3,
                    withHeaderRow: false
                  })
                "
              >
                <img class="svgIcon" src="@/assets/images/icons/table.svg" />
              </v-btn>
              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="commands.undo" v-on="on">
                    <v-icon>undo</v-icon>
                  </v-btn>
                </template>
                <span>Undo</span>
              </v-tooltip>

              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="commands.redo" v-on="on">
                    <v-icon>redo</v-icon>
                  </v-btn>
                </template>
                <span>Redo</span>
              </v-tooltip>

              <!-- <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="saveJson" v-on="on">
                    <v-icon>save</v-icon>
                  </v-btn>
                </template>
                <span>임시저장</span>
              </v-tooltip>

              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="openJson" v-on="on">
                    <v-icon>folder_open</v-icon>
                  </v-btn>
                </template>
                <span>임시저장 열기</span>
              </v-tooltip>-->

              <v-tooltip bottom nudge-top="5">
                <template v-slot:activator="{ on }">
                  <v-btn class="menubar__button" @click="saveArticle" v-on="on">
                    <v-icon>cloud_upload</v-icon>
                  </v-btn>
                </template>
                <span>업로드</span>
              </v-tooltip>
              <span v-if="isActive.table()">
                <v-btn class="menubar__button" @click="commands.deleteTable">
                  <img class="svgIcon" src="@/assets/images/icons/delete_table.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.addColumnBefore">
                  <img class="svgIcon" src="@/assets/images/icons/add_col_before.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.addColumnAfter">
                  <img class="svgIcon" src="@/assets/images/icons/add_col_after.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.deleteColumn">
                  <img class="svgIcon" src="@/assets/images/icons/delete_col.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.addRowBefore">
                  <img class="svgIcon" src="@/assets/images/icons/add_row_before.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.addRowAfter">
                  <img class="svgIcon" src="@/assets/images/icons/add_row_after.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.deleteRow">
                  <img class="svgIcon" src="@/assets/images/icons/delete_row.svg" />
                </v-btn>
                <v-btn class="menubar__button" @click="commands.toggleCellMerge">
                  <img class="svgIcon" src="@/assets/images/icons/combine_cells.svg" />
                </v-btn>
              </span>
            </section>
          </EditorMenuBar>
          <v-layout row>
            <v-flex xs7>
              <v-text-field v-model="title" height="35" label="Title" />
            </v-flex>
            <v-flex xs5 class="categories">
              <Treeselect
                v-model="value"
                :multiple="false"
                :options="categoryListForArticle"
                :close-on-select="true"
                :open-on-click="true"
                :disable-branch-nodes="true"
                :show-count="true"
                placeholder="Categories"
              />
              <pre class="result">{{ value }}</pre>
            </v-flex>
          </v-layout>

          <EditorContent :editor="editor" class="editor__content" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import '@/assets/editorStyle.scss';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Sketch } from 'vue-color';
// import the component
import Treeselect from '@riophae/vue-treeselect';
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

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
} from 'tiptap-extensions';
import TextSize from '@/assets/textSize.js';
import TextColor from '@/assets/fontColor.js';

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    chromePicker: Sketch,
    Treeselect,
  },
  props: {
    articleId: String,
  },
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
          new Underline(),
          new History(),
          new Image(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
            },
          }),
          new Table(),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new TextColor(),
          new TextSize(),
        ],
        content: '',
      }),
      article: {},
      colors: '',
      showColorPicker: false,
      list: [],
      value: null,
      treeshow: false,
      title: '',
      toggle: {
        decoration: [0, 1, 2, 3],
      },
      font: {
        color: 'black',
        size: 12,
      },
      previewImage: null,
      editStatus: false,
      editImagesToUpload: [],
    };
  },
  computed: {
    categories() {
      return this.$store.state.blogStore.categories;
    },
    categoriesList() {
      return this.$store.getters['blogStore/categoriesList'];
    },
    categoryListForArticle() {
      return this.$store.getters['blogStore/categoryListForArticle'];
    },
  },
  mounted() {
    this.getSingleArticle();
  },
  beforeDestroy() {
    if (this.editStatus || this.editImagesToUpload.length === 0) { return this.editor.destroy(); }
    const pidArr = this.editImagesToUpload.map(e =>
      this.$store.dispatch('blogStore/deleteImage', e.pId),
    );
    Promise.all(pidArr).then(() => {
      this.editor.destroy();
    });
  },
  methods: {
    getSingleArticle() {
      this.$store
        .dispatch('blogStore/getSingleArticle', this.articleId)
        .then((res) => {
          this.article = res.data.data;
          this.title = this.article.title;
          this.value = this.article.categories.path;
          this.editor.setContent(this.article.content);
        })
        .catch(console.error);
    },
    saveJson() {
      this.content = this.editor.getJSON();
    },
    openJson() {
      this.editor.setContent(this.content);
    },
    saveArticle() {
      const content = this.editor.getJSON();
      const payload = {
        content,
        title: this.title,
        categories: this.value,
        articleId: this.articleId,
        images: this.article.images.concat(this.editImagesToUpload),
      };
      setTimeout(() => {
        this.$store.dispatch('blogStore/saveArticle', payload).then((result) => {
          if (result.data.success) {
            this.editStatus = true;
            this.$router.push(
              `/blog/category/${result.data.data.path}/${
                result.data.data.articleId
              }`,
            );
          } else {
            this.editStatus = false;
          }
        });
      }, 0);
    },
    onImageSelected(e, command) {
      const image = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onload = async (e) => {
        this.previewImage = e.target.result;
        const result = await this.$store.dispatch(
          'blogStore/onImageSelected',
          this.previewImage,
        );
        const src = result.image;
        command({ src });
        this.editImagesToUpload.push(result);
        this.$nextTick(() => {
          this.previewImage = null;
        });
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .menubar {
    justify-content: center;
    display: flex;
    flex-flow: row wrap;
    position: sticky;
    top: 65px;
    border: solid 1px rgb(254, 246, 255);
  }
  .menubar__button {
    border: solid 1px gray !important;
    background-color: white !important;
    margin: 2px;
    padding: 1px;
    color: black !important;
    min-width: 45px !important;
    min-height: 45px !important;
    width: 45px !important;
    height: 45px !important;
  }

  .editor {
    width: 100%;
  }

  .editor__content {
    border: solid 2px black;
    padding: 8px;
    margin-top: 20px;
  }

  * {
    .is-active {
      background-color: rgb(255, 224, 254);
    }
    :focus {
      outline: none;
    }
  }

  .v-btn {
    opacity: 1 !important;
  }

  .v-btn--active:before,
  .v-btn:hover:before,
  .v-btn:focus:before {
    background-color: none;
  }

  .line_break {
    flex-basis: 100%;
    width: 0px;
    height: 30px;
    overflow: hidden;
  }
  .vc-chrome {
    align-items: center;
  }

  .categories {
    background-color: #fafafa;
    z-index: 3;
    padding: 8px;
    width: 100%;
    margin-left: 5px;
    div {
      border: solid 1px black;
      width: 100%;
    }
    pre {
      font-size: 13px;
      color: blue;
      padding-left: 1px;
    }
  }

  .input-photo {
    display: none;
  }
  .input-center {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);

    i {
      color: black;
    }
  }
</style>
