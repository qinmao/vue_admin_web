<template>
  <div :class="wrapperClass">
    <template v-if="layout === 'vertical'">
      <Vertical class="vertical" />
      <div class="main-container">
        <div class="nav-bar">
          <Breadcrumb />
          <HeaderRight />
        </div>
        <section class="app-main">
          <el-scrollbar :wrap-style="{ overflow: 'hidden' }">
            <router-view>
              <template #default="{ Component, route }">
                <component :is="Component" />
                <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
                  <BackTop />
                </el-backtop>
              </template>
            </router-view>
          </el-scrollbar>
        </section>
      </div>
    </template>
    <template v-if="layout === 'horizontal'">
      <Horizontal></Horizontal>
      <section class="app-main">
        <el-scrollbar :wrap-style="{ overflow: 'hidden' }">
          <router-view>
            <template #default="{ Component, route }">
              <component :is="Component" />
              <el-backtop title="回到顶部" target=".app-main .el-scrollbar__wrap">
                <BackTop />
              </el-backtop>
            </template>
          </router-view>
        </el-scrollbar>
      </section>
    </template>
    <Setting v-if="showSetting" />
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { useSettingStore } from '@/store/settings'
import Breadcrumb from '@/layout/components/bread-crumb.vue'
import HeaderRight from '@/layout/components/header-right.vue'
import Setting from './components/setting/index.vue'
import Vertical from './components/vertical/index.vue'
import Horizontal from './components/horizontal/index.vue'
import BackTop from '@/assets/svg/back_top.svg?component'

export default {
  components: {
    Horizontal,
    Setting,
    Vertical,
    Breadcrumb,
    HeaderRight,
    BackTop
  },
  computed: {
    ...mapState(useSettingStore, ['layout', 'showSetting', 'isCollapse']),
    wrapperClass() {
      return this.layout === 'vertical' ? 'vertical-wrapper' : 'horizontal-wrapper'
    }
  },
  mounted() {
    window.document.body.setAttribute('layout', this.layout)
  }
}
</script>

<style lang="scss" scoped>
.vertical-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  .main-container {
    flex: 1;
    background: var(--main-bg-color);
    overflow: hidden;
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      padding: 0 20px;
      background-color: var(--el-bg-color);
      box-shadow: 0 1px 2px 0 var(--border-color);
    }
    .app-main {
      height: calc(100vh - 48px); //  自适应高度 el-scrollbar 继承
    }
  }
}

.horizontal-wrapper {
  width: 100%;
  height: 100vh;
  background: var(--main-bg-color);
  .app-main {
    height: calc(100vh - 48px); //  自适应高度 el-scrollbar 继承
  }
}
</style>
