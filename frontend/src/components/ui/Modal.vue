<script setup lang="ts">
import {usePasswordStore} from "@/stores/passwordStore";

const passwordStore = usePasswordStore();
</script>

<template>
  <div :class="['modal_outer', {'active': passwordStore.modalVisible}]"
       @click="passwordStore.toggleModal(false, null)">
    <div class="modal_inner" @click.stop>
      <component :is="passwordStore.getNonReactiveModalContent()?.component"
                 v-bind="passwordStore.getNonReactiveModalContent()?.props" />
    </div>
  </div>
</template>

<style scoped>
.modal_outer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 102;
  display: none;
  justify-content: center;
  align-items: center;
}
.modal_outer.active {
  display: flex;
}
.modal_inner {
  padding: 25px;
  margin: 0 25px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 95vh;
  background-color: #fff;
  border-radius: 3px;
  scrollbar-width: thin;
  scrollbar-color: #ababab #e7e7e7;
}
.modal_inner::-webkit-scrollbar {
  width: 0.35vw;
}
.modal_inner::-webkit-scrollbar-thumb {
  background-color: #ababab;
}
.modal_inner::-webkit-scrollbar-track {
  background-color: #e7e7e7;
}
</style>
