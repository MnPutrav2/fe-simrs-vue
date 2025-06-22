<script setup lang="ts">
import { getDrugData } from '@/lib/api/pharmacy';
import { reactive, ref } from 'vue';

const props = defineProps(['data'])

interface Recipe {
  id: string;
  name: string;
  value: number;
  use:string;
  embalming:number;
  tuslah:number;
}

interface Drug {
  id: string;
  name: string;
  distributor_id: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  category: string;
  price: number;
  expired_date: string;
}

interface RecipeRequest {
  care_number: string;
  recipe_number: string;
  drug: Recipe[]
}

const recipes = ref<Recipe[]>([])

const drugs = ref<Drug[]>([])

const valMap = reactive<Record<string, number>>({})
const useMap = reactive<Record<string, string>>({})
const embalmingMap = reactive<Record<string, number>>({})
const tuslahMap = reactive<Record<string, number>>({})

function removeRecipe(id: string) {
  recipes.value = recipes.value.filter(r => r.id !== id)
}

function handleAddDrug(data: Drug) {
  const value = valMap[data.id] || 0
  const use = useMap[data.id] || ''
  const embalming = embalmingMap[data.id] || 0
  const tuslah = tuslahMap[data.id] || 0

  const recipe: Recipe = {
    id: data.id,
    name: data.name,
    value,
    use,
    embalming,
    tuslah,
  }

  recipes.value.push(recipe)

  valMap[data.id] = 0
  useMap[data.id] = ''
  embalmingMap[data.id] = 0
  tuslahMap[data.id] = 0
}

const recipeRequest = reactive<RecipeRequest>({
  care_number: props.data,
  recipe_number: "",
  drug: recipes.value
})

function handleCreateRecipe() {
  console.log(recipeRequest)
}

const searchDrug = ref<string>("")

async function handleGetDrugData() {
  const response = await getDrugData(localStorage.getItem('token'), searchDrug.value, 10)
  const json = await response.json()

  try {

    if (response.status === 200) {
      drugs.value = json
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }
}

</script>

<template>
  <div class="cover2 scroll">
    <slot></slot>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleCreateRecipe">
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="mr">Nomor rawat</label>
            </div>
            <input type="text" id="mr" v-model="recipeRequest.care_number" readonly placeholder="no rawat">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="ss">Nomor resep</label>
            </div>
            <input type="text" id="ss" v-model="recipeRequest.recipe_number" placeholder="resep">
          </div>
          <button>Save</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; height: 20rem; margin-top: 1rem;" class="scroll">
      <hr>
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>Nama</td>
            <td>Jumlah</td>
            <td>Aturan pakai</td>
            <td>Embalase</td>
            <td>Tuslah</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in recipes" :key="rec.id">
            <td>
              <button class="button-action" @click="removeRecipe(rec.id)">Delete</button>
            </td>
            <td>{{ rec.name }}</td>
            <td>{{ rec.value }}</td>
            <td>{{ rec.use }}</td>
            <td>{{ rec.embalming }}</td>
            <td>{{ rec.tuslah }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleGetDrugData">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Cari Obat</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt1">Nama obat</label>
            </div>
            <input type="text" id="dt1" v-model="searchDrug" placeholder="Nama obat">
          </div>
          <button>Cari</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; height: 20rem" class="scroll">
      <hr>
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>Nama</td>
            <td>Jumlah</td>
            <td>Aturan pakai</td>
            <td>Embalase</td>
            <td>Tuslah</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in drugs" :key="rec.id">
            <td>
              <button class="button-action" @click="handleAddDrug(rec)">Add</button>
            </td>
            <td>{{ rec.name }}</td>
            <td>
              <input type="number" v-model.number="valMap[rec.id]" />
            </td>
            <td>
              <input type="text" v-model="useMap[rec.id]" />
            </td>
            <td>
              <input type="number" v-model="embalmingMap[rec.id]" />
            </td>
            <td>
              <input type="number" v-model="tuslahMap[rec.id]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cover2 {
  width: 95%;
  height: 92%;
  border-radius: 1rem;
  background-color: var(--background-color);
  border: 1px solid var(--line-color);
  z-index: 3;
}

input {
  background-color: var(--background-color);
  border: 1px solid var(--line-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--font-color);
}
</style>
