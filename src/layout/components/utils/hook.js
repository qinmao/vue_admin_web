import { useUserStore } from '@/store/user'
import { useSettingStore } from '@/store/settings'
import { generateMenus } from '@/router/utils'

export function useNav() {
  // 设置相关
  const title = computed(() => {
    return useSettingStore().title
  })
  const layout = computed(() => {
    return useSettingStore().layout
  })
  const showLogo = computed(() => {
    return useSettingStore().showLogo
  })
  const isCollapse = computed(() => {
    return useSettingStore().isCollapse
  })
  function toggleSetting() {
    useSettingStore().toggleSetting()
  }
  function toggleSidebar() {
    useSettingStore().toggleSidebar()
  }

  // 用户相关
  const userInfo = computed(() => {
    return useUserStore().userInfo
  })

  function logout() {
    useUserStore().logout()
  }

  const menus = computed(() => {
    return generateMenus(useUserStore().userAllRoutes)
  })

  return {
    title,
    showLogo,
    layout,
    isCollapse,
    toggleSetting,
    toggleSidebar,

    userInfo,
    logout,
    menus
  }
}
