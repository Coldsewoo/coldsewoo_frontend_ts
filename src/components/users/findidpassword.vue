<template>
  <v-container fluid fill-height pa-2 class="container">
    <v-layout row wrap justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="#7b22eecc">
            <v-toolbar-title>Reset password</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <div v-if="step === 1" style="margin:10px auto;text-align:center;font-size:15px;">
              <Strong>Please enter your username</Strong>
            </div>
            <div v-if="step === 2" style="font-size:15px;">
              <span>Email sent to your email:</span>
              <br />
              <Strong>{{ email }}</Strong>
              <p>Please copy & paste your code attached</p>
            </div>

            <v-form v-if="step === 1" @submit.prevent="submit">
              <v-text-field
                v-model="submitForm.username"
                prepend-icon="person"
                label="Username"
                required
                :rule="submitForm.usernameRule"
                autofocus
                @enter="submit"
              ></v-text-field>
            </v-form>
            <v-form v-if="step === 2" @submit.prevent="submitCode">
              <v-text-field
                v-model="submitForm.code"
                prepend-icon="code"
                label="Code"
                :rule="submitForm.codeRule"
                required
                autofocus
                @enter.prevent="submitCode"
              ></v-text-field>
            </v-form>
            <v-form v-if="step === 3">
              <v-text-field
                id="newPassword"
                v-model="submitForm.newPassword"
                prepend-icon="lock"
                hint="Minimum eight characters, at least one letter, one number and one special character"
                persistent-hint
                :rules="submitForm.newPasswordRules"
                label="New password"
                :type="submitForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                :append-icon="
                  submitForm.showPassword ? 'visibility' : 'visibility_off'
                "
                @click:append="
                  submitForm.showPassword = !submitForm.showPassword
                "
              ></v-text-field>
              <v-text-field
                id="passwordConfirmation"
                v-model="submitForm.newPasswordConfirmation"
                :rules="submitForm.newPasswordConfirmationRules"
                label="Confirm New Password"
                prepend-icon="lock"
                :type="submitForm.showPassword ? 'text' : 'password'"
                name="input-10-2"
                @keyup.native.enter="saveNewPassword"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="step === 1" color="error" @click.prevent="cancel">cancel</v-btn>
            <v-btn v-if="step === 1" color="primary" @click.prevent="submit">Submit</v-btn>
            <v-btn v-if="step === 2" color="primary" @click.prevent="submitCode">Submit</v-btn>
            <v-btn v-if="step === 3" color="primary" @click.prevent="saveNewPassword">Submit</v-btn>
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
      submitForm: {
        valid: false,
        username: '',
        usernameRule: [v => !!v || 'Username is required'],
        code: '',
        codeRule: [
          v => !!v || 'Code is required',
          v => v.length === 30 || 'Invalid Code',
        ],
        newPassword: null,
        newPasswordRules: [
          v =>
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
              v,
            ) ||
            'Minimum eight characters, at least one letter, one number and one special character',
        ],
        newPasswordConfirmation: null,
        newPasswordConfirmationRules: [
          v =>
            v === this.submitForm.newPassword ||
            "Password confirmation doesn't match Password",
        ],
        showPassword: false,
      },
      step: 1,
      email: '',
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
  },
  watch: {
    token() {
      if (this.token.length) this.$router.go(-1);
    },
  },
  mounted() {
    if (this.$store.state.token.token) return this.$router.push('/');
  },
  methods: {
    submit() {
      this.$store
        .dispatch('userStore/resetPasswordSubmit', this.submitForm.username)
        .then((email) => {
          if (!email) this.step = 1;
          else {
            this.email = email;
            this.step = 2;
          }
        });
    },
    getItem() {
      this.$store.dispatch('postStore/getPostsAuth');
    },
    cancel() {
      this.$router.replace('/users/login');
    },
    submitCode() {
      this.$store
        .dispatch('userStore/resetPasswordCodeSubmit', this.submitForm.code)
        .then((res) => {
          if (res) {
            this.step = 3;
          } else this.step = 2;
        });
    },
    saveNewPassword() {
      this.$store
        .dispatch('userStore/saveNewPassword', {
          code: this.submitForm.code,
          newPassword: this.submitForm.newPassword,
          passwordConfirmation: this.submitForm.newPasswordConfirmation,
        })
        .then((res) => {
          if (res) { this.$router.push('/users/login'); } else this.step = 3;
        });
    },
  },
};
</script>

<style scoped>
  .container {
    height: 60vh;
  }
</style>
