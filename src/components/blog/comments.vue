<template>
  <v-layout wrap class="comments">
    <v-flex class="comment-inputbox" xs12>
      <div class="comment-input">
        <v-textarea
          v-model.lazy="commentInput"
          class="write-box mt-0 pt-0"
          label="Add comment"
          append-outer-icon="send"
          clearable
          @click:append-outer="addComment"
        ></v-textarea>
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
                  <v-icon small>subdirectory_arrow_right</v-icon>댓글달기
                </button>
                <button
                  class="edit-comment"
                  v-if="isAdminOrUser(comment)"
                  @click.prevent="toggleEdit(comment)"
                >
                  <v-icon color="primary" small>edit</v-icon>
                </button>
                <button
                  class="delete-comment"
                  v-if="isAdminOrUser(comment)"
                  @click.prevent="deleteComment(comment._id)"
                >x</button>
              </div>
              <v-divider class="comment-divider"></v-divider>

              <span class="comments-content-message">{{ comment.message }}</span>
            </div>
            <div class="comment-sub-input" v-if="editToggle[comment._id]">
              <v-textarea
                v-model.lazy="editInput[comment._id]"
                class="write-box"
                label="Edit Comment"
                append-outer-icon="send"
                clearable
                @click:append-outer="editComment(comment)"
              ></v-textarea>
            </div>
            <div class="comment-sub-input" v-if="replyToggled[comment._id]">
              <v-textarea
                v-model.lazy="replyInput[comment._id]"
                class="write-box ma-1 pa-1"
                label="Add Reply Message"
                append-outer-icon="send"
                clearable
                @click:append-outer="addReply(comment)"
              ></v-textarea>
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
                  @click.prevent="deleteReply(reply)"
                >x</button>
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
  props: {
    comments: {
      type: Object,
      default: [],
    },
  },
  data() {
    return {
      commentInput: '',
      replyInput: {},
      replyToggle: {},
      editToggle: {},
      editInput: {},
    }
  },
  computed: {
    replyToggled() {
      return this.replyToggle;
    },
    article() {
      return this.$store.state.blogStore.currentArticle
    },
  },
  watch: {
    comments(val) {
      this.comments = val;
    },
  },
  methods: {
    addComment() {
      const payload = {
        articleId: this.article.articleId,
        message: this.commentInput,
      };
      this.$store.dispatch('blogStore/addComment', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId)
          this.commentInput = ''
        })
    },
    editComment(comment) {
      const payload = {
        articleId: this.article.articleId,
        commentId: comment._id,
        message: this.editInput[comment._id],
      }
      this.$store.dispatch('blogStore/editComment', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId)
          this.editToggle = {}
          this.editInput = {}
          this.replyToggle = {}
          this.replyInput = {}
        })
    },
    deleteComment(_id) {
      const payload = {
        articleId: this.article.articleId,
        commentId: _id,
      }
      this.$store.dispatch('blogStore/deleteComment', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId)
        })
    },
    addReply(comment) {
      const payload = {
        articleId: this.article.articleId,
        commentId: comment._id,
        message: this.replyInput[comment._id],
      }
      this.$store.dispatch('blogStore/addReply', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId)
          this.editToggle = {}
          this.editInput = {}
          this.replyToggle = {}
          this.replyInput = {}
        })
    },
    deleteReply(reply) {
      const payload = {
        articleId: this.article.articleId,
        commentId: reply.commentId,
        replyId: reply._id,
      }
      this.$store.dispatch('blogStore/deleteReply', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId)
        })
    },
    isAdminOrUser(param) { return true },
    toggleReplyInput(_id) {
      this.$set(this.replyToggle, _id, true);
      this.$set(this.replyInput, _id, '')
    },
    toggleEdit(comment) {
      this.$set(this.editToggle, comment._id, true);
      this.$set(this.editInput, comment._id, comment.message)
    },

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
    padding: 5px;
    outline: none;
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
    display: block;
    word-wrap: break-word;
    font-size: 16px;
    margin-left: 7px;
    white-space: pre-line;
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
      right: 10px;
      color: red;
    }

    .edit-comment {
      position: absolute;
      right: 20px;
      color: blue;
    }

    .reply-comment {
      position: absolute;
      right: 45px;
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
