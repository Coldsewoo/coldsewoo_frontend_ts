<template>
  <div class="post-wrapper">
    <v-layout sm6 xs12>
      <v-card class="post">
        <v-card-title primary-title>
          <div class="date">
            <p>{{ createdDay }}</p>
          </div>
          <hr />
          <div class="profile">
            <div class="profile-row">
              <v-img :src="post.userAvatar" class="profile-img"></v-img>
            </div>
            <div class="profile-user">
              <h3 class="profile-name">{{ post.userNickname }}</h3>
              <hr />
              <h5
                class="profile-id"
                @click="findByItemFromPost({ username: post.username })"
              >@{{ post.username }}</h5>
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
                <v-list-tile v-if="user && user.username === post.username" @click="editPage">
                  <v-list-tile-title>Edit</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="isAdminOrUser(post)" @click="deleteEvent">
                  <v-list-tile-title>Delete</v-list-tile-title>
                </v-list-tile>
                <v-list-tile :to="`/users/profile/${post.username}`">
                  <v-list-tile-title>User profile</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
          <hr />
          <v-flex ma-1>
            <v-img
              :src="post.thumbnail"
              width="449"
              max-width="449"
              max-height="500"
              class="post-image"
              :class="post.filter"
              @click="openImage"
            ></v-img>
          </v-flex>
          <hr />
          <div class="like">
            <ul class="like">
              <li @click="likePressed">
                <v-icon :color="likePress.color">favorite</v-icon>
              </li>
              <span>{{ likePress.count }} {{ likesText }}</span>
            </ul>
          </div>
          <hr />
          <p class="post-content light">{{ messageWithLine }}</p>
          <hr />
          <div>
            <span
              v-for="(hashTag, i) in post.categories"
              :key="i"
              class="hashtaghover font-weight-bold"
              @click="findByItemFromPost({ categories: hashTag })"
            >#{{ hashTag }}</span>
          </div>
          <hr />

          <div class="comment-inputbox">
            <div class="comment-input">
              <v-text-field
                v-model.lazy="commentInput"
                class="write-box mt-0 pt-0"
                label="Add comment"
                single-line
                append-outer-icon="send"
                clearable
                @keydown.enter="addCommentKeyboard"
                @click:append-outer="addComment"
              ></v-text-field>
            </div>
          </div>

          <div class="comments">
            <div
              v-for="(comment, i) in post.comments"
              v-show="i < maximumComments"
              :key="comment._id"
              class="comments-wrapper"
            >
              <v-flex xs2>
                <div class="comments-nickname">
                  <v-img :src="comment.userAvatar" class="comments-nickname-image"></v-img>
                </div>
              </v-flex>
              <v-flex xs9>
                <div class="comments-content">
                  <span class="comments-content-nickname">
                    <router-link
                      :to="`/users/profile/${comment.username}`"
                    >{{ comment.userNickname }}</router-link>
                  </span>
                  <span class="comments-content-message">{{ comment.message }}</span>
                </div>
              </v-flex>
              <v-flex xs1>
                <div v-if="isAdminOrUser(comment)" class="delete-comment">
                  <button @click.prevent="deleteComment(comment)">x</button>
                </div>
              </v-flex>
            </div>
            <div v-if="maximumComments < post.comments.length" class="more">
              <button @click.prevent="maximumComments += 10">...More</button>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import EventBus from '@/EventBus.js';
