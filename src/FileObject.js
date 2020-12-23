
import axios from "axios"
import { Guid } from 'guid-ts';

export const STATES = {
    PENDING_UPLOAD: "pending-upload",
    UPLOADING: "uploading",
    UPLOADED: "uploaded",
    FAILED: "failed"
}

export class FileObject {

    static awsSigningEndpoint

    constructor(fileData, state = STATES.PENDING_UPLOAD) {
        // this.id = Guid.newGuid().contentStr
        this.name = fileData.name
        this.size = fileData.size
        this.state = state
        this.fileData = fileData
    }

    get isPendingUpload() {
        return this.state === STATES.PENDING_UPLOAD
    }

    get isUploading() {
        return this.state === STATES.UPLOADING
    }

    get isUploaded() {
        return this.state === STATES.UPLOADED
    }

    upload(onUploadProgress) {

        if (!this.isPendingUpload) {
            return Promise.reject("FileObject not eligible for upload")
        }

        this.state = STATES.UPLOADING

        return getAwsSignedPolicy()

            .then(awsData => {
                this.id = awsData.fileId
                this.downloadUrl = awsData.downloadUrl
                const formData = createFormData(awsData.postParams, this.fileData)
                const config = {onUploadProgress}
                return axios.post(awsData.postUrl, formData, config)
            })

            .then((result) => {
                this.state = STATES.UPLOADED
                return result.data
            })

            .catch((err) => {
                this.state = STATES.FAILED
                console.error('Upload to AWS S3 server failed', err)
            })

    }

    getLocalBlobURL() {
      return window.URL.createObjectURL(this.fileData)
    }
}

/**
 * Call an endpoint that will use an AWS secret key to authorize the S3 upload.
 *
 * @return {Promise<Object>} - Signing data with which we form POST request.
 */
function getAwsSignedPolicy() {

    if (!FileObject.awsSigningEndpoint) {
        throw new Error("awsSigningEndpoint not set")
    }

    return axios.get(FileObject.awsSigningEndpoint)
        .then((res) => {
            return Promise.resolve(res.data)
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


function createFormData(awsFields, webApiFile) {

    let formData = new FormData()

    // Append Post-policy related fields returned by signing endpoint
    for (const awsFieldId in awsFields) {
        if (awsFields.hasOwnProperty(awsFieldId)) {
            formData.append(awsFieldId, awsFields[awsFieldId])
        }
    }

    formData.append('x-amz-meta-name', webApiFile.name)
    formData.append('Content-Type', webApiFile.type)
    formData.append('file', webApiFile)

    return formData
}