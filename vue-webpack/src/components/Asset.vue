<template>
  <li>
    <h2 @click="toggle">{{ title }}</h2>
    <section v-show="show">{{ summary }}</section>
  </li>
</template>

<script>
export default {
  props: {
    title: String,
    summary: String,
    show: Boolean
  },
  data() {
    return {

    }
  },
  methods: {
    toggle() {
      this.$emit('batman', !this.show);
    }
  }
}
</script>

<style scoped>

</style>
