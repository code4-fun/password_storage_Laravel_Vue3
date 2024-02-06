<script setup lang="ts">

const toggleSideMenu = () => {
  document.querySelector('.side_menu')?.classList.toggle('is_opened')
}
</script>

<template>
  <div class="side_menu">
    <div class="side_menu_content">
      <div>Hello</div>
      <div>World</div>
    </div>
    <div class="arrow" @click="toggleSideMenu"></div>
  </div>
</template>

<style scoped>
/* There ara also side menu styles in Layout component */
.side_menu .arrow {
  position: relative;
  display: flex;
  width: 10px;
  height: 100%;
  background-color: hsl(235, 50%, 73%);
  cursor: pointer;
}
.side_menu .arrow:hover {
  background-color: hsl(235, 50%, 67%);
}
.side_menu .arrow::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
  top: 50%;
  transform: translate(-50%) rotate(-45deg);
  transition: transform 1s ease;
  left: 22%;
}
.side_menu.is_opened .arrow::before {
  transform: rotate(135deg);
  left: 27%;
}
</style>
