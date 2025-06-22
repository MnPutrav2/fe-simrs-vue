export async function province() {
  const response = await fetch(`http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`, {
    method: "GET"
  })

  return response
}

export async function regencie(id: number) {
  const response = await fetch(`http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`, {
    method: "GET"
  })

  return response
}

export async function district(id: number) {
  const response = await fetch(`http://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`, {
    method: "GET"
  })

  return response
}

export async function village(id: number) {
  const response = await fetch(`http://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`, {
    method: "GET"
  })

  return response
}
