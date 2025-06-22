export async function logsApi(token: string | null, date1: string, date2: string) {
  const response = await fetch(`${import.meta.env.VITE_API_PATH}/logs?date1=${date1}&date2=${date2}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return response
}
