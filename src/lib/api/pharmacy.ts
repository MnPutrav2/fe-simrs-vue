import type { DrugData, RequestBodyDrugDataUpdate, RecipeForRequest, RecipeCompoundForRequest } from "@/types/pharmacy"

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

export async function createRecipeCompound(token: string | null, drug: RecipeCompoundForRequest) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/create-recipe-compound`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(drug)
  })

  return response
}

export async function getCurrentRecipeNumber(token: string | null, date: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-current-recipe-number?date=${date.split("T")[0]}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function getRecipeNumber(token: string | null, care: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-recipe-number?care_number=${care}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function getRecipeData(token: string | null, date1: string, date2: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-recipe-data?date1=${date1.split("T")[0]}&date2=${date2.split("T")[0]}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function getDrugRecipe(token: string | null, recipe: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/get-all-drug-recipe?recipe=${recipe}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}

export async function deleteDrugRecipes(token: string | null, recipe:  string, drugID: string, comname: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/pharmacy/delete-drug-recipes?recipe_id=${recipe}&drug_id=${drugID}&compound_name=${comname}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  return response
}
