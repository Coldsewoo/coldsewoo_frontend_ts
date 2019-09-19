<template>
  <div class="wrapper">
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm6>
        <v-card class="card">
          <p class="name">
            <strong>Coldsewoo</strong>
          </p>
          <p>Email : coldsewoo@gmail.com</p>
          <p>Vue.js frontend & Node.js REST API</p>
          <p>Backend migrated with typescript</p>
          <p>Github link to this webpage:</p>
          <p>
            Frontend :
            <a
              href="https://github.com/Coldsewoo/coldsewoo_frontend_ts"
            >https://github.com/Coldsewoo/coldsewoo_frontend_ts</a>
          </p>
          <p>
            Backend :
            <a
              href="https://github.com/Coldsewoo/coldsewoo_backend_typescript"
            >https://github.com/Coldsewoo/coldsewoo_backend_typescript</a>
          </p>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
p {
  font-size: 16px;
}
a {
  text-decoration-line: none;
}
.wrapper {
  position: relative;
  top: 20vh;
}
.card {
  padding: 10px;
}
.name {
  font-size: 22px !important;
}
</style>
