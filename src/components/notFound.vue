<template>
  <div class="container">
    <div class="main">
      <strong class="four-zero-four">404</strong>
      <h2 class="four-zero-four-two">PAGE NOT FOUND!</h2>
      <a class="four-zero-four-three" href="/">GO TO HOMEPAGE</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main {
  margin: 0 auto;
  margin-bottom: 200px;
  vertical-align: middle;
  text-align: center;
  justify-items: center;
}

.four-zero-four {
  font-size: 250px;
  color: #7b22ee90;
  margin: 0;
}
.four-zero-four-two {
  font-size: 70px;
  color: #7b22ee90;
  margin-top: -80px;
}

.four-zero-four-three {
  padding: 12px;
  font-size: 30px;
  color: #7b22ee;
  text-decoration: none;
  border: solid 1px #7b22ee;
}
</style>
