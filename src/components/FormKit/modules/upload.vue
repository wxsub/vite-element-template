<script setup lang="ts">
import Upload from '@/utils/upload.class'

const props = defineProps({
    modelValue: { type: [String, Array] },
    limit: { type: Number, default: 1 },
    autoUpload: { type: Boolean, default: true },
    isCustom: { type: Boolean, default: false },
    beforeUpload: { type: Function, default: null },
    accept: {
        type: Array,
        default: [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'image/vnd.microsoft.icon'
        ]
    },
    size: { type: Number, default: 80 }
})

const loading = ref(false),
    uuid = ref(Number(new Date()).toString()),
    fileBucket = ref<any>([]);

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        if (props.limit === 1) {
            fileBucket.value = [{ path: newVal, status: 1, progress: 0 }]
        } else if (Array.isArray(newVal)) {
            fileBucket.value = (newVal as string[]).map((path: string) => ({
                path, status: 1, progress: 0
            }))
        } else {
            fileBucket.value = []
        }
    } else {
        fileBucket.value = []
    }
}, { immediate: true })

const multiple = computed(() => {
    if (props.limit === -1) return true
    return props.limit > 1
}), disabled = computed(() => {
    if (props.limit === -1) return false
    return fileBucket.value.length >= props.limit
});

const change = (e: Event) => {
    const target = e.target as HTMLInputElement,
        files = target.files;
    if (files && files.length > 0) {
        Array.from(files).forEach(file => {
            fileBucket.value.push({
                file,
                status: 0,
                progress: 0,
                temporaryPath: URL.createObjectURL(file)
            })
        })
        if (props.autoUpload) uploading()
        target.value = ''
    }
}

const uploading = async () => {
    for (const item of (fileBucket.value || [])) {
        if (item.status === 1) continue
        const upload = new Upload()
        upload.action(item.file)
        upload.setProgressListener((progress: number) => {
            item.progress = progress
        })
        upload.setCompleteListener((response: any) => {
            item.path = response || null
            item.status = 1
            upload.destroy()
            setData()
        })
        upload.setErrorListener(() => {
            item.progress = 0
            item.status = -1
            upload.destroy()
        })
    }
}

const removeFile = (item: any, index: number) => {
    fileBucket.value.splice(index, 1)
    setData()
    const input = document.getElementById(uuid.value) as HTMLInputElement
    input && (input.value = '')
}

const setData = () => {
    if (fileBucket.value.length === 0) {
        emit('update:modelValue', props.limit === 1 ? '' : [])
    } else {
        const data = fileBucket.value.map((item: any) => item.path)
        emit('update:modelValue', props.limit === 1 ? data[0] : data)
    }
}
</script>

<template>
    <div :class="formKitUpload.upload">
        <div v-for="(it, index) in fileBucket" :key="index" :class="formKitUpload.uploadPrepare">
            <div :class="formKitUpload.warning" v-if="it.status === -1">
                <el-icon :size="(size / 2)" class="text-[#FC4870]"><i-ep-warningFilled /></el-icon>
            </div>
            <template v-else>
                <el-image
                    class="w-full h-full cursor-pointer"
                    :src="it.path || it.temporaryPath"
                    :preview-src-list="[it.path]"
                    show-progress
                    :initial-index="4"
                    fit="cover"
                />
                <div :class="formKitUpload.progress" v-if="it.status === 0 && it.progress < 100">
                    <el-progress type="circle" :percentage="it.progress || 0" :width="(size / 2)" :stroke-width="3" />
                </div>
            </template>
            <div :class="formKitUpload.close" @click="removeFile(it, index)">
                <el-button circle size="small" plain>
                    <el-icon><i-ep-close /></el-icon>
                </el-button>
            </div>
        </div>
        <div :class="[formKitUpload.uploadContanier]" v-if="!disabled">
            <input
                type="file"
                :id="uuid"
                @change="change"
                :disabled="loading || disabled"
                :accept="accept.join(',')"
                :multiple="multiple" />
            <label :for="uuid" v-if="isCustom">
                <slot></slot>
            </label>
            <label :for="uuid" :class="formKitUpload.label" v-else>
                <el-icon><i-ep-plus /></el-icon>
            </label>
        </div>
    </div>
</template>

<style module="formKitUpload" lang="scss">
.upload {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    .uploadPrepare {
        position: relative;
        width: v-bind("`${size}px`");
        height: v-bind("`${size}px`");
        border: 1px solid #e4e7ec;
        border-radius: 6px;
        .warning {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .close {
            position: absolute;
            top: -10px;
            right: -6px;
            cursor: pointer;
            color: #fff;
        }
    }
    .uploadContanier {
        .label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: v-bind("`${size}px`");
            height: v-bind("`${size}px`");
            background: #FAFAFA;
            border: 1px dashed #cdd0d6;
            border-radius: 6px;
            &:hover {
                border-color: #409EFF;
            }
        }
    }
    input[type="file"]{ display: none }
}
</style>