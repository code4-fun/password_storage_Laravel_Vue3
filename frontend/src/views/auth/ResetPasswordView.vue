<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import {onMounted} from "vue";
import router from '@/router'
import Spinner from "@/components/ui/Spinner.vue";

const authStore = useAuthStore()

const submitHandler = (e: Event) => {
  authStore.loading = true
  const form = e.target as HTMLFormElement
  authStore.resetPasswordHandler({
    password: form.password.value,
    password_confirmation: form.password_confirmation.value,
    email: router.currentRoute.value.query.email as string || '',
    token: router.currentRoute.value.params.token as string || ''
  })
  form.password.value = ''
  form.password_confirmation.value = ''
}

onMounted(() => {
  authStore.errors = {}
  authStore.status = null
})
</script>

<template>
  <Spinner v-if="authStore.loading" />
  <form v-else class="form_container auth-form" @submit.prevent='submitHandler' autoComplete="off">
    <div v-if="authStore.status" class="forgot-password-popup">
      {{ authStore.status }}
    </div>
    <div v-if="Object.keys(authStore.errors).length !== 0">
      <div v-if="authStore.errors?.password" class="error-msg">
        {{ authStore.errors?.password?.[0] }}
      </div>
      <div v-if="authStore.errors?.token || authStore.errors?.email" class="error-msg">
        It seems like the password reset link is invalid or has expired.
      </div>
    </div>
    <input name="password" type="text" placeholder="New Password" />
    <input name="password_confirmation" type="text" placeholder="Password Confirmation" />
    <input type="submit" value="Register" />
  </form>
</template>

<style scoped>
</style>
