<template>
  <button @click="openFileDialog">add</button>
  <input
      id="fileInput"
      type="file"
      @change="$emit('filesSelected', $event.target.files)"
      style="display:none">
</template>

<script>

import $ from "jquery";

export default {

  name: "FileDialogButton",

  methods: {

    openFileDialog() {
      $('#fileInput').trigger('click')
    }
  }

}
</script>

<style scoped>

</style>