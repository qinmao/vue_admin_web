<template>
  <el-form ref="formRef" :model="ruleForm" :rules="rules">
    <el-form-item label="角色列表" prop="roleIds">
      <el-select
        v-model="ruleForm.roleIds"
        placeholder="请选择"
        style="width: 100%"
        clearable
        multiple
      >
        <el-option
          v-for="(item, index) in roleList"
          :key="index"
          :value="item.id"
          :label="item.name"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup>
const props = defineProps({
  initData: {
    type: Object
  },
  roleList: {
    type: Array
  }
})

const formRef = ref(null)
const ruleForm = reactive({
  roleIds: []
})

Object.entries(props.initData).forEach(([key, value]) => {
  ruleForm[key] = value
})

const rules = {}

// 暴露方法
const validate = () => formRef.value.validate()
const getFormData = () => ({
  ...ruleForm
})

defineExpose({
  validate,
  getFormData // 只暴露方法，不暴露数据对象
})
</script>
