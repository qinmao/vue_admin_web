<template>
  <div class="page-wrapper">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <UserCard />
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人信息" name="user">
              <Account />
            </el-tab-pane>
            <el-tab-pane label="密码修改" name="pwd">
              <PassWord />
            </el-tab-pane>
            <!-- <el-tab-pane label="头像修改" name="avatar">
            </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import UserCard from './components/user-card.vue'
import Account from './components/account.vue'
import PassWord from './components/password.vue'
defineOptions({
  name: 'Profile'
})
const activeTab = ref('user')
</script>
