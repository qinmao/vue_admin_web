<template>
  <div class="wrapper">
    <div class="l"></div>
    <div class="m">
      <el-menu :default-active="activeIndex" mode="horizontal">
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3">Info</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item>
        <el-menu-item index="5">Info</el-menu-item>
        <el-menu-item index="6">Orders</el-menu-item>
        <el-menu-item index="7">Info</el-menu-item>
        <el-menu-item index="8">Orders</el-menu-item>
      </el-menu>
    </div>
    <div class="r"></div>
  </div>
</template>

<script setup>
const activeIndex = ref('1')
</script>
<style>
.wrapper {
  width: 100%;
  display: flex;
}
.l,
.r {
  width: 200px;
  border: 1px solid gold;
}
.m {
  flex: 1;
  border: 1px solid red;
}
</style>
