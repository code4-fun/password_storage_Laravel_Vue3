<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import {onMounted} from "vue"
import Spinner from "@/components/ui/Spinner.vue";

const authStore = useAuthStore()

const submitHandler = (e: Event) => {
  authStore.loading = true
  const form = e.target as HTMLFormElement
  authStore.registerHandler({
    name: form.userName.value,
    email: form.email.value,
    password: form.password.value,
    password_confirmation: form.password_confirmation.value
  })
  form.userName.value = ''
  form.email.value = ''
  form.password.value = ''
  form.password_confirmation.value = ''
}

onMounted(() => {
  authStore.errors = {}
})
</script>

<template>
  <Spinner v-if="authStore.loading" />
  <form v-else class="form_container auth-form" @submit.prevent='submitHandler' autoComplete="off">
    <div>
      <input name="userName" type="text" placeholder="Name" />
      <div v-if="authStore.errors?.name" class="error-msg">
        {{ authStore.errors?.name?.[0] }}
      </div>
    </div>
    <div>
      <input name="email" type="text" placeholder="Email" />
      <div v-if="authStore.errors?.email" class="error-msg">
        {{ authStore.errors?.email?.[0] }}
      </div>
    </div>
    <div>
      <input name="password" type="password" placeholder="Password" />
      <div v-if="authStore.errors?.password" class="error-msg">
        {{ authStore.errors?.password?.[0] }}
      </div>
    </div>
    <input name="password_confirmation" type="password" placeholder="Password Confirmation" />
    <input type="submit" value="Register" />
    <div class="form-bottom-links">
      <div class="sign-in">
        Already have an account?
        <RouterLink to='/login'>Sign in</RouterLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>
