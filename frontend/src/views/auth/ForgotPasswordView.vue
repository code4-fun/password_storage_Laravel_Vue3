<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import {onBeforeMount} from "vue";
import Spinner from "@/components/ui/Spinner.vue";

const authStore = useAuthStore()

const submitHandler = (e: Event) => {
  authStore.loading = true
  const form = e.target as HTMLFormElement
  authStore.forgotPasswordHandler(
      (form.email as HTMLInputElement).value
  )
  form.email.value = ''
}

onBeforeMount(() => {
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
    <div v-if="authStore.errors?.email && authStore.errors?.email[0].includes('These credentials')" class="error-msg top-error-msg">
      {{ authStore.errors?.email?.[0] }}
    </div>
    <div>
      <input name="email" type="text" placeholder="Email" />
      <div v-if="authStore.errors?.email && !authStore.errors?.email[0].includes('These credentials')" class="error-msg">
        {{ authStore.errors?.email?.[0] }}
      </div>
    </div>
    <input type="submit" value="Sign in" />
  </form>
</template>

<style scoped>
</style>
