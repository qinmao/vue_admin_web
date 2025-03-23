// 平台配置
import { setStore, getStore } from '@/utils'

const platformConfig = {
  Version: '1.0.0',
  Layout: 'horizontal',
  EpThemeColor: '#409EFF',
  ShowLogo: true
}

// 缓存本地的配置
const {
  Layout,
  EpThemeColor,
  ShowLogo
} = platformConfig

setStore('Layout', getStore('Layout') ?? Layout)
setStore('EpThemeColor', getStore('EpThemeColor') ?? EpThemeColor)
setStore('ShowLogo', getStore('ShowLogo') ?? ShowLogo)