import { monthEng } from '@/lib/globalVar'

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commentInput: '',
      commentStatus: 'None',
      maximumComments: 5,
      deleteCommentStatus: 'None',
      monthEng,
    };
  },
  computed: {
    createdDay() {
      const date = this.post.created.toString();
      const year = parseInt(date.substring(0, 4));
      const month = parseInt(date.substring(4, 6));
      const day = date.substring(6, 8);
      const result = `${this.monthEng[month - 1]} ${day} ${year}`;
      return result;
    },
    hashSelector() {
      return this.$store.state.postStore.hashSelector;
    },
    likesText() {
      if (this.likePress.count > 1) return 'Likes';
      return 'Like';
    },
    messageWithLine() {
      return this.post.message.trim();
    },
    user() {
      return this.$store.state.user;
    },
    likePress() {
      return {
        status: this.post.likes.includes(this.user.username),
        color: this.post.likes.includes(this.user.username) ? 'red' : 'black',
        count: this.post.likes.length,
      };
    },
    likes() {
      return this.post.likes.slice();
    },
  },
  watch: {
    async commentStatus() {
      if (this.commentStatus === 'Done') {
        EventBus.$emit('commentUpdated', this.post._id);
        this.commentStatus = 'None';
      }
    },
  },
  methods: {
    deleteEvent() {
      if (this.isAdminOrUser(this.post)) {
        this.$store.dispatch('postStore/deletePost', this.post);
      }
    },
    editPage() {
      if (this.user && this.user.username === this.post.username) {
        this.$store.commit('postStore/changeStep', 5);
        this.$nextTick(() => {
          this.$store.dispatch('postStore/editPage', this.post);
        });
      }
    },
    openImage() {
      window.open(this.post.imageURL);
    },
    findByItemFromPost(e) {
      this.$store.commit('postStore/findByItem', e);
    },
    likePressed() {
      if (!this.$store.state.isLoggedIn) { return this.$router.replace('/users/login'); }
      if (this.likes.includes(this.user.username)) {
        this.likePressed.status = true;
        this.likePressed.color = 'black';
        const index = this.likes.indexOf(this.user.usernmae);
        this.likes.splice(index, 1);
        this.likePressed.likesCount--;
      } else {
        this.likePressed.status = false;
        this.likePressed.color = 'red';
        this.likes.push(this.user.username);
        this.likePressed.likesCount++;
      }
      this.$store.dispatch('postStore/editLike', {
        post: this.post,
        likes: this.likes,
      });
    },
    addComment() {
      const payload = {
        post_id: this.post._id,
        commentInput: this.commentInput,
      };
      this.commentStatus = 'Pending';
      this.$store.dispatch('postStore/addComment', payload).then((status) => {
        if (status === 200) {
          this.commentStatus = 'Done';
          this.commentInput = '';
        }
      });
    },
    addCommentKeyboard(e) {
      if (e.keyCode !== 13) return;
      this.addComment();
    },
    deleteComment(comment) {
      if (this.isAdminOrUser(comment)) {
        this.commentStatus = 'Pending';
        this.$store
          .dispatch('postStore/deleteComment', {
            _id: comment._id,
            post_id: this.post._id,
          })
          .then((status) => {
            if (status === 200) {
              this.commentStatus = 'Done';
              this.commentInput = '';
            }
          });
      }
    },
    isAdminOrUser(item) {
      if (!this.user) return false;
      if (this.user.role === 'Admin') return true;
      if (this.user.role === 'Owner') return true;
      return this.user.username === item.username;
    },
  },
};
</script>

<style scoped>
  a {
    color: #4000ff;
    text-decoration: none;
  }

  button:focus {
    outline: 0;
  }
  .post {
    width: 455px;
    border: 1px solid #7b22ee33;
    padding: 1px;
    background-color: gray(94.2%);
    display: block;
    margin-bottom: 1px;
    margin-top: 1px;
  }
  .post hr {
    width: 100%;
    border: none;
  }

  .post-image {
    border-radius: 1%;
    margin-left: -15px;
    right: 4px;
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
    padding-left: 12px;
    font-size: 20px;
    padding-top: 3px;
  }

  .profile-id {
    display: block;
    float: left;
    padding-left: 16px;
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
    padding-left: 15px;
  }
  .edit-remove button {
    margin-left: 20px;
  }

  .like {
    display: block;
    padding-left: 6px;
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
    padding-left: 10px;
    padding-right: 15px;
    padding-top: 5px;
    margin-top: 5px;
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
    padding-left: 3px;
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
    padding-left: 3px;
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
    padding-bottom: 3px;
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
    background-color: #e6e7ffbf;
    border-radius: 5px;
    padding: 5px 8px;
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
    color: #000000;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .comments-content-nickname:hover {
    color: #0000ff;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .delete-comment {
    margin-left: 15px;
    color: white;
    font-size: 18px;
    margin-top: 5px;
  }

  .delete-comment:hover {
    color: red;
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
</style>
