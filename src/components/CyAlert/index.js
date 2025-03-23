// 命令式组件写法：demo alert 示例
import alert from './msg.vue'

export default function CyAlert(msg) {
  const app = createApp(alert, {
    msg
  })
  const div = document.createElement('div')
  app.mount(div)
  document.body.appendChild(div)

  return () => {
    app.unmount(div)
    div.remove()
  }
}
