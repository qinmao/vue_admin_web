<!-- src/components/DynamicDialog.vue -->
<template>
  <ElDialog
    v-model="state.visible"
    :width="width"
    :destroy-on-close="false"
    :close-on-click-modal="false"
    draggable
    @close="handleClose"
  >
    <template #header>
      <h3 class="dialog-title">{{ title }}</h3>
    </template>

    <component :is="RawComponent" ref="contentRef" v-bind="contentProps" />

    <template #footer>
      <ElButton
        v-for="btn in state.buttons"
        :key="btn.text"
        :type="btn.type"
        :loading="btn.loading"
        :disabled="btn.loading"
        @click="handleButtonAction(btn)"
      >
        {{ btn.text }}
      </ElButton>
    </template>
  </ElDialog>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '50%'
  },
  title: {
    type: String
  },
  content: {
    type: Object
  },
  contentProps: {
    type: Object
  },
  buttons: {
    type: Array
  },
  onDestroy: {
    type: Function
  }
})

const state = reactive({
  visible: true,
  buttons: props.buttons.map((btn) => ({
    ...btn,
    loading: false
  }))
})

const contentRef = ref(null)
const RawComponent = markRaw(props.content)

// 验证逻辑
const validate = async () => {
  if (!contentRef.value?.validate) return true
  try {
    return await contentRef.value.validate()
  } catch (e) {
    return false
  }
}

const resetFields = () => {
  contentRef.value?.resetFields()
}

// 数据获取
const getFormData = () => {
  return contentRef.value?.getFormData?.() ?? null
}

// 关闭处理
const handleClose = () => {
  if (!state.visible) return
  state.visible = false
  setTimeout(() => {
    props?.onDestroy()
  }, 300)
}

// 按钮动作处理
const handleButtonAction = async (btn) => {
  btn.loading = true
  try {
    const formData = getFormData()
    if (typeof btn.handle === 'function') {
      await btn.handle({
        formData,
        validate,
        close: handleClose
      })
    }
  } catch (error) {
    console.error('handle failed:', error)
  } finally {
    btn.loading = false
  }
}

// 暴露给父组件的方法
defineExpose({
  updateButtons: (newButtons) => {
    state.buttons = newButtons.map((btn) => ({
      ...btn,
      loading: false
    }))
  }
})
</script>
