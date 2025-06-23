<script setup lang="ts">
import { UserStatus } from '@/lib/api/user'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { RouterView } from 'vue-router'
import Menus from '@/components/Menus.vue'
import Navbar from '@/components/Navbar.vue'

const router: Router = useRouter()
const open = ref<boolean>(false)
const token: string | null = localStorage.getItem('token')
interface userData {
  id: Number,
  name: String,
  gender: String
}
const userData: userData = reactive({
  id: 0,
  name: '',
  gender: ''
})

async function userStatus() {
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await UserStatus(token)
    const json = await response.json()

    if (response.status === 200) {
      userData.id = json.employee_id
      userData.name = json.name
      userData.gender = json.gender
    } else {
      console.log(json)
    }
  } catch (error) {
    console.log(error)
  }
}

onBeforeMount(async () => {
  await userStatus()
})
</script>

<template>
  <main class="center">
    <PopupMenu v-if="open" :state="open">
      <button @click="open = false" aria-label="Close menu">Close</button>
    </PopupMenu>
    <Menus>
      <section class="anim-slide cover">
        <Navbar />
        <div class="scroll">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :data="userData" />
          </RouterView>
        </div>
      </section>
    </Menus>
  </main>
</template>

<style scoped>
.cover {
  width: 85%;
  height: 100vh;
}

.scroll {
  width: 100%;
  height: 93%;
}
</style>
