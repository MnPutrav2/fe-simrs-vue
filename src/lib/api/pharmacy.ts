interface DrugData {
  id: string;
  name: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  category: string;
  price: number;
  expired_date: string;
}

interface RequestBodyDrugDataUpdate {
  id: string;
  data: DrugData;
}

export async function createDrugData(token: string | null, drug: DrugData) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/create-drug-data`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(drug)
  })

  return response
}

export async function getDrugData(token: string | null, search: string | null, limit: number) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-drug-data?search=${search}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function updateDrugData(token: string | null, data: RequestBodyDrugDataUpdate) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/update-drug-data`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  return response
}

export async function deleteDrugData(token: string | null, id: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/delete-drug-data?drug_id=${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function getDistributor(token: string | null) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-distributor`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}
