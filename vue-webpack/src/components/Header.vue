<template>
  <div id="header">
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
div {
  color: #123456;
}
</style>
