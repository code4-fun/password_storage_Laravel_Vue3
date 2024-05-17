<script setup lang="ts">
import {defineProps, defineEmits, onUnmounted} from "vue"
import type {StoreUserItem} from "@/types";
import Spinner from "@/components/ui/Spinner.vue";
import {createPopper} from '@popperjs/core'
import type { Placement, Instance } from '@popperjs/core'

const emits = defineEmits(['update:selectedOptions'])
let popperInstance: Instance | null = null

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

const withPopper = (
  dropdownList: HTMLElement,
  component: { $refs: { toggle: HTMLElement }, $el: HTMLElement },
  { width }: { width: string }
) => {

  dropdownList.style.width = width

  popperInstance = createPopper(component.$refs.toggle, dropdownList, {
    placement: "bottom",
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -1],
        },
      },
      {
        name: 'toggleClass',
        enabled: true,
        phase: 'write',
        fn({ state }: { state: { placement: Placement } }) {
          component.$el.classList.toggle(
            'drop-up',
            state.placement === 'top'
          )
        },
      },
    ],
  })
}

onUnmounted(() => {
  if (popperInstance) {
    popperInstance.destroy()
    popperInstance = null
  }
})
</script>

<template>
  <Spinner containerHeight="46.391" v-if="optionsLoading || selectedOptionsLoading" />
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
    :calculate-position="withPopper"
    placeholder='Allowed Users' />
</template>

<style scoped>
</style>
