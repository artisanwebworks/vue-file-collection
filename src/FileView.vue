<template>
  <div class="file">
    <a>
      <div class="name">{{ fileObject.name }}</div>
    </a>

    <div class="size">
      <template v-if="fileObject.isUploading">
        ({{ uploadPercentage }})
      </template>
      <template v-else>
        ({{ filesizeKb }})
      </template>
    </div>

    <img class="remove" :src="require('./resource/x.png')" @click="deleteThisFile">

  </div>
</template>

<script>

export default {

  name: "FileView",

  props: {
    fileObject: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  data() {
    return {
      uploadPercentage: "0%"
    }
  },

  computed: {
    filesizeKb() {
      return Math.round(this.fileObject.size / 1024.0) + 'K'
    }
  },

  mounted() {
    if (this.fileObject.isPendingUpload) {
      this.fileObject.upload(this.onUploadProgress)
    }
  },

  methods: {

    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total)
      this.uploadPercentage = percentCompleted + "%"
    },

    deleteThisFile() {
      this.$emit('delete', this.fileObject.id)
    }
  },

}
</script>

