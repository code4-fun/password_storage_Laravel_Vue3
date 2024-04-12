<script setup lang="ts">
import {useAuthStore} from '@/stores/authStore'
import Dropdown from "@/components/ui/Dropdown.vue";
import type {DropdownOption, Group, Password} from "@/types";
import Sidebar from "@/components/ui/Sidebar.vue";
import Modal from "@/components/ui/Modal.vue";
import GroupForm from "@/components/GroupForm.vue";
import PasswordForm from "@/components/PasswordForm.vue";
import {usePasswordStore} from "@/stores/passwordStore";

const authStore = useAuthStore()
const passwordStore = usePasswordStore()

const createGroup = (group: Group) => {
  passwordStore.storeGroup(group)
  passwordStore.toggleModal(false, null)
}

const createPassword = (password: Password) => {
  passwordStore.storePassword(password)
  passwordStore.toggleModal(false, null)
}

const options: DropdownOption[] = [
  {
    name: 'Create Group',
    action: () => passwordStore.toggleModal(true, {component: GroupForm, props: {onSubmit: createGroup}})
  },
  {
    name: 'Create Password',
    action: () => passwordStore.toggleModal(true, {component: PasswordForm, props: {onSubmit: createPassword}})
  },
  {
    name: 'Logout',
    action: () => authStore.logoutHandler()
  }
]
</script>

<template>
  <Modal />
  <Sidebar />
  <div class="wrapper">
    <header class="header">
      <div class="header_container container">
        <div class="header_left">
          <RouterLink to='/home'>Home</RouterLink>
          <RouterLink v-if='authStore.user' to='/about'>About</RouterLink>
          <RouterLink v-if='authStore.user' to='/passwords'>Passwords</RouterLink>
        </div>
        <div class="header_right">
          <div v-if='authStore.user'>
            <Dropdown :options="options"
                      :displayValue="authStore.user.name"/>
          </div>
          <div v-else>
            <RouterLink to='/login'>Sigh in</RouterLink>
            <RouterLink to='/register'>Sign up</RouterLink>
          </div>

        </div>
      </div>
    </header>

    <main class="page">
      <div class="main_container container">
        <router-view/>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        &copy; Password storage 2024
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  height: 50px;
  width: 100%;
  position: sticky;
  top: 0;
  background-color: var(--primary-color);
  box-shadow: 0 0 7px 3px rgba(0, 0, 0, .1);
  z-index: 100;
  user-select: none;
}
.header_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
}
.header_left > *:not(:last-child) {
  padding-right: 20px;
}
.header_right > div {
  display: flex;
  flex-direction: row;
}
.header_right > div > *:not(:last-child) {
  padding-right: 20px;
}
.wrapper{
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.page {
  flex: auto;
  display: flex;
}
.container {
  max-width: 1000px;
  padding: 0 15px;
  margin: 0 auto;
  box-sizing: content-box;
}
.main_container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
}
.page_content {
  margin: auto;
}
.footer {
  text-align: center;
  padding: 10px 0;
}
/* Side menu */
.side_menu {
  display: flex;
  position: fixed;
  top: 0;
  left: -400px;
  height: 100%;
  width: 410px;
  background-color: hsl(235, 50%, 73%);
  /*padding-top: 75px;*/
  transition: 0.5s;
  overflow: hidden;
  z-index: 101;
}
@media (max-width: 767px) {
  .side_menu {
    width: 100%;
    left: -100vw;
  }
}
.side_menu.is_opened {
  left: 0;
}
.side_menu.is_opened + .wrapper {
  margin-left: 400px;
  transition: margin-left 0.5s;
}
.side_menu + .wrapper {
  margin-left: 0;
  transition: margin-left 0.5s;
}
.side_menu {
  justify-content: space-between;
}
</style>
