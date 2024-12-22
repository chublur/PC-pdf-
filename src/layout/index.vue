<template>
  <div class="app-wrapper">
    <div class="main-container">
      <el-tabs
        v-model="activeTab"
        class="tabs-bar"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="route in routes"
          :key="route.path"
          :label="route.meta.title"
          :name="route.path"
        />
      </el-tabs>
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取路由配置中的子路由
const routes = computed(() => {
  return router.options.routes
    .find(r => r.path === '/')
    ?.children || []
})

// 当前激活的标签页
const activeTab = ref(route.path)

// 标签页点击事件
const handleTabClick = (tab) => {
  router.push(tab.props.name)
}
</script>

<style scoped>
.app-wrapper {
  height: 100vh;
  width: 100%;
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs-bar {
  padding: 10px 20px 0;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 路由切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 