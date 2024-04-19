<script setup lang="ts">
import {defineProps} from "vue"

const props = withDefaults(
  defineProps<{
    size?: string,
    border?: string,
    height?: string
  }>(),
  {
    size: '25',
    border: '3',
    height: '25'
  }
)

const spinnerStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  border: `${props.border}px solid #fff`,
  borderTop: `${props.border}px solid var(--primary-color)`,
  borderRight: `${props.border}px solid var(--primary-color)`,
}

const containerStyle = {
  height:`${props.height}px`
}
</script>

<template>
  <div class="spinner_container" :style="containerStyle">
    <div class="spinner" :style="spinnerStyle" />
  </div>
</template>

<style scoped>
.spinner_container {
  display: flex;
  margin:auto;
}
.spinner {
  margin: auto;
  border-radius: 50%;
  animation: rotate 1.5s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
