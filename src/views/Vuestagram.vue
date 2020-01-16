<template>
  <v-layout class="vuestagram">
    <div v-show="updateStatus.status === 'pending'" class="blur">
      <v-progress-circular :size="100" :width="14" color="purple" indeterminate class="pending" />
    </div>
    <v-flex xs12 sm12 md6 offset-md-3>
      <v-toolbar class="header">
        <!--
    step 1: main 2: post/imageselect 3: post/message&tags
         5: editpage 4:for refresh (goHome)
        !-->
        <ul class="header-button-left">
          <li v-if="step !== 1 && step !== 4" @click="changeStep(1)">Cancel</li>
        </ul>
        <v-spacer />
        <v-toolbar-title>
          <img
            src="Assets/image.png"
            class="logo"
            width
            @click="goVuestagramHome"
            alt="vuestagram logo"
          />
        </v-toolbar-title>
        <v-spacer />
        <ul class="header-button-right">
          <li v-if="step === 2" @click="changeStep(3)">Next</li>
          <li v-if="step === 3" @click="publish">Done</li>
          <li v-if="step === 5" @click.once="editPost">Done</li>
        </ul>
      </v-toolbar>
      <section class="body">
        <Body />
      </section>
      <div v-if="step === 1" class="footer">
        <ul class="footer-button-plus">
          <div class="inputFile" @click="loginCheck">
            <input id="file" type="file" class="inputfile" @change="onSelected" />
            <label for="file" class="input-plus">+</label>
          </div>
        </ul>
      </div>
    </v-flex>
    <div v-show="updateStatus.status === 'bottom' && step === 1 && !maxLenReached" class="blur">
      <v-progress-circular :size="100" :width="14" color="purple" indeterminate class="pending2" />
    </div>
  </v-layout>
</template>

<script>
import postStore from 'Store/postStore';
import { createNamespacedHelpers } from 'vuex';
import EventBus from '@/EventBus';
import Body from 'Components/posts/Body.vue';

const {
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} = createNamespacedHelpers('postStore');

export default {
  name: 'Vuestagram',
  components: {
    Body,
  },
  data() {
    return {
      post: {},
    };
  },
  computed: {
    ...mapState([
      'step',
      'imageUploading',
      'updateStatus',
      'maxPost',
      'itemSelector',
    ]),
    ...mapGetters(['reversedPosts', 'filteredPosts']),
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    maxLenReached() {
      const postLen = this.itemSelector.selected
        ? this.filteredPosts.length
        : this.reversedPosts.length;
      return this.maxPost >= postLen;
    },
  },
  watch: {},
  metaInfo() {
    return {
      title: 'Coldsewoo - vuestagram',
      author: 'coldsewoo',
      description: 'Instagram clone',
    };
  },
  methods: {
    onSelected(e) {
      this.$store.dispatch('postStore/onImageSelected', {
        item: e.target,
        position: 2,
      });
    },
    publish() {
      if (this.updateStatus.status === 'false') {
        this.$store.commit('postStore/publishStart', 'post');
        EventBus.$emit('publish');
      }
    },
    home() {
      this.$store.commit('postStore/goHome', 1);
    },
    changeStep(num) {
      this.$store.commit('postStore/changeStep', num);
      if (num === 1) EventBus.$emit('resetForm');
    },
    editPost() {
      EventBus.$emit('editPost');
    },
    loginCheck() {
      if (!this.isLoggedIn) this.$router.replace('/users/login');
    },
    goVuestagramHome() {
      this.$router.go(0);
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
}
ul {
  padding: 5px;
  list-style-type: none;
}
.vuestagram {
  max-width: 455px;
  margin: auto;
  padding: 0;
}
.logo {
  width: 65%;
  height: 65%;
  margin: auto;
  display: flex;
  cursor: pointer;
}
.header {
  overflow: hidden;
  width: 455px;
  position: fixed;
  top: 64px;
  z-index: 1;
  border: 1px solid #7b22ee11;
  background-color: #ffffffee;
  border-radius: 2%;
}
.header-button-left {
  color: #7b22ee99;
  float: left;
  width: 50px;
  padding-left: 25px;
  font-size: 15px;
}
.header-button-left li {
  cursor: pointer;
}

.header-button-right {
  color: #7b22ee99;
  float: right;
  width: 50px;
  cursor: pointer;
  padding-right: 25px;
  font-size: 15px;
}

.header-button-right li {
  cursor: pointer;
}

.body {
  position: sticky;
  width: 450px;
  margin-top: 31px;
  clear: bottom;
}

.footer {
  width: 450px;
  position: fixed;
  bottom: 0;
  padding-bottom: 23px;
  background: none;
  z-index: 1;
}

.toolbar {
  width: 100%;
  position: sticky;
}

.footer-button-plus {
  width: 80px;
  margin: 0 auto;
  text-align: center;
  cursor: pointer;
  font-size: 30px;
  color: skyblue;
}
.sample-box {
  width: 100%;
  height: 600px;
  background-color: bisque;
}
.inputfile {
  display: none;
}
.input-plus {
  cursor: pointer;
  color: #7b22ee;
}

.more {
  float: center;
}

.more button {
  background: white;
  border: none;
  color: skyblue;
  float: center;
  width: 100px;
  cursor: pointer;
  margin: 10px auto;
  padding: 10px;
  display: block;
  size: 15px;
}

.pending {
  display: block;
  position: absolute;
  z-index: 3;
  margin: 40px auto;
  left: 38%;
  top: 200px;
}

.pending2 {
  display: block;
  position: absolute;
  z-index: 3;
  margin: 40px auto;
  left: 38%;
  bottom: 200px;
}
.blur {
  z-index: 3;
  display: block;
  position: fixed;
  width: 465px;
  height: 100%;
  margin: auto;
  overflow: hidden;
  background: #ffffffbb;
  filter: blur(3px);
}
</style>
