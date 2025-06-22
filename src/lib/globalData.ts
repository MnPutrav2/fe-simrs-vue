import { ref, watch } from 'vue'

const globalMR = ref<string>(localStorage.getItem('mr') || '')

watch(globalMR, (val) => {
  localStorage.setItem('mr', val)
})

export function useGlobalMR() {
  return {
    globalMR
  }
}
