import http from '@/config/axios.config'
import { AxiosProgressEvent } from "axios"

type UploadProgressListener = (percentage: number) => void;
type UploadCompletedListener = (response: any) => void;
type UploadErrorListener = (error: any) => void;

class FileUploader {
  private readonly uploadUrl: string
  private onProgress: UploadProgressListener
  private onComplete: UploadCompletedListener
  private onError: UploadErrorListener

  constructor(uploadUrl: string) {
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

  private isValidFileType(file: File, typePatterns: string[]): boolean {
    return typePatterns.some((pattern: string) => (new RegExp(pattern)).test(file.type))
  }

  async action(file: File, typePattern: string[] = ['image/*']): Promise<void> {
    try {
      if (!this.isValidFileType(file, typePattern)) {
        this.onError(`Invalid file type. Only ${typePattern.join(', ')} are allowed.`)
        return
      }
      const FORM_DATA = new FormData()
      FORM_DATA.append('file', file)
      const response = await http.post(this.uploadUrl, FORM_DATA, {
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
}

export type FileUploaderTypes = {
  action: (file: File, typePatterns?: string[]) => void;
  setProgressListener: (listener: (percentage: number) => void) => void;
  setCompleteListener: (listener: (response: any) => void) => void;
  setErrorListener: (listener: (error: any) => void) => void;
}

export default FileUploader
