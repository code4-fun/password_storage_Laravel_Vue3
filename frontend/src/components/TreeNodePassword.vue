<script setup lang="ts">
import {defineProps} from 'vue';
import type {StorePasswordItem} from "@/types";
import {usePasswordStore} from "@/stores/passwordStore";

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

const editHandler = () => {
  console.log('edit')
}

const deleteHandler = () => {
  console.log('delete')
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
  <div class="tree_node" v-if="passwords && passwords.length" :class="{ 'visible': expanded }">
    <div class="tree_node_child" v-for="password in passwords" :key="password.id">
      <div class="node_content"
           :draggable="true"
           :id="password.id.toString()"
           @dragstart="handleDragStart(password, $event)">
        <span class="node_label">{{ password.name }}</span>
        <span class="node_label">{{ password.password }}</span>
        <div class="node_label node_content_buttons">
          <div v-if="password.owner" class="node_edit" @click.stop="editHandler">Edit</div>
          <div v-if="password.owner" class="node_delete" @click.stop="deleteHandler">Delete</div>
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
