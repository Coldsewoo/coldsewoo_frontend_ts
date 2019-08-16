<template>
  <v-container>
    <v-layout row wrap pt-1 pb-1 ma-1>
      <v-layout>
        <v-flex xs12>
          <v-tabs height="30" slider-color="green">
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
                  <v-flex v-if="currentTab" xs3 md2>
                    <p
                      v-for="(menu, n) in ordered[currentTab]"
                      :key="n"
                      :class="{ 'submenu-selected': currentMenu === n }"
                      class="menuItem"
                      @click="selectMenu(n)"
                    >{{ n }}</p>
                  </v-flex>
                  <v-flex v-if="currentMenu" xs4 md2>
                    <p
                      v-for="(submenu, j) in ordered[currentTab][currentMenu]"
                      :key="j"
                      :class="{
                        'submenu-selected': currentSubmenu === submenu
                      }"
                      class="menuItem"
                      v-show="submenu !== '_'"
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
              small
              class="new_article green"
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
              v-if="role >= menu.priv"
              active-class="none"
              class="menu-list"
            >
              <v-icon color="green">{{ menu.icon }}</v-icon>
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
        small
        class="error goup"
        @click.native="goup"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import blogStore from '@/modules/store/blogStore'

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
          priv: 0,
        },
        {
          name: 'New Article',
          path: '/blog/newarticle',
          icon: 'library_add',
          priv: 2,
        },
        {
          name: 'Manage Category',
          path: '/blog/editcategory',
          icon: 'format_list_bulleted',
          priv: 2,
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
    role() {
      return this.$store.state.role
    },
  },
  created() {
    this.$store.registerModule('blogStore', blogStore)
  },
  mounted() {
    this.getCategories();
    const query = this.$route.params;
    this.currentTab = query.tab || '';
    this.currentMenu = query.menu || '';
    this.currentSubmenu = query.submenu || '';
    console.log()
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
    background-color: green;
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
    background-color: green;
    opacity: 0.4;
    border-color: transparent !important;
  }
</style>
