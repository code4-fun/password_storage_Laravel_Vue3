<script setup lang="ts">
import {defineProps} from "vue"

withDefaults(
  defineProps<{
    type?: string,
    value?: string,
    placeholder?: string
  }>(),
  {
    type: "text",
    value: ""
  }
)
</script>

<template>
  <input :type="type"
         :value="value"
         :placeholder="placeholder"
         autocomplete="off"
         @change="" />
</template>

<style scoped>
input {
  padding: 10px;
  width: 100%;
  height: 41px;
  font-size: 16px;
  font-family: inherit;
  font-weight: inherit;
  border: 2px solid hsl(235, 100%, 90%);
  border-radius: 4px;
}
input:focus {
  outline: 0;
  box-shadow: 0 0 3px 2px hsl(235, 100%, 90%);
}
input::placeholder {
  font-family: 'Montserrat', sans-serif;
}
</style>
