<script setup lang="ts">
import Input from "@/components/ui/Input.vue"
import Button from "@/components/ui/Button.vue"
import Textarea from "@/components/ui/Textarea.vue"
import Select from "@/components/ui/Select.vue"
import {usePasswordStore} from "@/stores/passwordStore";
import {useUserStore} from "@/stores/userStore";
import type {Password, SelectItem, StoreUserItem} from "@/types";
import {onMounted, onUnmounted, defineProps} from "vue";
import VueSelect from "@/components/ui/VueSelect.vue";

const passwordStore = usePasswordStore()
const userStore = useUserStore()

const props = withDefaults(
  defineProps<{
    id?: number,
    name?: string,
    password?: string,
    description?: string,
    fromGroupId?: number | null,
    formName?: string,
    buttonValue?: string,
    onSubmit: (password: Password) => void
  }>(), {}
)

const handleSubmit = (event: Event) => {
  const form = event.target as HTMLFormElement
  const name = (form.elements.namedItem('name') as HTMLInputElement).value
  const password = (form.elements.namedItem('password') as HTMLInputElement).value
  const description = (form.elements.namedItem('description') as HTMLInputElement).value
  const toGroupId = parseInt((form.elements.namedItem('group') as HTMLInputElement).value)

  props.onSubmit({
    ...(props.id && {id: props.id}),
    name: name,
    password: password,
    description: description,
    allowedUsers: passwordStore.allowedUsers,
    fromGroupId: props.fromGroupId,
    toGroupId: toGroupId
  })
}

const selectExtraOptions = [
  { id: -1, name: 'Group', disabled: true },
  { id: -2, name: 'ungroup' }
] as SelectItem[]

onMounted(() => {
  userStore.fetchUsersExceptAdminAndCurrentUser()
  passwordStore.fetchAllowedUsers(props.id)
})

onUnmounted(() => {
  userStore.users = []
  passwordStore.allowedUsers = []
  passwordStore.errors = {}
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class='form'>
    <div class="form_title">{{ formName }}</div>
    <Input name="name" :value="name" placeholder='Password name' />
    <div v-if="passwordStore.errors?.name" class="error-msg">
      {{ passwordStore.errors?.name?.[0] }}
    </div>
    <Input name="password" :value="password" :placeholder="formName?.includes('Create') ? 'Password' : 'New password'" />
    <div v-if="passwordStore.errors?.password" class="error-msg">
      {{ passwordStore.errors?.password?.[0] }}
    </div>
    <Textarea name="description" :value="description" placeholder='Password description' />
    <div v-if="passwordStore.errors?.description" class="error-msg">
      {{ passwordStore.errors?.description?.[0] }}
    </div>
    <VueSelect
      v-model="passwordStore.allowedUsers"
      :options="userStore.users"
      :reduce="(user: StoreUserItem) => user.id"
      :optionsLoading="userStore.loading"
      :selectedOptionsLoading="passwordStore.allowedUsersLoading" />
    <Select
      name="group"
      :selected="fromGroupId"
      :options="passwordStore.groups"
      :extraOptions="selectExtraOptions" />
    <Button
      :disabled="passwordStore.allowedUsersLoading || userStore.loading"
      :value="buttonValue"
      :loading="passwordStore.formLoading" />
  </form>
</template>

<style scoped>
>>> {
  --vs-border-color: hsl(235, 100%, 90%);
  --vs-border-width: 2px;
  --vs-selected-bg: hsl(235, 100%, 67%);
  --vs-selected-color: #ffffff;
  --vs-selected-border-width: 0;

/*  --vs-dropdown-min-width: 160px;
  --vs-dropdown-max-height: 350px;*/
}
</style>
