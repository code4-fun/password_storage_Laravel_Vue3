<script setup lang="ts">
import {defineProps} from 'vue';
import type {StorePasswordItem} from "@/types";
import {usePasswordStore} from "@/stores/passwordStore";
import PasswordForm from "@/components/PasswordForm.vue";

const passwordStore = usePasswordStore()

const props = withDefaults(
  defineProps<{
    groupId: number,
    passwords: StorePasswordItem[],
    expanded: boolean
  }>(),
  {
    users: () => [],
    expanded: false
  }
)

const copyHandler = (id: number) => {
  console.log(id)
}

const showHandler = (id: number) => {
  passwordStore.fetchPassword(id)
}

const editHandler = (password: StorePasswordItem, fromGroupId: number | null = null) => {
  passwordStore.toggleModal(true, {
    component: PasswordForm,
    props: {
      id: password.id,
      name: password.name,
      description: password.description,
      fromGroupId: fromGroupId,
      buttonValue: 'Save',
      onSubmit: passwordStore.updatePassword
    }
  })
}

const deleteHandler = (passwordId: number, groupId: number) => {
  passwordStore.deletePassword(passwordId, groupId)
}

const handleDragStart = (item: StorePasswordItem, event: DragEvent) => {
  const data = {
    fromGroupId: props.groupId,
    passwordId: item.id,
    type: 'group_password'
  }
  passwordStore.setDragObjectInfo(data)
}
</script>

<template>
  <div :class="['tree_node', {'visible': expanded}]" v-if="passwords && passwords.length">
    <div class="tree_node_child" v-for="password in passwords" :key="password.id">
      <div class="node_content"
           :draggable="true"
           :id="password.id.toString()"
           @dragstart="handleDragStart(password, $event)">
        <span class="node_label">{{ password.name }}</span>
        <span class="node_label">{{ password.updated }}</span>
        <div class="node_label node_content_buttons">
          <div class="node_edit" @click.stop="showHandler(password.id)">Show</div>
          <div class="node_edit" @click.stop="copyHandler(password.id)">Copy</div>
          <div v-if="password.owner" class="node_edit" @click.stop="editHandler(password, groupId)">Edit</div>
          <div v-if="password.owner" class="node_delete" @click.stop="deleteHandler(password.id, groupId)">Delete</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree_node > .tree_node > *:last-child > .node_content {
  margin-bottom: 0;
}
.tree_node_child:first-child {
  margin-top: 8px;
}
</style>
