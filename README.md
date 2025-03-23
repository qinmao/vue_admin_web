# vite-project

This template should help get you started developing with Vue 3 in Vite.

## 编码规范
### 命名规范
* 文件夹命名
  - 组件文件夹大写
  - 其他文件夹多词的用“-” 如：xxx-xxx,推荐用单个词
* 函数命名
  - 统一用驼峰，如：getUserInfo
  - 事件触发函数 用 on+触发的元素+事件名 如：onLoginBtnClick
* 路由命名
  - 多个单词用“-”,xxx-xxx, 推荐用单个词
* 组件
  - 多个单词用“-”,xxx-xxx, 推荐用单个词
* 样式命名
  - 多个单词用“-”,xxx-xxx, 推荐用单个词

## 全局配置
* element-plus 组件库的全局配置
  - size
  - 语言

* vscode 配置
  - 推荐插件 extentsion.json
  - 项目配置 settings.json
  - 代码片段 xxx.code-snippets

* npm 包源的项目级配置
  - .npmrc

* 全局变量 eslint 维护
  - eslint 设置 global

* 图标的统一用法
  - iconify 的图标库
    ```js
        // 在 vite.config.js 中自动导入，自动安装
        import AutoImport from 'unplugin-auto-import/vite'
        import Components from 'unplugin-vue-components/vite' 
        import Icons from 'unplugin-icons/vite'
        
        export default defineConfig({
            plugins: [
              AutoImport({
                resolvers({
                  // 自动导入图标组件
                  IconsResolver({
                    // prefix: 'icon' // 默认 i
                    prefix: false
                  })
                })
              }),
              Components({
                  resolvers: [
                      // 自动注册 element-plus 中所有图标
                      IconsResolver({
                        enabledCollections: ['ep']
                      })
                  ]
              }),
              Icons({
                  compiler: 'vue3',
                  autoInstall: true
              })
            ]
          })
    ```
    ```html
        <!-- 在 template 中的用法 -->
        <!-- 方式一 -->
        <i-ep-plus/>
        <!-- 方式二 -->
        <el-icon><i-ep-plus/></el-icon>

        <!-- 动态用法 -->
        import { Icon } from '@iconify/vue';
        <Icon icon="ep-user"></Icon>

    ```
  - iconfont 使用
    ```vue
    <template>
        <div>
            <!-- symbol 模式 -->
             <!-- icon-password 为 icon 的名字;-->
            <svg-icon icon="icon-password"  />
            <!-- svg-icon 默认会读取其父级的 color fill: currentColor -->
            <!-- 改变父级的color或者直接改变fill的颜色 -->
            </div>
    </template>
    ```
  - 本地的svg
    ```vue
     <script setup>
        // svg后面加?component代表将其作为Vue组件引入，以获取更好的类型声明，
        // 更多写法请看 https://github.com/jpkleemans/vite-svg-loader#import-params
        import backTop from "@/assets/svg/back_top.svg?component";
    </script>

    <template>
        <backTop />
    </template>
    ```

* 统一三方库
  - 日期：dayjs
  - 轮播：优先使用组件库中的，不能满足使用swiper(不推荐使用三方封装的vue组件，推荐使用原生组件，避免增加心智负担)
  - http请求:axios
  - excel 解析导出使用 xlsx
  - css 动画库 animate.css
  - 统计图表 echarts
  - 进度条 nprogress
  - 打字机效果 typeit
  - 无缝滚动 vue3-seamless-scroll 

* vite 构建支持
  - ui 组件库和常用三方库自动导包，和UI组件按需加载
  - 去除 console、debugger
  - 开发环境 https 的支持
  - 输出分类打包、抽离公共 chunk

* 组件加载时统一loading效果

## 实现的功能
* 常见系统配置
  - [x] 两种布局方式，菜单根据路由自动生成
  - [x] 国际化支持
  - [x] 暗黑模式切换
  - [x] 应用更新通知
  - [x] 可控的水印

* 组件
  - [x] 表格内容区自适应高度
  - [ ] 封装函数式组件

* 业务
  - [x] 账号登录（唯一登录）
  - [x] 手机号登录
  - [ ] 扫码登录

  - [x] 用户管理
  - [ ] 权限系统：角色控制权限、动态添加权限路由

  - [ ] 实时聊天
  - [ ] 在线用户
  - [ ] 站内信
  - [x] 系统监控-日志：登录日志、访问日志
  - [ ] 系统监控-在线用户:强制用户下线


## 浏览器兼容性
* 默认 Vite 的目标是能够 支持原生 ESM script 标签、支持原生 ESM 动态导入 和 import.meta 的浏览器：
  - Chrome >=87
  - Firefox >=78
  - Safari >=14
  - Edge >=88
* js 低版本浏览器兼容
  ```js
   //  Vite 只处理语法转译，且不包含任何 polyfill,传统浏览器可以通过插件 @vitejs/plugin-legacy 来实现
    // 它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。
    plugins:[
      legacy({
        targets: ['chrome < 60'], // 需要兼容的目标列表，可以设置多个
        // true的话会编译一份额外的针对传统浏览器(不支持esm的浏览器)的代码。
        renderLegacyChunks: true
      }),
    ]
  ```
* css 样式的兼容
  ```js
    css:{
        postcss:{
            plugins:[
                autoprefixer({
                    // 自动添加前缀 的浏览器
                    overrideBrowserslist: [
                        'Chrome >= 85',
                        'ff >= 79',
                        //'last 2 versions', // 所有主流浏览器最近2个版本
                    ],
                    grid: true
                }) 
            ]
        }
    }
  ```