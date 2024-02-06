<script setup lang="ts">
import {defineProps} from "vue"

withDefaults(
  defineProps<{
    rows?: number,
    placeholder?: string
  }>(),
  {
    rows: 10,
    placeholder: ""
  }
)
</script>

<template>
  <textarea
    :rows="rows"
    :placeholder="placeholder" />
</template>

<style scoped>
textarea {
  padding: 10px;
  width: 100%;
  font-size: 16px;
  border: 2px solid hsl(235, 100%, 90%);
  border-radius: 4px;
  font-family: inherit;
  font-weight: inherit;
}
textarea:focus {
  outline: 0;
  box-shadow: 0 0 6px 2px hsl(235, 100%, 90%);
}
</style>
