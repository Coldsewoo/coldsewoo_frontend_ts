<template>
  <v-container fluid fill-height pa-2 class="container">
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="#7b22eecc">
            <v-toolbar-title>New Account</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn slot="activator" icon large target="_blank">
                <v-icon large>help</v-icon>
              </v-btn>
              <span>Forgot Password?</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="accountForm.username"
                prepend-icon="person"
                :rules="accountForm.nameRules"
                label="Username"
                required
                name="input-10-2"
              ></v-text-field>

              <v-text-field
                id="password"
                v-model="accountForm.password"
                prepend-icon="lock"
                :append-icon="
                  accountForm.showPassword ? 'visibility' : 'visibility_off'
                "
                hint="Minimum eight characters, at least one letter, one number and one special character"
                persistent-hint
                :rules="accountForm.passwordRules"
                label="Password"
                required
                :type="accountForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                @click:append="
                  accountForm.showPassword = !accountForm.showPassword
                "
              ></v-text-field>

              <v-text-field
                id="passwordConfirmation"
                v-model="accountForm.passwordConfirmation"
                :rules="accountForm.passwordConfirmationRules"
                label="Confirm Password"
                prepend-icon="lock"
                required
                :type="accountForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                @keyup.native.enter="login"
              ></v-text-field>

              <v-text-field
                v-model="accountForm.email"
                prepend-icon="email"
                required
                name="input-10-2"
                :rules="accountForm.emailRules"
                label="E-mail"
              ></v-text-field>

              <v-text-field
                v-model="accountForm.nickname"
                prepend-icon="person"
                :rules="accountForm.nicknameRules"
                label="Nickname"
                required
                name="input-10-2"
              ></v-text-field>

              <v-text-field
                v-model="accountForm.status"
                prepend-icon="poll"
                label="Status"
                name="input-10-2"
              ></v-text-field>

              <v-text-field
                v-model="accountForm.avatar"
                prepend-icon="account_circle"
                label="Avatar"
                :rules="accountForm.avatarRules"
                name="input-10-2"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.prevent="makeAccount">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EventBus from '@/EventBus.js'
import { createNamespacedHelpers } from 'vuex'
import ErrorHandlerMixin from 'Mixins/ErrorHandlerMixin'

const {
  mapGetters,
  mapActions,
  mapState,
  mapMutations,
} = createNamespacedHelpers('userStore')

export default {
  components: {},
  mixins: [ErrorHandlerMixin],
  data() {
    return {
      loginForm: {
        valid: false,
        username: '',
        nameRules: [v => !!v || 'Username is required'],
        password: '',
        passwordRules: [v => !!v || 'Password is required'],
        showPassword: false,
      },
      accountForm: {
        valid: false,
        showPassword: false,
        username: '',
        nameRules: [
          v => !!v || 'Name is required',
          v =>
            (v && v.length <= 12 && v.length >= 4) ||
            'Should be 4-12 characters!',
        ],
        password: null,
        passwordRules: [
          v => !!v || 'Password is required',
          v =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
              v
            ) ||
            'Minimum eight characters, at least one letter, one number and one special character',
        ],
        passwordConfirmation: null,
        passwordConfirmationRules: [
          v =>
            v === this.accountForm.password ||
            "Password confirmation doesn't match Password",
        ],
        nickname: '',
        nicknameRules: [v => !!v || 'Nickname is required!'],
        email: '',
        emailRules: [
          v => !!v || 'Email is required!',
          v =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || 'Should be a valid email address!',
        ],
        status: '',
        avatar: '',
      },
      errors: {},
    }
  },
  mounted() {
    if (
      this.$store.state.token.token &&
      this.$store.state.token.token !== 'null'
    )
      this.$router.push('/')
  },
  methods: {
    makeAccount() {
      this.$store
        .dispatch('userStore/newAccountSubmit', this.accountForm)
        .then(() => {})
        .catch(err => this.handleAPIError(err))
    },
    login() {},
    logout() {},
  },
}
</script>

<style scoped>
.container {
  height: 75vh;
}
</style>

<!--
  <div>
    <form class="newaccount-form">
      <div class="input">
        <div class="item">
          <span>username</span>
          <input
            v-model="accountForm.username"
            type="text"
            class="username"
            placeholder="username"
          />
          <p v-if="error('username')">{{ errors.username }}</p>
        </div>
        <div class="item">
          <span>password</span>
          <input
            v-model="accountForm.password"
            type="password"
            class="password"
            placeholder="password"
            autocomplete="off"
          />
          <p v-if="error('password')">{{ errors.password }}</p>
        </div>

        <div class="item">
          <span>confirm</span>
          <input
            v-model="accountForm.passwordConfirmation"
            type="password"
            class="passwordConfirmation"
            placeholder="passwordConfirmation"
            autocomplete="off"
          />
          <p v-if="error('passwordConfirmation')">
            {{ errors.passwordConfirmation }}
          </p>
        </div>

        <div class="item">
          <span>nickname</span>
          <input
            v-model="accountForm.nickname"
            type="text"
            placeholder="nickname"
            class="nickname"
          />
          <p v-if="error('nickname')">{{ errors.nickname }}</p>
        </div>

        <div class="item">
          <span>email address</span>
          <input
            v-model="accountForm.email"
            type="text"
            class="email"
            placeholder="email"
          />
          <p v-if="error('email')">{{ errors.email }}</p>
        </div>

        <div class="item">
          <span>comment</span>
          <input
            v-model="accountForm.status"
            type="text"
            class="status"
            placeholder="comment"
          />
        </div>

        <div class="item">
          <span>url</span>
          <input
            v-model="accountForm.avatar"
            type="text"
            class="url"
            placeholder="avatar URL"
          />
        </div>

        <button class="submit" @click.prevent="makeAccount">submit</button>
        <div class="item">
          <p v-if="newAccountResult.success">New ACCOUNT SUCCESS!</p>
        </div>
      </div>
    </form>
  </div> -->
