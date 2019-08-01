<template>
  <div class="app">
    <v-app>
      <v-navigation-drawer v-if="drawer.open" width="460" permanent app>
        <v-list>
          <v-list-tile>
            <v-list-tile-action @click="drawer.open = !drawer.open">
              <v-icon class="pa-1">close</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <!-- <v-list-tile class="list-tile" to="/">
            <v-list-tile-action>
              <v-icon color="primary">dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider /> -->
          <v-list-tile class="list-tile" to="/blog/home">
            <v-list-tile-action>
              <v-icon>ballot</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Blog</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile class="list-tile" to="/currency">
            <v-list-tile-action>
              <v-icon>attach_money</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Currency Exchanger</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile class="list-tile" to="/vuestagram" @click="changeStep(1)">
            <v-list-tile-action>
              <v-icon>collections</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Vuestagram</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />
          <v-list-tile class="list-tile" to="/about" @click="changeStep(1)">
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>About</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar flat app permanent>
        <v-toolbar-side-icon class="toolbar-expand-button" @click.stop="toggleDrawer" />
        <v-toolbar-title class="toolbar-title">
          <router-link to="/" tag="a">
            <span class="text-black">Cold</span>
            <span class="text-purple">sewoo</span>
          </router-link>
        </v-toolbar-title>
        <v-spacer />
        <v-menu :nudge-top="-5" offset-y allow-overflow>
          <template v-slot:activator="{ on }">
            <v-btn color="black" dark icon v-on="on">
              <v-icon v-if="!isLoggedIn" large>account_circle</v-icon>
              <img v-if="isLoggedIn" :src="user.avatar" class="avatar" />
            </v-btn>
          </template>
          <v-list>
            <v-list-tile v-if="!isLoggedIn" class="wantSmall" to="/users/login">
              <v-list-tile-title>Login</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="!isLoggedIn" to="/users/newaccount">
              <v-list-tile-title>New Account</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="isLoggedIn" @click="logout">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="'/users/profile/' + user.username">
              <v-list-tile-title>My Profile</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <div class="footer-plus" v-for="(err, i) in errorsList" :key="i">
        <v-alert
          :value="true"
          class="errorAlert"
          type="error"
          color="error"
          transition="scale-transition"
          @click="errorChecked(i)"
        >{{err.message}}</v-alert>
      </div>

      <v-content>
        <router-view />
      </v-content>

      <v-footer class="pa-3" permanent app>
        <v-spacer />
        <div class="footer">
          &copy; {{ new Date().getFullYear() }}
          Coldsewoo
        </div>
        <v-menu open-on-hover top offset-y>
          <template v-slot:activator="{ on }">
            <img src="@/assets/GitHubMark.png" width="25" height="25" v-on="on" />
          </template>
          <v-list class="footer-v-list">
            <v-list-tile
              class="list-tile footer-tile"
              href="https://github.com/Coldsewoo/coldsewoo_frontend"
            >
              <v-list-tile-title color="primary">Frontend</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              class="list-tile footer-tile"
              href="https://github.com/Coldsewoo/coldsewoo_backend"
            >
              <v-list-tile-title color="primary">Backend</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { throws } from 'assert';

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

export default {
  name: 'App',
  data() {
    return {
      drawer: {
        open: false,
      },
      toolbar: {
        fixed: true,
      },
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    user() {
      return this.$store.state.user;
    },
    tooManyRequests() {
      return this.$store.state.tooManyRequests;
    },
    errorsList() {
      return this.$store.state.errorsList;
    },
  },
  watch: {
    token() {
      if (this.token.token) this.$store.dispatch('getUser');
    },
    $route(to, from) {
      this.$store.commit('resetErrors')
      this.drawer.open = false;
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$store.dispatch('getUser');
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('userStore/logout');
    },
    changeStep(step) {
      this.$store.commit('postStore/changeStep', step);
    },
    // changes the drawer to permanent
    makeDrawerPermanent() {
      this.drawer.permanent = true;
      // set the clipped state of the drawer and toolbar
      this.drawer.clipped = false;
      this.toolbar.clippedLeft = false;
    },
    // toggles the drawer variant (mini/full)
    toggleMiniDrawer() {
      this.drawer.mini = !this.drawer.mini;
    },
    // toggles the drawer type (permanent vs temporary) or shows/hides the drawer
    toggleDrawer() {
      if (this.drawer.permanent) {
        this.drawer.permanent = !this.drawer.permanent;
        // set the clipped state of the drawer and toolbar
        // this.drawer.clipped = true;
        // this.toolbar.clippedLeft = true;
      } else {
        this.drawer.open = !this.drawer.open;
      }
    },
    errorChecked(i) {
      this.errorsList.splice(i, 1)
    },
  },
};
</script>

<style scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: #7e29ff;
  }

  #inspire {
    background-color: white;
  }

  #app {
    font-family: "Noto Sans KR", "AppleGothic", "Avenue";
    width: 100%;
    background: #fff;
    margin: auto;
    position: relative;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
  }
  .testBtn {
    top : 50px;
  }
  .text-black {
    color: rgb(74, 74, 74) !important;
    float: left;
    font-weight: 600;
  }

  .text-purple {
    color: green !important;
    font-weight: 600;
  }

  .v-toolbar--fixed {
    background-color: white !important;
  }

  .v-toolbar__title {
    color: #6600ff;
  }

  .toolbar-expand-button:hover {
    background-color: #964fff22;
  }

  .toolbar-expand-button:active {
    background-color: #964fffee;
  }

  .list-tile:hover {
    background: #964fff22;
  }

  .list-tile:active {
    background: #964fffee;
  }

  .list-title-icon-close i:hover {
    cursor: pointer;
    border-radius: 50%;
    background-color: #954fff3c;
  }

  .v-toolbar__title {
    color: greenyellow;
  }

  .v-toolbar__side-icon {
    color: green !important;
    padding-top: 2px;
  }
  .v-btn--icon {
    width: 40px !important;
    height: 40px !important;
  }

  .avatar {
    border-radius: 50%;
    border: solid 1px #954fff3c;
    background: white;
    width: 40px !important;
    height: 40px !important;
  }

  .footer-v-list {
    margin: 0;
  }

  .footer-tile {
    color: #7e29ff;
  }

  .footer {
    margin-right: 5px;
  }

  .errorAlert {
    z-index: 5;
    width: 460px;
  }

  .footer-plus {
    width: 100%;
    position: fixed;
    top: 62px;
    float: top;
    background: none;
    z-index: 4;
    padding-right: 4px;
  }

  .footer-button-plus {
    width: 80px;
    margin: 0 auto;
    text-align: center;
    cursor: pointer;
    font-size: 30px;
    color: skyblue;
  }

  .inputfile {
    display: none;
  }

  .navbar-btn {
    border-radius: 15px;
  }
</style>
