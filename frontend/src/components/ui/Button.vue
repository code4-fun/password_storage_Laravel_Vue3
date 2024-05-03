<script setup lang="ts">
import {defineProps} from "vue"
import Spinner from "@/components/ui/Spinner.vue";

withDefaults(
  defineProps<{
    value?: string,
    disabled?: boolean,
    loading?: boolean,
    color?: string,
    size?: string
  }>(),
  {
    value: "Go",
    disabled: false,
    loading: false,
    color: 'primary',
    size: 'normal'
  }
)
</script>

<template>
  <button :class="['custom_btn', `custom_btn_${color}`, {'custom_btn_large': size === 'large'}, {'loading': loading}]"
          :disabled="disabled || loading">
    <Spinner v-if="loading" color="--primary-btn" />
    <div v-else>{{ value }}</div>
  </button>
</template>

<style scoped>
.custom_btn {
  height: 34px;
  width: fit-content;
  padding: 0 10px;
  font-size: 1rem;
  color: #ffffff;
  border: 0;
  border-radius: 4px;
  font-family:'Raleway', sans-serif;
}
.custom_btn:hover {
  cursor: pointer;
}
.custom_btn_primary {
  background: var(--primary-btn);
}
.custom_btn_primary:hover {
  background: var(--primary-btn-hover);
}
.custom_btn_danger {
  background: var(--danger-color);
}
.custom_btn_danger:hover {
  background: var(--danger-color-hover);
}
.custom_btn[disabled]:not(.loading) {
  background-color: #e5e5e5;
  cursor: auto;
}
.custom_btn_large {
  height: 50px;
  font-size: 16px;
  padding: 0 15px;
}
</style>
