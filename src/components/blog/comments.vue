<template>
  <v-layout wrap class="comments">
    <v-flex class="comment-inputbox" xs12>
      <v-form ref="form" class="comment-input-items">
        <v-layout row wrap>
          <v-layout xs12 class="comment-input-items-nickname">
            <v-flex xs5 md4>
              <v-text-field
                v-model="commentInput.userNickname"
                :disabled="isLoggedIn"
                single-line
                :rules="[
                  rules.userNickname.required,
                  rules.userNickname.counter
                ]"
                :counter="isLoggedIn ? false : 15"
                prepend-icon="person_outline"
                label="Nickname"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs5 md4 offset-xs1>
              <v-text-field
                v-if="!isLoggedIn"
                v-model="commentInput.password"
                :rules="[rules.password.required, rules.password.counter]"
                prepend-icon="lock"
                label="Password"
                counter="15"
                type="password"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-flex xs12 class="comment-input">
            <v-textarea
              v-model.lazy="commentInput.comment"
              class="write-box mt-0 pt-0"
              label="Comment"
              append-outer-icon="send"
              counter="250"
              clearable
              :rules="[rules.comment.required, rules.comment.counter]"
              auto-grow
              prepend-icon="chat"
              :rows="isLoggedIn ? 2 : 1"
              @click:append-outer="addComment"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>

    <v-flex class="comments comments--items" xs12>
      <div v-for="comment in comments" :key="comment._id">
        <div class="comments-wrapper">
          <v-flex xs2 md1>
            <div class="comments-nickname">
              <v-img
                :src="comment.userAvatar"
                class="comments-nickname-image"
                alt="Avatar"
              ></v-img>
            </div>
          </v-flex>
          <v-flex xs10 md11>
            <div class="comments-content">
              <div class="comments-content-nickname">
                <a
                  v-if="comment.anonymous"
                  href="/"
                  @click.prevent=""
                  class="anonymous"
                >
                  {{ comment.userNickname }}
                </a>
                <router-link
                  v-if="!comment.anonymous"
                  :to="`/users/profile/${comment.username}`"
                >
                  <v-icon small color="rgb(0,130,0)">beenhere</v-icon>

                  {{ comment.userNickname }}</router-link
                >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span class="date" v-on="on">{{
                      comment.created | moment("from", "now")
                    }}</span>
                  </template>
                  <span>{{
                    comment.created | moment("YYYY년 MMMM Do dddd a h:mm:ss")
                  }}</span>
                </v-tooltip>

                <button
                  class="reply-comment"
                  @click.prevent="toggleReplyInput(comment._id)"
                >
                  <v-icon>subdirectory_arrow_right</v-icon>
                </button>
                <button
                  class="edit-comment"
                  v-if="
                    comment.anonymous ||
                      comment.username === $store.state.user.username
                  "
                  @click.prevent="toggleEdit(comment)"
                >
                  <v-icon color="primary">edit</v-icon>
                </button>
                <button
                  class="delete-comment"
                  v-if="comment.anonymous || hasPermission[comment._id]"
                  v-on="on"
                  @click="toggleDialog(comment._id)"
                >
                  <v-icon color="red">delete_outline</v-icon>
                </button>
                <v-dialog
                  persistent
                  v-model="dialog.show"
                  width="300"
                  v-if="comment._id === dialog.opened"
                >
                  <v-flex class="popup-modal">
                    <v-card v-if="!hasPermission[comment._id]">
                      <v-card-text>
                        비밀번호를 입력하세요
                        <v-text-field v-model="dialog.input" type="password"></v-text-field>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" flat @click="dialog.show = false">
                          취소
                        </v-btn>
                        <v-btn
                          color="primary"
                          flat
                          @click="deleteComment(comment)"
                        >
                          삭제
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <v-card v-if="hasPermission[comment._id]">
                      <v-card-text>
                        <span class="subheader grey-darken-1">
                          댓글을 삭제하시겠습니까?
                        </span>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" flat @click="dialog.show = false">
                          취소
                        </v-btn>
                        <v-btn
                          color="primary"
                          flat
                          @click="deleteComment(comment)"
                        >
                          삭제
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-dialog>
              </div>
              <v-divider class="comment-divider"></v-divider>
              <span class="comments-content-message">{{
                comment.comment
              }}</span>
            </div>

            <div class="comment-inputbox" v-if="editToggle[comment._id]">
              <v-form class="comment-input-items">
                <v-layout row wrap>
                  <v-layout xs12 class="comment-input-items-nickname">
                    <v-flex xs6 md4>
                      <v-text-field
                        v-if="
                          comment.anonymous ||
                            comment.username !== $store.state.user.username
                        "
                        v-model="editInput[comment._id].userNickname"
                        :disabled="true"
                        single-line
                        prepend-icon="person_outline"
                        label="Nickname"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6 md4>
                      <v-text-field
                        v-if="
                          comment.anonymous ||
                            comment.username !== $store.state.user.username
                        "
                        v-model="editInput[comment._id].password"
                        :rules="
                          $vuetify.breakpoint.xs
                            ? [
                                rules.password.xsrequired,
                                rules.password.xscounter
                              ]
                            : [rules.password.required, rules.password.counter]
                        "
                        prepend-icon="lock"
                        label="Password"
                        :counter="$vuetify.breakpoint.xs ? false : 15"
                        type="password"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12>
                    <v-textarea
                      v-model="editInput[comment._id].comment"
                      class="write-box"
                      label="Edit Comment"
                      append-outer-icon="send"
                      clearable
                      :rows="hasPermission[comment._id] ? 2 : 1"
                      @click:append-outer="editComment(comment)"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </div>

            <v-form
              class="comment-input-items reply"
              v-if="replyToggled[comment._id]"
            >
              <v-layout row wrap>
                <v-layout xs12 class="comment-input-items-nickname">
                  <v-flex xs4 md3>
                    <v-text-field
                      v-model="replyInput[comment._id].userNickname"
                      :disabled="isLoggedIn"
                      single-line
                      :rules="[
                        rules.userNickname.required,
                        rules.userNickname.counter
                      ]"
                      :counter="isLoggedIn ? false : 15"
                      prepend-icon="person_outline"
                      label="Nickname"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 md3 offset-xs1>
                    <v-text-field
                      v-if="!isLoggedIn"
                      v-model="replyInput[comment._id].password"
                      :rules="[rules.password.required, rules.password.counter]"
                      prepend-icon="lock"
                      label="Password"
                      counter="15"
                      type="password"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-flex xs12 class="comment-input">
                  <v-textarea
                    v-model.lazy="replyInput[comment._id].comment"
                    class="write-box mt-0 pt-0"
                    label="Comment"
                    append-outer-icon="send"
                    counter="250"
                    clearable
                    :rules="[rules.comment.required, rules.comment.counter]"
                    auto-grow
                    prepend-icon="chat"
                    :rows="isLoggedIn ? 2 : 1"
                    @click:append-outer="addReply(comment)"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </div>

        <div
          v-for="reply in comment.reply"
          :key="reply._id"
          class="reply-content comments-wrapper"
        >
          <v-flex xs9 md10>
            <div class="comments-content">
              <div class="comments-content-nickname">
                <a
                  v-if="reply.anonymous"
                  href="/"
                  @click.prevent=""
                  class="anonymous"
                >
                  {{ reply.userNickname }}
                </a>
                <router-link
                  v-if="!reply.anonymous"
                  :to="`/users/profile/${reply.username}`"
                >
                  <v-icon small color="rgb(0,130,0)">beenhere</v-icon>
                  {{ reply.userNickname }}
                </router-link>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span class="date" v-on="on">{{
                      reply.created | moment("from", "now")
                    }}</span>
                  </template>
                  <span>{{
                    reply.created | moment("YYYY년 MMMM Do dddd a h:mm:ss")
                  }}</span>
                </v-tooltip>

                <button
                  class="delete-comment"
                  v-if="reply.anonymous || hasPermission[reply._id]"
                  v-on="on"
                  @click="toggleDialog(reply._id)"
                >
                  <v-icon color="red">delete_outline</v-icon>
                </button>

                <v-dialog
                  persistent
                  v-model="dialog.show"
                  width="300"
                  v-if="reply._id === dialog.opened"
                >
                  <v-flex class="popup-modal">
                    <v-card v-if="!hasPermission[reply._id]">
                      <v-card-text>
                        비밀번호를 입력하세요
                        <v-text-field v-model="dialog.input" type="password"></v-text-field>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" flat @click="dialog.show = false">
                          취소
                        </v-btn>
                        <v-btn color="primary" flat @click="deleteReply(reply)">
                          삭제
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <v-card v-if="hasPermission[reply._id]">
                      <v-card-text>
                        <span class="subheader grey-darken-1">
                          댓글을 삭제하시겠습니까?
                        </span>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" flat @click="dialog.show = false">
                          취소
                        </v-btn>
                        <v-btn color="primary" flat @click="deleteReply(reply)">
                          삭제
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-dialog>
              </div>
              <v-divider class="comment-divider"></v-divider>

              <span class="comments-content-message">{{ reply.comment }}</span>
            </div>
          </v-flex>
          <v-flex xs2 md1 class="comments-reply-nickname-container">
            <div class="comments-nickname">
              <v-img
                :src="reply.userAvatar"
                class="comments-nickname-image reply-image"
                alt="Avatar"
              ></v-img>
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
      commentInput: {
        userNickname: '',
        password: '',
        comment: '',
      },
      rules: {
        userNickname: {
          required: value => !!value || '닉네임을 입력해주세요',
          counter: value => value.length <= 15 || '최대 15자까지 가능합니다',
        },
        password: {
          required: value => !!value || '비밀번호를 입력해주세요',
          counter: value => value.length <= 15 || '최대 15자까지 가능합니다',
          xsrequired: value => !!value || '비밀번호 입력',
          xscounter: value => value.length <= 15 || '최대 15자까지',
        },
        comment: {
          required: value => !!value || '댓글을 입력해주세요',
          counter: value => value.length <= 250 || '최대 250자까지 가능합니다',
        },
      },
      replyInput: {},
      replyToggle: {},
      editToggle: {},
      editInput: {},
      dialog: {
        show: false,
        input: '',
        opened: '',
      },
    };
  },
  computed: {
    replyToggled() {
      return this.replyToggle;
    },
    article() {
      return this.$store.state.blogStore.currentArticle;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    hasPermission() {
      const hasPermission = {};
      const user = this.$store.state.user;
      const commentsAndReply = [];
      this.comments.forEach((comment) => {
        commentsAndReply.push(comment);
        comment.reply.forEach((reply) => {
          commentsAndReply.push(reply);
        });
      });
      commentsAndReply.forEach((item) => {
        const { _id, username } = item;
        if (!this.isLoggedIn) hasPermission[_id] = false;
        else {
          if (['Admin', 'Owner'].includes(user.role)) hasPermission[_id] = true;
          if (user.username === item.username) hasPermission[_id] = true;
        }
        if (hasPermission[_id] === undefined) hasPermission[_id] = false;
      });
      return hasPermission;
    },
  },
  watch: {
    comments(val) {
      this.comments = val;
    },
  },
  async mounted() {
    if (this.isLoggedIn) {
      await this.$store.dispatch('getUser');
      this.commentInput = {
        userNickname: this.$store.state.user.nickname,
        password: '',
        comment: '',
      };
    }
  },
  methods: {
    addComment() {
      const validation = this.validate(this.commentInput);
      if (!validation) return;
      let payload;

      if (this.isLoggedIn) {
        payload = {
          articleId: this.article.articleId,
          comment: this.commentInput.comment,
          anonymous: false,
          created: this.$moment(),
        };
      } else {
        payload = {
          ...this.commentInput,
          articleId: this.article.articleId,
          anonymous: true,
          created: this.$moment(),
        };
      }
      this.$store.dispatch('blogStore/addComment', payload).then(() => {
        this.$store.dispatch('blogStore/getComments', payload.articleId);
        this.resetCommentInput();
      });
    },
    validate(input) {
      const { userNickname, password, comment } = input;
      let isValid = true;
      if (!userNickname || userNickname.length > 15) isValid = false;
      if ((!password || password.length > 15) && !this.isLoggedIn) {
        isValid = false;
      }
      if (!comment || comment.length > 250) isValid = false;
      return isValid;
    },
    resetCommentInput() {
      this.commentInput = {
        userNickname: this.$store.state.user.nickname || '',
        password: '',
        comment: '',
      };
      this.editToggle = {};
      this.editInput = {};
      this.replyToggle = {};
      this.replyInput = {};
      this.$refs.form.resetValidation();
      this.dialog = {
        show: false,
        input: '',
        opened: '',
      };
    },
    editComment(comment) {
      let payload = {};
      if (comment.anonymous) {
        payload = {
          articleId: this.article.articleId,
          commentId: comment._id,
          anonymous: true,
          ...this.editInput[comment._id],
        };
      } else {
        payload = {
          articleId: this.article.articleId,
          commentId: comment._id,
          comment: this.editInput[comment._id].comment,
          anonymous: false,
        };
      }
      this.$store
        .dispatch('blogStore/editComment', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId);
          this.resetCommentInput();
        })
        .catch((err) => {});
    },
    deleteComment(comment) {
      let payload = {};
      if (comment.anonymous) {
        payload = {
          articleId: this.article.articleId,
          commentId: comment._id,
          password: this.dialog.input,
          anonymous: true,
          hasPermission: this.hasPermission[comment._id],
        };
      } else {
        payload = {
          articleId: this.article.articleId,
          commentId: comment._id,
          anonymous: false,
          hasPermission: this.hasPermission[comment._id],
        };
      }
      this.$store
        .dispatch('blogStore/deleteComment', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId);
          this.resetCommentInput();
        })
        .catch((err) => {});
    },
    addReply(comment) {
      const validation = this.validate(this.replyInput[comment._id]);
      if (!validation) return;
      let payload;

      if (this.isLoggedIn) {
        payload = {
          anonymous: false,
          comment: this.replyInput[comment._id].comment,
        };
      } else {
        payload = {
          ...this.replyInput[comment._id],
          anonymous: true,
        };
      }
      payload.commentId = comment._id;
      payload.articleId = this.article.articleId;
      payload.created = this.$moment();
      this.$store.dispatch('blogStore/addReply', payload).then(() => {
        this.$store.dispatch('blogStore/getComments', payload.articleId);
        this.resetCommentInput();
      });
    },
    deleteReply(reply) {
      let payload = {};
      if (reply.anonymous) {
        payload = {
          articleId: this.article.articleId,
          commentId: reply.commentId,
          replyId: reply._id,
          password: this.dialog.input,
          anonymous: true,
          hasPermission: this.hasPermission[reply._id],
        };
      } else {
        payload = {
          articleId: this.article.articleId,
          commentId: reply.commentId,
          replyId: reply._id,
          anonymous: false,
          hasPermission: this.hasPermission[reply._id],
        };
      }
      this.$store
        .dispatch('blogStore/deleteReply', payload)
        .then(() => {
          this.$store.dispatch('blogStore/getComments', payload.articleId);
          this.resetCommentInput();
        })
        .catch((err) => {});
    },
    toggleReplyInput(_id) {
      if (!this.replyToggle[_id]) {
        this.$set(this.replyToggle, _id, true);
        this.$set(this.replyInput, _id, {
          userNickname: this.$store.state.user.nickname || '',
          password: '',
          comment: '',
        });
      } else {
        this.$set(this.replyToggle, _id, false);
      }
    },
    toggleEdit(comment) {
      this.$set(this.editToggle, comment._id, true);
      this.$set(this.editInput, comment._id, {
        userNickname: comment.userNickname,
        password: '',
        comment: comment.comment,
      });
    },
    toggleDialog(_id) {
      this.dialog = {
        show: true,
        opened: _id,
        input: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$comment-background: rgba(141, 147, 142, 0.043);

a {
  color: rgb(0, 82, 0);
  text-decoration: none;
  font-weight: bold;
}

.comments {
  margin-bottom: 150px;
}

.v-list__tile__title {
  word-wrap: break-word;
  font-size: 14px;
  margin-left: 7px;
}

.comment-inputbox {
  margin: 25px 0px 5px 15px;
  padding: 15px;
  border: solid 1px #ccc;
  border-radius: 2px;
}

.comment-input-items-nickname {
  margin-bottom: 25px;
}

.comments-header {
  margin-bottom: 5px;
}

.comment-input {
  button {
    margin-left: 10px;
    padding-left: 3px;
    padding-top: 10px;
    width: 40px;
    height: 30px;
  }

  input {
    border: 1px solid black;
    width: 100%;
    padding: 5px;
    outline: none;
  }
}
.comments {
  margin-top: 20px;
  padding: 5px;
  margin-left: 10px;
}

.comments-wrapper {
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 3px;
}

.comments--items {
  margin-bottom: 70px;
}

.comments-nickname {
  display: inline-block;
}

.comments-nickname-image {
  width: 40px;
  height: 40px;
  background-size: 100%;
  border-radius: 20%;
  padding-top: 20px;
  margin-top: 8px;
  float: left;
  border: solid 1px rgba(0, 0, 0, 0.201);
}

.comments-content {
  padding: 5px 8px;
  margin: 4px 0px 0px 5px;
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
    font-weight: 300;
    color: #999;
    font-size: 12px;
  }

  .delete-comment {
    position: absolute;
    right: 0px;
    color: red;
  }

  .edit-comment {
    position: absolute;
    right: 30px;
    color: blue;
  }

  .reply-comment {
    position: absolute;
    right: 60px;
    color: black;
    font-size: 14px;
    line-height: 24px;
  }
}

.more {
  float: center;

  button {
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
}

.reply-content {
  margin-left: 60px;
}

.comments-reply-nickname-container {
  display: flex;
  justify-content: flex-end;

  .comments-nickname {
    margin-right: 5px;
  }
}

.comment-input-items.reply {
  border: solid 1px #ccc;
  padding: 15px;
  margin-top: 15px;
}
</style>
