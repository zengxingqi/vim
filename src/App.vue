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
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
