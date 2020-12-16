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
    <div
        role="button"
        aria-label="Remove attachment"
        class="X"
        tabindex="-1"
        data-tooltip="Remove attachment"
        @click="deleteThisFile"
        >
    </div>
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

<style scoped>

.file {
  display: inline-block;
  background-color: #f5f5f5;
  max-width: 448px;
  border-radius: 5px;
  font-size: .875rem;
  border: 1px solid transparent;
  font-weight: bold;
  margin: 0 0 9px;
  overflow-y: hidden;
  padding: 4px 4px 4px 8px;
}

a {
  color: #15c;
  float: left;
  padding: 0 8px 0 0;
  text-decoration: none;
}

.name {
 display: inline-block;
 overflow: hidden;
 padding: 3px 0;
 text-overflow: ellipsis;
 vertical-align: bottom;
 white-space: nowrap;
 max-width: 315px;
}

.size {
  color: #777;
  display: inline-block;
  padding: 3px 0;
}

.X {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAYUlEQVQ4y2P4//8/A7Uxw6ihw8BQIDAAYn40MX6QOFmGQg38AMQnYAZDDTwBFTcgx1CYAf+htBwan59c7yMb/JMYA4mKKKgLfyIZLEdpRFHXpTQJU5rEPk3S6WjeHwGGAgB7bY/MvPH1YwAAAABJRU5ErkJggg==) no-repeat 0 0;
  cursor: pointer;
  float: right;
  height: 16px;
  margin-top: 1px;
  opacity: .5;
  width: 16px;
}

</style>