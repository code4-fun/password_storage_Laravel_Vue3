<script setup lang="ts">
import {defineProps, onMounted} from "vue";
import type {DropdownOption} from "@/types";

onMounted(() => {
  document.addEventListener("click", (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement

    const currentDropdown = targetElement.closest('.main_dropdown')
    const dropdownButton = targetElement.closest('.dropdown-button')

    if(targetElement && targetElement.matches('.main_dropdown .dropdown-menu .link')){
      currentDropdown?.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('top')
      document.querySelector('.chevron')?.classList.add('bottom')
    }

    if (dropdownButton && currentDropdown?.contains(dropdownButton)){
      currentDropdown?.classList.toggle('active')
      if(currentDropdown?.className.includes('active')){
        document.querySelector('.chevron')?.classList.remove('bottom')
        document.querySelector('.chevron')?.classList.add('top')
      } else {
        document.querySelector('.chevron')?.classList.remove('top')
        document.querySelector('.chevron')?.classList.add('bottom')
      }
    }

    document.querySelectorAll(".main_dropdown.active").forEach(dropdown => {
      if (dropdown === currentDropdown){
        return
      }
      dropdown.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('top')
      document.querySelector('.chevron')?.classList.add('bottom')
    })
  })
})

withDefaults(
  defineProps<{
    options: DropdownOption[],
    displayValue: string
  }>(),
  {
    options: () => [],
    displayValue: 'user'
  }
)
</script>

<template>
  <div class="main_dropdown">
    <div class="dropdown-button">
      <div class="link">{{ displayValue }}</div>
      <div class="chevron bottom"></div>
    </div>
    <div class="dropdown-menu">
      <div class="link"
           v-for="option in options"
           :key="option.name"
           @click="option.action">{{ option.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.link {
  border: none;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  cursor: pointer;
  color: #fff;
  user-select: none;
}
.main_dropdown {
  line-height: 1;
  display: flex;
  position: relative;
}
.main_dropdown > .dropdown-menu > .link {
  font-weight: inherit;
  padding: 13px 12px;
  color: #899CB1;
}
.main_dropdown > .dropdown-button {
  display: flex;
  flex-direction: row;
}
.main_dropdown > .dropdown-button > .link {
  padding-right: 11px;
}
.main_dropdown > .dropdown-button:hover *,
.main_dropdown .dropdown-button:hover .chevron::before {
  color: hsl(235, 100%, 60%);
}
.main_dropdown.active > .dropdown-button *,
.main_dropdown.active  .chevron::before {
  color: hsl(235, 100%, 60%);
}
.main_dropdown > .dropdown-menu > .link:hover {
  background-color: hsl(235, 100%, 97%);
  color: #252B42;
}
.dropdown-menu {
  position: absolute;
  left: 0;
  top: calc(100% + 11px);
  background: #FFFFFF;
  border: 1px solid #EAF0FA;
  border-radius: 4px;
  width: 162px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
}
@media (max-width: 1200px) {
  .dropdown-menu {
    left: -75px;
  }
}
.main_dropdown.active > .dropdown-button ~ .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.chevron::before {
  border-style: solid;
  border-width: 2px 2px 0 0;
  content: '';
  display: inline-block;
  height: 7px;
  left: 0;
  position: relative;
  top: 6px;
  transform: rotate(-45deg);
  vertical-align: top;
  width: 7px;
  color: white;
  cursor: pointer;
}
.chevron.active::before {
  color: hsl(235, 100%, 60%);
}
.chevron.right:before {
  left: 0;
  transform: rotate(45deg);
}
.chevron.bottom:before {
  top: 3px;
  transform: rotate(135deg);
}
.chevron.left:before {
  left: 0.25em;
  transform: rotate(-135deg);
}
</style>
