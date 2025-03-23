import { buildTree } from '@/utils'
import { $http } from '@/plugins/axios/index'

export function useDept() {
  const treeDepts = ref([])

  async function getDeptList() {
    const { result } = await $http.post('/api/dept/getList', { status: 1 })

    const newList = result.map((item) => {
      const { id, name, pId, deptType } = item
      return {
        id,
        pId,
        name,
        deptType
      }
    })
    const treeList = buildTree(newList) // 处理成树结构
    treeDepts.value = treeList || []
  }

  return {
    treeDepts,
    getDeptList
  }
}
