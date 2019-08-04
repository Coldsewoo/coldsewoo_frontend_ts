<template>
  <v-layout wrap class="comments">
    <v-flex class="comment-inputbox" xs12>
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
    </v-flex>
    <v-flex class="comments" xs12>
      <div v-for="(comment, i) in comments" :key="comment._id">
        <div class="comments-wrapper">
          <v-flex xs2 md1>
            <div class="comments-nickname">
              <v-img :src="comment.userAvatar" class="comments-nickname-image"></v-img>
            </div>
          </v-flex>
          <v-flex xs9 md10>
            <div class="comments-content">
              <div class="comments-content-nickname">
                <router-link :to="`/users/profile/${comment.username}`">{{ comment.userNickname }}</router-link>
                <span class="date">{{comment.created}}</span>
                <button class="reply-comment" @click.prevent="toggleReplyInput(comment._id)">
                  <v-icon>edit</v-icon>댓글달기
                </button>
                <button
                  class="delete-comment"
                  v-if="isAdminOrUser(comment)"
                  @click.prevent="deleteComment(comment)"
                >x</button>
              </div>
              <v-divider class="comment-divider"></v-divider>

              <span class="comments-content-message">{{ comment.message }}</span>
            </div>
            <div class="comment-input" v-if="replyToggled[comment._id]">
              <v-text-field
                v-model.lazy="replyInput[comment._id]"
                class="write-box mt-0 pt-0"
                label="Add comment"
                single-line
                append-outer-icon="send"
                clearable
                @keydown.enter="addReplyKeyboard(comment._id)"
                @click:append-outer="addReply(comment._id)"
              ></v-text-field>
            </div>
          </v-flex>
        </div>
        <div
          v-for="(reply, index) in comment.reply"
          :key="reply._id"
          class="reply comments-wrapper"
        >
          <v-flex xs9 md10>
            <div class="comments-content">
              <div class="comments-content-nickname">
                <router-link :to="`/users/profile/${reply.username}`">{{ reply.userNickname }}</router-link>
                <span class="date">{{reply.created}}</span>
                <button
                  v-if="isAdminOrUser(reply)"
                  class="delete-comment"
                  @click.prevent="deleteComment(reply)"
                ></button>
              </div>
              <v-divider class="comment-divider"></v-divider>

              <span class="comments-content-message">{{ reply.message }}</span>
            </div>
          </v-flex>
          <v-flex xs2 md1>
            <div class="comments-nickname">
              <v-img :src="reply.userAvatar" class="comments-nickname-image reply-image"></v-img>
            </div>
          </v-flex>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      commentInput: '',
      replyInput: {},
      comments: [],
      replyToggle: {},
    }
  },
  computed: {
    replyToggled() {
      return this.replyToggle;
    },
  },
  watch: {
  },
  methods: {
    addCommentKeyboard() { },
    addComment() { },
    deleteComment() { },
    isAdminOrUser(param) { return true },
    replyComment() { },
    toggleReplyInput(_id) {
      this.$set(this.replyToggle, _id, true);
      this.$set(this.replyInput, _id, '')
    },
    addReplyKeyboard() { },
    addReply() { },
  },
}
</script>

<style lang="scss" scoped>
  $comment-background: rgba(141, 147, 142, 0.043);

  a {
    color: rgb(0, 82, 0);
    text-decoration: none;
    font-weight: bold;
  }

  .v-list__tile__title {
    word-wrap: break-word;
    font-size: 14px;
    margin-left: 7px;
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
    width: 90%;
    height: 25px;
    margin: 10px auto;
    padding: 3px;
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
    width: 90%;
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 3px;
  }

  .comments-nickname {
    display: inline-block;
  }

  .comments-nickname-image {
    width: 60px;
    height: 60px;
    background-size: 100%;
    border-radius: 20%;
    padding-top: 20px;
    float: left;
    border: solid 1px rgba(0, 0, 0, 0.201);
  }

  .comments-content {
    margin-left: 5px;
    padding: 5px 8px;
    margin-top: 4px;
    background-color: $comment-background;
  }

  .comments-content-message {
    word-wrap: break-word;
    font-size: 16px;
    margin-left: 7px;
  }

  .comment-divider {
    background-color: black;
    margin-bottom: 10px;
  }

  .comments-content-nickname {
    position: relative;
    padding-left: 5px;
    margin-bottom: 5px;
    font-size: 15px;
    color: #000000;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;

    .date {
      padding-left: 5px;
      font-weight: 450;
    }

    .delete-comment {
      position: absolute;
      right: 5px;
      color: $comment-background;
    }

    .delete-comment:hover {
      color: red;
    }

    .reply-comment {
      position: absolute;
      right: 20px;
      color: black;
    }
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

  .reply {
    margin-left: 60px;
  }

  .reply-image {
    margin-left: 5px;
  }
</style>
