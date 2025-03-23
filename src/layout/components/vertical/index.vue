<template>
  <div class="vertical-sidebar-container">
    <router-link
      v-if="showLogo"
      class="sidebar-logo-container"
      :style="{ width: isCollapse ? '64px' : '100%' }"
      :title="title"
      to="/"
    >
      <img class="logo" src="@/assets/logo.png" alt="logo" />
      <h4 class="sidebar-title" v-if="!isCollapse">{{ title }}</h4>
    </router-link>
    <div class="sidebar-menu-container">
      <el-scrollbar :wrap-style="{ 'overflow-x': 'hidden' }">
        <el-menu
          router
          unique-opened
          mode="vertical"
          :collapse="isCollapse"
          :default-active="defaultActive"
        >
          <template v-for="menu in menus">
            <template v-if="!menu.children">
              <el-menu-item :key="menu.path" :index="menu.path">
                <el-icon v-if="menu.meta.icon">
                  <Icon :icon="menu.meta.icon"></Icon>
                </el-icon>
                <span> {{ menu.meta.title }}</span>
              </el-menu-item>
            </template>
            <template v-else>
              <el-sub-menu :key="`${menu.path}-submenu`" :index="menu.path">
                <template #title>
                  <el-icon v-if="menu.meta.icon">
                    <Icon :icon="menu.meta.icon"></Icon>
                  </el-icon>
                  <span> {{ menu.meta.title }}</span>
                </template>
                <el-menu-item
                  v-for="child in menu.children"
                  :key="`${menu.path}-${child.path}`"
                  :index="resolve(menu.path, child.path)"
                >
                  <el-icon v-if="child.meta.icon">
                    <Icon :icon="child.meta.icon"></Icon>
                  </el-icon>
                  <span> {{ child.meta.title }}</span>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="sidebar-collapse-container">
      <div class="icon-collapse" @click="toggleSidebar">
        <el-tooltip placement="right" :content="isCollapse ? '点击展开' : '点击折叠'">
          <i-ep-expand v-if="isCollapse" />
          <i-ep-fold v-else />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNav } from '@/layout/components/utils/hook'
import { resolve } from 'path-browserify'
import { Icon } from '@iconify/vue'

const route = useRoute()
const defaultActive = computed(() => {
  return route.path
})

const { title, showLogo, isCollapse, menus, toggleSidebar } = useNav()
</script>
<style lang="scss" scoped>
.vertical-sidebar-container {
  height: 100vh;
  background-color: var(--el-bg-color);
  box-shadow: 0 0 2px var(--border-color);
}

.sidebar-logo-container {
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: width 0.2s;
  .logo {
    height: 30px;
  }

  .sidebar-title {
    padding-left: 12px;
    max-width: 150px;
    font-size: 18px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.sidebar-menu-container {
  height: calc(100vh - 98px);
}

.sidebar-collapse-container {
  width: 100%;
  height: 40px;
  box-shadow: 0 0 6px -2px var(--border-color);
  .icon-collapse {
    margin-top: 8px;
    margin-left: 16px;
    font-size: 18px;
    &:hover {
      opacity: 0.7;
      cursor: pointer;
    }
  }
}
</style>
