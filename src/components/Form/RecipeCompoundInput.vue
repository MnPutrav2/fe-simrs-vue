<script setup lang="ts">
import { createRecipeCompound, getCurrentRecipeNumber, getDrugData, getRecipeNumber } from '@/lib/api/pharmacy';
import { nextTick, onBeforeMount, reactive, ref, watch } from 'vue';
import { loopSumCompound, sum } from '@/lib/drugSum';
import type { Drug, RecipeCompound, RecipeCompoundForRequest } from '@/types/pharmacy';
import { formatDatetime } from '@/lib/formatDate';
import { recipeNumber } from '@/lib/careNumber';

// Define variabels
const props = defineProps(['data'])
const drugs = ref<Drug[]>([])
const recipeType = ref(false)
const date = new Date()
const recipeCompounds = ref<RecipeCompound[]>([])
const indexData = ref<number>(0)
const indexName = ref<string | null>(null)
const indexValue = ref<number>(0)
const valMap = reactive<Record<string, number>>({})
const embalmingMap = reactive<Record<string, number>>({})
const tuslahMap = reactive<Record<string, number>>({})
const pageScroll = ref<HTMLElement | null>()
const searchDrug = ref<string>("")
const recipeRequest = reactive<RecipeCompoundForRequest>({
  care_number: props.data,
  recipe_number: "",
  date: formatDatetime(date, null),
  validate: formatDatetime(date, "00:00:00"),
  handover: formatDatetime(date, "00:00:00"),
  type: "create",
  recipes: recipeCompounds.value
})
const recipeCompound = ref<RecipeCompound>({
  recipe_name: "",
  value: 0,
  use: "",
  drug: []
})

// Define functions
function scroll() {
  pageScroll.value?.scrollIntoView({behavior: "smooth"})
}

function resetForm() {
  recipeCompounds.value = []
}

function removeRecipeCompound(id: string) {
  recipeCompounds.value = recipeCompounds.value.filter(r => r.recipe_name !== id)

  indexName.value = null
}

function drugRec(capacity: number, fill: number, content: number): number {
  const data: number = content / capacity * fill

  return Math.round(data)
}

// Handler function
async function handleCreateRecipe() {
  const response = await createRecipeCompound(localStorage.getItem('token'), recipeRequest)
  const json = await response.json()

  try {

    if (response.status === 201) {
      alert("Berhasil membuat resep!")
      resetForm()
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }
}

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

function handleInputObat(index: number, name: string, value: number) {
  indexData.value = index
  indexName.value = name
  indexValue.value = value

  nextTick(() => {
    scroll()
  })
}

function handleCreateRecipeCompound() {
  recipeCompounds.value.push({...recipeCompound.value})

  recipeCompound.value = {
    recipe_name: "",
    value: 0,
    use: "",
    drug: []
  }
}

function handleAddDrugCompound(id: Drug) {
  const value = valMap[id.id] || 0
  const embalming = embalmingMap[id.id] || 0
  const tuslah = tuslahMap[id.id] || 0

  const res = drugRec(id.capacity, indexValue.value, value)

  recipeCompounds.value[indexData.value].drug.push({name: id.name, drug_id: id.id, value: res, embalming: embalming, tuslah: tuslah, price: sum(res, id.price, embalming, tuslah)})
}

async function handleGetCurrentRecipeNumber() {
  const response = await getCurrentRecipeNumber(localStorage.getItem('token'), recipeRequest.date)
  const json = await response.json()

  try {

    if (response.status === 200) {
      recipeRequest.recipe_number = recipeNumber(new Date(recipeRequest.date), json.response)
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }
}

async function handleGetRecipeNumber() {
  const response = await getRecipeNumber(localStorage.getItem('token'), recipeRequest.care_number)
  const json = await response.json()

  try {

    if (response.status === 200) {
      recipeRequest.recipe_number = json.response
    }else{
      alert(json.errors)
    }

  } catch(error) {
    console.log(error)
  }
}

// Wacher
watch(recipeType, async (val) => {
  val ? await handleGetRecipeNumber() : await handleGetCurrentRecipeNumber()
  recipeRequest.type = val ? "add" : "create"
})

watch(() => recipeRequest.date, async () => {
  await handleGetCurrentRecipeNumber()
})

// Before page view
onBeforeMount(async () => {
  await handleGetCurrentRecipeNumber()
})
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
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="ck">Timpa resep</label>
              </div>
              <input type="checkbox" id="ck" v-model="recipeType" placeholder="resep">
            </div>
            <div style="padding: 0.5rem;">
              <div style="margin-bottom: 0.5rem;">
                <label for="da">Tanggal resep</label>
              </div>
              <input type="datetime-local" id="da" step="1" v-model="recipeRequest.date" placeholder="resep">
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
              <input type="text" id="nr" v-model="recipeCompound.recipe_name" placeholder="nama racikan">
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
              <input type="text" id="d" v-model="recipeCompound.use" placeholder="aturan pakai">
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
            <tr v-for="(rec, index) in recipeCompounds" :key="rec.recipe_name">
              <td>
                <button class="button-action" @click="removeRecipeCompound(rec.recipe_name)">Delete</button>
                <button class="button-action" @click="handleInputObat(index, rec.recipe_name, rec.value)">Input obat</button>
              </td>
              <td>{{ rec.recipe_name }}</td>
              <td>{{ rec.value }}</td>
              <td>{{ rec.use }}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <td>Nama Obat</td>
                      <td>Harga/tablet</td>
                      <td>Jumlah</td>
                      <td>Embalase</td>
                      <td>Tuslah</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="drug in rec.drug" :key="drug.name">
                      <td>{{ drug.name }} <hr></td>
                      <td>{{ drug.price }} <hr></td>
                      <td>{{ drug.value }} <hr></td>
                      <td>{{ drug.embalming }} <hr></td>
                      <td>{{ drug.tuslah }} <hr></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 2rem; margin-left: 2rem;">Total = {{ loopSumCompound(recipeCompounds) }}</div>

      <div ref="pageScroll" style="padding-top: 2rem; padding-bottom: 2rem;" v-if="recipeCompounds.length != 0 && indexName != null">
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

      <template v-if="recipeCompounds.length != 0 && indexName != null">
        <hr>

        <div style="width: 100%; height: 15rem" class="scroll anim-slide">
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
                <td>Komposisi</td>
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
                <td>{{ rec.composition }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
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
