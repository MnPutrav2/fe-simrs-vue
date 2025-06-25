<script setup lang="ts">
import { getRecipeData } from '@/lib/api/pharmacy';
import { formatDatetime } from '@/lib/formatDate';
import type { RecipeData } from '@/types/pharmacy';
import { onBeforeMount, ref } from 'vue';


// Define variabel
const date = new Date()
const firstDateSearch = ref<string>(formatDatetime(date, "00:00"))
const lastDateSearch = ref<string>(formatDatetime(date, "23:59"))
const recipeData = ref<RecipeData[]>([])

// Define function
async function handleGetRecipeData() {
  const response = await getRecipeData(localStorage.getItem('token'), firstDateSearch.value, lastDateSearch.value)
  const json = await response.json()

  try {

    if (response.status === 200) {
      recipeData.value = json
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }
}

// Before page view
onBeforeMount(async () => {
  await handleGetRecipeData()
})
</script>

<template>
  <section class="anim-slide" ref="ambulatoryCare">
    <h3 style="margin: 0.5rem;">Resep masuk</h3>
    <hr>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleGetRecipeData">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Cari resep</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt1">Tanggal awal</label>
            </div>
            <input type="datetime-local" id="dt1" v-model="firstDateSearch" placeholder="tanggal">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt2">Tanggal akhir</label>
            </div>
            <input type="datetime-local" id="dt2" v-model="lastDateSearch" placeholder="tanggal">
          </div>
          <button type="submit">Cari</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; overflow-x: scroll; overflow-y: scroll; height: 20rem; scrollbar-width: thin;">
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>No resep</td>
            <td>No rawat</td>
            <td>Tanggal resep</td>
            <td>Tanggal validasi</td>
            <td>Tanggal penyerahan</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in recipeData" :key="rec.recipe_id">
            <td>-</td>
            <td>{{ rec.recipe_id }}</td>
            <td>{{ rec.care_number }}</td>
            <td>{{ rec.date }}</td>
            <td>{{ rec.validate }}</td>
            <td>{{ rec.handover }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
