interface DrugData {
  id: string;
  name: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  composition:string;
  category: string;
  price: number;
  expired_date: string;
}

interface RequestBodyDrugDataUpdate {
  id: string;
  data: DrugData;
}

interface RecipeForRequest {
  care_number: string;
  recipe_number: string;
  date: string;
  validate: string;
  handover: string;
  type: string;
  drug: RecipesForRequest[]
}

interface RecipesForRequest {
  drug_id: string;
  value: number;
  use:string;
  embalming:number;
  tuslah:number;
  total_price:number;
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

export async function createRecipe(token: string | null, drug: RecipeForRequest) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/create-recipe`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(drug)
  })

  return response
}
