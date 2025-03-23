<template>
  <el-card>
    <template #header>
      <span>个人信息</span>
    </template>
    <div class="user-profile">
      <div class="avatar-wrapper">
        <el-avatar :size="50" shape="square" :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" />
        <el-avatar :size="80" :icon="useIcon('ep-user-filled')" v-else />
      </div>
      <div class="user-name">{{ userInfo.userName }}</div>
    </div>
    <div class="section-item">
      <div class="section-header">
        <i-ri-admin-line />
        <h4 class="title">用户角色</h4>
      </div>
      <div class="section-content">
        <el-tag
          class="tag"
          v-for="item in userInfo.roles"
          :key="item.id"
          :type="item.status === 0 ? 'info' : 'success'"
          effect="dark"
        >
          {{ item.name }}
        </el-tag>
      </div>
    </div>
    <div class="section-item">
      <div class="section-header">
        <i-ep-phone />
        <h4 class="title">联系方式</h4>
      </div>
      <div class="section-content">
        <p class="s-item">手机号： {{ userInfo.phone }}</p>
        <p class="s-item">邮 箱：{{ userInfo.email ? userInfo.email : '无' }}</p>
      </div>
    </div>
    <div class="section-item">
      <div class="section-header">
        <i-ep-user />
        <h4 class="title">其他信息</h4>
      </div>
      <div class="section-content">
        <p class="s-item">账号: {{ userInfo.account }}</p>
        <p class="s-item">性别: {{ sexFormat(userInfo.sex) }}</p>
        <p class="s-item" v-if="userInfo.remark">备注: {{ userInfo.remark }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/store/user'
import { useIcon } from '@/components/CyIcon/hook'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(useUserStore, ['userInfo'])
  },
  methods: {
    useIcon,
    sexFormat(sex) {
      if (sex === 1) {
        return '男'
      } else if (sex === 2) {
        return '女'
      }
      return '保密'
    }
  },
  mounted() {
    // console.log(this.userInfo)
  }
}
</script>

<style lang="scss" scoped>
.user-profile {
  text-align: center;
  .user-name {
    margin-top: 20px;
    font-weight: bold;
  }
}

.section-item {
  margin-top: 20px;
  padding-left: 4px;
  &:last-child {
    border: none;
  }
  .section-header {
    display: flex;
    align-items: center;
    color: #606266;
    border-bottom: 0.5px solid lightgray;

    .title {
      margin-left: 10px;
    }
  }
  .section-content {
    padding-top: 10px;
    padding-left: 20px;
    font-size: 14px;
    .tag {
      margin-right: 4px;
      margin-top: 4px;
    }
    .s-item {
      margin-top: 4px;
    }
  }
}
</style>
