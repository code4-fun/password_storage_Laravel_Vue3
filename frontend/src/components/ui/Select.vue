<script setup lang="ts">
import {defineProps} from "vue"
import type {SelectItem} from "@/types";

const props = withDefaults(
  defineProps<{
    selected: number | null,
    options?: SelectItem[],
    extraOptions?: SelectItem[]
  }>(),
  {
    options: () => [],
    selected: null
  }
)

const handleChange = (e: Event) => {
  // const target = e.target as HTMLSelectElement
}
</script>

<template>
  <select @change="handleChange" :value="selected ?? -1">
    <option :value="extraOption.id" v-for="extraOption in extraOptions" :disabled="extraOption.disabled" :key="extraOption.id">{{ extraOption.name }}</option>
    <option :value="option.id" v-for="option in options" :key="option.id">{{ option.name }}</option>
  </select>
</template>

<style scoped>
select{
  width: 100%;
  border: 2px solid hsl(235, 100%, 90%);
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  font-family: inherit;
  padding: 8px;
}
select:focus {
  outline: 0;
  box-shadow: 0 0 3px 2px hsl(235, 100%, 90%);
}
select:hover {
  cursor: pointer;
}
option:hover {
  cursor: pointer;
}
</style>
