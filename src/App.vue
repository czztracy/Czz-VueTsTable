<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/Newlybuild">newlybuild</router-link>|
      <router-link to="/submit">submit</router-link>|
      <router-link to="/suppliers">suppliers</router-link>|
    </div> -->
    <div class="con">
      <router-view/>
    </div>
  </div>
</template>

<style lang='scss'>
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  // min-width: 1440px;
  #nav {
    /* padding: 30px; */
    height: 137px;
    line-height: 137px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>
