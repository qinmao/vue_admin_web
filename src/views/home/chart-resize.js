import { debounce } from '@/utils'
export function useChartResize(chartInstance) {
  const resizeHandler = debounce(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }, 500)

  function addResizeEvent() {
    window.addEventListener('resize', resizeHandler)
  }
  function removeResizeEvent() {
    window.removeEventListener('resize', resizeHandler)
  }

  addResizeEvent()

  onUnmounted(() => {
    removeResizeEvent()
  })
}
