import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite' // 组件注册
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import legacy from '@vitejs/plugin-legacy' // 低版本浏览器兼容 不支持 esmodule
// import autoprefixer from 'autoprefixer'

// eslint-disable-next-line no-undef
// console.log('当前环境:', process.env.NODE_ENV)
// const isElectron = process.versions && process.versions.electron
const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // 或 "modern"，"legacy"
        // importers: [
        //   // ...
        // ]
      }
    },
    postcss: {
      plugins: [
        // autoprefixer({
        //   // 自动添加前缀 的浏览器
        //   overrideBrowserslist: [
        //     'Chrome >= 85',
        //     'ff >= 79'
        //     //'last 2 versions', // 所有主流浏览器最近2个版本
        //   ],
        //   grid: true
        // })
      ]
    }
  },
  plugins: [
    // legacy({
    //   targets: ['chrome < 64'],
    //   renderLegacyChunks: true
    // }),
    vue(),
    vueJsx(),
    VueDevTools(),
    AutoImport({
      // 自动导入以下的格式的组件
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/ // .vue
      ],
      // global imports to register
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: [
        // presets
        'vue',
        'vue-router',
        // custom
        {
          axios: [
            // default imports
            ['default', 'axios'] // import { default as axios } from 'axios',
          ]
        }
      ],
      resolvers: [
        // 按需 自动导入 ElementPlus 相关的函数带样式 如:ElMessage
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          // prefix: 'icon' // 默认 i
        })
      ],
      eslintrc: {
        enabled: true // Default `false`
      }
    }),
    // 组件安装
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep', 'ri']
        })
      ]
    }),
    // svg组件化支持
    svgLoader(),
    Icons({
      compiler: 'vue3',
      // experimental
      // It will install the icon set when you import them
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      // 自签名证书 测试 https 音视频测试用
      key: readFileSync('./secrets/private-key.pem'),
      cert: readFileSync('./secrets/public-certificate.pem')
    },
    host: true, // 监听所有地址
    open: true,
    proxy: {
      // 选项写法
      '^/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false // 不验证证书
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 测试
      '^/gpt': {
        target: 'https://u202822-a9a5-a3a3a9b7.nmb1.seetacloud.com:8443',
        changeOrigin: true,
        secure: false, // 不验证证书
        rewrite: (path) => path.replace(/^\/gpt/, '')
      },

      // Proxying websockets or socket.io
      '/socket.io': {
        target: 'https://localhost:3000',
        ws: true, // 支持 WebSocket 协议
        // changeOrigin: true, // 可选，是否更改源
        secure: false // 不验证证书
      }
    }
  },
  build: {
    // minify: 'terser', // boolean | 'terser' | 'esbuild' 默认是 esbuild,比 terser 快 20-40 倍，压缩率只差 1%-2%
    target: 'esnext', // 默认是 modules最低支持到 es2015、esnext（electron应用）有原生动态导入支持，并只执行最低限度的转译。
    chunkSizeWarningLimit: 4000, // 消除打包大小超过500kb警告
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      // 静态资源分类打包
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          // 允许你创建自定义的公共 chunk
          'vendor-core': ['vue', 'vue-router', 'pinia', 'axios']
        }
      }
    }
  },
  esbuild: {
    drop: isProduction ? ['console', 'debugger'] : [] // 移除 console 和 debugger
  }
})
