import { Icon } from '@iconify/vue'

export function useIcon(icon) {
  return defineComponent({
    render() {
      return h(Icon, {
        icon
      })
    }
  })
}
