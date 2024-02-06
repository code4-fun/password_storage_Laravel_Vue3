<script setup lang="ts">
import {defineProps} from 'vue';
import Checkbox from "@/components/ui/Checkbox.vue";
import type {CheckboxData, PasswordUser} from "@/types";
import {usePasswordStore} from '@/stores/passwordStore'

const passwordStore = usePasswordStore();

withDefaults(
  defineProps<{
    users: PasswordUser[],
    passwordId: number,
    expanded: boolean
  }>(),
  {
    users: () => [],
    expanded: false
  }
)

const checkboxHandler = (data: CheckboxData, permitted: boolean): void => {
  passwordStore.togglePasswordPermission(data.passwordId, data.userId, permitted)
}
</script>

<template>
  <div class="tree_node" v-if="users && users.length" :class="{ 'visible': expanded }">
    <div class="tree_node_child" v-for="user in users" :key="user.id">
      <div class="node_content">
        <span class="node_label">{{ user.name }}</span>
        <span class="node_label">{{ user.owner ? 'owner' : 'user' }}</span>
        <div class="node_label node_content_buttons">
          <Checkbox
            :checked="Boolean(user.permitted)"
            :data="{
              passwordId: passwordId,
              userId: user.id
            }"
            :checkboxHandler="checkboxHandler"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
