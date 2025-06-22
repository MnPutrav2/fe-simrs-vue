interface PatientData {
  medical_record: string;
  name: string;
  gender: string;
  wedding: string;
  religion: string;
  education: string;
  birth_place: string;
  birth_date: string;
  work: string;
  address: string;
  village: number;
  district: number;
  regencie: number;
  province: number;
  nik: string;
  bpjs: string;
  phone_number: string;
  parent_name: string;
  relationship: string;
  parent_gender: string;
}

export async function createPatient(token: string | null, patient: PatientData) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/patient/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(patient)
  })

  return response
}

export async function getPatient(token: string | null, limit: number, search: string | null) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/patient/get?limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function deletePatient(token: string | null, mr: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/patient/delete?mr=${mr}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function updatePatient(token: string | null, patient: PatientData, mr: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/patient/update`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      medical_record: mr,
      update: patient
    })
  })

  return response
}

export async function getCurrentMedicalRecord(token: string | null) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/patient/get-current-medical-record`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}
