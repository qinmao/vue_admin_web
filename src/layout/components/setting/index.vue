<template>
  <div class="mask-wrapper animate__animated animate__fadeIn" @click="toggleSetting">
    <div
      @click.stop="() => {}"
      class="right-panel animate__animated animate__fadeInRight animate__faster"
    >
      <div class="panel-title">
        <h4>项目配置</h4>
        <span title="关闭配置" class="close-icon" @click="toggleSetting">
          <i-ep-close />
        </span>
      </div>
      <div class="line" />
      <el-divider>导航栏模式</el-divider>
      <ul class="pure-theme">
        <el-tooltip class="item" content="左侧模式" placement="bottom" popper-class="pure-tooltip">
          <li :class="layout === 'vertical' ? 'is-select' : ''" @click="setLayoutModel('vertical')">
            <div />
            <div />
          </li>
        </el-tooltip>

        <el-tooltip class="item" content="顶部模式" placement="bottom" popper-class="pure-tooltip">
          <li
            :class="layout === 'horizontal' ? 'is-select' : ''"
            @click="setLayoutModel('horizontal')"
          >
            <div />
            <div />
          </li>
        </el-tooltip>

        <!-- <el-tooltip class="item" content="混合模式" placement="bottom" popper-class="pure-tooltip">
          <li :class="layout === 'mix' ? 'is-select' : ''" @click.stop="setLayoutModel('mix')">
            <div />
            <div />
          </li>
        </el-tooltip> -->
      </ul>

      <!-- <el-divider>主题色</el-divider>
      <ul class="theme-color">
        <li
          v-for="(item, index) in themeColors"
          :key="index"
          v-show="showThemeColors(item.themeColor)"
          :style="getThemeColorStyle(item.color)"
          @click="setLayoutThemeColor(item.themeColor)"
        >
          <el-icon
            style="margin: 0.1em 0.1em 0 0"
            :size="17"
            :color="getThemeColor(item.themeColor)"
          >
          </el-icon>
        </li>
      </ul> -->

      <el-divider>界面显示</el-divider>
      <ul class="setting">
        <li>
          <span>侧边栏Logo</span>
          <el-switch
            v-model="showSiderLogo"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            inactive-color="#a6a6a6"
            active-text="开"
            inactive-text="关"
            @change="toggleLogo"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { useSettingStore } from '@/store/settings'

export default {
  data() {
    return {
      showSiderLogo: true
    }
  },
  computed: {
    ...mapState(useSettingStore, ['layout', 'showLogo'])
  },
  created() {
    this.showSiderLogo = this.showLogo
  },
  methods: {
    ...mapActions(useSettingStore, ['toggleSetting', 'setLayout', 'toggleLogo']),
    onResetClick() {
      //   storageLocal().clear()
      //   const { EpThemeColor, Layout } = getConfig()
      //   useAppStoreHook().setLayout(Layout)
      //   setEpThemeColor(EpThemeColor)
      //   router.push('/login')
      //   resetRouter()
    },
    setLayoutModel(layout) {
      this.setLayout(layout)
      window.document.body.setAttribute('layout', layout)
    }
  }
}
</script>
<style lang="scss" scoped>
.mask-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.2);
}
.right-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 4000;
  width: 316px;
  height: 100vh;
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  background-color: var(--el-bg-color);
  .panel-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding-left: 10px;
    .close-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-right: 20px;
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-radius: 4px;
      font-size: 20px;
      &:hover {
        background-color: #0000000f;
      }
    }
  }
  .line {
    border-bottom: 1px solid #dcdfe6;
  }
  .is-select {
    border: 2px solid var(--el-color-primary);
  }
  .setting {
    width: 100%;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 25px;
    }
  }
}

.pure-theme {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  margin-top: 25px;

  li {
    position: relative;
    width: 18%;
    height: 45px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}
</style>
