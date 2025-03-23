<template>
  <div class="horizontal-header" v-loading="menus.length === 0">
    <div class="header-left" @click="$router.push('/')">
      <img class="logo" src="@/assets/logo.png" alt="logo" />
      <h4 class="header-title">{{ title }}</h4>
    </div>
    <div class="header-middle">
      <el-menu router mode="horizontal" :default-active="defaultActive">
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
    </div>
    <HeaderRight />
  </div>
</template>
<script setup>
import HeaderRight from '@/layout/components/header-right.vue'
import { useNav } from '@/layout/components/utils/hook'
import { resolve } from 'path-browserify'
import { Icon } from '@iconify/vue'

const route = useRoute()
const defaultActive = computed(() => {
  return route.path
})
const { title, menus } = useNav()
</script>
<style lang="scss" scoped>
.horizontal-header {
  width: 100%;
  display: flex;
  background-color: var(--el-bg-color);
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;
    width: 200px;
    cursor: pointer;
    .logo {
      height: 32px;
    }
    .header-title {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
      max-width: 320px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .header-middle {
    flex: 1;
    min-width: 0; /* 允许收缩 */
  }
}
</style>
