import { pushScopeId, popScopeId, openBlock, createBlock, createVNode, toDisplayString, Fragment, createTextVNode, withScopeId, resolveComponent, createCommentVNode, renderList } from 'vue';
import axios from 'axios';

var e = [],
    t = [];

function n(n, r) {
  if (n && "undefined" != typeof document) {
    var a,
        s = !0 === r.prepend ? "prepend" : "append",
        d = !0 === r.singleTag,
        i = "string" == typeof r.container ? document.querySelector(r.container) : document.getElementsByTagName("head")[0];

    if (d) {
      var u = e.indexOf(i);
      -1 === u && (u = e.push(i) - 1, t[u] = {}), a = t[u] && t[u][s] ? t[u][s] : t[u][s] = c();
    } else a = c();

    65279 === n.charCodeAt(0) && (n = n.substring(1)), a.styleSheet ? a.styleSheet.cssText += n : a.appendChild(document.createTextNode(n));
  }

  function c() {
    var e = document.createElement("style");
    if (e.setAttribute("type", "text/css"), r.attributes) for (var t = Object.keys(r.attributes), n = 0; n < t.length; n++) e.setAttribute(t[n], r.attributes[t[n]]);
    var a = "prepend" === s ? "afterbegin" : "beforeend";
    return i.insertAdjacentElement(a, e), e;
  }
}

var css = ".file {\n  display: inline-flex;\n  align-self: start;\n  background-color: #f5f5f5;\n  font-size: .875rem;\n  border-radius: 5px;\n  border: 1px solid transparent;\n  font-weight: bold;\n  padding: 4px 4px 4px 8px;\n  white-space: nowrap; }\n  .file a {\n    color: #15c;\n    float: left;\n    padding: 0 8px 0 0;\n    text-decoration: none; }\n  .file .name {\n    display: inline-block;\n    overflow: hidden;\n    padding: 3px 0;\n    text-overflow: ellipsis;\n    vertical-align: bottom;\n    white-space: nowrap;\n    max-width: 315px; }\n  .file .size {\n    color: #777;\n    display: inline-block;\n    padding: 3px 0; }\n  .file .remove {\n    cursor: pointer;\n    height: 20px;\n    width: 20px;\n    margin-top: 1px;\n    opacity: .5; }\n\nbutton.file > .size::after {\n  display: inline-block;\n  margin-left: .255em;\n  vertical-align: .255em;\n  content: \"\";\n  border-top: .3em solid;\n  border-right: .3em solid transparent;\n  border-bottom: 0;\n  border-left: .3em solid transparent; }\n";
n(css,{});

var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAYUlEQVQ4y2P4//8/A7Uxw6ihw8BQIDAAYn40MX6QOFmGQg38AMQnYAZDDTwBFTcgx1CYAf+htBwan59c7yMb/JMYA4mKKKgLfyIZLEdpRFHXpTQJU5rEPk3S6WjeHwGGAgB7bY/MvPH1YwAAAABJRU5ErkJggg==";

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
      uploadPercentage: "0%",
      xImg: img
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
    createVNode("img", {
      class: "remove",
      src: $data.xImg,
      onClick: _cache[1] || (_cache[1] = (...args) => ($options.deleteThisFile && $options.deleteThisFile(...args))),
      alt: "delete icon"
    }, null, 8 /* PROPS */, ["src"])
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
    // this.id = Guid.newGuid().contentStr
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
      this.id = awsData.fileId;
      this.downloadUrl = awsData.downloadUrl;
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

  getLocalBlobURL() {
    return window.URL.createObjectURL(this.fileData);
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
    return Promise.reject(err);
  });
}

function createFormData(awsFields, webApiFile) {
  let formData = new FormData(); // Append Post-policy related fields returned by signing endpoint

  for (const awsFieldId in awsFields) {
    if (awsFields.hasOwnProperty(awsFieldId)) {
      formData.append(awsFieldId, awsFields[awsFieldId]);
    }
  }

  formData.append('x-amz-meta-name', webApiFile.name);
  formData.append('Content-Type', webApiFile.type);
  formData.append('file', webApiFile);
  return formData;
}

FileObject.awsSigningEndpoint = "https://127.0.0.1/aws-sign";

