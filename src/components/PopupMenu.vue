<script setup lang="ts">
const open = defineProps(['state'])
</script>

<template>
  <div class="popup-menu-cover center">
    <div style="width: 10rem; height: 10rem; background-color: red;" :class="open.state ? 'anim-slide' : ''">
      <slot></slot>
    </div>
  </div>
</template>
