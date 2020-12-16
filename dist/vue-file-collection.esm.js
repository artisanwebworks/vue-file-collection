import { pushScopeId, popScopeId, openBlock, createBlock, createVNode, toDisplayString, Fragment, createTextVNode, withScopeId, resolveComponent, createCommentVNode, renderList } from 'vue';
import axios from 'axios';
import { Guid } from 'guid-ts';

var script = {

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
      this.fileObject.upload(this.onUploadProgress);
    }
  },

  methods: {

    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total);
      this.uploadPercentage = percentCompleted + "%";
    },

    deleteThisFile() {
      this.$emit('delete', this.fileObject.id);
    }
  },

};

const _withId = /*#__PURE__*/withScopeId("data-v-2230ea8c");

pushScopeId("data-v-2230ea8c");
const _hoisted_1 = { class: "file" };
const _hoisted_2 = { class: "name" };
const _hoisted_3 = { class: "size" };
popScopeId();

const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("a", null, [
      createVNode("div", _hoisted_2, toDisplayString($props.fileObject.name), 1 /* TEXT */)
    ]),
    createVNode("div", _hoisted_3, [
      ($props.fileObject.isUploading)
        ? (openBlock(), createBlock(Fragment, { key: 0 }, [
            createTextVNode(" (" + toDisplayString($data.uploadPercentage) + ") ", 1 /* TEXT */)
          ], 64 /* STABLE_FRAGMENT */))
        : (openBlock(), createBlock(Fragment, { key: 1 }, [
            createTextVNode(" (" + toDisplayString($options.filesizeKb) + ") ", 1 /* TEXT */)
          ], 64 /* STABLE_FRAGMENT */))
    ]),
    createVNode("div", {
      role: "button",
      "aria-label": "Remove attachment",
      class: "X",
      tabindex: "-1",
      "data-tooltip": "Remove attachment",
      onClick: _cache[1] || (_cache[1] = (...args) => ($options.deleteThisFile && $options.deleteThisFile(...args)))
    })
  ]))
});

script.render = render;
script.__scopeId = "data-v-2230ea8c";
script.__file = "src/FileView.vue";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const STATES = {
  PENDING_UPLOAD: "pending-upload",
  UPLOADING: "uploading",
  UPLOADED: "uploaded",
  FAILED: "failed"
};
class FileObject {
  constructor(fileData, state = STATES.PENDING_UPLOAD) {
    this.id = Guid.newGuid().contentStr;
    this.name = fileData.name;
    this.size = fileData.size;
    this.state = state;
    this.fileData = fileData;
  }

  get isPendingUpload() {
    return this.state === STATES.PENDING_UPLOAD;
  }

  get isUploading() {
    return this.state === STATES.UPLOADING;
  }

  get isUploaded() {
    return this.state === STATES.UPLOADED;
  }

  upload(onUploadProgress) {
    if (!this.isPendingUpload) {
      return Promise.reject("FileObject not eligible for upload");
    }

    this.state = STATES.UPLOADING;
    return getAwsSignedPolicy().then(awsData => {
      const formData = createFormData(awsData.postParams, this.fileData);
      const config = {
        onUploadProgress
      };
      return axios.post(awsData.postUrl, formData, config);
    }).then(result => {
      this.state = STATES.UPLOADED;
      return result.data;
    }).catch(err => {
      this.state = STATES.FAILED;
      console.error('Upload to AWS S3 server failed', err);
    });
  }

}
/**
 * Call an endpoint that will use an AWS secret key to authorize the S3 upload.
 *
 * @return {Promise<Object>} - Signing data with which we form POST request.
 */

_defineProperty(FileObject, "awsSigningEndpoint", void 0);

function getAwsSignedPolicy() {
  if (!FileObject.awsSigningEndpoint) {
    throw new Error("awsSigningEndpoint not set");
  }

  return axios.get(FileObject.awsSigningEndpoint).then(res => {
    return Promise.resolve(res.data);
  }).catch(err => {
    console.error("Dropzone failed to get aws-sign", err);
    return Promise.reject(err);
  });
}

function createFormData(awsFields, webApiFile) {
  let formData = new FormData();

  for (const awsFieldId in awsFields) {
    if (awsFields.hasOwnProperty(awsFieldId)) {
      formData.append(awsFieldId, awsFields[awsFieldId]);
    }
  }

  formData.append('file', webApiFile);
  return formData;
}

FileObject.awsSigningEndpoint = "https://127.0.0.1/aws-sign";

var script$1 = {

  name: "FileCollection",

  components: {FileView: script},

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
    this.files = this.initialFiles;
  },

  methods: {

    openFileDialog() {
      window.document.getElementById('fileInput').click();
    },

    filesSelected(webApiFileList) {
      console.log("files selected", webApiFileList);
      for (let i = 0; i < webApiFileList.length; i++) {
        let uploaderFile = new FileObject(webApiFileList[i]);
        console.log("new uploaderFile", uploaderFile);
        this.files.push(uploaderFile);
        console.log("component file list", this.files);
      }
    },

    deleteLocalDescriptor(fileId) {
      let targetIdx;
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].id === fileId) {
          targetIdx = i;
          break
        }
      }
      if (targetIdx !== undefined) {
        this.files.splice(targetIdx, 1);
        this.$emit('deleteFile', fileId);
      }
    }

  }
};

const _withId$1 = /*#__PURE__*/withScopeId("data-v-8306af1a");

pushScopeId("data-v-8306af1a");
const _hoisted_1$1 = { class: "file-collection" };
popScopeId();

const render$1 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_file_view = resolveComponent("file-view");

  return (openBlock(), createBlock(Fragment, null, [
    createCommentVNode(" Hidden input element on which we trigger 'click' to\n       provoke opening of browser file dialog "),
    createVNode("input", {
      id: "fileInput",
      type: "file",
      onChange: _cache[1] || (_cache[1] = $event => ($options.filesSelected($event.target.files))),
      style: {"display":"none"}
    }, null, 32 /* HYDRATE_EVENTS */),
    createVNode("div", _hoisted_1$1, [
      (openBlock(true), createBlock(Fragment, null, renderList($data.files, (file) => {
        return (openBlock(), createBlock(_component_file_view, {
          "file-object": file,
          onDelete: $options.deleteLocalDescriptor
        }, null, 8 /* PROPS */, ["file-object", "onDelete"]))
      }), 256 /* UNKEYED_FRAGMENT */))
    ])
  ], 64 /* STABLE_FRAGMENT */))
});

script$1.render = render$1;
script$1.__scopeId = "data-v-8306af1a";
script$1.__file = "src/FileCollection.vue";

export default script$1;
export { FileObject, STATES };
