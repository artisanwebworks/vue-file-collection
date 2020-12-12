
import axios from "axios"
import { Guid } from 'guid-ts';

const PENDING_UPLOAD = "pending-upload"
const UPLOADING = "uploading"
const UPLOADED = "uploaded"
const FAILED = "failed"

export class FileObject {

    static awsSigningEndpoint

    constructor(dlgFile) {
        this.id = Guid.newGuid().contentStr
        this.name = dlgFile.name
        this.size = dlgFile.size
        this.state = PENDING_UPLOAD
        this.dlgFile = dlgFile
    }

    get isPendingUpload() {
        return this.state === PENDING_UPLOAD
    }

    get isUploading() {
        return this.state === UPLOADING
    }

    get isUploaded() {
        return this.state === UPLOADED
    }

    upload(onUploadProgress) {

        if (!this.isPendingUpload) {
            return Promise.reject("FileObject not eligible for upload")
        }

        this.state = UPLOADING

        return getAwsSignedPolicy()

            .then(awsData => {
                const formData = createFormData(awsData.postParams, this.dlgFile)
                const config = {onUploadProgress}
                return axios.post(awsData.postUrl, formData, config)
            })

            .then((result) => {
                this.state = UPLOADED
                return result.data
            })

            .catch((err) => {
                this.state = FAILED
                console.error('Upload to AWS S3 server failed', err)
            })

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
            console.error("Dropzone failed to get aws-sign", err)
            return Promise.reject(err)
        })
}


function createFormData(awsFields, webApiFile) {

    let formData = new FormData()

    for (const awsFieldId in awsFields) {
        if (awsFields.hasOwnProperty(awsFieldId)) {
            formData.append(awsFieldId, awsFields[awsFieldId])
        }
    }

    formData.append('file', webApiFile)
    return formData
}