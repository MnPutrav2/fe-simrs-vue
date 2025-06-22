<script setup lang="ts">
import { getDrugData } from '@/lib/api/pharmacy';
import { nextTick, reactive, ref, type HtmlHTMLAttributes } from 'vue';

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

// NEW

interface DrugRecipeCompound {
  name: string;
  value: number;
  embalming: number;
  tuslah: number;
}

interface RecipeCompound {
  name: string;
  value: number;
  use: string;
  drug: DrugRecipeCompound[]
}

const pages = ref<HTMLElement | null>()
function scroll() {
  pages.value?.scrollIntoView({behavior: "smooth"})
}

function handleInputObat(index: number, name: string, value: number) {
  indexData.value = index
  indexName.value = name
  indexValue.value = value

  nextTick(() => {
    scroll()
  })
}

const recipeCompounds = ref<RecipeCompound[]>([])
const recipeCompound = ref<RecipeCompound>({
  name: "",
  value: 0,
  use: "",
  drug: []
})

function removeRecipeCompound(id: string) {
  recipeCompounds.value = recipeCompounds.value.filter(r => r.name !== id)

  indexName.value = null
}

function handleCreateRecipeCompound() {
  recipeCompounds.value.push({...recipeCompound.value})

  recipeCompound.value = {
    name: "",
    value: 0,
    use: "",
    drug: []
  }
}

function drugRec(capacity: number, fill: number, content: number): number {
  const data: number = content / capacity * fill

  return Math.round(data)
}

const indexData = ref<number>(0)
const indexName = ref<string | null>(null)
const indexValue = ref<number>(0)

const valMap = reactive<Record<string, number>>({})
const embalmingMap = reactive<Record<string, number>>({})
const tuslahMap = reactive<Record<string, number>>({})

function handleAddDrugCompound(id: Drug) {
  const value = valMap[id.id] || 0
  const embalming = embalmingMap[id.id] || 0
  const tuslah = tuslahMap[id.id] || 0

  const res = drugRec(id.capacity, indexValue.value, value)

  recipeCompounds.value[indexData.value].drug.push({name: id.name, value: res, embalming: embalming, tuslah: tuslah})
}

</script>

<template>
  <section class="container center" >
    <div class="cover2 scroll">
      <div class="close-btn center">
        <slot name="btn-close"></slot>
      </div>

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

      <h4>Resep Obat Racikan</h4>

      <div style="padding-top: 2rem; padding-bottom: 2rem;">
        <form class="form-data-custom" v-on:submit.prevent="handleCreateRecipeCompound">
          <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="nr">Nama racikan</label>
              </div>
              <input type="text" id="nr" v-model="recipeCompound.name" placeholder="no rawat">
            </div>
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="xx">Jumlah</label>
              </div>
              <input type="number" id="xx" v-model="recipeCompound.value" placeholder="jumlah">
            </div>
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="d">Aturan pakai</label>
              </div>
              <input type="text" id="d" v-model="recipeCompound.use" placeholder="pakai">
            </div>
            <button>Save</button>
          </div>
        </form>
      </div>

      <hr>

      <div style="width: 100%; height: 15rem; margin-top: 1rem;" class="scroll">
        <table class="table-custom">
          <thead>
            <tr>
              <td>Action</td>
              <td>Nama</td>
              <td>Jumlah</td>
              <td>Aturan pakai</td>
              <td>Obat</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rec, index) in recipeCompounds" :key="rec.name">
              <td>
                <button class="button-action" @click="removeRecipeCompound(rec.name)">Delete</button>
                <button class="button-action" @click="handleInputObat(index, rec.name, rec.value)">Input obat</button>
              </td>
              <td>{{ rec.name }}</td>
              <td>{{ rec.value }}</td>
              <td>{{ rec.use }}</td>
              <td>
                <table>
                  <tbody>
                    <tr v-for="drug in rec.drug" :key="drug.name">
                      <td>{{ drug.name }}</td>
                      <td>{{ drug.value }}</td>
                      <td>{{ drug.embalming }}</td>
                      <td>{{ drug.tuslah }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div ref="pages" style="padding-top: 2rem; padding-bottom: 2rem;" v-if="recipeCompounds.length != 0 && indexName != null">
        <form class="form-data-custom" v-on:submit.prevent="handleGetDrugData">
          <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Cari Obat</h4>
          <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="nm">Nama racikan</label>
              </div>
              <input type="text" id="ns" v-model="indexName" readonly placeholder="Nama obat">
            </div>
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

      <hr>

      <div style="width: 100%; height: 15rem" class="scroll anim-slide" v-if="recipeCompounds.length != 0 && indexName != null">
        <table class="table-custom">
          <thead>
            <tr>
              <td>Action</td>
              <td>Nama</td>
              <td>Kapasitas</td>
              <td>Kandungan</td>
              <td>Jumlah</td>
              <td>Embalase</td>
              <td>Tuslah</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in drugs" :key="rec.id">
              <td>
                <button class="button-action" @click="handleAddDrugCompound(rec)">Add</button>
              </td>
              <td>{{ rec.name }}</td>
              <td>{{ rec.capacity }}</td>
              <td>
                <input type="number" v-model="valMap[rec.id]" />
              </td>
              <td>
                <p>{{ drugRec(rec.capacity, indexValue, valMap[rec.id]) }}</p>
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
  </section>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  z-index: 3;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  background-color: var(--background-color);
  border: 1px solid var(--line-color);
  position: absolute;
  right: 1rem;
  margin-top: -1.5rem;
  border-radius: 2rem;
}

.cover2 {
  width: 94%;
  height: 89%;
  padding: 0.5rem;
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
