<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="上传PDF预览" name="pdf">
        <pdf-viewer />
      </el-tab-pane>
      <el-tab-pane label="base64数据转pdf预览" name="page2">
        <page-two />
      </el-tab-pane>
      <el-tab-pane label="url转pdf预览" name="page3">
        <page-three />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PdfViewer from './views/pdf/index.vue'
import PageTwo from './views/page2/index.vue'
import PageThree from './views/page3/index.vue'

const activeTab = ref('pdf')

const handleTabClick = (tab) => {
  console.log('切换到标签:', tab.props.name)
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
