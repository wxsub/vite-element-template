import { AxiosProgressEvent } from "axios"

type UploadProgressListener = (percentage: number) => void;
type UploadCompletedListener = (response: any) => void;
type UploadErrorListener = (error: any) => void;

class FileUploader {
  private readonly uploadUrl: string
  private onProgress: UploadProgressListener
  private onComplete: UploadCompletedListener
  private onError: UploadErrorListener

  constructor(uploadUrl: string = '/default/oss/upload') {
    this.uploadUrl = uploadUrl
    this.onProgress = () => {}
    this.onComplete = () => {}
    this.onError = () => {}
  }

  setProgressListener(listener: UploadProgressListener): void {
    this.onProgress = listener
  }

  setCompleteListener(listener: UploadCompletedListener): void {
    this.onComplete = listener
  }

  setErrorListener(listener: UploadErrorListener): void {
    this.onError = listener
  }

  isValidFileType(file: File, typePatterns: string): boolean {
    const Types = typePatterns.split(', ') || []
    return Types.some((pattern: string) => (new RegExp(pattern)).test(file.type))
  }

  async action(file: File): Promise<void> {
    try {
      const UploadFormData = new FormData()
      UploadFormData.append('file', file)
      const response = await useAxios().post(this.uploadUrl, UploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const total = progressEvent.total || 1,
            percentage = Math.round((progressEvent.loaded * 100) / total);
          this.onProgress(percentage)
        }
      })
      this.onComplete(response)
    } catch (error) { this.onError(error) }
  }

  destroy() {
    this.onProgress = () => {}
    this.onComplete = () => {}
    this.onError = () => {}
  }
}

export type FileUploaderTypes = {
  action: (file: File, typePatterns?: string[]) => void;
  setProgressListener: (listener: (percentage: number) => void) => void;
  setCompleteListener: (listener: (response: any) => void) => void;
  setErrorListener: (listener: (error: any) => void) => void;
}

export default FileUploader