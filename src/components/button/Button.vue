<template>
    <button>
      <img :src="props.imgSrc" alt="add" v-if="props.imgSrc" />
      {{ props.label }}
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  imgSrc: {
    type: String,
    default: ''
  }
});
</script>
