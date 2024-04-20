<script setup lang="ts">
import {defineProps} from "vue"

const props = withDefaults(
  defineProps<{
    size?: string,
    border?: string,
    containerHeight?: string
    color?: string
  }>(),
  {
    size: '25',
    border: '3',
    containerHeight: 'fit-content',
    color: '--primary-color'
  }
)

const spinnerStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  border: `${props.border}px solid #fff`,
  borderTop: `${props.border}px solid var(${props.color})`,
  borderRight: `${props.border}px solid var(${props.color})`,
}

const containerStyle = {
  height: props.containerHeight == 'fit-content' ? 'fit-content' : `${props.containerHeight}px`
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
