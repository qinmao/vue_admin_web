<template>
  <div class="page-wrapper">
    <el-button @click="openDialog" type="primary"> 函数调用弹窗 </el-button>
  </div>
</template>

<script setup>
import { useDialog } from '@/components/CyDialog/hook'
import CustomForm from './form.vue'
const { createDialog } = useDialog()

const openDialog = () => {
  const dialog = createDialog({
    width: '50%',
    title: '函数式弹窗',
    content: CustomForm,
    contentProps: {
      initData: {
        userName: 'test'
      }
    },
    buttons: [
      {
        text: '提交',
        type: 'primary',
        handle: async ({ formData, validate, close }) => {
          const isValid = await validate()
          if (!isValid) return
          console.log('isValid:', isValid, 'formData:', formData)
          close()
        }
      },
      {
        text: '取消',
        handle: ({ formData, close }) => close()
      }
    ]
  })

  // 动态更新按钮
  //   dialog.updateButtons([
  //     { text: '保存草稿', type: 'warning', handle: () => {} },
  //     { text: '取消', type: 'info' }
  //   ])
}
</script>

<style lang="scss" scoped></style>
