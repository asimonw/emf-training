<template>
  <div id="header">
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data() {
    return {

    }
  }
}
</script>

<style scoped>
div {
  border: 1px solid black;
}
</style>
