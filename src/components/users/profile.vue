<template>
  <v-layout class="layout" sm6 xs12 align-center justify-center>
    <div class="text-xs-center ">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline red lighten-2" primary-title>
            Delete Account
          </v-card-title>

          <v-card-text class="subheading">
            Are you sure to delete your account : {{ user.username }} ?
            <br />
            All your posts also will be deleted!
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="error" flat @click="deleteAccount">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <span class="post2" @click="showProfile = !showProfile">
      {{ postText }}
    </span>
    <v-card class="post">
      <div v-show="showProfile" class="show">
        <v-card-title primary-title>
          <hr />
          <div class="profile">
            <div class="profile-row">
              <v-img :src="user.avatar" class="profile-img"></v-img>
            </div>
            <div class="profile-user">
              <h3 class="profile-name">{{ user.nickname }}</h3>
              <hr />
              <h5 class="profile-id">@{{ user.username }}</h5>
              <br />
            </div>
          </div>
          <v-spacer></v-spacer>
          <div class="edit-remove">
            <v-menu offset-y :nudge-top="-5" :nudge-left="5" allow-overflow>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>more_horiz</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile
                  v-show="myUser.username && myUser.username === user.username"
                  :to="'/users/edit/' + myUser.username"
                >
                  <v-list-tile-title>
                    Edit Profile
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-show="
                    myUser.username &&
                      (myUser.username === user.username ||
                        myUser.role === 'Owner')
                  "
                  @click="dialog = true"
                >
                  <v-list-tile-title>
                    Delete Account
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>

          <hr />
          <p class="post-content light">
            {{ user.status }}
          </p>
          <hr />
        </v-card-title>
      </div>
      <!--
        <v-card-actions>
          <v-btn flat color="orange">Share</v-btn>
          <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions> -->
    </v-card>
    <div class="wrapper">
      <Post v-for="(post, i) in filteredPosts" :key="i" :post="post" />
    </div>
  </v-layout>
</template>

<script>
import EventBus from '@/EventBus.js';
import { createNamespacedHelpers } from 'vuex';
import Post from '../posts/Post.vue';

const {
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} = createNamespacedHelpers('postStore');

export default {
  components: {
    Post,
  },
  props: {
    username: String,
  },
  data() {
    return {
      user: {},
      showProfile: true,
      dialog: false,
    };
  },
  computed: {
    ...mapState([
      'posts',
      'step',
      'localImageURL',
      'itemSelector',
      'imageUploading',
      'filters',
      'currentPost',
      'maxPost',
      'updateStatus',
    ]),
    filteredPosts() {
      return this.$store.getters['postStore/filteredPosts'].slice(
        0,
        this.maxPost,
      );
    },
    myUser() {
      return {
        username: this.$store.state.token.username,
        role: this.$store.state.token.role,
      };
    },
    postText() {
      return this.showProfile ? 'Hide Profile' : 'Show Profile';
    },
  },
  watch: {
    $route() {
      this.$store.dispatch('getUser', this.username).then((data) => {
        this.user = data;
      });
    },
    posts: {
      handler() {},
      deep: true,
    },
    step() {
      if (this.step === 1) {
        this.getPosts();
        this.message = '';
        this.hashtags = {
          items: [],
          text: '',
          status: false,
        };
        this.filterSelected = 'normal';
        this.$nextTick(() => {
          window.scroll(0, 0);
        });
      }
    },
  },
  mounted() {
    this.getPosts();
    this.scroll();
    this.$store.commit('postStore/findByItem', {
      username: this.username,
    });
    this.$store.dispatch('getUser', this.username).then((data) => {
      if (!data) this.$router.push('/404');
      else this.user = data;
    });
    EventBus.$on('commentUpdated', async (_id) => {
      this.getPosts();
    });
  },
  methods: {
    ...mapActions(['getPosts', 'onImageSelected']),
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop,
          ) +
            window.innerHeight >=
          document.documentElement.scrollHeight - 2;
        if (bottomOfWindow) {
          this.$store.commit('postStore/pending', 'bottom');
          setTimeout(() => {
            this.$store.commit('postStore/pending', 'false');
            this.$store.commit('postStore/maxPost');
          }, 1000);
        }
      };
    },
    deleteAccount() {
      this.$store.dispatch('userStore/deleteAccount', this.user);
    },
  },
};
</script>

<style scoped>
hr {
  display: block;
}

button:focus {
  outline: 0;
}

.layout {
  margin: 5px auto;
  margin-bottom: 25px;
}

.post {
  width: 460px;
  border: 1px solid #7b22ee33;
  padding: 1px;
  background-color: gray(94.2%);
  width: 460px;
  position: fixed;
  top: 65px;
  z-index: 2;
  border: 1px solid #7b22ee11;
  background-color: #fafafa;
  overflow-y: auto;
}

