<template>
  <div class="pdf-container">
    <div class="upload-area">
      <el-upload
        class="pdf-upload"
        accept=".pdf"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          选择PDF文件
        </el-button>
      </el-upload>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="pdfData" class="pdf-viewer">
        <iframe 
          :src="pdfData" 
          :style="{ height: viewerHeight + 'px' }" 
          width="100%" 
          frameborder="0"
        ></iframe>
      </div>
      <div v-else class="empty-tip">
        请选择PDF文件
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

const pdfData = ref(null)
const loading = ref(false)
const error = ref(null)
const viewerHeight = ref(0)

// 计算预览区域高度
const calculateHeight = () => {
  // 获取视窗高度
  const windowHeight = window.innerHeight
  // 减去其他元素的高度（头部padding、上传区域、边距等）
  const offset = 160 // 根据实际情况调整这个值
  viewerHeight.value = windowHeight - offset
}

// 监听窗口大小变化
const handleResize = () => {
  calculateHeight()
}

// 将文件转换为base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 处理文件选择
const handleFileChange = async (file) => {
  if (file && file.raw) {
    const isValidPDF = file.raw.type === 'application/pdf'
    if (!isValidPDF) {
      error.value = '只能上传PDF文件!'
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      if (pdfData.value) {
        URL.revokeObjectURL(pdfData.value)
        console.log('旧文件流', pdfData.value)
      }
      
      pdfData.value = URL.createObjectURL(file.raw)
      console.log('新文件流', pdfData.value)
      
      // 转换为base64并保存到store
      const base64Data = await fileToBase64(file.raw)
      pdfStore.setPdfBase64(base64Data)
      console.log('PDF Base64数据已保存到store')
      
      console.log('文件信息:', {
        名称: file.raw.name,
        大小: (file.raw.size / 1024).toFixed(2) + 'KB',
        类型: file.raw.type
      })
      
      loading.value = false
    } catch (err) {
      error.value = '文件加载失败'
      loading.value = false
      console.error('文件处理错误:', err)
    }
  }
}

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (pdfData.value) {
    URL.revokeObjectURL(pdfData.value)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pdf-container {
  height: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.upload-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pdf-upload {
  display: inline-block;
}

.pdf-viewer {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
}

.loading, .error, .empty-tip {
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

.error {
  color: #f56c6c;
}

:deep(.el-upload) {
  width: auto;
}

:deep(.el-upload-dragger) {
  width: auto;
}

/* 适配移动设备 */
@media screen and (max-width: 768px) {
  .pdf-container {
    padding: 10px;
  }
  
  .upload-area {
    padding: 5px;
  }
}
</style> 