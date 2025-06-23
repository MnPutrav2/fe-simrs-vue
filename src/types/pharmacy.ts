export interface RecipeForRequest {
  care_number: string;
  recipe_number: string;
  date: string;
  validate: string;
  handover: string;
  type: string;
  drug: RecipesForRequest[]
}

export interface Recipe {
  id: string;
  name: string;
  value: number;
  use:string;
  embalming:number;
  tuslah:number;
  price:number;
}

export interface RecipesForRequest {
  drug_id: string;
  value: number;
  use:string;
  embalming:number;
  tuslah:number;
  total_price:number;
}

export interface Drug {
  id: string;
  name: string;
  distributor_id: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  composition: string;
  category: string;
  price: number;
  expired_date: string;
}

export interface DrugRecipeCompound {
  name: string;
  value: number;
  embalming: number;
  tuslah: number;
  price: number;
}

export interface RecipeCompound {
  name: string;
  value: number;
  use: string;
  drug: DrugRecipeCompound[]
}

export interface RecipeRequest {
  care_number: string;
  recipe_number: string;
  drug: Recipe[]
}

export interface DrugData {
  id: string;
  name: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  composition: string;
  category: string;
  price: number;
  expired_date: string;
}

export interface RequestBodyDrugDataUpdate {
  id: string;
  data: DrugData;
}

export interface ResponseDrugData {
  id: string;
  name: string;
  distributor_id: string;
  distributor: string;
  capacity: number;
  fill: number;
  unit: string;
  composition: string;
  category: string;
  price: number;
  expired_date: string;
}

export interface Distributor {
  id: string;
  name: string;
  address: string;
}
