<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import {defineProps} from "vue"
import type {Group} from "@/types";

const props = withDefaults(
  defineProps<{
    id?: number,
    name?: string,
    buttonValue?: string,
    onSubmit: (group: Group) => void
  }>(),{}
)

const handleSubmit = (e:Event) => {
  const form = e.target as HTMLFormElement
  const name = (form.elements.namedItem('name') as HTMLInputElement).value

  props.onSubmit({
    ...(props.id && {id: props.id}),
    name: name
  })
}
</script>

<template>
  <form class='form' @submit.prevent="handleSubmit">
    <div class='form_title'>Create group</div>
    <Input name="name" :value="name" placeholder='Group name'/>
    <Button :value="buttonValue" />
  </form>
</template>

<style scoped>
</style>
