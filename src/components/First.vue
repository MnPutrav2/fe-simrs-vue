<script setup lang="ts">
import { ref } from 'vue';


interface userData {
  id: Number,
  name: String,
  gender: String
}

const getUserData = defineProps(['data'])
const userData = ref<userData>(getUserData.data)

</script>

<template>
  <section class="center anim-slide" style="width: 100%; height: 100%;">
    <h1>Welcome {{ userData.name }}</h1>
  </section>
</template>
