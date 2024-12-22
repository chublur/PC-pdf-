<template>
  <div class="pdf-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <vue-pdf-embed
        :source="pdfData"
        :page="currentPage"
        @loaded="onPdfLoaded"
      />
      <div class="pdf-controls">
        <el-button @click="prevPage" :disabled="currentPage === 1">上一页</el-button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <el-button @click="nextPage" :disabled="currentPage === totalPages">下一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import  VuePdfEmbed  from 'vue-pdf-embed'
import { getPdfFile } from '@/api/pdf'

const pdfData = ref(null)
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

const fetchPdfData = async () => {
  try {
    const response = await getPdfFile()
    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfData.value = URL.createObjectURL(blob)
    loading.value = false
  } catch (err) {
    error.value = '加载PDF文件失败'
    loading.value = false
  }
}

const onPdfLoaded = (numPages) => {
  totalPages.value = numPages
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(() => {
  fetchPdfData()
})
</script>

<style scoped>
.pdf-container {
  max-width: 800px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.pdf-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
</style> 