import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePdfStore = defineStore('pdf', () => {
  const pdfBase64 = ref('')

  const setPdfBase64 = (base64) => {
    pdfBase64.value = base64
  }

  return {
    pdfBase64,
    setPdfBase64
  }
}) 