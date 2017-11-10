<template>
  <li>
    <h2 @click="toggleShow">
      {{ title }}
      <button @click.stop="toggleEdit">Edit</button>
    </h2>
    <section v-if="edit">
      <input type="text" :value="summary" @change="editSummary">
    </section>
    <section v-else v-show="show">{{ summary }}</section>
  </li>
</template>

<script>
export default {
  props: {
    title: String,
    summary: String,
    show: Boolean,
    edit: Boolean,
    toggleShow: Function
  },
  data() {
    return {

    }
  },
  methods: {
    toggleEdit() {
      this.$emit('toggleEdit', !this.edit);
    },
    editSummary(event) {
      this.$emit('edit', event.target.value)
    }
  }
}
</script>

<style scoped>

</style>
