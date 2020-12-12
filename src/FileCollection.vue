<template>

  <file-dialog-button @filesSelected="filesSelected" />

  <div class="fileStack">
    <file-view
        v-for="file in files"
        :file-object="file"
    />
  </div>

</template>

<script>


import $ from 'jquery'
import FileView from './FileView.vue'
import FileDialogButton from "./FileDialogButton.vue";
import {FileObject} from "./FileObject"

FileObject.awsSigningEndpoint = "https://127.0.0.1/aws-sign"

export default {

  name: "FileCollection",

  components: {FileView, FileDialogButton},

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

  data() {
    return {
      files: undefined
    }
  },

  created() {
    this.files = this.initialFiles
  },

  mounted() {

  },

  methods: {
    openFileDialog() {
      $('#fileInput').trigger('click')
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

  }
}
</script>

<style scoped>

.fileStack {
  display: flex;
  flex-direction: column;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
}

</style>