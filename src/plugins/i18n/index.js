import { createI18n } from 'vue-i18n'
import { getStore, setStore } from '@/utils'

// 创建i18n实例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API模式
  //   locale: navigator.language, // 自动检测浏览器语言
  locale: getStore('locale') || 'zh-CN',
  fallbackLocale: 'en',
  messages: {} // 初始为空，动态加载
  //   numberFormats: {
  //     en: {
  //       currency: {
  //         style: 'currency',
  //         currency: 'USD'
  //       }
  //     },
  //     'zh-cn': {
  //       currency: {
  //         style: 'currency',
  //         currency: 'CNY'
  //       }
  //     }
  //   }
})

const loadElementLocale = async (lang) => {
  const localMap = {
    'zh-CN': () => import('element-plus/dist/locale/zh-cn.mjs'),
    en: () => import('element-plus/dist/locale/en.mjs')
  }
  const { default: locale } = await localMap[lang]()
  return locale
}

// 按需加载本地语言文件
async function loadLocaleMessages(lang) {
  const [custom, element] = await Promise.all([
    import(`@/locales/${lang}.json`),
    loadElementLocale(lang)
  ])

  return {
    ...custom.default,
    element // 合并Element翻译
  }
}

// 初始化加载语言资源
export async function setupI18n(app) {
  const lang = i18n.global.locale.value
  // 1. 初始化自定义语言文件
  // 2. 初始化 Element Plus 语言
  const localeMessage = await loadLocaleMessages(lang)
  //   console.log('localeMessage:', localeMessage)
  i18n.global.setLocaleMessage(lang, localeMessage)
  app.use(i18n)
}

// 切换语言
export const changeLanguage = async (lang) => {
  if (!i18n.global.availableLocales.includes(lang)) {
    const localeMessage = await loadLocaleMessages(lang)
    i18n.global.setLocaleMessage(lang, localeMessage)
  }
  i18n.global.locale.value = lang
  setStore('locale', lang)
}
