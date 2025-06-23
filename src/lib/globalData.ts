import { ref, watch } from 'vue'

const globalMR = ref<string>(sessionStorage.getItem('mr') || '')

watch(globalMR, (val) => {
  sessionStorage.setItem('mr', val)
})

export function clearGlobalMR() {
  globalMR.value = ''
  sessionStorage.removeItem('mr')
}

export function useGlobalMR() {
  return {
    globalMR
  }
}
