<template>
  <div class="page-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>PDF URL预览</span>
        </div>
      </template>
      <div class="content">
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
          <div v-if="pdfUrl" class="url-display">
            <span class="url-label">PDF URL:</span>
            <el-input
              v-model="pdfUrl"
              readonly
              class="url-input"
            >
              <template #append>
                <el-button @click="copyUrl">复制</el-button>
              </template>
            </el-input>
          </div>
        </div>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="preview-area">
          <div v-if="pdfUrl" class="pdf-viewer">
            <object 
              :data="pdfUrl"
              type="application/pdf"
              :style="{ height: viewerHeight + 'px', width: '100%' }"
            >
              <div>无法显示PDF，请安装PDF阅读器</div>
            </object>
          </div>
          <div v-else class="empty-tip">
            请选择PDF文件
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const error = ref(null)
const viewerHeight = ref(0)
const pdfUrl = ref(null)

// 处理文件选择
const handleFileChange = (file) => {
  if (file && file.raw) {
    const isValidPDF = file.raw.type === 'application/pdf'
    if (!isValidPDF) {
      error.value = '只能上传PDF文件!'
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      // 如果已经有之前的 URL，先清除
      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value)
      }
      
      // 创建新的URL
      pdfUrl.value = URL.createObjectURL(file.raw)
      loading.value = false
    } catch (err) {
      error.value = '文件加载失败'
      loading.value = false
      console.error('文件处理错误:', err)
    }
  }
}

// 复制URL到剪贴板
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(pdfUrl.value)
    ElMessage({
      message: 'URL已复制到剪贴板',
      type: 'success'
    })
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error'
    })
  }
}

// 计算预览区域高度
const calculateHeight = () => {
  const windowHeight = window.innerHeight
  const offset = 280 // 根据实际情况调整
  viewerHeight.value = windowHeight - offset
}

const handleResize = () => {
  calculateHeight()
}

onMounted(() => {
  calculateHeight()
  window.addEventListener('resize', handleResize)
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
}

.upload-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.url-display {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.url-label {
  white-space: nowrap;
  color: #606266;
}

.url-input {
  flex: 1;
}

.preview-area {
  height: calc(100% - 140px);
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
}

.empty-tip, .loading, .error {
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

/* 适配移动设备 */
@media screen and (max-width: 768px) {
  .page-container {
    padding: 10px;
  }
  
  .upload-area {
    padding: 10px;
  }
  
  .url-display {
    flex-direction: column;
    align-items: stretch;
  }
  
  .url-label {
    margin-bottom: 5px;
  }
}
</style> 