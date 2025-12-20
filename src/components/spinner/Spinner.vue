<template>
  <div
    class="loading flex align-center justify-center full-width"
  >
    <div class="spinner" />
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'AppSpinner',
})
</script>

<style lang="scss" scoped>
.loading {
    background: rgba(255,255,255,0.8);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;

    .spinner {
      animation: spin 1s linear infinite;
      border: 6px solid #ddd;
      border-radius: 50%;
      border-top-color: #2196f3;
      height: 50px;
      width: 50px;
    }
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>