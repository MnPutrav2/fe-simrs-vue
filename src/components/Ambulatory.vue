<script setup lang="ts">
import { createAmbulatoryCare, deleteAmbulatoryCare, getAmbulatoryCare, updateAmbulatoryCare } from '@/lib/api/ambulatory';
import { getRegisters } from '@/lib/api/register';
import { formatDate, formatDatetime, viewedDateTime } from '@/lib/formatDate';
import { useGlobalMR } from '@/lib/globalData';
import { resetForm } from '@/lib/resetForm';
import { onBeforeMount, reactive, ref } from 'vue';
import type { RegistrationData } from '@/types/register';
import type { AmbulatoryCareRequest, AmbulatoryCare, AmbulatoryCareRequestUpdate } from '@/types/ambulatory';

// Define variabels
const user = defineProps(['data'])
const gl = new Date()
const token = localStorage.getItem('token')
const date1 = ref<string>(formatDate(gl))
const date2 = ref<string>(formatDate(gl))
const search_reg = ref<string>("")
const limit_reg = ref<number>(5)
const registerDatas = ref<RegistrationData[]>([])
const pages = ref<HTMLElement | null>()
const searchAmbulatory = ref<string | null>("")
const dateSearch1 = ref<string>(formatDatetime(gl, "00:00:00"))
const dateSearch2 = ref<string>(formatDatetime(gl, "23:59:00"))
const ambulatoryDatas = ref<AmbulatoryCare[]>([])
const editAction = ref<boolean>(false)
const bool = ref<boolean>(false)
const dateForEdit = ref<string>('')
const { globalMR } = useGlobalMR()
let inter = setInterval(updateTime, 1000)
const officers = [
  {
    id: "EMP001",
    name: "ADMIN"
  },
  {
    id: "EMP001",
    name: "AGUS"
  },
]
const ambulatoryData = reactive<AmbulatoryCareRequest>({
  care_number: '',
  medical_record: '',
  date: '',
  body_temperature: 0,
  tension: '',
  pulse: 0,
  respiration: 0,
  height: 0,
  weight: 0,
  spo2: 0,
  gcs: 0,
  awareness: 'Compos Mentis',
  complaint: '',
  examination: '',
  allergy: '',
  followup: '',
  assessment: '',
  instructions: '',
  evaluation: '',
  officer: user.data.id
})

// Define functions
function updateTime() {
  ambulatoryData.date = formatDatetime(new Date(), null)
}

function autoDate(bool: boolean) {
  if (bool) {
    clearInterval(inter)
  } else {
    inter = setInterval(updateTime, 1000)
  }
}

