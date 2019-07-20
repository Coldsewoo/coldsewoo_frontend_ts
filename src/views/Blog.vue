<template>
  <v-container>
    <v-layout row wrap pa-1 ma-1>
      <v-layout>
        <v-flex xs12>
          <v-tabs fixed-tabs height="30">
            <v-tab
              v-for="(tab, i) in ordered"
              :key="i"
              :class="{ 'tab-selected': currentTab === i }"
              class="tab_header"
              @click="selectTab(i)"
            >{{ i }}</v-tab>
            <v-tab-item v-for="(tab, i) in ordered" :key="i">
              <v-card>
                <v-layout fill-height>
                  <v-flex v-if="currentTab" xs5 md2>
                    <p
                      v-for="(menu, n) in ordered[currentTab]"
                      :key="n"
                      :class="{ 'submenu-selected': currentMenu === n }"
                      class="menuItem"
                      @click="selectMenu(n)"
                    >{{ n }}</p>
                  </v-flex>
                  <v-flex v-if="currentMenu" xs5 md2>
                    <p
                      v-for="(submenu, j) in ordered[currentTab][currentMenu]"
                      :key="j"
                      :class="{
                        'submenu-selected': currentSubmenu === submenu
                      }"
                      class="menuItem"
                      @click="selectSubmenu(submenu)"
                    >{{ submenu }}</p>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <router-view />
      </v-flex>
      <div class="text-xs-center new_article">
        <v-menu offset-x left>
          <template v-slot:activator="{ on }">
            <v-btn
              :class="{
                transparent: $vuetify.breakpoint.sm || $vuetify.breakpoint.xs
              }"
              fixed
              right
              fab
              flat
              top
              class="new_article primary"
              v-on="on"
            >
              <v-icon>menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(menu, index) in menuList"
              :key="index"
              :to="menu.path"
              active-class="none"
              class="menu-list"
            >
              <v-icon color="#7a22ffaa">{{ menu.icon }}</v-icon>
              <v-spacer />
              <v-list-tile-title class="needSpace">
                {{
                menu.name
                }}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      <v-btn
        :class="{
          transparent: $vuetify.breakpoint.sm || $vuetify.breakpoint.xs
        }"
        fixed
        right
        fab
        bottom
        flat
        class="error goup"
        @click.native="goup"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
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
  CodeBlockHighlight,
} from 'tiptap-extensions';

export default {
  name: 'Blog',
  components: {},
  data() {
    return {
      currentTab: '',
      currentMenu: '',
      currentSubmenu: '',
      menuList: [
        {
          name: 'Home',
          path: '/blog/home',
          icon: 'home',
        },
        {
          name: 'New Article',
          path: '/blog/newarticle',
          icon: 'library_add',
        },
        {
          name: 'Manage Category',
          path: '/blog/editcategory',
          icon: 'format_list_bulleted',
        },
      ],
    };
  },
  computed: {
    menus() {
      return this.$store.state.blogStore.categories;
    },
    ordered() {
      return this.$store.getters['blogStore/orderedCategories'];
    },
    current() {
      return this.$store.getters['blogStore/selectedCategoryObj'];
    },
  },
  mounted() {
    this.getCategories();
    const query = this.$route.params;
    this.currentTab = query.tab || '';
    this.currentMenu = query.menu || '';
    this.currentSubmenu = query.submenu || '';
  },

  methods: {
    goup() {
      window.scrollTo(0, 0);
    },
    newArticle() {
      this.$router.push('/blog/newarticle');
    },
    getCategories() {
      this.$store.dispatch('blogStore/getCategories');
    },
    selectTab(i) {
      this.currentTab = i;
      this.$router.push(`/blog/category/${this.currentTab}`);
    },
    selectMenu(n) {
      this.currentMenu = n;
      this.$router.push(
        `/blog/category/${this.currentTab}/${this.currentMenu}/`,
      );
    },
    selectSubmenu(submenu) {
      this.currentSubmenu = submenu;
      this.$router.push(
        `/blog/category/${this.currentTab}/${this.currentMenu}/${
          this.currentSubmenu
        }/`,
      );
    },
  },
};
</script>

<style scoped>
  .submenu-top {
    height: 35px;
    background-color: antiquewhite;
  }

  .menuItem {
    margin: 5px auto;
    margin-left: 10px;
    font-size: 16px;
    border-bottom: solid 1px black;
  }

  .menuItem:hover {
    cursor: pointer;
    color: blue;
  }

  .goup {
    margin-bottom: 45px;
    margin-right: 15px;
    border-radius: 50%;
  }

  .new_article {
    margin-top: 70px;
    margin-right: 15px;
    border-radius: 50%;
    background-color: #7a22ff;
    color: white;
  }

  .tab_header {
    border-bottom: solid 1px black;
  }

  .submenu-selected {
    font-weight: bold;
  }

  .tab-selected {
    font-weight: bold;
  }

  .needSpace {
    margin-left: 20px;
  }

  .transparent {
    background-color: blue;
    opacity: 0.4;
    border-color: transparent !important;
  }
</style>
