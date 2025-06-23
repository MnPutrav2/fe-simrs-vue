<script setup lang="ts">
import { GetAuthToken, UserPages } from '@/lib/api/user'
import router from '@/router'
import { reactive } from 'vue'

const userAccount: userAccount = reactive({
  username: "",
  password: ""
})

interface userAccount {
  username: string,
  password: string
}

async function login() {
  const response = await GetAuthToken(userAccount)
  const json = await response.json()

  try {
    if (response.status === 201) {
      localStorage.setItem('token', json.token)

      router.push('/')
      console.log(json.status)
    }else{
      alert(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}
</script>

<template>
  <main class="center">
    <section class="form-cover center" style="width: 30%;">
      <div class="anim-slide">
        <h3 style="margin: 0.5rem;">LOGIN</h3>
        <form v-on:submit.prevent="login" class="form-custom">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="username">Username</label>
            </div>
            <input type="text" id="username" v-model="userAccount.username" required autocomplete="username" placeholder="Username">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="password">Password</label>
            </div>
            <input type="password" id="password" v-model="userAccount.password" required autocomplete="current-password" placeholder="Password">
          </div>
          <div class="center">
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    </section>
    <div role="separator" aria-orientation="vertical" style="width: 1px; height: 95vh; background-color: var(--line-color);"></div>
    <section class="form-cover center" style="width: 70%; align-items: flex-start;">
      <div style="padding: 1rem;" class="anim-slide">
        <h1 style="margin-bottom: 1rem;">SIMRS</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam culpa fugit debitis ipsum ea officia laboriosam perferendis in sit, rem dolor consequatur ipsam doloribus, eligendi fugiat dolorum cumque aliquid ad!</p>
      </div>
    </section>
  </main>
</template>
