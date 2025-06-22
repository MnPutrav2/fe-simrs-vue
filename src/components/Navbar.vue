<script setup lang="ts">
import { UserLogout } from '@/lib/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()

async function logout() {
  const response = await UserLogout(localStorage.getItem('token'))
  const json = await response.json()

  try {
    if (response.status === 200) {
      localStorage.setItem('token', '')

      router.push({
        path: '/login'
      })

      console.log(json.status)
    }else{
      localStorage.setItem('token', '')

      router.push({
        path: '/login'
      })

      console.log(json.errors)
    }
  } catch(error) {
    localStorage.setItem('token', '')

    router.push({
      path: '/login'
    })

    console.log(error)
  }
}
</script>

<template>
  <div style="width: 100%; height: 6%; justify-content: space-between;" class="center">
    <div style="padding: 0.5rem;">

    </div>
    <div style="padding: 0.5rem;">
      <button @click="logout" class="logout">Logout</button>
    </div>
  </div>
  <hr>
</template>
