import { QuillEditor } from '@vueup/vue-quill'
import Upload from '@/utils/upload.class'
import ImageUploader from "quill-image-uploader"
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default QuillEditor

export const defaultToolbar = ref([
    { header: [1, 2, 3, 4, false] },
    { color: [] }, { background: [] },
    "bold", "italic", "underline", "strike", "blockquote", "code-block",
    { list: "ordered" }, { list: "bullet" },
    { script: "sub" }, { script: "super" },
    { align: [] },
    "clean",
    'link', 'image'
])

export const modules = [
    {
        name: 'ImageUploader',
        module: ImageUploader,
        options: {
            upload: (file: File) => {
                const upload = new Upload()
                return new Promise((resolve, reject) => {
                    upload.action(file)
                    upload.setCompleteListener(async (response: any) => {
                        resolve(response)
                        upload.destroy()
                    })
                    upload.setErrorListener((err) => {
                        reject(err)
                        upload.destroy()
                    })
                })
            }
        }
    }
]