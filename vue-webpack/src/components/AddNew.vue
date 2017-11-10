<template>
  <div>
    Add new <input type="text" @change="addNew">
  </div>
</template>

<script>
export default {
  methods: {
    addNew(event) {
      //TODO: send new asset title to parent
    }
  }
}
</script>
