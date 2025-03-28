// 命令式组件写法：demo alert 示例
import alert from './msg.vue'

export default function CyAlert(msg) {
  const app = createApp(alert, {
    msg
  })
  const container = document.createElement('div')
  document.body.appendChild(container)

  app.mount(container)

  return () => {
    app.unmount(div)
    div.remove()
  }
}
