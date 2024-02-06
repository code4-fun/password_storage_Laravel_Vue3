<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import router from '@/router'
import {onMounted} from "vue";

const authStore = useAuthStore()

const submitHandler = (e: Event) => {
  authStore.loading = true
  const form = e.target as HTMLFormElement
  authStore.loginHandler({
    email: (form.email as HTMLInputElement).value,
    password: (form.password as HTMLInputElement).value,
    to: router.currentRoute.value.query.from as string | undefined || 'home'
  })
  form.email.value = ''
  form.password.value = ''
}

onMounted(() => {
  authStore.errors = {}
})
</script>

<template>
  <div class="loader" v-if="authStore.loading" />
  <form v-else class="form_container auth-form" @submit.prevent='submitHandler' autoComplete="off">
    <div v-if="authStore.errors?.email && authStore.errors?.email[0].includes('These credentials')" class="error-msg top-error-msg">
      {{ authStore.errors?.email?.[0] }}
    </div>
    <div>
      <input name="email" type="text" placeholder="Email" />
      <div v-if="authStore.errors?.email && !authStore.errors?.email[0].includes('These credentials')" class="error-msg">
        {{ authStore.errors?.email?.[0] }}
      </div>
    </div>
    <div>
      <input name="password" type="password" placeholder="Password" />
      <div v-if="authStore.errors?.password" class="error-msg">
        {{ authStore.errors?.password?.[0] }}
      </div>
    </div>
    <input type="submit" value="Sign in" />
    <div class="form-bottom-links">
      <div class="forgot-password">
        <RouterLink to='/forgot-password'>Forgot password?</RouterLink>
      </div>
      <div>
        Not a member yet?
        <RouterLink to='/register'>Sign Up</RouterLink>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>
