<script setup lang="ts">
import {defineProps} from 'vue';

withDefaults(
  defineProps<{
    checked: boolean,
    label?: string,
    data: {
      passwordId: number,
      userId: number
    },
    checkboxHandler: (...args: any[]) => void
  }>(),
  {
    checked: false,
    label: ''
  }
)
</script>

<template>
  <label class="checkbox_label">
    {{ label }}
    <input class="checkbox_input"
           type="checkbox"
           :checked="checked"
           @change="checkboxHandler(data, !checked)" />
    <span class="checkmark_border">
      <span class="checkmark"></span>
    </span>
  </label>
</template>

<style scoped>
.checkbox_label {
  position: relative;
  top:0;
  padding-left: 30px;
  user-select: none;
}
.checkbox_label:hover {
  cursor: pointer;
}
.checkbox_input {
  display: none;
}
.checkmark_border {
  position: absolute;
  top: -2px;
  left: 0;
  height: 20px;
  width: 20px;
  border: 1px solid white;
  border-radius: 20%;
  background-color: hsl(235, 50%, 67%);
}
.checkmark_border > .checkmark {
  display: none;
  width: 12px;
  height: 8px;
  position: relative;
  top: 4px;
  left: 3px;
}
.checkbox_input:checked + .checkmark_border > .checkmark {
  display: block;
  transform: rotate(-45deg);
  border-bottom: 4px solid white;
  border-left: 4px solid white;
}
</style>
