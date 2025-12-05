<template>
  <button>
    <img
      v-if="props.imgSrc"
      alt="add"
      :src="props.imgSrc"
    >
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseButton',
})

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  imgSrc: {
    type: String,
    default: '',
  },
})
</script>
