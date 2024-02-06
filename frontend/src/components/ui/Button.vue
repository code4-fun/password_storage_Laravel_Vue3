<script setup lang="ts">
import {defineProps} from "vue"

withDefaults(
  defineProps<{
    value?: string
  }>(),
  {
    value: "Create"
  }
)
</script>

<template>
  <button>{{ value }}</button>
</template>

<style scoped>
button {
  height: 34px;
  width: fit-content;
  padding: 0 10px;
  font-size: 1rem;
  background: hsl(235, 100%, 67%);
  color: #ffffff;
  border: 0;
  border-radius: 4px;
  font-family:'Raleway', sans-serif;
}
button:hover {
  background: hsl(235, 100%, 74%);
  cursor: pointer;
}
</style>
