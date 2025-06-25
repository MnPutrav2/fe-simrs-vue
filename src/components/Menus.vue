<script setup lang="ts">
import { UserPages } from '@/lib/api/user'
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MedicalRecordMenu from './MedicalRecordMenu.vue'
import RecipeInput from './Form/RecipeInput.vue'
import RecipeCompoundInput from './Form/RecipeCompoundInput.vue'
import { clearGlobalMR, useGlobalMR } from '@/lib/globalData'

const router = useRouter()
const route = useRoute()

interface pathData {
  group: string
  path: pathGroup[]
}

interface pathGroup {
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

function routing(path: string) {
  router.push(path)
  handlePath()
}

function handlePath() {
  // pathData.value.forEach(item => {
  //   if (route.path !== '/' && !item.path.find(p => p.path === route.path)) {
  //       router.push('/')
  //     }
  // })

  clearGlobalMR()
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
          <details v-if="path.group != '-'">
            <summary>{{ path.group }}</summary>
            <button v-for="r in path.path" :key="r.name" class="menu-button" :class="route.path == r.path ? 'menu-button-active' : ''" @click="routing(r.path)">{{ r.name }}</button>
          </details>
          <button v-else v-for="r in path.path" :key="r.name" class="menu-button" :class="route.path == r.path ? 'menu-button-active' : ''" @click="routing(r.path)">{{ r.name }}</button>
        </li>
      </ul>
    </div>
  </section>

  <!-- Menu area -->
   <RecipeInput style="position: fixed; transition: all 0.2s linear;" :data="globalMR" v-if="activeMenu === 'resep'">
      <template #btn-close>
        <button class="act" @click="toggleMenu('resep')">X</button>
      </template>
    </RecipeInput>

    <RecipeCompoundInput style="position: fixed; transition: all 0.2s linear;" :data="globalMR" v-if="activeMenu === 'resep-racik'">
      <template #btn-close>
        <button class="act" @click="toggleMenu('resep-racik')">X</button>
      </template>
    </RecipeCompoundInput>
  <!-- Menu area -->

  <slot></slot>
  <MedicalRecordMenu v-if="route.path == '/ambulatory-care'">
    <div style="margin-bottom: 1rem;">
      <p style="margin-bottom: 0.5rem;">{{ globalMR == '' ? 'Pilih pasien' : globalMR }}</p>
      <hr>
    </div>
    <template v-if="globalMR != ''">
      <div>
        <button style="background-color: transparent; color: var(--font-color); border: none;" @click="toggleMenu('resep')">Input Resep</button>
      </div>
      <div style="margin-top: 1rem;">
        <button style="background-color: transparent; color: var(--font-color); border: none;" @click="toggleMenu('resep-racik')">Input Resep Racikan</button>
      </div>
    </template>
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

.act {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  color: var(--font-color);
}

.menu-button-active {
  border: 1px solid var(--font-color-sec);
  padding: 0.5rem;
  color: var(--font-color);
  background-color: var(--menu-color);
}

details {
  margin: 0.5rem 0rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  color: var(--font-color-sec);
}

summary::marker,
summary::-webkit-details-marker {
  display: none;
}

/* Tambahkan panah custom */
summary {
  position: relative;
  margin-bottom: 0.5rem;
  cursor: pointer;
  list-style: none;
}

summary::before {
  content: "›"; /* panah ke kanan */
  position: absolute;
  right: 0;
  transition: transform 0.2s ease;
}

/* Saat <details> dibuka, putar panah */
details[open] summary::before {
  transform: rotate(90deg); /* jadikan panah ke bawah */
}
</style>
