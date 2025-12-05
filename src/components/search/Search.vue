<template>
  <div class="search-wrapper">
    <span class="search-icon" />
    <input
      v-model="inputModel"
      class="search-input"
      name="search"
      placeholder="Search"
      type="text"
      @input="$emit('input', inputModel)"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'InputSearch',
})

defineEmits(['input'])

const inputModel = ref('')
const props = defineProps<{
  modelValue: string
}>()
inputModel.value = props.modelValue
</script>

<style lang="scss" scoped>
.search-wrapper {
    display: inline-block;
    position: relative;

    .search-icon {
        background: url('search.svg') no-repeat center;
        background-size: contain;
        height: 1.125rem;
        left: 0.625rem;
        pointer-events: none;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 1.125rem;
    }

    .search-input {
        background-size: 1.125rem;
        border: 0.0625rem solid var(--color-border);
        border-radius: 0.25rem;
        color: var(--color-on-brand);
        font-size: 0.875rem;
        height: 2.75rem;
        min-width: 13.0625rem;
        padding: 0.625rem 1rem 0.625rem 2.5rem;

        &::placeholder {
            color: var(--color-placeholder);
        }
    }
}
</style>