// 应用的所有配置设置

import { defineStore } from 'pinia'
import { setStore, getStore } from '@/utils'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    title: 'demo-admin',
    isCollapse: false,
    showLogo: getStore('ShowLogo') === 'false' ? false : true,
    layout: getStore('Layout'),
    showSetting: false
  }),
  actions: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse
    },
    setLayout(layout) {
      this.layout = layout
      setStore('Layout', layout)
    },
    toggleSetting() {
      this.showSetting = !this.showSetting
    },
    toggleLogo() {
      this.showLogo = !this.showLogo
      setStore('ShowLogo', this.showLogo)
    }
  }
})
