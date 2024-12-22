<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <div class="error-desc">抱歉，你访问的页面不存在</div>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
}

.error-desc {
  font-size: 30px;
  color: #666;
  margin: 20px 0;
}
</style> 