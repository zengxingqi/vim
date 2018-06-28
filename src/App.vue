<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import '@/assets/css/reset.css'
import '@/assets/css/common.css'
export default {
  name: 'App'
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
h1 {
  margin: 0;
}
</style>
