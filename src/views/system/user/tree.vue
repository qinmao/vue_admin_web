<template>
  <div class="tree-wrapper" v-loading="props.treeLoading">
    <div class="tree-filter">
      <el-input v-model="searchValue" placeholder="请输入部门名称" clearable>
        <template #suffix>
          <el-icon class="el-input__icon">
            <i-ep-search v-show="searchValue.length === 0" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <el-divider />
    <div class="tree-content">
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          :data="props.treeData"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        >
          <template #default="{ node, data }">
            <span class="tree-lable">
              <Icon :icon="getIconByHierarchy(data.deptType)"></Icon>
              {{ node.label }}
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
  treeLoading: Boolean,
  treeData: Array
})
const emit = defineEmits(['tree-select'])

const treeRef = ref()
const isExpand = ref(true)
const searchValue = ref('')

const defaultProps = {
  children: 'children',
  label: 'name'
}
// 根据数据层级显示不同的icon
function getIconByHierarchy(deptType) {
  let icon
  switch (deptType) {
    case '单位(根单位)':
      icon = 'ep-office-building'
      break
    case '分支单位':
      icon = 'ep-add-location'
      break
    default:
      icon = 'ri-git-branch-line'
      break
  }
  return icon
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}
watch(searchValue, (val) => {
  treeRef.value.filter(val)
})

function nodeClick(value) {
  //   console.log(value)
  emit('tree-select', value)
}

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  searchValue.value = ''
}

watch(searchValue, (val) => {
  treeRef.value.filter(val)
})

defineExpose({ onTreeReset })
</script>

<style lang="scss" scoped>
.tree-wrapper {
  background-color: var(--el-bg-color);
  .tree-filter {
    display: flex;
    align-items: center;
    padding: 6px;

    .btn-expand {
      height: 20px !important;
      color: gray !important;
      font-weight: 500 !important;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .tree-content {
    height: calc(100% - 34px);
    // border: 1px solid red;
  }
  .tree-lable {
    display: flex;
    align-items: center;
    padding: 0 4px;
  }
}
</style>
