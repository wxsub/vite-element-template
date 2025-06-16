<script setup lang="ts">
import QuillEditor, { defaultToolbar, modules } from "./editor"

const props = defineProps({
    toolbar: { type: Object, default: () => {} },
    height: { type: Number, default: 200 },
    placeholder: { type: String, default: '' },
    modelValue: { type: [String, Number, Array] }
})

const emit = defineEmits(['update:modelValue']);

const dataset: any = computed({
    get: () => {
        return props.modelValue || null
    },
    set: (value) => {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <div class="editorContent">
        <quill-editor
            class="w-full"
            :modules="modules"
            :toolbar="toolbar || defaultToolbar"
            :placeholder="placeholder || '请输入内容'"
            v-model:content="dataset"
            theme="snow"
            content-type="html">
        </quill-editor>
    </div>
</template>

<style lang="scss">
.editorContent {
    display: flex;
    flex-direction: column;
    .ql-toolbar.ql-snow .ql-formats {
        margin-right: 0;
    }
    .ql-container {
        height: v-bind("`${height}px`");
    }
}
</style>