<template>
  <div>
    <el-button @click="onExportClick" type="primary" :icon="useIcon('ep-download')">
      导出Excel
    </el-button>
  </div>
</template>

<script setup>
import { useIcon } from '@/components/CyIcon/hook'
import { exportJsonToExcel } from '@/plugins/excel/index'
defineOptions({
  name: 'ExcelDemo'
})
const result = []
function onExportClick() {
  const jsonData = result.map((item) => {
    const warnInfo = {
      1: '绿色',
      2: '黄色',
      3: '红色'
    }
    const statusInfo = {
      0: '已删除',
      10: '待审核',
      12: '审核未通过',
      20: '待签收',
      30: '已签收待反馈',
      32: '已退回待反馈',
      40: '已反馈待核查',
      50: '完成已归档'
    }

    return {
      任务编号: item.id,
      任务名称: item.name,
      处置人单位: item.dealUserName,
      处置单位: item.dealDeptName,
      预警等级: warnInfo[item.warning],
      任务状态: statusInfo[item.status],
      创建日期: item.createTime,
      截止日期: item.deadline
    }
  })
  const fileName = '统计-一季度.xlsx'

  exportJsonToExcel(jsonData, fileName)
}
</script>

<style lang="scss" scoped></style>
