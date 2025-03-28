// import { ElDialog, ElButton } from 'element-plus'

export const useDialog = () => {
  const createDialog = (options) => {
    const {
      title,
      content: ContentComponent,
      buttons = [],
      width = '50%',
      props = {},
      closeDelay = 300
    } = options

    // 容器管理
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 避免组件被不必要的响应式化
    const RawComponent = markRaw(ContentComponent)

    // 组件引用
    const contentRef = ref(null)

    // 组件状态管理
    const state = reactive({
      visible: true,
      buttons: buttons.map((btn) => ({
        ...btn,
        loading: false
      }))
    })

    const validate = async () => {
      if (!contentRef.value?.validate) return true
      try {
        return await contentRef.value.validate()
      } catch (e) {
        // console.error('Validation error:', e)
        return false
      }
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
        dialogApp.unmount()
        container.remove()
      }, closeDelay)
    }

    // 按钮动作处理
    const handleButtonAction = async (btn) => {
      btn.loading = true
      //   console.log('btn:', btn.loading)

      try {
        // 获取表单数据
        const formData = getFormData()
        // 如果按钮有自定义action，执行并传入表单数据和关闭函数
        if (typeof btn.handle === 'function') {
          await btn.handle({
            formData,
            validate,
            close: handleClose
          })
        }
      } catch (error) {
        // 错误处理（可根据需要添加通知逻辑）
        console.error('handle failed:', error)
      } finally {
        // 无论成功失败都解除加载状态
        btn.loading = false
      }
    }

    const dialogApp = createApp({
      setup() {
        return () => (
          <ElDialog
            vModel={state.visible}
            width={width}
            destroy-on-close={false}
            close-on-click-modal={false}
            draggable
            onClose={handleClose}
          >
            {{
              header: () => <h3 class="dialog-title">{title}</h3>,
              default: () => <RawComponent ref={contentRef} {...props} />,
              footer: () =>
                state.buttons.map((btn) => (
                  <ElButton
                    key={btn.text}
                    type={btn.type}
                    loading={btn.loading}
                    disabled={btn.loading}
                    onClick={() => handleButtonAction(btn)}
                  >
                    {btn.text}
                  </ElButton>
                ))
            }}
          </ElDialog>
        )
      }
    })

    dialogApp.mount(container)

    return {
      close: () => handleClose(),
      updateButtons: (newButtons) => {
        state.buttons = newButtons.map((btn) => ({
          ...btn,
          loading: false
        }))
      }
    }
  }
  return { createDialog }
}
