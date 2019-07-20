<template>
  <div>
    <p>{{ cookieItem.name }}</p>
    <p>{{ cookieItem.id }}</p>
    <p>{{ cookieItem.email }}</p>
    <input v-model="item.name" type="text" class="text" />
    <input v-model="item.id" type="text" />
    <input v-model="item.email" type="text" />
    <button @click="updateCookie">submit</button>
    <br />
    <p>name : {{ item.name }}</p>
    <p>id : {{ item.id }}</p>
    <p>email : {{ item.email }}</p>

    <input v-model="login.username" type="text" />
    <input v-model="login.password" type="password" />
    <button @click="sessioncall">session call</button>
    <p>{{ login.result }}</p>
    <p>{{ login.session }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      item: {
        name: '',
        id: 0,
        email: '',
      },
      cookieRes: '',
      result: '',
      cookieItem: {
        name: '',
        id: 0,
        email: '',
      },
      login: {
        username: '',
        password: '',
        result: 'Please Login',
        session: null,
      },
    };
  },
  created() {
    this.gettCookieItem();
  },
  mounted() {
    this.cookieItem.name = this.$cookies.get('name');
    this.cookieItem.id = this.$cookies.get('id');
    this.cookieItem.email = this.$cookies.get('email');
  },
  methods: {
    gettCookieItem(item) {
      let params = {
        name: 'coldsewoo1',
        id: 2010140178,
        email: 'coldsewoo@yahoo.co.jp1123123',
      };
      if (item) {
        params = {
          name: item.name,
          id: item.id,
          email: item.email,
        };
      }
      axios({
        url: 'http://localhost:5000/cookie',
        method: 'GET',
        params,
      }).then((res) => {
        for (const index in res.data.cookies) {
          if (Object.prototype.hasOwnProperty.call(res.data.cookies, index)) {
            this.$cookies.set(`${index}`, res.data.cookies[index]);
          }
        }
      });
    },
    async updateCookie() {
      const res = await axios({
        url: 'http://localhost:5000/cookie',
        method: 'POST',
        data: this.item,
      });
      this.gettCookieItem(res.data);
    },
    async sessioncall() {
      const res = await axios({
        url: 'http://localhost:5000/session',
        method: 'GET',
        params: this.login,
      });
      if (typeof res.data === 'object') {
        this.login.result = res.data.status;
        this.login.session = res.data.sessionID;
      } else {
        this.login.result = res.data;
        this.login.session = null;
      }
    },
  },
};
</script>

<style></style>
