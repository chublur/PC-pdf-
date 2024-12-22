<template>
  <div class="page-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Base64 PDF预览</span>
          <div v-if="pdfStore.pdfBase64" class="pdf-controls">
            <el-button-group>
              <el-button :disabled="currentPage <= 1" @click="prevPage">
                <el-icon><ArrowLeft /></el-icon>
                上一页
              </el-button>
              <el-button :disabled="currentPage >= totalPages" @click="nextPage">
                下一页
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <div class="page-info">
              <el-input-number 
                v-model="currentPage" 
                :min="1" 
                :max="totalPages"
                :controls="false"
                size="small"
                @change="handlePageChange"
              />
              <span class="page-text">/ {{ totalPages }} 页</span>
            </div>
          </div>
        </div>
      </template>
      <div class="content">
        <div v-if="!pdfStore.pdfBase64" class="empty-tip">
          请先在PDF预览页面上传文件
        </div>
        <div v-else-if="loading" class="loading">
          加载中...
        </div>
        <div v-else class="pdf-viewer">
          <iframe 
            ref="pdfIframe"
            :src="pdfUrl + '#page=' + currentPage"
            :style="{ height: viewerHeight + 'px' }" 
            width="100%" 
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePdfStore } from '@/stores/pdf'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const pdfStore = usePdfStore()
const loading = ref(false)
const viewerHeight = ref(0)
const pdfUrl = ref(null)
const pdfIframe = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// 页面控制函数
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

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 将base64转换为URL
const base64ToUrl = (base64Data) => {
  try {
    console.log('pdfbase64信息：', base64Data)
    const base64Clean = base64Data.split(',')[1]
    const byteCharacters = atob(base64Clean)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }

    // 设置一个默认的总页数
    totalPages.value = 10 // 这里可以根据实际情况调整
    
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Base64转换错误:', error)
    return null
  }
}

// 计算预览区域高度
const calculateHeight = () => {
  const windowHeight = window.innerHeight
  const offset = 200 // 根据实际情况调整
  viewerHeight.value = windowHeight - offset
}

const handleResize = () => {
  calculateHeight()
}

// 监听base64数据变化
watch(() => pdfStore.pdfBase64, (newValue) => {
  if (newValue) {
    loading.value = true
    pdfUrl.value = base64ToUrl(newValue)
    currentPage.value = 1 // 重置页码
    loading.value = false
  }
})

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', handleResize)
  
  if (pdfStore.pdfBase64) {
    pdfUrl.value = base64ToUrl(pdfStore.pdfBase64)
  }
})

onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.page-container {
  height: 100%;
  padding: 20px;
}

.box-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 100px;
  z-index: -99;
}

.pdf-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-text {
  color: #606266;
}

:deep(.el-input-number) {
  width: 70px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

.content {
  height: calc(100% - 60px);
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
}

.empty-tip, .loading {
  text-align: center;
  padding: 40px;
  color: #909399;
  background: #f5f7fa;
  border-radius: 4px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 适配移动设备 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }
  
  .card-header {
    position: relative;
    top: 20px;
    z-index: -99;
    flex-direction: column;
    gap: 10px;
  }
  
  .pdf-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .page-info {
    flex-shrink: 0;
  }
}
</style> 