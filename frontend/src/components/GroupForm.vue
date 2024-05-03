<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import {defineProps} from "vue"
import type {Group} from "@/types";
import {usePasswordStore} from "@/stores/passwordStore";

const passwordStore = usePasswordStore()

const props = withDefaults(
  defineProps<{
    id?: number,
    name?: string,
    formName?: string,
    buttonValue?: string,
    onSubmit: (group: Group) => void
  }>(),{}
)

const handleSubmit = (event:Event) => {
  const form = event.target as HTMLFormElement
  const name = (form.elements.namedItem('name') as HTMLInputElement).value

  props.onSubmit({
    ...(props.id && {id: props.id}),
    name: name
  })
}
</script>

<template>
  <form class='form' @submit.prevent="handleSubmit">
    <div class='form_title'>{{ formName }}</div>
    <Input name="name" :value="name" placeholder='Group name'/>
    <Button :value="buttonValue" :loading="passwordStore.formLoading" />
  </form>
</template>

<style scoped>
</style>
