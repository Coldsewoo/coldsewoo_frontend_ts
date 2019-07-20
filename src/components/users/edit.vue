<template>
  <v-container fluid fill-height pa-2 class="container">
    <v-layout v-if="tokenName !== username">Invalid redirect</v-layout>
    <v-layout v-if="tokenName === username" row wrap justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="#7b22eecc">
            <v-toolbar-title>Edit Profile</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-alert
            v-for="(message, i) in newAccountStatus.message"
            :key="i"
            :value="!newAccountStatus.success"
            type="error"
          >{{ message }}</v-alert>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="accountForm.username"
                prepend-icon="person"
                label="Username"
                name="input-10-2"
                disabled
              ></v-text-field>
              <v-text-field
                id="currentPassword"
                v-model="accountForm.currentPassword"
                prepend-icon="lock"
                :append-icon="
                  accountForm.showPassword ? 'visibility' : 'visibility_off'
                "
                required
                :rules="accountForm.currentPasswordRule"
                label="Current password"
                :type="accountForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                @click:append="
                  accountForm.showPassword = !accountForm.showPassword
                "
              ></v-text-field>
              <v-text-field
                id="newPassword"
                v-model="accountForm.newPassword"
                prepend-icon="lock"
                hint="Minimum eight characters, at least one letter, one number and one special character"
                persistent-hint
                :rules="accountForm.passwordRules"
                label="New password"
                :type="accountForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
              ></v-text-field>

              <v-text-field
                id="passwordConfirmation"
                v-model="accountForm.passwordConfirmation"
                :rules="accountForm.passwordConfirmationRules"
                label="Confirm New Password"
                prepend-icon="lock"
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
            <v-btn color="error" :to="'/users/profile/' + username">cancel</v-btn>
            <v-btn color="primary" @click.prevent="editAccount">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {},
  props: {
    username: String,
  },
  data() {
    return {
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
        currentPassword: null,
        currentPasswordRule: [v => !!v || 'Current Password is required'],
        passwordRules: [
          v =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
              v,
            ) ||
            'Minimum eight characters, at least one letter, one number and one special character',
        ],
        newPassword: null,
        passwordConfirmation: null,
        passwordConfirmationRules: [
          v =>
            v === this.accountForm.newPassword ||
            "Password confirmation doesn't match Password",
        ],
        nickname: '',
        nicknameRules: [v => !!v || 'Nickname is required!'],
        email: '',
        emailRules: [
          v => !!v || 'Email is required!',
          v =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v,
            ) || 'Should be a valid email address!',
        ],
        status: '',
        avatar: '',
      },
      user: {},
    };
  },
  computed: {
    newAccountStatus() {
      return this.$store.state.userStore.newAccountStatus;
    },
    tokenName() {
      return this.$store.state.token.username;
    },
  },
  watch: {
    $router: (to, from) => this.$router.push(to),
  },
  async mounted() {
    this.user = await this.$store.dispatch('getUser', this.username);
    this.loadUser();
  },
  methods: {
    loadUser() {
      this.accountForm.username = this.user.username;
      this.accountForm.nickname = this.user.nickname;
      this.accountForm.email = this.user.email;
      this.accountForm.status = this.user.status;
      this.accountForm.avatar = this.user.avatar;
    },
    editAccount() {
      this.$store.dispatch('userStore/editAccount', this.accountForm);
    },
  },
};
</script>

<style scoped>
  .container {
    height: 75vh;
  }
</style>
