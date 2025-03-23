// 表格内容去自适应
export const useResizeTable = () => {
  const tableWrapperRef = ref(null)
  let tableHeight = ref(0)

  // 监听父容器尺寸变化
  let resizeObserver = null

  // 计算并更新表格高度
  const updateTableHeight = () => {
    if (!tableWrapperRef.value) return

    requestAnimationFrame(() => {
      // 延迟计算优化
      // tableHeight.value = tableWrapperRef.value.clientHeight

      // 存在的问题：表格父元素缩小时被表格撑开，无法监听到收缩时的高度
      // 原因及解决方案：由于 Flex 容器的默认最小高度约束 和 多层嵌套布局的高度继承问题导致的，需要在表格父元素及他的上层设置
      //  min-height: 0;  overflow: hidden;
      tableHeight.value = tableWrapperRef.value.getBoundingClientRect().height
      //   console.log('tableHeight.value:', tableHeight.value)
    })
  }

  onMounted(() => {
    // 初始化高度
    updateTableHeight()

    // 创建 ResizeObserver 监听器
    resizeObserver = new ResizeObserver(() => {
      updateTableHeight()
    })
    // 开始监听父容器
    if (tableWrapperRef.value) {
      resizeObserver.observe(tableWrapperRef.value)
    }
  })
  // 组件卸载时销毁监听
  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return {
    tableWrapperRef,
    tableHeight
  }
}
