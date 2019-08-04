<template>
  <v-container fluid fill-height pa-2 class="container">
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="#7b22eecc">
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn slot="activator" icon large to="/users/findidpassword">
                <v-icon large>help</v-icon>
              </v-btn>
              <span>Forgot Password?</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="loginForm.username"
                prepend-icon="person"
                :rules="loginForm.nameRules"
                label="Username"
                required
                name="input-10-2"
              ></v-text-field>
              <v-text-field
                id="password"
                v-model="loginForm.password"
                prepend-icon="lock"
                :append-icon="
                  loginForm.showPassword ? 'visibility' : 'visibility_off'
                "
                :rules="loginForm.passwordRules"
                label="Password"
                required
                :type="loginForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                @click:append="loginForm.showPassword = !loginForm.showPassword"
                @keyup.native.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.prevent="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      errorMessage: '',
      loginForm: {
        valid: false,
        username: '',
        nameRules: [v => !!v || 'Username is required'],
        password: '',
        passwordRules: [v => !!v || 'Password is required'],
        showPassword: false,
      },
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
  },
  watch: {
    token() {
      if (this.token && this.token !== 'null') this.$router.go(-1);
    },
  },
  mounted() {
    if (this.$store.state.token.token && this.$store.state.token.token !== 'null') return this.$router.push('/');
  },
  methods: {
    login() {
      this.$store.dispatch('userStore/login', this.loginForm).then((success) => {
        if (success) {
          this.$router.push('/');
        }
      });
    },
    getItem() {
      this.$store.dispatch('postStore/getPostsAuth');
    },
  },
};
</script>

<style scoped>
  .container {
    height: 60vh;
  }
</style>
