<script setup lang="ts">
import Input from "@/components/ui/Input.vue"
import Button from "@/components/ui/Button.vue"
import Textarea from "@/components/ui/Textarea.vue"

const handleSubmit = () => {
  console.log('handleSubmit')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class='form'>
    <div class='form_title'>Create password</div>
    <Input name="name" placeholder='Password name' />
    <Textarea placeholder='Password description' />
    <Button />
  </form>
</template>

<style scoped>
</style>
