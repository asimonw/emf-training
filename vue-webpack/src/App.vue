<template>
  <div id="app">
    <app-header :name="title"></app-header>
    <div>Hello</div>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  data() {
    return {
      title: 'Playlist'
    }
  },
  components: {
    appHeader: Header,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
