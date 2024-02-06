<script setup lang="ts">
import {defineProps, onMounted} from "vue";
import type {DropdownOption} from "@/types";

onMounted(() => {
  document.addEventListener("click", (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement

    const isDropdownButton = targetElement.matches('.dropdown-button')
    let currentDropdown = targetElement.closest('.main_dropdown')

    if(targetElement && targetElement.matches('.main_dropdown .dropdown-menu .link')){
      currentDropdown?.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('active')
      document.querySelector('.chevron')?.classList.remove('top')
      document.querySelector('.chevron')?.classList.add('bottom')
    }

    if (isDropdownButton){
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

  document.addEventListener('mouseover', (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement
    if(targetElement && targetElement.matches('.dropdown-button')) {
      document.querySelector('.main_dropdown .chevron')?.classList.add('active')
    }
  })

  document.addEventListener('mouseout', (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement
    if(targetElement && targetElement.matches('.dropdown-button')) {
      if(document.querySelector('.main_dropdown')?.className?.includes('active')){
        return
      }
      document.querySelector('.main_dropdown .chevron')?.classList.remove('active')
    }
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
    <div class="link dropdown-button">{{ displayValue }}</div>
    <span class="chevron bottom dropdown-button"></span>
    <div class="dropdown-menu">
      <div class="link"
           v-for="option in options"
           :key="option.name"
           @click="option.action">{{ option.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.main_dropdown > .link {
  padding-right: 11px;
}
.link {
  border: none;
  font-family: inherit;
  font-weight: 400;
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
.main_dropdown > .dropdown-button:hover {
  color: hsl(235, 100%, 60%);
}
.main_dropdown.active > .dropdown-button {
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
  width: 160px;
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
.main_dropdown.active > .link ~ .dropdown-menu{
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
/* chevron */
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
