<template>


  <div class="editor-container">

    <!-- title bar -->
    <div class="template-title">
      <span class="title-text">Email Template</span>
    </div>

    <div class="template-body">

      <!-- 'To' line -->
      <div class="header-line">
        <span class="line-label">
          To
        </span>
        <span>some@foo.bar</span>
      </div>

      <!-- 'Subject' line -->
      <div class="header-line">
        <span class="line-label">
          Subject
        </span>
        <span>Testing rendering of file attachments</span>
      </div>


      <!-- 'Subject' line -->
      <div class="header-line">

        <file-collection
            :initial-files="files"
            ref="fileCollection"
            @deleteFile="deleteFile"
        />

      </div>

      <div class="email-body">
        Hello World,
        ...
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>

      <div>
        <button @click="add">Attach File</button>
      </div>
    </div>
  </div>

</template>


<script>

import FileCollection from "../src/FileCollection.vue"
import {FileObject, STATES} from "../src/FileObject"
export {FileObject, STATES}

export default {
  name: "App",

  components: {FileCollection},

  data() {
    return {
      files: [
        new FileObject({name: "some-file.pdf", size: 124000}, STATES.UPLOADED),
        new FileObject({name: "foo-file.pdf", size: 224000}, STATES.UPLOADED),
        new FileObject({name: "bar-file.pdf", size: 12400}, STATES.UPLOADED),
        new FileObject({name: "bar-baz-file.pdf", size: 124000}, STATES.UPLOADED),
        new FileObject({name: "other-file.pdf", size: 6400}, STATES.UPLOADED),
        new FileObject({name: "brochure.pdf", size: 98000}, STATES.UPLOADED)
      ]
    }
  },

  methods: {

    add() {
      this.$refs.fileCollection.openFileDialog()
    },

    deleteFile(id) {
      console.log("deleting file", id)
    }
  },

}
</script>


<style lang="scss">


$title-bar-color: #404040;
$title-bar-radius: .5rem;
$h-margin: 1rem;
$v-margin: .5rem;
$faint-text-color: #777;
$faint-separator-color: #e6e6e6;
$overlay-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);

// Token and token lists
$extracted-token-color: #ebebeb;
$special-token-color: #ccc;
$subtitle-color: #595959;
$token-popup-spacing-offset: .5rem;

.editor-container {
  width: 40rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  display: inline-block;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
  -webkit-font-smoothing: antialiased;
  font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
}

.template-title {
  background-color: $title-bar-color;

  // display
  display: flex;
  flex-direction: row;

  // text formatting
  color: white;
  font-weight: 500;
  font-size: 1.1rem;

  // borders and spacing
  border-top-left-radius: $title-bar-radius;
  border-top-right-radius: $title-bar-radius;
  padding: $v-margin $h-margin;

  .title-buttons {
    margin-left: auto;

    img {
      opacity: .6;
      vertical-align: middle;
    }
  }
}

.email-body {
  margin-top: 1rem;
}

$line-padding: .5rem;
.template-body {
  padding: 0 $h-margin $v-margin;
  height: 100%;

  .header-line {
    display: flex;
    padding-bottom: $line-padding;
    padding-top: $line-padding;
    border-bottom: $faint-separator-color 1px solid;
  }

  .line-label {
    font-size: 1.1rem;
    color: $faint-text-color;
    margin-right: 1rem;
  }
}

.content {
  min-height: 8rem;
  margin-top: 1rem;
}

.editable-area-layers {
  position: relative;

  .footer-stack {
    display: inline-block;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 100;
  }
}

.footer {
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  // Stack of formatting toolbar on top of misc toolbar
  & > :last-child {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;

    & > :first-child {
      margin-bottom: .5rem;
    }
  }
}

// Eliminate outline on focused content-editable div
*:focus {
  outline: none;
}

</style>