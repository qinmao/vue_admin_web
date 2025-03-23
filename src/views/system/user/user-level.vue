<template>
  <div class="page-wrapper">
    <tree
      class="l-tree"
      ref="treeRef"
      :treeData="treeDepts"
      :treeLoading="treeLoading"
      @tree-select="onTreeSelect"
    />
    <div class="r-user-level">
      <div class="user-tree">
        <el-scrollbar height="calc(100vh - 240px)">
          <el-tree
            ref="userTreeRef"
            draggable
            :data="treeUserList"
            :props="treeProps"
            default-expand-all
            :expand-on-click-node="false"
            node-key="id"
          >
            <template #default="{ node, data }">
              <Icon :icon="getIconByFlag(data.isContact)" />
              {{ data.isContact === 1 ? `${node.label}(联络员)` : node.label }}
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <el-divider />
      <div style="margin-top: 20px; padding-left: 20px">
        <el-button type="primary" :loading="btnLoading" @click="onSubmitClick"> 确定 </el-button>
        <el-button type="primary" @click="toggleRowExpansionAll(isExpand ? true : false)">
          <el-icon
            class="icon"
            :size="20"
            :style="{ transform: isExpand ? 'rotate(180deg)' : 'rotate(90deg)' }"
            @click="onExpandClick"
          >
            <i-ep-upload />
          </el-icon>

          {{ isExpand ? '展开全部' : '折叠全部' }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { $http } from '@/plugins/axios/index'
import tree from './tree.vue'
import { buildTree } from '@/utils'
import { useDept } from '@/views/system/dept/utils/hook'

const { treeDepts, getDeptList } = useDept()
const treeUserList = ref([])

const treeProps = ref({
  label: 'userName'
})

const isExpand = ref(false)
const treeLoading = ref(false)

const btnLoading = ref(false)

function onTreeSelect({ id, selected }) {
  const deptId = selected ? id : 68
  getUserListByDeptId(deptId)
}
/**
 * 重新构建层间关系并拉平
 * @param {*} treeList
 */
function flattenHierarchy(treeList) {
  const result = []
  const stack = [...treeList]
  while (stack.length > 0) {
    const item = stack.pop()
    result.push({
      pId: item.pId,
      id: item.id
    })
    if (item.children && item.children.length > 0) {
      const children = item.children.map((childItem) => {
        return {
          ...childItem,
          // pId 为父级的id
          pId: item.id ? item.id : 0
        }
      })
      stack.push(...children)
    }
  }
  return result
}
async function onSubmitClick() {
  const list = flattenHierarchy(treeUserList.value)
  const { code } = await $http.post(`/api/user/batchUpdateUserPId`, list)
  if (code === 200) {
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  }
}

async function getUserListByDeptId(deptId) {
  const { result: userList } = await $http.get(`/api/user/getUserListByDeptId/${deptId}`)
  const treeUserData = buildTree(userList)
  treeUserList.value = treeUserData || []
}

function toggleRowExpansionAll(status) {
  isExpand.value = !status
  const nodes = proxy.$refs['userTreeRef'].store._getAllNodes()
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status
  }
}

function getIconByFlag(isContact) {
  let icon
  switch (isContact) {
    case 1:
      icon = 'ep-service'
      break
    default:
      icon = 'ep-user'
      break
  }
  return icon
}

onMounted(() => {
  // 获取层级化的部门数据
  //   getDeptList()
  //   const rootDeptId = 68
  //   getUserListByDeptId(rootDeptId)
})
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  justify-content: space-between;

  .l-tree {
    min-width: 260px;
    margin-right: 8px;
  }

  .r-user-level {
    width: calc(100% - 260px);
    background-color: var(--el-bg-color);

    .user-tree {
      height: calc(100vh - 240px);
    }
  }
}
</style>
