<script setup lang="ts">
import { deleteDrugRecipes, getDrugRecipe, getRecipeData } from '@/lib/api/pharmacy';
import { formatDatetime, viewedDateTime } from '@/lib/formatDate';
import type { RecipeType, RecipeData } from '@/types/pharmacy';
import { nextTick, onBeforeMount, ref } from 'vue';


// Define variabel
const date = new Date()
const firstDateSearch = ref<string>(formatDatetime(date, "00:00:00"))
const lastDateSearch = ref<string>(formatDatetime(date, "23:59:00"))
const validateDate = ref<string>(formatDatetime(date, null))
const recipeData = ref<RecipeData[]>([])
const drugRecipe = ref<RecipeType[]>([])
const pageScroll = ref<HTMLElement | null>()
const pageScrollTop = ref<HTMLElement | null>()
const recipeSelect = ref<string>("")
let inter = setInterval(updateTime, 1000)
const bool = ref<boolean>(false)
const recipeValidateMenu = ref<boolean>(false)
const recipeHandoverMenu = ref<boolean>(false)

// Define function
function scroll() {
  pageScroll.value?.scrollIntoView({behavior: "smooth"})
}

function updateTime() {
  validateDate.value = formatDatetime(new Date(), null)
}

function autoDate(bool: boolean) {
  if (bool) {
    clearInterval(inter)
  } else {
    inter = setInterval(updateTime, 1000)
  }
}

// Handler fuunction
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

async function handleGetDrugRecipe(recipe: string) {
  const response = await getDrugRecipe(localStorage.getItem('token'), recipe)
  const json = await response.json()

  try {

    if (response.status === 200) {
      drugRecipe.value = json
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }

  nextTick(() => {
    scroll()
  })
}

function handleValidateRecipe() {
  pageScrollTop.value?.scrollIntoView({behavior: "smooth"})
}

async function handleDeleteDrugRecipe(recipe: string, drugID: string, comname: string) {
  const response = await deleteDrugRecipes(localStorage.getItem('token'), recipe, drugID, comname)
  const json = await response.json()

  try {

    if (response.status === 200) {
      alert('Berhasil hapus data')
      await handleGetRecipeData()
      await handleGetDrugRecipe(recipeSelect.value)
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }

  nextTick(() => {
    scroll()
  })
}

// Before page view
onBeforeMount(async () => {
  await handleGetRecipeData()
})
</script>

<template>
  <section class="anim-slide" ref="pageScrollTop">
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
            <input type="datetime-local" step="1" id="dt1" v-model="firstDateSearch" placeholder="tanggal">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt2">Tanggal akhir</label>
            </div>
            <input type="datetime-local" step="1" id="dt2" v-model="lastDateSearch" placeholder="tanggal">
          </div>
          <button type="submit">Cari</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; overflow-x: scroll; overflow-y: scroll; height: 30rem; scrollbar-width: thin;">
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>No resep</td>
            <td>No rawat</td>
            <td>Nama</td>
            <td>Tanggal resep</td>
            <td>Tanggal validasi</td>
            <td>Tanggal penyerahan</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in recipeData" :key="rec.recipe_id">
            <td>
              <button class="button-action" @click="handleGetDrugRecipe(rec.recipe_id); recipeSelect = rec.recipe_id">Validasi</button>
            </td>
            <td>{{ rec.recipe_id }}</td>
            <td>{{ rec.care_number }}</td>
            <td>{{ rec.name }}</td>
            <td>{{ viewedDateTime(rec.date) }}</td>
            <td>{{ viewedDateTime(rec.validate) }}</td>
            <td>{{ viewedDateTime(rec.handover) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div ref="pageScroll" v-if="drugRecipe && drugRecipe.length > 0">
      <hr>
      <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleValidateRecipe">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Validasi resep</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt1">Tanggal validasi</label>
            </div>
            <input type="datetime-local" step="1" id="dtv" v-model="validateDate" placeholder="tanggal">
            <button style="font-size: 0.5rem;" type="button" @click="autoDate(bool = !bool)">{{ bool ? 'Otomatic Clock' : 'Manual Clock' }}</button>
          </div>
          <button type="submit">Validasi</button>
        </div>
      </form>
    </div>

      <div style="width: 100%; overflow-x: scroll; overflow-y: scroll; height: 30rem; scrollbar-width: thin;">
        <table class="table-custom">
          <thead>
            <tr>
              <td>Jenis resep</td>
              <td>Data</td>
            </tr>
          </thead>
          <tbody>
            <template v-for="(drug, index) in drugRecipe" :key="index">
              <tr>
                <td colspan="6">{{ drug.compound_name == 'com' ? 'Biasa' : `Racikan : ${drug.compound_name}` }}</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <table>
                    <thead>
                      <tr>
                        <td>Action</td>
                        <td>Nama obat</td>
                        <td>Jumlah</td>
                        <td>Aturan pakai</td>
                        <td>Embalase</td>
                        <td>Tuslah</td>
                        <td>Total</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dt in drug.data" :key="dt.drug_id">
                        <td>
                          <button class="button-action" @click="handleDeleteDrugRecipe(dt.recipe_id, dt.drug_id, dt.compound_name)">Delete</button>
                        </td>
                        <td>{{ dt.drug_name }}</td>
                        <td>{{ dt.value }}</td>
                        <td>{{ dt.use }}</td>
                        <td>{{ dt.embalming }}</td>
                        <td>{{ dt.tuslah }}</td>
                        <td>{{ dt.total_price }}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
