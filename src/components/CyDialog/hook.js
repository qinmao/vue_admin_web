import DynamicDialog from '@/components/CyDialog/DynamicDialog.vue'

export const useDialog = () => {
  const createDialog = (options) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    let dialogInstance = null

    const dialogApp = createApp(DynamicDialog, {
      ...options,
      onDestroy: () => {
        dialogApp.unmount()
        container.remove()
        dialogInstance = null
        // console.log('执行清理')
      }
    })

    dialogInstance = dialogApp.mount(container)

    return {
      close: () => dialogInstance.handleClose(),
      updateButtons: (newButtons) => {
        dialogInstance?.updateButtons(newButtons)
      }
    }
  }
  return { createDialog }
}
