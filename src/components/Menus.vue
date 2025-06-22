<script setup lang="ts">
import { UserPages } from '@/lib/api/user'
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MedicalRecordMenu from './MedicalRecordMenu.vue'
import RecipeInput from './Form/RecipeInput.vue'
import { useGlobalMR } from '@/lib/globalData'

const router = useRouter()
const route = useRoute()

interface pathData {
  name: string
  path: string
}

const pathData = ref<pathData[]>([])
const token: string | null = localStorage.getItem('token')
const { globalMR } = useGlobalMR()

async function userPages() {
  if (!token) {
    return
  }

  try {
    const response = await UserPages(token)
    const json = await response.json()

    if (response.status === 200) {
      handlePath()
      pathData.value = json
    } else {
      router.push('/login')
      console.log(json)
    }
  } catch (error) {
    router.push('/login')
    console.log(error)
  }
}

function handlePath() {
  if (route.path !== '/' && !pathData.value.find(p => p.path === route.path)) {
    router.push('/')
  }
}

const activeMenu = ref<string | null>(null)

function toggleMenu(menuName: string) {
  activeMenu.value = activeMenu.value === menuName ? null : menuName
}

onBeforeMount(async () => {
  await userPages()
})
</script>

<template>
  <section class="anim-slide" style="width: 15%; height: 100vh;">
    <div style="width: 100%; height: 10%;"></div>
    <div style="width: 100%; height: 90%;" class="scroll">
      <ul>
        <li v-for="(path, index) in pathData" :key="index" class="path">
          <button class="menu-button" :class="route.path == path.path ? 'menu-button-active' : ''" @click="router.push(path.path), handlePath()">{{ path.name }}</button>
        </li>
      </ul>
    </div>
  </section>

  <!-- Menu area -->
  <RecipeInput style="position: fixed; transition: all 0.2s linear;" :data="globalMR" v-if="activeMenu === 'resep'">
    <button @click="toggleMenu('resep')">{{ globalMR }}</button>
  </RecipeInput>
  <!-- Menu area -->

  <slot></slot>
  <MedicalRecordMenu v-if="route.path == '/ambulatory-care'">
    <button style="background-color: transparent; color: var(--font-color); border: none;" @click="toggleMenu('resep')">Input Resep</button>
  </MedicalRecordMenu>
</template>

<style scoped>
.menu-button {
  padding: 0.5rem;
  text-align: start;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  color: var(--font-color-sec);
  border: none;
}

.menu-button-active {
  border: 1px solid var(--font-color-sec);
  padding: 0.5rem;
  color: var(--font-color);
  background-color: var(--menu-color);
}
</style>
