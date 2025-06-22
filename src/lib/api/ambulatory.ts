interface AmbulatoryCare {
  care_number: string;
  medical_record: string;
  date: string;
  body_temperature: number;
  tension: string;
  pulse: number;
  respiration: number;
  height: number;
  weight: number;
  spo2: number;
  gcs: number;
  awareness: string;
  complaint: string;
  examination: string;
  allergy: string;
  followup: string;
  assessment: string;
  instructions: string;
  evaluation: string;
  officer: string;
}

interface AmbulatoryCareUpdate {
  care_number: string;
  date: string;
  data: AmbulatoryCare
}

export async function createAmbulatoryCare(token: string | null, ambulatory: AmbulatoryCare) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/ambulatory-care/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(ambulatory)
  })

  return response
}

export async function getAmbulatoryCare(token: string | null, careNumber: string | null, date1: string, date2: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/ambulatory-care/get?care-number=${careNumber}&date1=${date1}&date2=${date2}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function deleteAmbulatoryCare(token: string | null, careNumber: string | null, date: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/ambulatory-care/delete?care-number=${careNumber}&date=${date}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function updateAmbulatoryCare(token: string | null, data: AmbulatoryCareUpdate) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/ambulatory-care/update`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  return response
}
