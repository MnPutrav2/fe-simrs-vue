interface RegisterData {
  care_number: string;
  register_number: string;
  register_date:string;
  medical_record: string;
  payment_method:string;
  policlinic: string;
  doctor: string;
}

export async function createRegister(token: string | null, register: RegisterData) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/register/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(register)
  })

  return response
}

export async function getRegisters(token: string | null, date1: string, date2: string, limit: number, search: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/register/get?date1=${date1}&date2=${date2}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function deleteRegister(token: string | null, careNum: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/register/delete?care-number=${careNum}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function getCurrentRegisterNumber(token: string | null, date: string, policlinic: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/register/get-current-register?date=${date}&policlinic=${policlinic}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}

export async function getCurrentCareNumber(token: string | null, date: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/register/get-current-care-number?date=${date}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}