.post2 {
  width: 460px;
  border: none;
  padding: 1px;
  background-color: gray(94.2%);
  width: 460px;
  position: fixed;
  top: 65px;
  z-index: 5;
  color: #7b22ee;
  margin: 0 auto;
  text-align: center;
  font-size: 15px;
}
.post hr {
  width: 100%;
  border: none;
}

.wrapper {
  margin-top: 40px;
  margin-bottom: 150px;
}

.post-image {
  border-radius: 1%;
  margin-left: -15px;
  border: solid 1px slategray;
}

.profile {
  display: flex;
  margin-bottom: 20px;
}

.profile-user {
  padding-top: 10px;
  padding-left: 0px;
  padding-bottom: 15px;
}

.profile-img {
  width: 63px;
  height: 63px;
  background-size: 100%;
  border-radius: 50%;
  padding-top: 17px;
  margin-top: 2px;
  float: left;
  border: solid 1.5px #7b22ee;
}
.profile-name {
  display: flex;
  float: left;
  padding-left: 17px;
  font-size: 20px;
  padding-top: 3px;
}

.profile-id {
  display: block;
  float: left;
  padding-left: 21px;
  padding-top: 5px;
  font-size: 13px;
  cursor: pointer;
}

.profile-id:hover {
  color: blue;
}
.post-header {
  height: 30px;
  padding: 10px;
}

.edit-remove {
  padding-bottom: 25px;
  padding-left: 20px;
}
.edit-remove button {
  margin-left: 20px;
}

.like {
  display: block;
  padding-left: 16px;
  padding-right: 15px;
  padding-top: 10px;
}

.like li {
  cursor: pointer;
  list-style-type: none;
  float: left;
  font-size: 12px;
  margin-bottom: 3px;
}
.like span {
  display: flex;
  margin-left: 20px;
  font-size: 15px;
}

.like i {
  display: flex;
  font-size: 15px;
  padding-top: 4px;
  margin-right: 10px;
}

.post-body {
  height: 350px;
  background-position: center;
  background-size: cover;
  padding: 5px;
  cursor: pointer;
}
.post-content {
  display: block;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 14px;
  white-space: pre-line;
}
.date {
  display: block;
  font-size: 12px;
  color: grey;
  margin-left: 10px;
  margin-bottom: 0px;
  margin-top: 3px;
  padding: 5px;
  width: 100%;
  text-align: right;
}

.date p {
  margin-bottom: 0px;
}

.hashtaghover:first-child {
  margin-left: 10px;
}

.hashtaghover {
  padding-left: 5px;
  cursor: pointer;
}

.hashtaghover:hover {
  color: blue;
}

.delete-button {
  color: red;
  float: right;
  width: 40px;
  cursor: pointer;
  margin-top: 5px;
}

.delete-button li {
  list-style-type: none;
}

.edit-button {
  color: blue;
  float: right;
  width: 0;
  cursor: pointer;
  margin-top: 5px;
}

.edit-button li {
  list-style-type: none;
}

.comment-inputbox {
  margin-top: 5px;
  margin-left: 15px;
  margin-bottom: 5px;
}

.comments-header {
  margin-bottom: 5px;
}

.comment-input {
  display: flex;
  width: 410px;
  height: 25px;
}
.v-input__slot {
  height: 35px;
  padding: 0 5px;
}
.v-input__control {
  height: 48px;
}

.comment-input button {
  margin-left: 10px;
  padding-left: 5px;
  padding-top: 10px;
  width: 40px;
  height: 30px;
}
.comment-input input {
  border: 1px solid black;
  width: 100%;
  height: 25px;
  padding: 5px;
  display: flex;
  outline: none;
  border-radius: 50%;
}
.comment-input {
  font-size: 28px;
  margin-top: 2px;
}

.comments {
  margin-top: 20px;
  padding: 5px;
  margin-left: 10px;
}

.comments-wrapper {
  width: 410px;
  display: flex;
  margin-bottom: 0px;
  padding-bottom: 10px;
}

.comments-nickname {
  display: inline-block;
}

.comments-nickname-image {
  width: 40px;
  height: 40px;
  background-size: 100%;
  border-radius: 50%;
  padding-top: 17px;
  float: left;
}

.comments-content {
  margin-left: -23px;
  background-color: #6a8fff82;
  border-radius: 12px;
  padding: 5px 10px;
  margin-top: 4px;
}

.comments-content-message {
  word-wrap: break-word;
  font-size: 14px;
  margin-left: 7px;
}

.comments-content-nickname {
  font-size: 13px;
  cursor: pointer;
  color: #7b22ee;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
.comments-content-nickname:hover {
  color: #0000ff;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.delete-comment {
  margin-left: 15px;
  color: red;
  font-size: 15px;
  margin-top: 5px;
}

.more {
  float: center;
}

.more button {
  background: white;
  border: none;
  color: blue;
  float: center;
  width: 100px;
  cursor: pointer;
  margin: 10px auto;
  display: block;
  padding-right: 20px;
  size: 16px;
}

.wrapper > div {
  margin-bottom: 15px;
}
.wrapper > div:last-child {
  margin-bottom: 10px;
}
</style>
