<template>

  <!-- Hidden input element on which we trigger 'click' to
       provoke opening of browser file dialog -->
  <input
      id="fileInput"
      type="file"
      @change="filesSelected($event.target.files)"
      style="display:none">

  <div class="file-collection">
    <file-view
        v-for="file in files"
        :file-object="file"
        @delete="deleteLocalDescriptor"
    />
  </div>

</template>

<script>

import FileView from './FileView.vue'
import {FileObject, STATES} from "./FileObject"
export {FileObject as FileObject, STATES as STATES}

FileObject.awsSigningEndpoint = "https://127.0.0.1/aws-sign"

export default {

  name: "FileCollection",

  components: {FileView},

  props: {

    /**
     * Array of S3Uploader files representing previous uploads.
     */
    initialFiles: {
      type: Array,
      required: false,
      default: []
    },

    /**
     * Return a Promise that settles on a new FileDescriptor.
     */
    createFileDescriptor: {
      type: Function,
      required: false,
    }

  },

  emits: ['deleteFile'],

  data() {
    return {
      files: undefined
    }
  },

  created() {
    console.log("file collection created");
    this.files = this.initialFiles
  },

  methods: {

    openFileDialog() {
      window.document.getElementById('fileInput').click()
    },

    filesSelected(webApiFileList) {
      console.log("files selected", webApiFileList);
      for (let i = 0; i < webApiFileList.length; i++) {
        let uploaderFile = new FileObject(webApiFileList[i])
        console.log("new uploaderFile", uploaderFile)
        this.files.push(uploaderFile)
        console.log("component file list", this.files)
      }
    },

    deleteLocalDescriptor(fileId) {
      let targetIdx
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].id === fileId) {
          targetIdx = i
          break
        }
      }
      if (targetIdx !== undefined) {
        this.files.splice(targetIdx, 1)
        this.$emit('deleteFile', fileId)
      }
    }

  }
}
</script>

<style lang="scss" scoped>

.file-collection {

  .file:not(:last-child) {
    margin-right: .6rem;
  }
}

</style>