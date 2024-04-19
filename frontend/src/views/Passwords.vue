<script setup lang="ts">
import {onMounted} from "vue";
import {usePasswordStore} from '@/stores/passwordStore'
import {useAuthStore} from '@/stores/authStore'
import AdminPasswords from "@/components/AdminPasswords.vue";
import UserPasswords from "@/components/UserPasswords.vue";
import Spinner from "@/components/ui/Spinner.vue";

const passwordStore = usePasswordStore()
const authStore = useAuthStore()

onMounted(async () => {
  await passwordStore.fetchPasswords()
})
</script>

<template>
  <Spinner v-if="passwordStore.loading" />
  <div v-else class="tree">
    <AdminPasswords v-if="authStore.user?.roles.includes('admin')" />
    <UserPasswords v-if="authStore.user?.roles.includes('user')" />
  </div>
</template>

<style scoped>
</style>
