<script setup lang="ts">
import {usePasswordStore} from '@/stores/passwordStore'
import TreeNodePassword from '@/components/TreeNodePassword.vue';
import useToggleCollapse from "@/composables/useToggleCollapse";
import type {StoreGroupItem, StorePasswordItem} from "@/types";
import GroupForm from "@/components/GroupForm.vue";
import PasswordForm from "@/components/PasswordForm.vue";

const passwordStore = usePasswordStore()
const {toggleCollapse, isExpanded} = useToggleCollapse()

const editGroupHandler = async (group: StoreGroupItem) => {
  passwordStore.toggleModal(true, {
    component: GroupForm,
    props: {
      id: group.id,
      name: group.name,
      formName: 'Update group',
      buttonValue: 'Save',
      onSubmit: passwordStore.updateGroup
    }
  })
}

const deleteGroupHandler = (id: number) => {
  passwordStore.deleteGroup(id)
}

const copyPasswordHandler = (id: number) => {
  console.log(id)
}

const showPasswordHandler = (id: number) => {
  passwordStore.fetchPassword(id)
}

const editPasswordHandler = (password: StorePasswordItem, fromGroupId: number | null = null) => {
  passwordStore.toggleModal(true, {
    component: PasswordForm,
    props: {
      id: password.id,
      name: password.name,
      description: password.description,
      fromGroupId: fromGroupId,
      formName: 'Update password',
      buttonValue: 'Save',
      onSubmit: passwordStore.updatePassword
    }
  })
}

const deletePasswordHandler = (id: number) => {
  passwordStore.deletePassword(id)
}

const handleDragStart = (item: StorePasswordItem) => {
  const data = {
    passwordId: item.id,
    type: 'external_password'
  }
  passwordStore.setDragObjectInfo(data)
}

const handleDragEnd = () => {
  passwordStore.setDragObjectInfo(null)
}

const handleDropInGroup = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement;
  const currentGroupId = parseInt(droppableArea.id)

  if (droppableArea) {
    droppableArea.classList.remove('dragover')
  }

  if(passwordStore.dragObjectInfo?.fromGroupId === currentGroupId){
    console.log('dragging an intragroup password to its own group')
    return
  }

  if (droppableArea && passwordStore.dragObjectInfo?.type === 'external_password') {
    if(passwordStore.dragObjectInfo){
      const passwordId = passwordStore.dragObjectInfo.passwordId
      passwordStore.changeGroup(passwordId, currentGroupId)
    }
  }
  else if(droppableArea && passwordStore.dragObjectInfo?.type === 'group_password'){
    if(passwordStore.dragObjectInfo){
      const passwordId = passwordStore.dragObjectInfo.passwordId
      const fromGroupId = passwordStore.dragObjectInfo.fromGroupId
      passwordStore.changeGroup(passwordId, currentGroupId, fromGroupId)
    }
  }
}

const handleDragEnterGroup = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement
  const currentGroupId = parseInt(droppableArea.id)

  if (droppableArea && passwordStore.dragObjectInfo?.fromGroupId !== currentGroupId) {
    droppableArea.classList.add('dragover')
  }
}

const handleDragLeaveGroup = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement

  if (droppableArea && !droppableArea.contains(relatedTarget)) {
    droppableArea.classList.remove('dragover')
  }
}

const handleDragEnterExternalPasswords = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement;

  if (droppableArea && passwordStore.dragObjectInfo?.type !== 'external_password') {
    droppableArea.classList.add('dragover')
  }
}

const handleDragLeaveExternalPasswords = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement

  if (droppableArea && !droppableArea.contains(relatedTarget)) {
    droppableArea.classList.remove('dragover')
  }
}

const handleOutsideGroupDrop = (event: DragEvent) => {
  event.preventDefault()
  const droppableArea = event.currentTarget as HTMLElement;

  if (droppableArea) {
    droppableArea.classList.remove('dragover')

    if(passwordStore.dragObjectInfo?.type !== 'group_password'){
      console.log('dragging an out-group password not onto a group')
      return
    }

    if(passwordStore.dragObjectInfo){
      const passwordId = passwordStore.dragObjectInfo.passwordId
      const fromGroupId = passwordStore.dragObjectInfo.fromGroupId
      passwordStore.changeGroup(passwordId, null, fromGroupId)
    }
  }
}
</script>

<template>
  <div class="group_frame"
       v-for="node in passwordStore.groups"
       :key="node.id">
    <div class="tree_node"
         :id="node.id.toString()"
         @dragover.prevent
         @drop="handleDropInGroup"
         @dragenter="handleDragEnterGroup"
         @dragleave="handleDragLeaveGroup">
      <div class="node_content group" @click="toggleCollapse(node)">
        <div class="node_label">{{ node.name }}</div>
        <div class="node_label node_content_buttons">
          <div class="node_edit" @click.stop="editGroupHandler(node)">Edit</div>
          <div class="node_delete" @click.stop="deleteGroupHandler(node.id)">Delete</div>
        </div>
      </div>
      <TreeNodePassword
        :groupId="node.id"
        :passwords="node.passwords"
        :expanded="isExpanded(node)" />
    </div>
  </div>
  <div class="not_grouped_passwords"
       @dragover.prevent
       @drop="handleOutsideGroupDrop"
       @dragenter="handleDragEnterExternalPasswords"
       @dragleave="handleDragLeaveExternalPasswords">
    <div v-if="passwordStore.passwords.length === 0"
         class="empty_container">Drag here to ungroup</div>
    <div class="tree_node"
         v-else
         v-for="node in passwordStore.passwords"
         :key="node.id"
         :draggable="true"
         @dragstart="handleDragStart(node)"
         @dragend="handleDragEnd">
      <div class="node_content">
        <span class="node_label">{{ node.name }}</span>
        <span class="node_label">{{ node.updated }}</span>
        <div class="node_label node_content_buttons">
          <div class="node_edit" @click.stop="showPasswordHandler(node.id)">Show</div>
          <div class="node_edit" @click.stop="copyPasswordHandler(node.id)">Copy</div>
          <div v-if="node.owner" class="node_edit" @click.stop="editPasswordHandler(node)">Edit</div>
          <div v-if="node.owner" class="node_delete" @click.stop="deletePasswordHandler(node.id)">Delete</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node_content.group {
  background-color: hsl(30, 100%, 50%);
}
.node_content.group:hover {
  background-color: hsl(30, 100%, 63%);
}
.tree > .group_frame > .tree_node {
  padding: 5px;
  margin: -5px;
  border-radius: 2px;
}
.tree > .group_frame > .tree_node.dragover {
  background-color: #cccccc;
}
.group_frame {
  margin-bottom: 3px;
}
.node_content.group {
  margin-bottom: 0;
}
.not_grouped_passwords {
  padding: 5px;
  margin: -5px;
  border-radius: 2px;
}
.not_grouped_passwords > *:last-child > .node_content {
  margin-bottom: 0;
}
.not_grouped_passwords.dragover {
  background-color: #cccccc;
}
.not_grouped_passwords .empty_container {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background-color: #d9d9d9;
  color: #9c9c9c;
  height: 70px;
}
</style>