var script$1 = {

  name: "FileCollection",

  components: {FileView: script},

  emits: ['deleteFile', 'imageSelected', 'imageUploadProgress', 'imageUploadComplete'],

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
    this.files = this.initialFiles;
  },

  methods: {

    openFileDialog() {
      window.document.getElementById('fileInput').click();
    },

    openImageDialog() {
      window.document.getElementById('imageInput').click();
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

    imageSelected(webApiFileList) {
      let imageFileObject = new FileObject(webApiFileList[0]);
      this.$emit('imageSelected', imageFileObject);
      imageFileObject.upload((progress) => {
        this.$emit('imageUploadProgress', progress);
      })
          .then(result => {
            this.$emit('imageUploadComplete', imageFileObject);
          });
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
const _hoisted_1$1 = { class: "file-collection-container" };
const _hoisted_2$1 = { class: "dropdown" };
const _hoisted_3$1 = {
  class: "file",
  type: "button",
  id: "dropdownMenuButton",
  "data-toggle": "dropdown",
  "aria-haspopup": "true",
  "aria-expanded": "false"
};
const _hoisted_4 = /*#__PURE__*/createVNode("a", null, [
  /*#__PURE__*/createVNode("div", { class: "name" }, "Attachments")
], -1 /* HOISTED */);
const _hoisted_5 = { class: "size" };
const _hoisted_6 = {
  class: "dropdown-menu",
  "aria-labelledby": "dropdownMenuButton"
};
const _hoisted_7 = { class: "file-collection" };
popScopeId();

const render$1 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_file_view = resolveComponent("file-view");

  return (openBlock(), createBlock(Fragment, null, [
    createVNode("div", _hoisted_1$1, [
      createCommentVNode(" Hidden input element on which we trigger 'click' to\n         provoke opening of file selection dialog "),
      createVNode("input", {
        id: "fileInput",
        type: "file",
        onChange: _cache[1] || (_cache[1] = $event => ($options.filesSelected($event.target.files))),
        style: {"display":"none"}
      }, null, 32 /* HYDRATE_EVENTS */),
      createCommentVNode(" Hidden input of triggering image file dialog "),
      createVNode("input", {
        id: "imageInput",
        type: "file",
        accept: "image/png, image/jpeg, image/gif",
        onChange: _cache[2] || (_cache[2] = $event => ($options.imageSelected($event.target.files))),
        style: {"display":"none"}
      }, null, 32 /* HYDRATE_EVENTS */),
      createCommentVNode(" If only one file attachment, render the file view "),
      ($data.files.length === 1)
        ? (openBlock(), createBlock(_component_file_view, {
            key: 0,
            "file-object": $data.files[0],
            onDelete: $options.deleteLocalDescriptor
          }, null, 8 /* PROPS */, ["file-object", "onDelete"]))
        : ($data.files.length > 1)
          ? (openBlock(), createBlock(Fragment, { key: 1 }, [
              createCommentVNode(" If multiple files, render a dropdown "),
              createVNode("div", _hoisted_2$1, [
                createCommentVNode(" We style the button like a file view... "),
                createVNode("button", _hoisted_3$1, [
                  createCommentVNode(" \"file name\" a fixed attachments label "),
                  _hoisted_4,
                  createCommentVNode(" \"size\" the count of attachments "),
                  createVNode("div", _hoisted_5, " (" + toDisplayString($data.files.length) + ") ", 1 /* TEXT */)
                ]),
                createCommentVNode(" The dropdown: vertical list of file attachments "),
                createVNode("div", _hoisted_6, [
                  createVNode("div", _hoisted_7, [
                    (openBlock(true), createBlock(Fragment, null, renderList($data.files, (file) => {
                      return (openBlock(), createBlock(_component_file_view, {
                        "file-object": file,
                        onDelete: _cache[3] || (_cache[3] = $event => ($options.deleteLocalDescriptor($event)))
                      }, null, 8 /* PROPS */, ["file-object"]))
                    }), 256 /* UNKEYED_FRAGMENT */))
                  ])
                ])
              ])
            ], 64 /* STABLE_FRAGMENT */))
          : createCommentVNode("v-if", true)
    ]),
    createCommentVNode(" .file-collection-container ")
  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
});

var css$1 = ".file-collection[data-v-8306af1a] {\n  width: 100%;\n  padding-left: 0.6rem;\n  padding-right: 0.6rem; }\n  .file-collection[data-v-8306af1a] > :not(:last-child) {\n    margin-bottom: 0.6rem; }\n";
n(css$1,{});

script$1.render = render$1;
script$1.__scopeId = "data-v-8306af1a";
script$1.__file = "src/FileCollection.vue";

export default script$1;
export { FileObject, STATES };
