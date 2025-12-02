<template>
    <div class="search-wrapper">
        <span class="search-icon"></span>
        <input name="search" class="search-input" type="text" placeholder="Search" v-model="inputModel" @input="$emit('input', inputModel)" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputModel = ref('')
const props = defineProps<{
    modelValue: string
}>()
inputModel.value = props.modelValue
</script>

<style lang="scss" scoped>
.search-wrapper {
    position: relative;
    display: inline-block;

    .search-icon {
        position: absolute;
        left: 0.625rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1.125rem;
        height: 1.125rem;
        background: url('search.svg') no-repeat center;
        background-size: contain;
        pointer-events: none;
    }

    .search-input {
        background-size: 1.125rem;
        min-width: 13.0625rem;
        height: 2.75rem;
        color: var(--color-on-brand);
        border: 0.0625rem solid var(--color-border);
        padding: 0.625rem 1rem 0.625rem 2.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;

        &::placeholder {
            color: var(--color-placeholder);
        }
    }
}
</style>