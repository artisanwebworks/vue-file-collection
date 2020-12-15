<template>

  <button @click="add">Add</button>
  <file-collection ref="fileCollection"/>

</template>


<script>

import FileCollection from "../src/FileCollection.vue";

export default {
  name: "App",
  components: {FileCollection},
  methods: {
    add() {
      this.$refs.fileCollection.openFileDialog()
    }
  },
}
</script>


<style lang="scss">
</style>