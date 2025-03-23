<template>
  <div class="page-wrapper">
    <!-- 语言切换 -->
    <div>
      语言切换：
      <el-select v-model="currentLang" @change="changeLanguage" style="width: 100px">
        <el-option
          v-for="lang in availableLangs"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        />
      </el-select>
    </div>
    <div class="i18n-demo">
      <!-- 文本翻译 -->
      <h1>{{ t('common.welcome') }}</h1>

      <!-- 带参数的翻译 -->
      <p>{{ t('common.userGreeting', { name: userName }) }}</p>

      <!-- 日期格式化 -->
      <!-- <p>{{ d(new Date(), 'short') }}</p> -->

      <!-- 数字格式化 -->
      <!-- <p>{{ n(1234.56, 'currency') }}</p> -->
    </div>
    <!-- Element 组件示例 -->
    <ul class="element-demo">
      <li>
        <el-button type="primary" @click="showMessage">{{ t('common.showMessage') }}</el-button>
      </li>
      <li>
        <el-date-picker
          v-model="dataPickerValue"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </li>
      <li>
        <el-pagination
          class="pagination"
          v-model:current-page="searchForm.currentPage"
          v-model:page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="10"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { changeLanguage } from '@/plugins/i18n'
const { t, d, n, locale } = useI18n()

const userName = '开发者'
const dataPickerValue = ref('')
const searchForm = reactive({
  currentPage: 1,
  pageSize: 10
})

// 可用语言列表
const availableLangs = ref([
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' }
])

// 当前语言
const currentLang = ref(locale.value)

function showMessage() {
  ElMessage({
    message: t('common.showMessage'),
    type: 'success'
  })
}
</script>
<style lang="scss" scoped>
.element-demo {
  border: 1px solid red;
  li {
    margin-top: 10px;
  }
}
.i18n-demo {
  border: 1px solid red;
  margin-bottom: 10px;
}
</style>
