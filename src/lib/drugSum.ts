import { ref } from "vue";

interface Recipe {
  id: string;
  name: string;
  value: number;
  use:string;
  embalming:number;
  tuslah:number;
  price:number;
}

interface RecipeCompound {
  name: string;
  value: number;
  use: string;
  drug: DrugRecipeCompound[]
}

interface DrugRecipeCompound {
  name: string;
  value: number;
  embalming: number;
  tuslah: number;
  price: number;
}

export function sum(value: number, price: number, embalming: number, tuslah: number): number {
  const total = ref<number>(value * price + embalming + tuslah)

  return total.value
}

export function loopSum(drug: Recipe[]): number {
  let no: number = 0

  drug.forEach(item => {
    no += sum(item.value, item.price, item.embalming, item.tuslah)
  });

  return no
}

export function loopSumCompound(x: RecipeCompound[]): number {
  let no: number = 0

  x.forEach(item => {
    item.drug.forEach(dx => {
      no += sum(dx.value, dx.price, dx.embalming, dx.tuslah)
    })
  })

  return no
}
