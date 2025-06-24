import { ref } from "vue"

export function formatDate(date: Date): string {
  const defaultDate: Date = date
  const datez: string = defaultDate.getDate().toString()
  const year: string = defaultDate.getFullYear().toString()
  const month: number = defaultDate.getMonth() + 1

  let formatMonth: string = ""
  let formatDate: string = ""

  if (month.toString().length == 1) {
    formatMonth = "0" + month.toString()
  } else {
    formatMonth = month.toString()
  }

  if (datez.length == 1) {
    formatDate = "0" + datez
  } else {
    formatDate = datez
  }

  return `${year}-${formatMonth}-${formatDate}`
}

export function formatDatetime(date: Date, time: string | null): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const timeFormatted = time ?? `${hours}:${minutes}`

  return `${year}-${month}-${day}T${timeFormatted}`
}
