<script setup lang="ts">
import { getPatient } from '@/lib/api/patient'
import { createRegister, deleteRegister, getCurrentCareNumber, getCurrentRegisterNumber, getRegisters } from '@/lib/api/register';
import { careNumber, regNumber } from '@/lib/careNumber';
import { formatDate } from '@/lib/formatDate';
import { onBeforeMount, reactive, ref, watch } from 'vue'
import type { RegistrationData, RegisterData } from '@/types/register';
import type { Patient, Doctor } from '@/types/patient';

// Define variabels
const gl = new Date()
const token = localStorage.getItem('token')
const date1 = ref<string>(formatDate(gl))
const date2 = ref<string>(formatDate(gl))
const search = ref<string>("")
const limit = ref<number>(5)
const search_reg = ref<string>("")
const limit_reg = ref<number>(5)
const patientDatas = ref<Patient[]>([])
const ambulatoryCare = ref<HTMLElement | null>()
const registerDatas = ref<RegistrationData[]>([])
const doctors = <Doctor[]>([
  {
    id: 'DR0001',
    name: 'dr. Albert, Sp.B',
    specialist: true,
    specialist_name: 'Bedah'
  },
])
const policlinics = ref<Common[]>([
  {
    id: 'BED',
    name: 'Poliklinik Bedah'
  },
])
const payments = ref<Common[]>([
  {
    id: 'UMUM',
    name: 'UMUM'
  },
  {
    id: 'BPJS',
    name: 'BPJS'
  },
])
const registerData: RegisterData = reactive({
  care_number: '',
  register_number: '',
  register_date: '',
  medical_record: '',
  payment_method: '',
  policlinic: '',
  doctor: ''
})
registerData.register_date = formatDate(gl)

// External interface
interface Common {
  id: string;
  name: string;
}

// Define function
// Handler functions
async function handleReg(mr: string) {
  ambulatoryCare.value?.scrollIntoView({behavior: 'smooth'})

  registerData.medical_record = mr
}

async function handleCreateRegister() {
  const response = await createRegister(token, registerData)
  const json = await response.json()

  try {
    if (response.status === 201) {
      await handleGetRegister()
      alert("Data berhasil dibuat")
    } else {
      alert(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleGetSearchPatient() {
  const response = await getPatient(token, limit.value, search.value)
  const json = await response.json()

  try {
    if (response.status === 200) {
      patientDatas.value = json
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

async function handleDeleteRegister(care_num: string) {
  const response = await deleteRegister(token, care_num)
  const json = await response.json()

  try {
    if (response.status === 200) {
      await handleGetRegister()
      alert("Data berhasil dihapus")
    } else {
      console.log(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleGetRegNumber() {
  const response = await getCurrentRegisterNumber(token, registerData.register_date, registerData.policlinic)
  const json = await response.json()

  try {
    if (response.status === 200) {
      registerData.register_number = regNumber(json.response)
    } else {
      console.log(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

async function handleGetCareNumber() {
  const response = await getCurrentCareNumber(token, registerData.register_date)
  const json = await response.json()

  try {
    if (response.status === 200) {
      registerData.care_number = careNumber(new Date(registerData.register_date), json.response)
    } else {
      console.log(json.errors)
    }
  } catch(error) {
    console.log(error)
  }
}

// Watcher
watch([() => registerData.register_date, () => registerData.policlinic], async () => {
  await handleGetRegNumber()
  await handleGetCareNumber()
})

// Before view page
onBeforeMount(async () => {
  await handleGetRegister()
  await handleGetRegNumber()
  await handleGetCareNumber()
})
</script>

<template>
  <section class="anim-slide" ref="ambulatoryCare">
    <h3 style="margin: 0.5rem;">Registrasi Rawat Jalan</h3>
    <hr>
    <div style="margin-top: 2rem; margin-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleCreateRegister()">

        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Rawat Jalan</h4>
        <div style="display: grid; grid-template-columns: auto auto auto; padding-left: 1rem;">
          <div class="input-field">
            <div class="cover">
              <label for="regnum">Nomor Registrasi</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="regnum" v-model="registerData.register_number" placeholder="Nomor registrasi" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="regd">Tanggal Registrasi</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="date" id="regd" v-model="registerData.register_date" placeholder="Tanggal registrasi" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="care_num">Nomor Rawat</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="care_num" v-model="registerData.care_number" placeholder="Nomor rawat" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="mr">Nomor Rekam Medis</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <input type="text" id="mr" v-model="registerData.medical_record" placeholder="Nomor RM" required>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="pay">Cara Bayar</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <select id="pay" v-model="registerData.payment_method">
              <option v-for="pay in payments" :key="pay.id" :value="pay.id">{{ pay.name }}</option>
            </select>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="dr">Dokter</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <select id="dr" v-model="registerData.doctor">
              <option v-for="doc in doctors" :key="doc.id" :value="doc.id">{{ doc.name }}</option>
            </select>
          </div>

          <div class="input-field">
            <div class="cover">
              <label for="poli">Poliklinik</label>
            </div>
            <span style="padding-right: 0.5rem;">:</span>
            <select id="poli" v-model="registerData.policlinic">
              <option v-for="poli in policlinics" :key="poli.id" :value="poli.id">{{ poli.name }}</option>
            </select>
          </div>
        </div>

        <div>
          <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Action</h4>
          <button type="submit">Save</button>
        </div>

      </form>
    </div>

    <hr>

    <div style="padding-top: 2rem; padding-bottom: 2rem;">
      <form class="form-data-custom" v-on:submit.prevent="handleGetSearchPatient()">
        <h4 style="margin: 0.5rem; color: var(--font-color-sec);">Cari pasien</h4>
        <div class="center" style="justify-content: flex-start; align-items: flex-end; padding-left: 1rem;">
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="search">Cari</label>
            </div>
            <input type="text" id="search" v-model="search" placeholder="no RM/Nama Pasien">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="limit">Limit</label>
            </div>
            <input type="number" id="limit" v-model="limit" placeholder="limit data">
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
            <td>No rekam medis</td>
            <td>Nama</td>
            <td>Tempat/tanggal lahir</td>
            <td>Jenis Kelamin</td>
            <td>Alamat</td>
            <td>NIK</td>
            <td>BPJS</td>
            <td>No telepon</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patientDatas" :key="patient.medical_record">
            <td>
              <button class="button-action" @click="handleReg(patient.medical_record)">Register</button>
            </td>
            <td>{{ patient.medical_record }}</td>
            <td>{{ patient.name }}</td>
            <td>{{ `${patient.birth_place}, ${patient.birth_date}` }}</td>
            <td>{{ patient.gender }}</td>
            <td>{{ patient.address }}</td>
            <td>{{ patient.nik }}</td>
            <td>{{ patient.bpjs }}</td>
            <td>{{ patient.phone_number }}</td>
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
            <input type="date" id="date1" v-model="date1" placeholder="tanggal">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="date2">s.d</label>
            </div>
            <input type="date" id="date2" v-model="date2" placeholder="tanggal">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="search1">Cari</label>
            </div>
            <input type="text" id="search1" v-model="search_reg" placeholder="No rawat/Nama Pasien">
          </div>
          <div style="padding: 0.5rem;">
            <div style="margin-bottom: 0.5rem;">
              <label for="limit2">Limit</label>
            </div>
            <input type="number" id="limit2" v-model="limit_reg" placeholder="limit data">
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
              <button class="button-action" @click="handleDeleteRegister(reg.care_number)">Delete</button>
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
