/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  global: {
    // BMapGL: true, // 百度地图
    // BMapGLLib: true,
    // BMAP_EARTH_MAP: true, // 地球卫星模式
    // BMAP_NORMAL_MAP: true, // 普通街道
    // BMAP_STATUS_SUCCESS: true,
    // mapvgl: true,
  }
}
