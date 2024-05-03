<script setup lang="ts">
import {usePasswordStore} from '@/stores/passwordStore'
import TreeNodeUser from '@/components/TreeNodeUser.vue';
import useToggleCollapse from "@/composables/useToggleCollapse";

const passwordStore = usePasswordStore()

const {toggleCollapse, isExpanded} = useToggleCollapse()

const editHandler = () => {
  console.log('edit')
}

const deleteHandler = () => {
  console.log('delete')
}
</script>

<template>
  <div>
    <div class="tree_node" v-for="node in passwordStore.passwords" :key="node.id">
      <div class="node_content" @click="toggleCollapse(node)">
        <div class="node_label">{{ node.name }}</div>
        <div class="node_label">{{ node.updated }}</div>
        <div class="node_label node_content_buttons">
          <div class="node_edit" @click.stop="editHandler">Edit</div>
          <div class="node_delete" @click.stop="deleteHandler">Delete</div>
        </div>
      </div>
      <TreeNodeUser
        :users="node.users"
        :passwordId="node.id"
        :expanded="isExpanded(node)" />
    </div>
  </div>
</template>

<style scoped>
</style>