// Handler functions
async function handleCreateAmbulatory() {
  const response = await createAmbulatoryCare(token, ambulatoryData)
  const json = await response.json()

  try {
    if (response.status === 201) {
      alert("Berhasil simpan data")
      await handleGetAmbulatoryData()
      await handleGetRegister()
      resetForm(ambulatoryData, ambulatoryData.officer)
    } else {
      alert(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleInputAmbulatory(care: string, mr: string) {
  pages.value?.scrollIntoView({behavior: "smooth"})

  ambulatoryData.care_number = care
  ambulatoryData.medical_record = mr
  searchAmbulatory.value = care

  await handleGetAmbulatoryData()
}

async function handleGetAmbulatoryData() {
  const response = await getAmbulatoryCare(token, searchAmbulatory.value, dateSearch1.value, dateSearch2.value)
  const json = await response.json()

  try {
    if (response.status === 200) {
      ambulatoryDatas.value = json
    } else {
      console.log(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleGetRegister() {
  const response = await getRegisters(token, date1.value, date2.value, limit_reg.value, search_reg.value)
  const json = await response.json()

  try {
    if (response.status === 200) {
      registerDatas.value = json
    } else {
      console.log(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

function handleEditAmbulatory(amb: AmbulatoryCare) {
  pages.value?.scrollIntoView({behavior: "smooth"})

  const {officer_name, date, ...filter} = amb
  Object.assign(ambulatoryData, filter)

  ambulatoryData.date = formatDatetime(new Date(amb.date), null)
}

async function handleDeleteAmbulatory(careNum: string, date: string) {
  const response = await deleteAmbulatoryCare(token, careNum, date)
  const json = await response.json()

  try {
    if (response.status === 200) {
      await handleGetAmbulatoryData()
      alert("hapus data berhasil")
    } else {
      alert(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleUpdateAmbulatory(careNum: string, date: string) {
  const data = ref<AmbulatoryCareRequestUpdate>({
    care_number: careNum,
    date: date,
    data: ambulatoryData
  })

  const response = await updateAmbulatoryCare(token, data.value)
  const json = await response.json()

  try {
    if (response.status === 200) {
      await handleGetAmbulatoryData()
      alert("update data berhasil")
    } else {
      alert(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

function handleGlobalMr(data: string) {
  globalMR.value = data
}

// Before page view
onBeforeMount(async () => {
  await handleGetRegister()
})
</script>

<template>
  <section class="anim-slide" ref="pages">
    <h3 style="margin: 0.5rem;">Rawat Jalan</h3>
    <hr>
    <div style="margin-top: 2rem; margin-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleCreateAmbulatory">

        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Input Pemeriksaan</h4>
        <div style="display: grid; grid-template-columns: auto auto auto; padding-left: 1rem;">
          <div class="input-field">
            <div class="cover">
              <label for="cm">Nomor Rawat</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="cm" v-model="ambulatoryData.care_number" placeholder="Nomor rawat" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="awa">Kesadaran</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <select id="awa" v-model="ambulatoryData.awareness">
              <option value="Compos Mentis">Compos Mentis</option>
              <option value="Somnolence">Somnolence</option>
              <option value="Sopor">Sopor</option>
              <option value="Coma">Coma</option>
              <option value="Alert">Alert</option>
              <option value="Confusion">Confusion</option>
              <option value="Voice">Voice</option>
              <option value="Pain">Pain</option>
              <option value="Unresponsive">Unresponsive</option>
            </select>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="al">Alergi</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="al" v-model="ambulatoryData.allergy" placeholder="Alergi" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="date">Tanggal</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <div class="center">
              <div class="center">
                <input type="datetime-local" step="1" id="date" v-model="ambulatoryData.date" placeholder="tanggal">
                <div :class="bool ? 'clock-inactive' : 'clock-active'" class="button-clock" @click="autoDate(bool = !bool)" role="button" tabindex="0"></div>
              </div>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="ofc">Petugas</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <select id="ofc" v-model="ambulatoryData.officer">
              <option v-for="ofc in officers" :value="ofc.id">{{ ofc.name }}</option>
            </select>
          </div>
        </div>

        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Pemeriksaan</h4>
        <div style="display: grid; grid-template-columns: auto auto auto; padding-left: 1rem;">
          <div class="input-field">
            <div class="cover">
              <label for="complaint">Subjek</label>
              <textarea id="complaint" v-model="ambulatoryData.complaint" placeholder="keluhan pasien"></textarea>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="exam">Objek</label>
              <textarea id="exam" v-model="ambulatoryData.examination" placeholder="Pemeriksaan"></textarea>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="as">Assesment</label>
              <textarea id="as" v-model="ambulatoryData.assessment" placeholder="Assesment"></textarea>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="fol">Plan</label>
              <textarea id="fol" v-model="ambulatoryData.followup" placeholder="Tindak lanjut"></textarea>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="int">Intruksi</label>
              <textarea id="int" v-model="ambulatoryData.instructions" placeholder="Intruksi"></textarea>
            </div>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="evl">Evaluasi</label>
              <textarea id="evl" v-model="ambulatoryData.evaluation" placeholder="Evaluasi"></textarea>
            </div>
          </div>

        </div>

        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Pemeriksaan</h4>
        <div style="display: grid; grid-template-columns: auto auto auto; padding-left: 1rem;">
          <div class="input-field">
            <div class="cover">
              <label for="bt">Suhu Badan</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="bt" v-model="ambulatoryData.body_temperature" placeholder="suhu badan">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="hg">Tinggi Badan (Cm)</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="hg" v-model="ambulatoryData.height" placeholder="tinggi badan">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="wg">Berat Badan (Kg)</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="wg" v-model="ambulatoryData.weight" placeholder="berat badan">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="ts">Tensi (mmHg)</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="ts" v-model="ambulatoryData.tension" placeholder="Tensi">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="pl">Nadi</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="pl" v-model="ambulatoryData.pulse" placeholder="nadi">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="spo">SPO</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="spo" v-model="ambulatoryData.spo2" placeholder="spo2">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="gcs">GCS</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="gcs" v-model="ambulatoryData.gcs" placeholder="GCS">
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="rs">Respirasi</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="number" id="rs" v-model="ambulatoryData.respiration" placeholder="Respirasi">
          </div>
        </div>

        <div>
          <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Action</h4>
          <button type="submit">Save</button>
          <button type="button" v-if="editAction" @click="handleUpdateAmbulatory(ambulatoryData.care_number, dateForEdit)">Update</button>
        </div>

      </form>
    </div>

    <hr>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleGetAmbulatoryData">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Data Pemeriksaan Pasien</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt1">Tanggal</label>
            </div>
            <input type="datetime-local" step="1" id="dt1" v-model="dateSearch1" placeholder="date">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="dt2">s.d</label>
            </div>
            <input type="datetime-local" step="1" id="dt2" v-model="dateSearch2" placeholder="date">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="sc">Cari</label>
            </div>
            <input type="text" id="sc" v-model="searchAmbulatory" placeholder="No Rawat/Nama Pasien">
          </div>
          <button>Cari</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; overflow-x: scroll; overflow-y: scroll; height: 20rem; scrollbar-width: thin;">
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>No Rawat</td>
            <td>Nama</td>
            <td>Tanggal Rawat</td>
            <td>No Rekam Medis</td>
            <td>Petugas</td>
            <td>Suhu</td>
            <td>Tensi</td>
            <td>Nadi</td>
            <td>Berat Badan</td>
            <td>Tinggi Badan</td>
            <td>SPO2</td>
            <td>GCS</td>
            <td>Respirasi</td>
            <td>Keluhan</td>
            <td>Assesment</td>
            <td>Intruksi</td>
            <td>Pemeriksaan</td>
            <td>Tindak Lanjut</td>
            <td>Evaluasi</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="amb in ambulatoryDatas" :key="amb.care_number">
            <td>
              <button class="button-action" @click="handleEditAmbulatory(amb), editAction = true, dateForEdit = amb.date">Edit</button>
              <button class="button-action" @click="handleDeleteAmbulatory(amb.care_number, amb.date)">Delete</button>
            </td>
            <td>{{ amb.care_number }}</td>
            <td>{{ amb.name }}</td>
            <td>{{ viewedDateTime(amb.date) }}</td>
            <td>{{ amb.medical_record }}</td>
            <td>{{ amb.officer_name }}</td>
            <td>{{ amb.body_temperature }}</td>
            <td>{{ amb.tension }}</td>
            <td>{{ amb.pulse }}</td>
            <td>{{ amb.weight }}</td>
            <td>{{ amb.height }}</td>
            <td>{{ amb.spo2 }}</td>
            <td>{{ amb.gcs }}</td>
            <td>{{ amb.respiration }}</td>
            <td>{{ amb.complaint }}</td>
            <td>{{ amb.assessment }}</td>
            <td>{{ amb.instructions }}</td>
            <td>{{ amb.examination }}</td>
            <td>{{ amb.followup }}</td>
            <td>{{ amb.evaluation }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <hr>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleGetRegister">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Cari pasien Rawat Jalan</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="date1">Tanggal</label>
            </div>
            <input type="date" id="date1" v-model="date1" placeholder="date">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="date2">s.d</label>
            </div>
            <input type="date" id="date2" v-model="date2" placeholder="date">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="search1">Cari</label>
            </div>
            <input type="text" id="search1" v-model="search_reg" placeholder="No Rawat/Nama Pasien">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="limit2">Limit</label>
            </div>
            <input type="number" id="limit2" v-model="limit_reg" placeholder="Limit data">
          </div>
          <button>Cari</button>
        </div>
      </form>
    </div>

    <div style="width: 100%; overflow-x: scroll; overflow-y: scroll; height: 20rem; scrollbar-width: thin;">
      <table class="table-custom">
        <thead>
          <tr>
            <td>Action</td>
            <td>No Rawat</td>
            <td>No rekam medis</td>
            <td>Nama</td>
            <td>Jenis Kelamin</td>
            <td>Cara Bayar</td>
            <td>Poliklinik</td>
            <td>Dokter</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reg in registerDatas" :key="reg.care_number">
            <td>
              <button class="button-action" @click="handleInputAmbulatory(reg.care_number, reg.medical_record)">Input</button>
              <button class="button-action" @click="handleGlobalMr(reg.care_number)">Menu</button>
            </td>
            <td>{{ reg.care_number }}</td>
            <td>{{ reg.medical_record }}</td>
            <td>{{ reg.name }}</td>
            <td>{{ reg.gender }}</td>
            <td>{{ reg.payment_method }}</td>
            <td>{{ reg.policlinic_name }}</td>
            <td>{{ reg.doctor_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
