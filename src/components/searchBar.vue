<script setup>
const onFocus = ref(false)
</script>

<template>
    <div class="search-bar" :class="{ 'focus-within': onFocus }">
        <el-icon class="text-[18px]"><i-ep-search /></el-icon>
        <input @focus="onFocus = true" @blur="onFocus = false" type="text" placeholder="搜索" class="flex-1 h-[42px] bg-transparent border-none outline-none text-[14px]" />
    </div>
</template>

<style>
.search-bar {
    flex: 1;
    max-width: 800px;
    height: 42px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    color: rgba(255, 255, 255, 0.65);
}
.focus-within {
    outline: 2px solid rgb(255, 255, 255);
}
</style>