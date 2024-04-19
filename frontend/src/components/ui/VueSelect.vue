<script setup lang="ts">
import {defineProps, defineEmits} from "vue"
import type {StoreUserItem} from "@/types";
import Spinner from "@/components/ui/Spinner.vue";

const emits = defineEmits(['update:selectedOptions'])

withDefaults(
  defineProps<{
    selectedOptions?: number[],
    options: StoreUserItem[],
    reduce: (...args: any[]) => void,
    optionsLoading: boolean,
    selectedOptionsLoading: boolean
  }>(),
  {
    selectedOptions: () => [],
    options: () => [],
    optionsLoading: false,
    selectedOptionsLoading: false
  }
)

const updateSelectedOptions = (e: Event) => {
  emits('update:selectedOptions', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <Spinner height="46.391" v-if="optionsLoading || selectedOptionsLoading" />
  <VueSelect_
    v-else
    class="vue_select"
    :value="selectedOptions"
    @update="updateSelectedOptions"
    :options="options"
    :reduce="reduce"
    label="name"
    append-to-body
    multiple
    placeholder='Allowed Users' />
</template>

<style scoped>
</style>