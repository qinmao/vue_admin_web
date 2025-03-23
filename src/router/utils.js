/**
 * 生成菜单目录
 * @param {*} routes 完整的路由数据
 * @returns
 */
export function generateMenus(routes = []) {
  let result = []
  const stack = [...routes]
  while (stack.length) {
    const route = stack.shift()
    // 如果不需要隐藏并且没有子路由
    if (!route?.meta?.hidden && !route.children) {
      const { path, meta } = route
      result.push({ path, meta })
    } else if (!route?.meta?.hidden && route.children) {
      const children = route.children
        .filter((child) => !child.meta.hidden)
        .map((item) => {
          const { path, meta } = item
          return {
            path,
            meta
          }
        })
      const { path, meta } = route
      result.push({
        path,
        meta,
        children
      })
    }
  }
  //   console.log('result:', result)
  return result
}
